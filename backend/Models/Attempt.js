const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const attemptSchema = new Schema(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Student', 
      required: true 
    },
    questionId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Question', 
      required: true 
    },
    testId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Test', 
      required: true 
    },
    selectedOption: {
      text: { type: String, required: true },
      index: { type: Number, required: true }
    },
    isCorrect: { type: Boolean, required: true },
    timeTaken: { type: Number, required: true }, // in seconds
    marksObtained: { type: Number, default: 0 },
    attemptedAt: { type: Date, default: Date.now },
    reviewed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Index for faster queries
attemptSchema.index({ userId: 1, testId: 1 });
attemptSchema.index({ questionId: 1 });

module.exports = mongoose.model("Attempt", attemptSchema);
