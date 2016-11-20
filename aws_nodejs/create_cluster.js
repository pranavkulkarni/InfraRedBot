// Load the SDK and UUID
var AWS = require('aws-sdk');
var uuid = require('node-uuid');
AWS.config.region = 'us-east-1';

var emr = new AWS.EMR();
var params = {
  Instances: { /* required */
    Ec2KeyName: 'infrared',
    InstanceGroups: [
        {
            InstanceCount: 1, /* required */
            InstanceRole: 'MASTER', /* required */
            InstanceType: 'm3.xlarge', /* required */
        },
        {
            InstanceCount: 2, /* required */
            InstanceRole: 'CORE', /* required */
            InstanceType: 'm3.xlarge', /* required */
        }
    ],
    KeepJobFlowAliveWhenNoSteps: true,
    },
    Name: 'namit_cluster', /* required */
    ReleaseLabel: 'emr-5.1.0',
    Applications: [
        {
            Name: 'Ganglia',
        },
        {
            Name: 'Spark',
        },
        {
            Name: 'Zeppelin',
        }
    ],
    JobFlowRole: 'EMR_EC2_DefaultRole',
    ServiceRole: 'EMR_DefaultRole',
};

emr.runJobFlow(params, function(err, data) {
    if (err) {
        console.log(err, err.stack); // an error occurred
    } else {
        console.log(data); // successful response

        var Id = data.JobFlowId;
        var params = {
            ClusterId: Id
        };

        /*
        // Just printing out some extra info about cluster
        emr.describeCluster(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(JSON.stringify(data)); // successful response
        });

        emr.listInstanceGroups(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(JSON.stringify(data)); // successful response
        });
        */

        emr.waitFor('clusterRunning', params, function(err, data) {
            if (err) {
                console.log(err, err.stack); // an error occurred
            } else {
                console.log("CLUSTER RUNNING")
                console.log(data); // successful response
                var masterPublicDnsName = data.Cluster.MasterPublicDnsName;
                console.log(masterPublicDnsName)

                // Insert into database

                // Cluster now Running, add rule in the security group to Access Zeppelin
                var ec2 = new AWS.EC2();
                var params = {
                  GroupName: 'ElasticMapReduce-master',
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
                    if (err) console.log(err, err.stack); // an error can also occurs when group has that same rule
                    else console.log(data); // successful response
                    console.log("authorizeSecurityGroupIngress")
                });
            }
        });
    }
});


/*
Steps to Create a cluster in AWS EMR

Create a cluster manually first using the console
 
aws emr create-default-roles

aws emr create-cluster --name "Timan's Spark Cluster" --release-label \
   emr-4.3.0 --applications Name=Spark Name=Zeppelin-Sandbox \
   --ec2-attributes KeyName=infrared --instance-type m3.xlarge \
   --instance-count 3 --use-default-roles

aws emr ssh --cluster-id j-3HFPPRTZ9NV99 \
   --key-pair-file infrared.pem


ssh -i infrared.pem -L 8890:ec2-52-90-233-230.compute-1.amazonaws.com:8890 ec2-52-90-233-230.compute-1.amazonaws.com -Nv



while :; do aws emr describe-cluster --cluster-id j-ABCDEFGHIJKLM | grep \"State\"\:; sleep 5s; done

aws ec2 authorize-security-group-ingress --group-name ElasticMapReduce-master --protocol all --port 0-65535 --cidr 0.0.0.0/0
   
*/

