const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const optionSchema = new Schema({
  text: { type: String },
  image: { type: String }, // Assuming the image path will be stored as a string
});
const questionSchema = new Schema({
  questionPaperId: { type: String, required: true },
  text: { type: String, required: true },
  questionImage: { type: String },
  options: [optionSchema],
  correctOption: { type: Number, required: true },
  marks: { type: Number, required: true },
});

module.exports = mongoose.model("Question", questionSchema);
