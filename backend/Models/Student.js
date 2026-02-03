const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const studentSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  fatherName: { type: String },
  motherName: { type: String },
  fatherNumber: { type: Number },
  motherNumber: { type: Number },
  role: { type: String, required: true },
  image: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  studentId: { type: String, required: true },
  admissionDate: { type: String, required: true },
  batch: { type: String, required: true },
  address: { type: String, required: true },
  pincode: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
});
studentSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Student", studentSchema);
