const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const optionSchema = new Schema({
  text: { type: String },
  image: { type: String },
});

const questionSchema = new Schema(
  {
    paperId: { type: String, required: true, index: true },
    text: { type: String, required: true },
    questionImage: { type: String },
    type: { type: String, enum: ["MCQ", "MSQ", "NAT"], default: "MCQ" },
    options: [optionSchema],
    correctOption: { type: Schema.Types.Mixed },
    correctOptions: [{ type: Number }],
    natMin: { type: Number },
    natMax: { type: Number },
    marksPositive: { type: Number, default: null },
    marksNegative: { type: Number, default: null },
    topic: { type: String, default: "" },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Question", questionSchema);
