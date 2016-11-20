
var request = require('request');
var params = {}

function post(params, url, callback) {
      var options = {
        url: url,
        method: 'POST',
        headers: {
          "User-Agent": "InfraRedBot",
          "content-type": "application/json",
        },
        json: params
      };

      console.log("\n POST Request \n")
      console.log(options);
      // Send a http request to url and specify a callback that will be called upon its return.
      request(options, callback);
}

post(params, "http://localhost:3001/test", function (error, response, body) {
      console.log("error")
      console.log(error)
      console.log("body")
      console.log(body)
});