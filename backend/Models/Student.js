const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const studentSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  fatherName: { type: String, default: null },
  motherName: { type: String, default: null },
  phoneNumber: { type: String, required: true },
  alternateNumber: { type: String, required: true },
  role: { type: String, required: true },
  image: { type: String, default: null },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  studentId: { type: String, required: true },
  admissionDate: { type: String, required: true },
  batch: { type: String, required: true },
  address: { type: String, required: true },
  pincode: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verificationToken: { type: String, default: null },
  verificationTokenExpiry: { type: Date, default: null },
});

studentSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Student", studentSchema);