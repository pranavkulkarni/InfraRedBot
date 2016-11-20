var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var ReservationSchema = new Schema({
  UserId: String,
  Cloud : String,
  Reservation: Schema.Types.Mixed,
  Request: Schema.Types.Mixed
});

mongoose.model('Reservation', ReservationSchema);