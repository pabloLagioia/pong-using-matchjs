//configure amdrequire

var express = require('express'),
	http = require('http'),
	app = express();

app.use(express.static(__dirname));

http.createServer(app).listen(9000, function ()
{
    console.log("Running");
});