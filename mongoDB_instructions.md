Mongo DB instructions:

1. Install mongodb using homebrew: `brew install mongodb`
2. After downloading Mongo, create the “db” directory. This is where the Mongo data files will live. You can create the directory in the default location by running `mkdir -p /data/db`
3. Make sure that the /data/db directory has the right permissions by running `sudo chown -R `id -un` /data/db`
4. Run the Mongo daemon, in one of your terminal windows run `mongod`. This should start the Mongo server.
5. Run the Mongo shell at `/usr/local/var/mongodb`, with the Mongo daemon running in one terminal, type `mongo` in another terminal window. This will run the Mongo shell which is an application to access data in MongoDB.
6. Switch to Infrared's provisioning service database i.e. `use provisioning_service`