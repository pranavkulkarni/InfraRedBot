var request = require('request');
var provisioning_service_url = "http://provision:3001";

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
	request(options, callback);
}

function deleteResource(params, url, callback) {
	var options = {
		url: url,
		method: 'DELETE',
		headers: {
			"User-Agent": "InfraRedBot",
			"content-type": "application/json",
		},
		json: params
	};

	console.log("\n DELETE Request \n")
	console.log(options);
	request(options, callback);
}

function get(params, url, callback) {
	var options = {
		url: url,
		method: 'GET',
		headers: {
			"User-Agent": "InfraRedBot",
			"content-type": "application/json",
		},
		json: params
	};

	console.log("\n GET Request \n")
	console.log(url);
	request(options, callback);
}

function format(results) {
    var reservationIds = [];

    var k = 1
    for (i in results) {
        if (results[i].Cloud == "aws") {
            if (results[i].Request.RequestType == "vm") {

                var details = "" + k + ". Reservation ID: *" + results[i].Reservation.ReservationId + "*";
                k = k + 1;
                var vmConfig = results[i].Request;
                details += "\n> _(" + vmConfig.OS + ", " + vmConfig.VCPUs + "vCPUs, " + vmConfig.VRAM + "GB RAM, " + 
                           vmConfig.Storage + "GB " + vmConfig.StorageType + ")_ *x" + results[i].Reservation.Instances.length + "*";

                for (var j = 0; j < results[i].Reservation.Instances.length; j++) {
                    details += "\n>" + results[i].Reservation.Instances[j].PublicIpAddress;
                    console.log(details);
                }
                
                reservationIds.push(details);
            } else if (results[i].Request.RequestType == "cluster" ) {
                console.log("CLUSTER**")
                console.log(results[i].Reservation)

                var details = "" + k + ". Cluster Reservation ID: *" + results[i].Reservation.Id + "*";
                k = k + 1;

                var vmConfig = results[i].Request;
                details += "\n> _(" + vmConfig.VCPUs + "vCPUs, " + vmConfig.VRAM + "GB RAM, " + 
                           vmConfig.Storage + "GB " + vmConfig.StorageType + ")_ *x" + vmConfig.NodeCount + "*";
                details += "\n>Zeppelin Link : " + results[i].Reservation.MasterPublicDnsName + ":8890"
                
                reservationIds.push(details);
            }
        } 
        else if (results[i].Cloud == "digital ocean") {
            //var res = results[i].Reservation.droplet;
            console.log("---------------");
            var droplet = results[i].Reservation.droplet;
            console.log(results[i].Reservation.droplet);
            console.log("---------------");

            var details = "" + k + ". Reservation ID: *" + droplet.id + "*";
            k = k+1
            details += "\n> _(" + droplet.image.distribution + droplet.image.name + 
                                ", " + droplet.size.vcpus  + "vCPUs, " + droplet.size.slug + " RAM, " +
                                droplet.size.disk + "GB SSD" + ")_ *x1*";

            for (var j = 0; j < droplet.networks.v4.length; j++) {
                details += "\n>" + droplet.networks.v4[0].ip_address;
                console.log(details);
            }

            reservationIds.push(details);
        } 
    }
    if(reservationIds.length == 0) {
        return "You don't have any reservation at this moment";
    }
    return reservationIds.join("\n\n");
}


module.exports = {

	saveKeys: function (bot, message, response) {
		bot.reply(message, "Okay, I am working on it.")
		console.log("***** SAVING KEYS ********");

		var params = {
			"UserId": message.user,
			"Service": response.result.parameters.service_name,
			"AccessKeyId": response.result.parameters.access_key_id,
			"SecretAccessKey": response.result.parameters.secret_access_key
		};

		var url = provisioning_service_url + '/users/' + params.UserId + '/keys';

		var callback = function (error, response, body) {
			if(error == null && body.status == 201) {
				console.log(body);
				bot.reply(message, "Your keys have been saved successfully!");
			} else if(error == null && body.status == 400) {
				bot.reply(message, "Please check your credentials they don't seem to be right!");
			}
			else {
				console.log(error);
				bot.reply(message, "Your keys could not be saved!");
			}
		};

		post(params, url, callback);
	},


	saveAWSKeys: function (bot, message, response) {
		bot.reply(message, "Okay, I am working on it.")
		console.log("***** SAVING AWS KEYS ********");

		var params = {
			"UserId": message.user,
			"Service": response.result.parameters.aws,
			"AccessKeyId": response.result.parameters.access_key_id,
			"SecretAccessKey": response.result.parameters.secret_access_key,
			"KeyPair": response.result.parameters.keypair
		};

		var url = provisioning_service_url + '/users/' + params.UserId + '/keys';

		var callback = function (error, response, body) {
			if(error == null && body.status == 201) {
				console.log(body);
				bot.reply(message, "Your keys have been saved successfully!");
			} else if(error == null && body.status == 400) {
				bot.reply(message, "Please check your credentials they don't seem to be right!");
			}
			else {
				console.log(error);
				bot.reply(message, "Your keys could not be saved!");
			}
		};

		post(params, url, callback);
	},

	saveDigitalOceanKeys: function (bot, message, response) {
		bot.reply(message, "Okay, I am working on it.")
		console.log("***** SAVING Digital Ocean KEYS ********");

		var params = {
			"UserId": message.user,
			"Service": response.result.parameters.digital_ocean,
			"Token": response.result.parameters.token,
			"KeyPair": response.result.parameters.keypair
		};

		var url = provisioning_service_url + '/users/' + params.UserId + '/keys';

		var callback = function (error, response, body) {
			if(error == null && body.status == 201) {
				console.log("Callback received!....");
				console.log(body);
				bot.reply(message, "Your keys have been saved successfully!");
			} else if(error == null && body.status == 400) {
				bot.reply(message, "Please check your credentials they don't seem to be right!");
			}
			else {
				console.log(error);
				bot.reply(message, "Your keys could not be saved!");
			}
		};

		post(params, url, callback);
	},

	createVM: function (bot, message, response) {
		bot.reply(message, "Okay, I am working on it.");
		console.log("***** CREATING VMs ********");

		var params = {
			"UserId": message.user,
			"RequestType": "vm",
			"OS": response.result.parameters.os,
			"VCPUs": response.result.parameters.vcpus,
			"VRAM": response.result.parameters.ram,
			"Storage": response.result.parameters.storage,
			"StorageType": "spindle/SSD",
			"VMCount": response.result.parameters.vmcount
		};

		console.log(params);
		var url = provisioning_service_url + '/users/' + params.UserId + '/reservations';

		var callback = function (error, response, body) {
			if(error == null && body.status == 201) {
				console.log("POST Response Body Data \n ")
				console.log(body.data)

				if (body.data.droplet) {
					var details = "VM/s Ready! \nYour Digital Ocean Reservation Id is : " + body.data.droplet.id + "\n>" + " Instance details:";
					details = details +  "\n>" + " Your IP is : " + body.data.droplet.networks.v4[0].ip_address;
					bot.reply(message,  details);
				} else {
					var details = "VM/s Ready! \nYour AWS Reservation Id is : " + body.data.ReservationId + "\n>" + " Instance details:";
					for (var i = 0; i < body.data.Instances.length; i++) {
						details = details +  "\n>" + " Your Public DNS name is : " + body.data.Instances[i].PublicDnsName;
					    }
					bot.reply(message,  details);
				}

			} else {
				console.log(error);
				bot.reply(message, body.message + ". Sorry, your reservation was not successful!");
			}
		};

		post(params, url, callback);
	},

	createCluster: function (bot, message, response) {
		bot.reply(message, "Okay, I am working on it.")
		console.log("***** CREATING CLUSTER ********");

		var params = {
			"UserId": message.user,
			"RequestType": "cluster",
			"VCPUs": response.result.parameters.vcpus,
			"VRAM": response.result.parameters.ram,
			"Storage": response.result.parameters.storage,
			"StorageType": "spindle/SSD",
			"NodeCount": response.result.parameters.no_of_nodes
		};

		var url = provisioning_service_url + '/users/' + params.UserId + '/reservations';

		var callback = function (error, response, body) {
			if(error == null && body.status == 201) {
				console.log(body.data);
				bot.reply(message, "Spark Cluster Created! \nYour Reservation Id is : " + body.data.Reservation.ReservationId + "\n>Zeppelin Link : " + body.data.Reservation.MasterPublicDnsName + ":8890");
			} else {
				console.log(error);
				bot.reply(message, body.message + " Sorry, your cluster reservation was not successful!");
			}
		};

		post(params, url, callback);
	},

	// GET /users/:<userId>/reservations/
	showReservations: function (bot, message, response) {
		console.log("***** SHOWING RESERVATIONS ********");
		var params = {
			"UserId": message.user,
		};
		var url = provisioning_service_url + '/users/' + params.UserId + '/reservations';

		var callback = function (error, response, body) {
			if(error == null && body.status == 200) {
				console.log(body);
				var formatted_results = format(body.data);
				console.log("FORMATTED RESULTS")
				console.log(formatted_results)
				bot.reply(message, formatted_results);
			} else {
				console.log(error);
				bot.reply(message,body.message);
				//bot.reply(message, "Sorry, I was not able to fetch your reservations at this time.");
			}
		};

		get(params, url, callback);
	},

	// GET /users/:<userId>/reservations/:<reservation-id>
	showReservation: function (bot, message, response) {
		console.log("***** SHOWING A SINGLE RESERVATION ********");
		var params = {
			"UserId": message.user,
			"ReservationId": response.result.parameters.reservation_id
		};

		console.log(response.result.parameters.reservation_id);

		var url = provisioning_service_url + '/users/' + params.UserId + '/reservations/'  + response.result.parameters.reservation_id;

		var callback = function (error, response, body) {
			if(error == null && body.status == 200) {
				console.log(body);
				var formatted_results = format([body.data]);
				console.log("FORMATTED RESULT")
				console.log(formatted_results)
				bot.reply(message, formatted_results);
			} else {
				console.log(error);
				bot.reply(message, body.message);
			}
		};

		get(params, url, callback);
	},

	tearDown: function (bot, message, response) {
		bot.reply(message, "Okay, I am working on it.");
		console.log("***** TEAR DOWN ********");
		console.log(response);
		console.log("***" + response.result.parameters.reservation_id);

		if(response.result.parameters.reservation_id != "") {
			//go ahead and delete that reservation
			var url = provisioning_service_url + '/users/' + message.user + '/reservations/' + response.result.parameters.reservation_id;
			var params = {
				"UserId": message.user,
				"ReservationId": response.result.parameters.reservation_id
			};

			var callback = function (error, response, body) {
				if(error == null && body.status == 204) {
					console.log(body);
					bot.reply(message, "Successfully terminated your reservation.");
				} else {
					console.log(error);
					bot.reply(message, body.message + ". Sorry, I was not able to terminate your reservation.");
				}
			};

			deleteResource(params, url, callback);

		} else {
			bot.reply(message, "Please provide a reservation id. (say: `tear down reservation <reservation_id>`)");
			this.showReservations(bot, message, response);

		}
	},

	setReminderReservation: function (bot, message, response) {
		var reservationId = response.result.parameters.reservation_id;
		var seconds = response.result.parameters.duration.amount;
		var multiplier = response.result.parameters.duration.unit;
		var timeval = seconds;
		
		if (multiplier === "min")
			seconds *= 60;
		
		if (multiplier === "h")
			seconds *= 60*60;

		if (multiplier === "day")
			seconds *= 60*60*24;

		console.log(seconds);
		bot.reply(message, "Reminder has been set successfully!");

		var showResFnPtr = this.showReservations;
		var showSingleResFnPtr = this.showReservation;

		setTimeout(function() {
			console.log('REMINDER!!!');
			if (reservationId == "") {
				bot.reply(message, "Reminder _(" + timeval + multiplier + ")_ : The days of one of your Reservations are numbered! \n" + "`tear down reservation <reservation_id>`");
				showResFnPtr(bot, message, response);
			}
			else {
				bot.reply(message, "Reminder: Time to terminate your reservation " + reservationId +  "! \n" + "`tear down reservation " + reservationId + "`");
				showSingleResFnPtr(bot, message, response);
			}
		}, seconds*1000);
	},

	extendReservation: function (bot, message, response) {
	
	},

	saveTemplate: function (bot, message, response) {
		bot.reply(message, "Okay, I am working on it.");
		console.log("***** Save Template ********");
		console.log(response);
		console.log("***" + response.result.parameters.reservation_id);
		console.log("***" + response.result.parameters.template_name);

		if(response.result.parameters.reservation_id != "" && response.result.parameters.template_name != "") {
			//go ahead and save the request of reservation as template
			var url = provisioning_service_url + '/users/' + message.user + '/templates/' + response.result.parameters.template_name;
			var params = {
			    "UserId": message.user,
			    "ReservationId": response.result.parameters.reservation_id,
			    "TemplateName": response.result.parameters.template_name
			};

			var callback = function (error, response, body) {
				if(error == null && body.status == 201) {
					console.log("POST Response Body Data \n ");
				
					bot.reply(message, "Your template has been saved successfully!");
				} else {
					console.log(error);
					bot.reply(message, body.message + ". Sorry, couldn't save your template!");
				}
			};

		post(params, url, callback);

		}	
	},

	useTemplate: function (bot, message, response) {
		bot.reply(message, "Okay, I am working on it.");
		console.log("***** Use Template ********");
		console.log(response);
		console.log("***" + response.result.parameters.template_name);

		if(response.result.parameters.template_name != "") {
			//go ahead and save the request of reservation as template
			var url = provisioning_service_url + '/users/' + message.user + '/templates/' + response.result.parameters.template_name + '/reservations';
			var params = {
			    "UserId": message.user,
			    "TemplateName": response.result.parameters.template_name
			};

			/*
			var callback = function (error, response, body) {
				//body has the correct message set.
				bot.reply(message, body.message);
			};
			*/


			var callback = function(error, response, body) {
				if(error == null && body.status == 201) {
					if(body.Request.RequestType == "vm") {

						if (body.data.droplet) {
							var details = "VM/s Ready! \nYour Digital Ocean Reservation Id is : " + body.data.droplet.id + "\n>" + " Instance details:";
							details = details +  "\n>" + " Your IP is : " + body.data.droplet.networks.v4[0].ip_address;
							bot.reply(message,  details);
						} else {
							var details = "VM/s Ready! \nYour AWS Reservation Id is : " + body.data.ReservationId + "\n>" + " Instance details:";
							for (var i = 0; i < body.data.Instances.length; i++) {
								details = details +  "\n>" + " Your Public DNS name is : " + body.data.Instances[i].PublicDnsName;
							    }
							bot.reply(message,  details);
						}

					} else {
						var details = "Spark Cluster Created! \n Zeppelin Link : " + body.data.Reservation.MasterPublicDnsName + ":8890";
						bot.reply(message, details);
					}
				} 
				else {
					bot.reply(message, body.message);
				}
			}

			post(params, url, callback);

		}	
	},


	showTemplates: function (bot, message, response) {
		console.log("***** SHOWING TEMPLATES ********");
		var params = {
			"UserId": message.user,
		};
		var url = provisioning_service_url + '/users/' + params.UserId + '/templates';

		templatesDetails = []

		var callback = function (error, response, body) {
			if(error == null && body.status == 200) {
				console.log("showing templatessssssss");
				console.log(body.data);
				templates = body.data;
				for(var i = 0; i < templates.length; i++) {

					var details = "" + (i+1) + ". Template Name: *" + templates[i].Name + "*";
	                var requestMap = templates[i].Request;
	                for(var key in requestMap) {
	                	if(key === "UserId") {
	                		continue;
	                	}
	                	details += "\n>" + key + ": " + requestMap[key];
	                }
	                
	                console.log(details);
	                templatesDetails.push(details);
				}

				bot.reply(message, templatesDetails.join("\n\n"));
			} else {
				console.log(error);
				bot.reply(message, body.message);
			}
		};

		get(params, url, callback);
	}

}


