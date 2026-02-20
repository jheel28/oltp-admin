const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  subjects: [{ type: String, trim: true }],
  description: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

categorySchema.plugin(uniqueValidator);
module.exports = mongoose.model("Category", categorySchema);