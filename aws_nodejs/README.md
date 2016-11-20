# Using AWS SDK in Node.js

Node.js application illustrating creation of an instance with AWS SDK for Node.js.

## Requirements

The only requirement of this application is the Node Package Manager. All other
dependencies (including the AWS SDK for Node.js) can be installed with:

    npm install

## Basic Configuration
Set up your AWS security credentials before running the code.
You can do this by creating a file named "credentials" at ~/.aws/ 

    [default]
    aws_access_key_id = <your access key id>
    aws_secret_access_key = <your secret key>

## Running the code to create an instance
    node create_instance.js

## Useful Links
	http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-examples.html
	http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/