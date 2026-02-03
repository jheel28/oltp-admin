const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const querySchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  question: { type: String, required: true },
  answer: [{ type: String }],
  status: { type: String, required: true },
  image: { type: String },
});
module.exports = mongoose.model("Query", querySchema);
