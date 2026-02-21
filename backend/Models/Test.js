const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const uniqueValidator = require("mongoose-unique-validator");

const testSchema = new Schema(
  {
    testId: { type: String, required: true, unique: true },
    testName: { type: String, required: true },
    paperId: { type: String, required: true },
    batchName: { type: String, required: true },
    course: { type: String, default: "" },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    duration: { type: Number, required: true },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true },
);

testSchema.plugin(uniqueValidator);
module.exports = mongoose.model("Test", testSchema);
