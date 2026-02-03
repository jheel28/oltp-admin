const Attempt = require("../Models/Attempt");
const Question = require("../Models/Question");
const Score = require("../Models/Score");
const { validationResult } = require("express-validator");

// CREATE ATTEMPT
const createAttempt = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { userId, questionId, testId, selectedOption, timeTaken } = req.body;

  try {
    // Get question details to check if answer is correct
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Find correct option
    const correctOption = question.options.find(opt => opt.isCorrect === true);
    const isCorrect = selectedOption.text === correctOption.text;
    const marksObtained = isCorrect ? question.marks : 0;

    // Create attempt
    const attempt = new Attempt({
      userId,
      questionId,
      testId,
      selectedOption,
      isCorrect,
      timeTaken,
      marksObtained
    });

    const savedAttempt = await attempt.save();

    // Update or create score
    let score = await Score.findOne({ studentId: userId, testId });
    
    if (score) {
      score.attemptIds.push(savedAttempt._id);
      score.marksObtained += marksObtained;
      
      if (isCorrect) {
        score.totalCorrect += 1;
      } else {
        score.totalIncorrect += 1;
      }
      
      score.percentage = (score.marksObtained / score.totalMarks) * 100;
      await score.save();
    }

    return res.status(201).json({
      message: "Attempt created successfully",
      attempt: savedAttempt,
      isCorrect
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET ATTEMPTS BY USER AND TEST
const getAttemptsByUserTest = async (req, res) => {
  const { userId, testId } = req.params;

  try {
    const attempts = await Attempt.find({ userId, testId })
      .populate("questionId", "questionText options difficulty topic marks")
      .sort({ attemptedAt: 1 });

    return res.status(200).json({
      message: "Attempts retrieved successfully",
      attempts
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET SINGLE ATTEMPT
const getAttemptById = async (req, res) => {
  const { attemptId } = req.params;

  try {
    const attempt = await Attempt.findById(attemptId)
      .populate("userId", "firstName lastName email")
      .populate("questionId")
      .populate("testId");

    if (!attempt) {
      return res.status(404).json({ message: "Attempt not found" });
    }

    return res.status(200).json({
      message: "Attempt retrieved successfully",
      attempt
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET QUESTION STATISTICS
const getQuestionStats = async (req, res) => {
  const { questionId } = req.params;

  try {
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const attempts = await Attempt.find({ questionId });
    const totalAttempts = attempts.length;
    const correctAttempts = attempts.filter(a => a.isCorrect).length;
    const incorrectAttempts = totalAttempts - correctAttempts;
    const avgTimeTaken = attempts.length > 0 
      ? (attempts.reduce((sum, a) => sum + a.timeTaken, 0) / attempts.length).toFixed(2)
      : 0;

    const correctPercentage = totalAttempts > 0 
      ? ((correctAttempts / totalAttempts) * 100).toFixed(2)
      : 0;

    return res.status(200).json({
      message: "Question statistics retrieved",
      stats: {
        questionId,
        totalAttempts,
        correctAttempts,
        incorrectAttempts,
        correctPercentage,
        avgTimeTaken
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET ALL ATTEMPTS FOR REVIEW
const getAllAttempts = async (req, res) => {
  try {
    const attempts = await Attempt.find()
      .populate("userId", "firstName lastName studentId")
      .populate("questionId", "questionText difficulty topic")
      .populate("testId");

    return res.status(200).json({
      message: "All attempts retrieved",
      attempts
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// UPDATE ATTEMPT (for review marking)
const updateAttemptById = async (req, res) => {
  const { attemptId } = req.params;
  const { reviewed, marksObtained } = req.body;

  try {
    const attempt = await Attempt.findByIdAndUpdate(
      attemptId,
      { reviewed, marksObtained },
      { new: true }
    );

    if (!attempt) {
      return res.status(404).json({ message: "Attempt not found" });
    }

    return res.status(200).json({
      message: "Attempt updated successfully",
      attempt
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// DELETE ATTEMPT
const deleteAttemptById = async (req, res) => {
  const { attemptId } = req.params;

  try {
    const attempt = await Attempt.findByIdAndDelete(attemptId);

    if (!attempt) {
      return res.status(404).json({ message: "Attempt not found" });
    }

    // Remove from score
    await Score.findByIdAndUpdate(
      { _id: attempt.scoreId },
      { $pull: { attemptIds: attemptId } }
    );

    return res.status(200).json({ message: "Attempt deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createAttempt,
  getAttemptsByUserTest,
  getAttemptById,
  getQuestionStats,
  getAllAttempts,
  updateAttemptById,
  deleteAttemptById
};
