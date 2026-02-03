const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const scoreSchema = new Schema(
  {
    testId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Test', 
      required: true 
    },
    studentId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Student', 
      required: true 
    },
    questionPaperId: { type: String, required: true },
    attemptIds: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Attempt' 
    }],
    totalMarks: { type: Number, required: true },
    marksObtained: { type: Number, required: true, default: 0 },
    totalCorrect: { type: Number, default: 0 },
    totalIncorrect: { type: Number, default: 0 },
    totalSkipped: { type: Number, default: 0 },
    totalQuestions: { type: Number, required: true },
    percentage: { type: Number, default: 0 },
    timeTaken: { type: Number }, // Total time in seconds
    startedAt: { type: Date },
    completedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ['In Progress', 'Completed', 'Submitted'],
      default: 'In Progress'
    }
  },
  { timestamps: true }
);

// Index for faster queries
scoreSchema.index({ studentId: 1, testId: 1 });

module.exports = mongoose.model("Score", scoreSchema);
