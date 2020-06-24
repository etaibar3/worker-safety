const mongoose = require("mongoose");

const reservationSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  //employee_id: { type: String },
});

module.exports = mongoose.model("Reservation", reservationSchema);
