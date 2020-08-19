const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongo4j = require("mongo4j");

const reservationSchema = mongoose.Schema({
  _id: { type: Schema.Types.ObjectId },
  seat_number: { type: String, requered: true, neo_prop: true },
  employee: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
    // neo_prop: true,
    neo_rel_name: "Made by",
  },
  date_created: {
    type: Date,
    default: Date.now(),
  },
  org: {
    type: String,
    required: true,
  }
});

reservationSchema.plugin(mongo4j.plugin());
module.exports = mongoose.model("Reservation", reservationSchema);
