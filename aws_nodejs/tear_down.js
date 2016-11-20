// Load the SDK and UUID
var AWS = require('aws-sdk');
var uuid = require('node-uuid');
AWS.config.region = 'us-east-1';

var emr = new AWS.EMR();

/*
var params = {
  JobFlowIds: [
    'j-11RUCNB4MO480',
  ]
};
emr.terminateJobFlows(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});
*/

var params = {
    ClusterId: "j-11RUCNB4MO480"
};

emr.listInstanceGroups(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(JSON.stringify(data)); // successful response
});
