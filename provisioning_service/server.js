var express = require('express'),
fs = require('fs'),
bodyParser = require('body-parser'),
mongoose = require('mongoose');

var mongoUri = 'mongodb://localhost/provisioning_service';
mongoose.connect(mongoUri);
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + mongoUri);
});

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