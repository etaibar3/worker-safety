const mongoose = require("mongoose");
const { int } = require("neo4j-driver");
const floorplanSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String},
  floorplanImage: { type: String, required: true },
  org: { type: String, required: true },
  floorNumber: { type: String, required: false },
});

module.exports = mongoose.model("Floorplan", floorplanSchema);
