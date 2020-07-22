const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create Geo Schema

const GeoSchema = new Schema({
  type: {
    type: String,
    default: "Point",
  },
  coordinates: {
    type: [Number],
    index: "2dsphere",
  },
});

// creat Seat Schema
const SeatSchema = new Schema({
  seat_number: {
    type: String,
    required: [true, "seat number is required"],
  },
  available: {
    type: Boolean,
    default: true,
  },
  $geometry: GeoSchema,
});

module.exports = mongoose.model("Seat", SeatSchema);
