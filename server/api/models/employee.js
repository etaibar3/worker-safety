const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongo4j = require("mongo4j");
const employeeSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId },
  name: { type: String, required: true, neo_prop: true },
  employee_id: { type: String, required: true, neo_prop: true },
  createdEvents: [
    {
      type: Schema.Types.ObjectId,
      ref: "Reservation",
    },
  ],
});
employeeSchema.plugin(mongo4j.plugin());
module.exports = mongoose.model("Employee", employeeSchema);
