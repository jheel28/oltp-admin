const HttpError = require("../Middleware/http-error");
const Question = require("../Models/Question");
const Attempt = require("../Models/Attempt");

// ✅ GET /api/questions - Fetch all questions (student side - without showing isCorrect)
const getQuestionsForStudent = async (req, res, next) => {
  try {
    const questions = await Question.find()
      .select("-createdBy") // Don't show who created it
      .populate("questionPaperId", "title description");

    if (!questions || questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No questions found",
        data: [],
      });
    }

    // Strip out isCorrect from options for student view
    const questionsForStudent = questions.map((q) => ({
      _id: q._id,
      questionText: q.questionText,
      difficulty: q.difficulty,
      topic: q.topic,
      marks: q.marks,
      options: q.options.map((opt) => ({
        text: opt.text,
        // ❌ Don't send isCorrect to student
      })),
      createdAt: q.createdAt,
    }));

    res.status(200).json({
      success: true,
      message: "Questions fetched successfully",
      count: questionsForStudent.length,
      data: questionsForStudent,
    });
  } catch (err) {
    const error = new HttpError(
      "Could not fetch questions, please try again",
      500
    );
    return next(error);
  }
};

// ✅ GET /api/questions/:testId - Fetch questions for specific test
const getQuestionsForTest = async (req, res, next) => {
  try {
    const { testId } = req.params;

    // Assuming questions are linked to tests via questionPaperId
    const questions = await Question.find({ questionPaperId: testId })
      .select("-createdBy");

    if (!questions || questions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No questions found for this test",
        data: [],
      });
    }

    // Strip out isCorrect from options
    const questionsForStudent = questions.map((q) => ({
      _id: q._id,
      questionText: q.questionText,
      difficulty: q.difficulty,
      topic: q.topic,
      marks: q.marks,
      options: q.options.map((opt) => ({
        text: opt.text,
      })),
      createdAt: q.createdAt,
    }));

    res.status(200).json({
      success: true,
      message: "Test questions fetched successfully",
      count: questionsForStudent.length,
      data: questionsForStudent,
    });
  } catch (err) {
    const error = new HttpError(
      "Could not fetch test questions, please try again",
      500
    );
    return next(error);
  }
};

// ✅ POST /api/answer - Submit answer and check if correct
const submitAnswer = async (req, res, next) => {
  try {
    const { questionId, selectedOption, userId, testId } = req.body;

    // Validation
    if (!questionId || selectedOption === undefined) {
      return res.status(400).json({
        success: false,
        message: "questionId and selectedOption are required",
      });
    }

    // Fetch question from database
    const question = await Question.findById(questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    // Get the correct option
    const correctOption = question.options.find((opt) => opt.isCorrect === true);

    if (!correctOption) {
      return res.status(500).json({
        success: false,
        message: "Question setup error - no correct answer defined",
      });
    }

    // Check if student's answer is correct
    const selectedOptionText = question.options[selectedOption]?.text;
    const isCorrect = selectedOptionText === correctOption.text;

    // Save attempt to database (if userId and testId provided)
    if (userId && testId) {
      const attempt = new Attempt({
        userId,
        questionId,
        testId,
        selectedOption: selectedOptionText,
        isCorrect,
        timeTaken: 0, // Can be updated by frontend
      });

      await attempt.save();
    }

    // Return response
    res.status(200).json({
      success: true,
      message: isCorrect ? "Correct answer!" : "Incorrect answer",
      data: {
        questionId,
        selectedOption: selectedOptionText,
        isCorrect,
        correctAnswer: correctOption.text,
        explanation: question.explanation || "No explanation provided",
        marks: question.marks,
      },
    });
  } catch (err) {
    console.error("Error submitting answer:", err);
    const error = new HttpError(
      "Could not submit answer, please try again",
      500
    );
    return next(error);
  }
};

// ✅ GET /api/answer/stats - Get answer statistics
const getAnswerStats = async (req, res, next) => {
  try {
    const { userId, testId } = req.query;

    if (!userId || !testId) {
      return res.status(400).json({
        success: false,
        message: "userId and testId are required",
      });
    }

    // Fetch all attempts for this user and test
    const attempts = await Attempt.find({ userId, testId }).populate(
      "questionId",
      "questionText marks"
    );

    if (!attempts || attempts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No attempts found",
        data: {
          totalQuestions: 0,
          correct: 0,
          incorrect: 0,
          skipped: 0,
          percentage: 0,
        },
      });
    }

    // Calculate statistics
    const correct = attempts.filter((a) => a.isCorrect).length;
    const incorrect = attempts.filter((a) => !a.isCorrect).length;
    const percentage = ((correct / attempts.length) * 100).toFixed(2);

    res.status(200).json({
      success: true,
      message: "Statistics fetched successfully",
      data: {
        totalQuestions: attempts.length,
        correct,
        incorrect,
        skipped: 0,
        percentage,
        attempts, // Full attempt details
      },
    });
  } catch (err) {
    const error = new HttpError(
      "Could not fetch statistics, please try again",
      500
    );
    return next(error);
  }
};

module.exports = {
  getQuestionsForStudent,
  getQuestionsForTest,
  submitAnswer,
  getAnswerStats,
};
