const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const questionPaperSchema = new Schema({
  questionPaperId: { type: String, required: true, unique: true },
  score: { type: Number, required: true },
  noOfQuestions: { type: Number, required: true },
  category: { type: String, required: true },
  keySheet: { type: String },
});
questionPaperSchema.plugin(uniqueValidator);
module.exports = mongoose.model("QuestionPaper", questionPaperSchema);
