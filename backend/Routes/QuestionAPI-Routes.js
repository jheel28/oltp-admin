const express = require("express");
const router = express.Router();
const {
  getQuestionsForStudent,
  getQuestionsForTest,
  submitAnswer,
  getAnswerStats,
} = require("../Controllers/QuestionAPI-Controllers");

// Public routes (no auth needed)
// ✅ GET /api/questions - Fetch all questions
router.get("/questions", getQuestionsForStudent);

// ✅ GET /api/questions/:testId - Fetch questions for specific test
router.get("/questions/:testId", getQuestionsForTest);

// ✅ POST /api/answer - Submit answer
router.post("/answer", submitAnswer);

// ✅ GET /api/answer/stats - Get statistics
router.get("/answer/stats", getAnswerStats);

module.exports = router;
