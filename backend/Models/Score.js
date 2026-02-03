const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const questionSchema = new Schema({
  questionId: { type: String, required: true },
  correctAnswer: { type: String, required: true },
  chosenAnswer: { type: String },
});
const scoreSchema = new Schema({
  testId: { type: String, required: true },
  studentId: { type: String, required: true },
  questionPaperId: { type: String, required: true },
  marks: { type: String, required: true },
  maxscore: { type: String, required: true },
  questions: [questionSchema],
});
module.exports = mongoose.model("Score", scoreSchema);
