const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const adminSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  normalizedEmail: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  password: { type: String, required: true },
  image: { type: String, default: null },
  role: { type: String, required: true },
});

adminSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Admin", adminSchema);
