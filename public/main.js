function main() {

	//Register attributes
	M.attribute("mappings", function() {
		this.up = "up";
		this.down = "down";
	});

	M.attribute("ball.max.speed", 4);
	M.attribute("ball.inc.speed", 0.25);
	M.attribute("ball.start.speed", 1);

	//Register Behaviours
	M.behaviour("moveWithSpeedAndDirection", function(entity, attributes, views) {
	
		var speed = attributes.get("speed"),
			direction = attributes.get("direction"),
			location = attributes.get("location");
		
		if ( speed != 0 ) {
			location.offset(speed * direction.x, speed * direction.y);
		}
				
	});

	M.behaviour("keydown", function(entity, attributes, views, input) {

		var direction = attributes.get("direction"),
			mappings = attributes.get("mappings");

		if ( input.keyboard.keysDown[mappings.up] ) {
			direction.y = -1;
		} else if ( input.keyboard.keysDown[mappings.down] ) {
			direction.y = 1;
		} else {
			direction.y = 0;
		}

	});

	M.behaviour("onCollision", function(entity, attributes) {

		var manifold = attributes.get("manifold");

		if ( manifold ) {

			var direction = attributes.get("direction");

			direction.x *= -1;

			if ( manifold.entity.attribute("location").y > manifold.collidedWith.attribute("location").y ) {
				direction.y = -1;
			} else {
				direction.y = 1;
			}

		}

	});

	M.behaviour("increaseSpeed", function(entity, attributes) {

		var manifold = attributes.get("manifold");

		if ( manifold && attributes.get("speed") < attributes.get("ball.max.speed") ) {

			attributes.set("speed", attributes.get("speed") + attributes.get("ball.inc.speed") );

		}

	});

	//Register displays
	M.display("pad", {
		type: "rectangle",
		x: 0,
		y: 0,
		color: "gray",
		width: 20,
		height: 100,
		layer: "world"
	});

	M.display("ball", {
		type: "circle",
		x: 0,
		y: 0,
		color: "white",
		radius: 15,
		layer: "world"
	});

	//Register entities
	M.entity("pad", {

		"has": ["location", "direction", "speed", "mappings", "collisionGroup"],

		"does": [ "moveWithSpeedAndDirection", "fixViewsToEntity", "keydown", "stickToCanvas" ],

		"displays": ["pad"]

	});

	M.entity("ball", {

		"has": ["location", "direction", "speed", "preventMoveOnCollision", "ball.start.speed", "ball.max.speed", "ball.inc.speed" ],

		"does": [ "moveWithSpeedAndDirection", "fixViewsToEntity", "bounce", "collide", "onCollision", "increaseSpeed" ],

		"displays": ["ball"]

	});

	//Spawn Player 1
	M.spawn("pad", function(pad) {
		
		var location = pad.attribute("location");
		
		location.x = 30;
		location.y = M.getCenter().y;

		pad.attribute("mappings").up = "up";
		pad.attribute("mappings").down = "down";

		pad.view("pad").setFillStyle("red");

		pad.attribute("speed", 2);

		pad.attribute("collisionGroup", 1);

	});

	//Spawn Player 2
	M.spawn("pad", function(pad) {
		
		var location = pad.attribute("location");
		
		location.x = M.getSize().width - 40;
		location.y = M.getCenter().y;

		pad.attribute("mappings").up = "w";
		pad.attribute("mappings").down = "s";

		pad.view("pad").setFillStyle("blue");

		pad.attribute("speed", 2);

		pad.attribute("collisionGroup", 1);

	});

	//Spawn Ball
	M.spawn("ball", function(ball) {
		
		var location = ball.attribute("location");
		
		location.x = M.getCenter().x;
		location.y = M.getCenter().y;

		var direction = ball.attribute("direction");

		direction.x = 1;
		direction.y = 1;

		ball.attribute("speed", ball.attribute("ball.start.speed"));

		ball.attribute("collisionGroup", 1);

		ball.attribute("preventMoveOnCollision", true);

	});

}