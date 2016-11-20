// Load the SDK and UUID
var AWS = require('aws-sdk');
var uuid = require('node-uuid');
AWS.config.region = 'us-east-1';

var ec2 = new AWS.EC2();

var params = {
  GroupName: 'default',
  IpPermissions: [
      {
          FromPort: 0,
          IpProtocol: "-1",
          IpRanges: [
            {
                CidrIp: "0.0.0.0\/0"
            }
          ],
          ToPort: 65535,

      }
  ],
};

ec2.authorizeSecurityGroupIngress(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});
