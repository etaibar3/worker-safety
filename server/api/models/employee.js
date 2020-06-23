const mongoose = require("mongoose");
const employeeSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  employee_id: { type: String, required: true },
  currentSeat: { type: String },
});

module.exports = mongoose.model("Employee", employeeSchema);
