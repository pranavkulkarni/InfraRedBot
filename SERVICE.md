# Milestone: SERVICE

In the previous milestone in Bot.md, we described 5 use cases and had implemented interaction of the provisioning service with our bot using mock data and services. In this milestone, we have implemented the internal logic required to *actually* perform the services/tasks via the bot. We have not only covered all the use cases mentioned previously, but added a few more. In this file we describe a little bit about how the service was implemented.

###Provisioning Service Summary
1. Serves Bot's requests for initial keys setup for cloud service provider (AWS/DigitalOcean)
2. Accepts provisioning requests from the bot to provision VMs and Cluster.The pricing engine decides the cheapest Cloud provider based on the configuration request and makes calls to the chosen cloud service provider APIs (AWS/DigitalOcean)
3. Accepts requests to show active reservations, tear down current reservation (VMs or Cluster).
4. Accepts requests to save a configuration request as a template and supports creation of future reservations using these saved templates
4. Maintains keys, reservation and template information per user in a database (MongoDB) and exposes APIs over it.


### Mapping Use Case to Service Endpoint
####Use Case : Configure Access Keys
**Endpoint :** POST /users/:UserId/keys

**Action :** Tests if provided credentials for the cloud provider are valid and subsequently saves the keys for the service with the unique UserId into a MongoDB collection called keys. This would be a one time setup and would be used for all VM and cluster creation requests. 

####Use Case : Set up VMs
**Endpoint :** POST /users/:UserId/reservations

**Action :** After receiving the configuraton request, the pricing engine queries the keys saved in the database for the user, and chooses the closest matching instance type and decides the cheaper cloud provider amongst AWS or Digital Ocean to provision the VM/s. It Waits for the state of the VM/s to be "READY" before returning success along with the Reservation Id and IP address/s. The reservation information is also saved in the database along with a unique reservation ID.

####Use Case : Set up a cluster
**Endpoint :** POST /users/:user_Id/reservations

**Action :** Queries for the keys saved in the database for the user, using which, makes an appropriate call to AWS to actually provision the Cluster (AWS EMR Cluster).The cluster is preconfigured with other services such as Apache Spark, Ganglia, Zepellin etc. It Waits for the state of the Cluster to be "READY" before returning success along with the Reservation Id, Master's DNS name of the cluster and the link to the Zepellin Notebook. The cluster reservation information is also saved in the database along with a unique cluster reservation ID in a MongoDB collection reservations.

####Use Case : Show Current Reservations
**Endpoint :** GET /users/:UserId/reservations

**Action :** Queries the database for current reservations of that user and returns the reservation Id along with their corresponding Request parameters.

####Use Case : User initiated tear down (Delete Reservation)
**Endpoint :** DELETE /users/:UserId/reservations/:ReservationId

**Action :** Checks if the Reservation Id is valid and makes calls to the cloud service APIs to actually terminate the reservation and release resources. It then deletes VM/s or cluster reservation based on the given ReservationId  from the database

#### Use Case : Save Templates
**Endpoint :** POST /users/:UserId/templates/:TemplateId

**Description :** The end user of the bot can save existing reservations as a template and use them in the future to relaunch them. The user may do this via the following conversation:

* save reservation <reservation_id> as template sandbox_vm
* save reservation <reservation_id> as template sandbox_cluster

**Action :** The specified reservation request is saved as a template in a MongoDB collection called templates.

#### Use Case : Create Reservation Using templates
**Endpoint :** POST /users/:UserId/templates/:TemplateId/reservations

**Description :** The end user can relaunch the reservations using templates using the following conversation:

* create reservation using my template sandbox_vm
* create reservation using my template sandbox_cluster

**Action :** Calls the POST /users/:user_Id/reservations API to launch VM/s or Cluster using the template name queried from the database.

#### Use Case : Show Templates
**Endpoint :** GET /users/:UserId/templates

**Action :** Queries the database and returns all existing templates with their names and request parameters saved. 

### Submission
[Screen Cast](https://www.youtube.com/watch?v=92oT-W1Pqxo)

Note: They keys that were displayed in the video have been deleted after the demo. Hence no one can misuse them

### Task Tracking
The task and issues related to this milestone can be found under `Week 5` and `Week 6` in [WORKSHEET.md](WORKSHEET.md)
