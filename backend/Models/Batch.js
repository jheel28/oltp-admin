const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const batchShcema = new Schema({
  batchName: { type: String, required: true, unique: true },
  sectionName: [{ type: String, required: true }],
  studentId: [{ type: String, required: true }],
});
batchShcema.plugin(uniqueValidator);
module.exports = mongoose.model("Batch", batchShcema);
