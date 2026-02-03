const HttpError = require("../Middleware/http-error");
const { validationResult } = require("express-validator");
const Score = require("../Models/Score");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const createScore = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Invalid inputs passed, please try again",
      errors: errors.array(),
    });
  }

  const { testId, studentId, questionPaperId, marks, maxscore, questions } =
    req.body;

  const createdScore = new Score({
    testId,
    studentId,
    questionPaperId,
    marks,
    maxscore,
    questions: questions.map((question) => ({
      questionId: question.questionId,
      correctAnswer: question.correctAnswer,
      chosenAnswer: question.chosenAnswer,
    })),
  });

  try {
    await createdScore.save();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      "Something went wrong while saving the data, please try again",
      500
    );
    return next(error);
  }

  res.status(201).json({ createdScore });
};

const getAllScore = async (req, res, next) => {
  let scores;
  try {
    scores = await Score.find({});
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching data, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ scores: scores });
};
const getScoreByStudentId = async (req, res, next) => {
  const studentId = req.params.studentId;
  let score;
  try {
    score = await Score.find({ studentId: studentId });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ score: score });
};
const getScoreByTestId = async (req, res, next) => {
  const testsId = req.params.testsId;
  let score;
  try {
    score = await Score.find({ testsId: testsId });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ score: score });
};
const getScoreByTestIdAndStudentId = async (req, res, next) => {
  const { testId, studentId } = req.params;
  let score;
  try {
    score = await Score.findOne({ testId, studentId });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }

  if (!score) {
    const error = new HttpError(
      "Score not found for the provided testId and studentId",
      404
    );
    return next(error);
  }

  res.status(200).json({ score });
};

const getAttemptedTestsByStudentId = async (req, res, next) => {
  const { studentId } = req.params;

  let tests;
  try {
    tests = await Score.find({ studentId: studentId });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }

  res.status(200).json({ tests: tests });
};

const deleteScoreByTestId = async (req, res, next) => {
  const testId = req.params.testId;
  let result;
  try {
    result = await Score.deleteMany({ testId: testId });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while deleting the data, please try again",
      500
    );
    return next(error);
  }

  // Check if any records were deleted
  if (result.deletedCount === 0) {
    const error = new HttpError("No matching records found for deletion", 404);
    return next(error);
  }

  // Return success response
  res.status(200).json({ message: "Records deleted successfully" });
};
exports.createScore = createScore;
exports.getAllScore = getAllScore;
exports.getScoreByStudentId = getScoreByStudentId;
exports.getScoreByTestId = getScoreByTestId;
exports.deleteScoreByTestId = deleteScoreByTestId;
exports.getAttemptedTestsByStudentId = getAttemptedTestsByStudentId;
exports.getScoreByTestIdAndStudentId = getScoreByTestIdAndStudentId;
