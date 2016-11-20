// Load the SDK and UUID
var AWS = require('aws-sdk');
var uuid = require('node-uuid');
AWS.config.region = 'us-east-1';

var ec2 = new AWS.EC2();

var params = {
  ImageId: 'ami-1624987f', // Amazon Linux AMI x86_64 EBS
  InstanceType: 't1.micro',
  MinCount: 1, MaxCount: 1,
  KeyName: 'infrared'
};

// Create the instance
ec2.runInstances(params, function(err, data) {
  if (err) { console.log("Could not create instance", err); return; }

  console.log(data);
  var reservationId = data.ReservationId
  var instanceIds = []
  for (var i = 0; i < data.Instances.length; i++) {
    var instanceId = data.Instances[0].InstanceId;
    instanceIds.push(instanceId)
  }; 
  console.log("Created instance Ids", instanceIds);

  var params = {
   InstanceIds: instanceIds
 };
 ec2.waitFor('instanceRunning', params, function(err, data) {
  if (err) 
      console.log(err, err.stack); // an error occurred
    else {
        console.log(data);           // successful response
        var reservation_json_to_store;
        for (var i = 0; i < data.Reservations.length; i++) {
          if (data.Reservations[i].ReservationId === reservationId) {
            reservation_json_to_store = data.Reservations[i];
            break;
          }
        }
        //console.log("reservation_json_to_store")
        console.log(reservation_json_to_store);
        return reservation_json_to_store;
      }    
    });
});
