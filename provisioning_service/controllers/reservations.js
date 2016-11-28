var mockData = require("../mock.json");
var aws = require('../aws/aws.js');
var docean = require('../do/do.js');
require('../models/reservation');
require('../models/key');
require('../models/template');
var mongoose = require('mongoose');
var Key = mongoose.model('Key');

var Reservation = mongoose.model('Reservation');
var Template = mongoose.model('Template');

//Function to find the cheapest satisfiable service and configuration
function getBestConfig(req, callback) {


    Key.find({"UserId": req.body.UserId}, function (err, result) {
        if (err) {
            console.log(err);
        } 

        if (result.length == 0){
            var best_config = {"Service":"None"};
            callback(best_config);
        } 
        else {

            var priority = ["VCPUs", "VRAM"]
            console.log(result);

            function comparator(a, b) {
                // Priority of columns that need to be
                for (var i = 0; i < priority.length; i++) {
                    if (a[priority[i]] < b[priority[i]]) {
                        return -1;
                    } else if (a[priority[i]] > b[priority[i]]) {
                        return 1;
                    }
                }

                return -1;
            }

            var prices = require('../data/prices.json')
            var best_config_each = {}


            for (var i = 0; i < result.length; i++) {
                var service = result[i].Service;
                prices[service].sort(comparator);
                //console.log(prices[service])

                for (var j = 0; j < prices[service].length; j++) {
                    if (prices[service][j]["VCPUs"] >= req.body.VCPUs && prices[service][j]["VRAM"] >= req.body.VRAM) {
                        best_config_each[service] = prices[service][j];
                        break;
                    }
                }
            }
            console.log("Best config each....");
            console.log(best_config_each);
            console.log("\n\n");

            var best_config = {}
            for (var service in best_config_each) {
                if (best_config["Service"] == undefined) {
                    best_config["Service"] = service
                    best_config["Config"] = best_config_each[service]
                } else {
                    if (best_config["Config"].Cost > best_config_each[service].Cost) {
                        best_config["Service"] = service
                        best_config["Config"] = best_config_each[service]
                    }
                }
            }

            callback(best_config)

        }
    });


}

exports.post_reservations = function (req, res) {
    var userId = req.params.userId;
    console.log("POST request Received : ")

    var userId = req.params.userId;
    console.log("POST request Received : \n")

    console.log(req.body);
    // TODO: CHECK THE TYPE OF REQUEST AND CALL APPROPRIATE AWS METHOD
    if (req.body.RequestType === 'vm') {
        getBestConfig(req, function (best_config) {
            console.log("##### BEST CONFIG #####");
            console.log(best_config);
            if (best_config["Service"] == undefined) {
                res.statusCode = 404
                return res.send({"status": 404, "message": "Configuration unavailable"});
            }
            else if (best_config["Service"] == "None") {
                res.statusCode = 404
                return res.send({"status": 404, "message": "Please set up your keys with a service provider before creating any reservation."});
            }
            else {
                if (best_config.Service == 'aws') {
                    aws.create_vm(best_config.Config.InstanceType, req, res);
                } else if (best_config.Service == 'digital ocean') {
                    docean.create_vm(best_config.Config.InstanceType, req, res);
                } else {
                    console.log("None of the service providers could match the request");
                }
            }
        });
    } else if (req.body.RequestType == 'cluster') {
        aws.create_cluster(req, res);
    }
}

exports.delete_reservation = function (req, res) {
    var ReservationId = req.params.ReservationId;
    console.log(ReservationId);
    if (ReservationId.match(/[a-z]/i)) {
        aws.terminate_reservation(req, res);
    } else {
        docean.terminate_vm(req, res);
    }
}

exports.get_reservations = function (req, res) {
    var userId = req.params.UserId;
    Reservation.find({"UserId": userId}, function (err, results) {
        if (err) {
            return res.send({"status": 500, "message": "Internal Server Error"});
        } else {
            console.log("GET RESERVATIONS RESULTS")
            console.log(results);
            if (results.length == 0) {
                console.log("Could not find reservation for this user from database", err);
                return res.send({"status": 400, "message": "You don't have any reservation at this moment"});
            }
            return res.send({"status": 200, "data": results});
        }
    });
}

exports.get_reservation = function (req, res) {
    var userId = req.params.UserId;
    var ReservationId = req.params.ReservationId;
    Reservation.findOne({"Reservation.ReservationId": ReservationId}, function (err, results) {
        if (err) {
            return res.send({"status": 500, "message": "Internal Server Error"});
        } else {
            console.log("GET RESERVATION RESULT")
            console.log(results);
            if (results == null) {
                console.log("Could not find reservation for this user from database", err);
                return res.send({
                    "status": 400,
                    "message": "You don't have any reservation with this Id at this moment"
                });
            }
            return res.send({"status": 200, "data": results});
        }
    });
}
