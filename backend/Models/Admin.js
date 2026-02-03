const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const adminSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  mobile: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  universityName: { type: String, required: true },
  address: { type: String, required: true },
  landmark: { type: String, required: true },
  pincode: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  image: { type: String, rewquired: true },
  role: { type: String, required: true },
  universityLogo: { type: String, required: true },
  dateOfEstablishment: { type: String, required: true },
});
adminSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Admin", adminSchema);
