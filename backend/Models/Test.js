const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const testSchema = new Schema({
  batchName: { type: String, required: true },
  testId: { type: String, required: true },
  score: { type: String, required: true },
  course: { type: String, required: true },
  examName: { type: String, required: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  questionPaperId: { type: String, required: true },
  subjects: { type: String }, // New field: e.g., Physics, Chemistry
  difficulty: { type: String }, // New field: Easy, Medium, Hard
});
testSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Test", testSchema);
