const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const testSchema = new Schema(
  {
    testId: { type: String, required: true, unique: true },
    testName: { type: String, required: true },
    paperId: { type: String, required: true },
    batchName: { type: String, default: "" },
    category: { type: String, default: "" },
    subjects: [{ type: String }],
    totalMarks: { type: Number, default: 0 },
    totalQuestions: { type: Number, default: 0 },
    isPermanent: { type: Boolean, default: false },
    date: { type: String, default: "" },
    startTime: { type: String, default: "" },
    endTime: { type: String, default: "" },
    duration: { type: Number, required: true },
    passingPercentage: { type: Number, default: 35 },
    isPublished: { type: Boolean, default: false },
    allowCalculator: { type: Boolean, default: true },
    allowWatermark: { type: Boolean, default: true },
    description: { type: String, default: "" },
  },
  { timestamps: true },
);

testSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Test", testSchema);