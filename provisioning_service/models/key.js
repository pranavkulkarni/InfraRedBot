var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var KeySchema = new Schema({
  UserId: String,
  AccessKeyId: String,
  SecretAccessKey: String,
  Service: String,
  Token: String,
  KeyPair: String
});

mongoose.model('Key', KeySchema);