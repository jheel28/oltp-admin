const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const optionSchema = new Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, default: false },
  image: { type: String } // Optional image for option
});

const questionSchema = new Schema(
  {
    questionPaperId: { type: String, required: true },
    questionText: { type: String, required: true },
    questionImage: { type: String },
    options: [optionSchema],
    difficulty: { 
      type: String, 
      enum: ['Easy', 'Medium', 'Hard'], 
      required: true,
      default: 'Medium'
    },
    topic: { type: String, required: true },
    marks: { type: Number, required: true, default: 1 },
    explanation: { type: String }, // Optional explanation for answer
    createdBy: { type: String }, // Admin/SuperAdmin ID
  },
  { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);
