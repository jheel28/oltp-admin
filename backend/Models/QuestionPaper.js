const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const questionPaperSchema = new Schema(
  {
    paperId: { type: String, required: true, unique: true },
    paperName: { type: String, required: true },
    category: { type: String, required: true },
    subjects: [{ type: String }],
    batch: { type: String, default: "" },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
    totalQuestions: { type: Number, default: 0 },
    totalMarks: { type: Number, default: 0 },
    marksPerQuestion: { type: Number, default: 4 },
    negativeMarking: { type: Boolean, default: false },
    negativeFraction: { type: Number, default: 0.25 },
    passingPercentage: { type: Number, default: 35 },
    isActive: { type: Boolean, default: true },
    description: { type: String, default: "" },
  },
  { timestamps: true },
);

questionPaperSchema.plugin(uniqueValidator);
module.exports = mongoose.model("QuestionPaper", questionPaperSchema);