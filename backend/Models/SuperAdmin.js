const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const superAdminSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image: { type: String, required: true },
  role: { type: String, required: true },
  mobile: { type: String, required: true },
});
superAdminSchema.plugin(uniqueValidator);
module.exports = mongoose.model("SuperAdmin", superAdminSchema);
