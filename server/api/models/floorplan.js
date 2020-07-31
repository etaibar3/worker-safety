const mongoose = require("mongoose");
const floorplanSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  floorplanImage: { type: String, required: true },
  org: { type: String, required: true }
});

module.exports = mongoose.model("Floorplan", floorplanSchema);
