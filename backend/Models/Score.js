const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionAttemptSchema = new Schema({
  questionId: { type: String, required: true },
  questionText: { type: String, default: "" },
  questionType: { type: String, default: "MCQ" },
  correctAnswer: { type: Schema.Types.Mixed, required: true },
  chosenAnswer: { type: Schema.Types.Mixed },
  marksAwarded: { type: Number, default: 0 },
});

const scoreSchema = new Schema(
  {
    testId: { type: String, required: true, index: true },
    testName: { type: String, default: "" },
    studentId: { type: String, required: true, index: true },
    studentName: { type: String, default: "" },
    paperId: { type: String, required: true },
    paperName: { type: String, default: "" },
    batch: { type: String, default: "" },
    category: { type: String, default: "" },
    subjects: [{ type: String }],
    marksObtained: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    percentage: { type: Number, default: 0 },
    passed: { type: Boolean, default: false },
    questions: [questionAttemptSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Score", scoreSchema);