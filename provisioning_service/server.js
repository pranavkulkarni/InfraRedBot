var express = require('express'),
fs = require('fs'),
bodyParser = require('body-parser'),
mongoose = require('mongoose');

var mongoUri = 'mongodb://database/provisioning_service';
//mongoose.connect(mongoUri, { server: { reconnectTries: Number.MAX_VALUE } });
connectDB();

mongoose.connection.on('open', function () {
	var app = express();
	app.use(bodyParser.urlencoded());
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
	  extended: true
	}));

	require('./routes')(app);
	var server = app.listen(3001);
	server.timeout = 10000000;
	console.log('InfraRed Provisioning Service is listening on Port 3001...');
});

mongoose.connection.on('error', function () {
  console.log('unable to connect to database at ' + mongoUri + "trying again in 5s...");
  setTimeout(function() {
  	connectDB();
  }, 5000);
});

function connectDB() {
	try {
	  mongoose.connect(mongoUri);
	  db = mongoose.connection;
	  console.log("Started connection on " + mongoUri + ", waiting for it to open...");
	} catch (err) {
	  console.log("Setting up failed to connect to " + mongoUri, err.message);
	}
}