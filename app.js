//configure amdrequire

var express = require('express'),
	http = require('http'),
	app = express(),
	PUBLIC_PATH = "/public";

app.use(express.static(__dirname + PUBLIC_PATH));

http.createServer(app).listen(9000, function ()
{
    console.log("Running");
});