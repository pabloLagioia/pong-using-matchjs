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

			// if ( manifold.entity.attribute("location").y > manifold.collidedWith.attribute("location").y ) {
			// 	direction.y = -1;
			// 	console.log(-1);
			// } else {
			// 	direction.y = 1;
			// 	console.log(1);
			// }

		}

	});

	M.behaviour("increaseSpeed", function(entity, attributes) {

		var manifold = attributes.get("manifold");

		if ( manifold && attributes.get("speed") < attributes.get("ball.max.speed") ) {

			attributes.set("speed", attributes.get("speed") + attributes.get("ball.inc.speed") );

		}

	});

	//Register displays
	M.display("field", {
		type: "rectangle",
		color: "#0000aa",
		layer: "world",
		border: "#ffffff",
		borderWidth: 5,
		x: M.getCenter().x,
		y: M.getCenter().y,
		width: M.getSize().width + 5,
		height: M.getSize().height - 5
	});

	M.display("field-line", {
		type: "rectangle",
		color: "#ffffff",
		border: "#888888",
		layer: "world",
		x: M.getCenter().x,
		y: M.getCenter().y,
		width: M.getSize().width - 140,
		height: 4
	});

	M.display("field-line-vertical", {
		type: "rectangle",
		color: "#ffffff",
		border: "#888888",
		layer: "world",
		x: M.getCenter().x,
		y: M.getCenter().y,
		width: 4,
		height: 20
	});

	M.display("pad", {
		type: "rectangle",
		width: 20,
		height: 100,
		layer: "world",
		borderWidth: 2,
	});

	M.display("ball", {
		type: "circle",
		color: "#ffffff",
		radius: 15,
		layer: "world"
	});

	M.display("score", {
		type: "text",
		family: "monospace",
		size: 36,
		x: M.getCenter().x,
		y: 50,
		text: "SCORE",
		color: "#dddddd"
	});

	M.display("score-1", {
		type: "text",
		family: "monospace",
		size: 36,
		x: M.getCenter().x - 150,
		y: 50,
		text: "0",
		color: "#dddddd"
	});
	
	M.display("score-2", {
		type: "text",
		family: "monospace",
		size: 36,
		x: M.getCenter().x + 150,
		y: 50,
		text: "0",
		color: "#dddddd"
	});

	//Register entities
	M.entity("field", {
		"has": ["location"],
		"displays": ["field", "field-line", "field-line-vertical", "score", "score-1", "score-2"]
	});

	M.entity("pad", {

		"has": ["location", "direction", "speed", "mappings", "collisionGroup"],

		"does": [ "moveWithSpeedAndDirection", "fixViewsToEntity", "keydown", "stickToCanvas" ],

		"displays": ["pad"]

	});

	M.entity("ball", {

		"has": ["location", "direction", "speed", "preventMoveOnCollision", "ball.start.speed", "ball.max.speed", "ball.inc.speed", "collisionGroup" ],

		"does": [ "moveWithSpeedAndDirection", "fixViewsToEntity", "bounce", "collide", "onCollision", "increaseSpeed" ],

		"displays": ["ball"]

	});

	M.entity("left-trigger", {

		"has": ["location", "collisionGroup" ],

		"does": [ "increase-score-left" ]

	});

	M.display("title", {
		type: "text",
		family: "monospace",
		size: 36,
		x: M.getCenter().x,
		y: 100,
		text: "MATCH PONG",
		color: "#dddddd"
	});

	M.display("button-text", {
		type: "text",
		family: "monospace",
		size: 24,
		x: M.getCenter().x,
		y: M.getCenter().y,
		text: "Play",
		color: "#dddddd"
	});

	M.display("button-back", {
		type: "rectangle",
		width: 100,
		height: 50,
		x: M.getCenter().x,
		y: M.getCenter().y,
		color: "#00bb00",
		border: "#007700"
	});

	M.entity("title", {

		displays: ["title"]

	});

	M.entity("play-button", {

		displays: ["button-back", "button-text"]

	});

	// M.trigger("inc-score-right", {

	// 	type: "area",
	// 	x: 0,
	// 	y: 0,


	// });

	M.scene("title", {
		onLoad: function() {

			M.spawn("title");

			M.spawn("play-button", function(entity) {

				entity.on("click", function() {
					M.setScene("game");
				});

			});

		}
	});

	M.scene("game", {

		onLoad: function() {

			M.spawn("field");

			//Spawn Player 1
			M.spawn("pad", function(pad) {
				
				var location = pad.attribute("location");
				
				location.x = 30;
				location.y = M.getCenter().y;

				pad.attribute("mappings").up = "up";
				pad.attribute("mappings").down = "down";
				pad.attribute("speed", 2);
				pad.attribute("collisionGroup", 1);

				pad.view("pad").setColor("#ff0000");
				pad.view("pad").setBorder("#880000");
				// pad.view("pad").setShadow(5, 0, "#770000", 10);

			});

			//Spawn Player 2
			M.spawn("pad", function(pad) {
				
				var location = pad.attribute("location");
				
				location.x = M.getSize().width - 40;
				location.y = M.getCenter().y;

				pad.attribute("mappings").up = "w";
				pad.attribute("mappings").down = "s";
				pad.attribute("speed", 2);
				pad.attribute("collisionGroup", 1);

				pad.view("pad").setColor("#ff8800");
				pad.view("pad").setBorder("#884400");
				// pad.view("pad").setShadow(-5, 0, "#000077", 10);

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

				ball.view("ball").setColor("#ffffff");
				ball.view("ball").setBorder("#777777");
				// ball.view("ball").setShadow(0, 0, "#777777", 10);

			});

		}

	});

	M.setScene("title");

}