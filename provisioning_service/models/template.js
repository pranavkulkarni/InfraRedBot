var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var TemplateSchema = new Schema({
  UserId: String,
  Name: String,
  Request: Schema.Types.Mixed
});

mongoose.model('Template', TemplateSchema);