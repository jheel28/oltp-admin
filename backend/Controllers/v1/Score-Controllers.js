const HttpError = require("../../Middleware/http-error");
const { validationResult } = require("express-validator");
const Score = require("../../Models/Score");
const Student = require("../../Models/Student");
const Test = require("../../Models/Test");

const createScore = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({
        message: "Invalid inputs passed, please try again",
        errors: errors.array(),
      });
  }

  const {
    testId,
    studentId,
    paperId,
    marksObtained,
    totalMarks,
    passed,
    questions,
  } = req.body;

  let studentName = "";
  let batch = "";
  let testName = "";

  try {
    const student = await Student.findOne({ studentId });
    if (student) {
      studentName = `${student.firstName} ${student.lastName}`;
      batch = student.batch || "";
    }
  } catch (_) {}

  try {
    const test = await Test.findOne({ testId });
    if (test) testName = test.testName || testId;
  } catch (_) {}

  const score = new Score({
    testId,
    testName,
    studentId,
    studentName,
    paperId,
    batch,
    marksObtained: Number(marksObtained),
    totalMarks: Number(totalMarks),
    passed:
      passed === true ||
      passed === "true" ||
      Number(marksObtained) / Number(totalMarks) >= 0.35,
    questions: (questions || []).map((q) => ({
      questionId: q.questionId,
      correctAnswer: q.correctAnswer,
      chosenAnswer: q.chosenAnswer,
      marksAwarded: Number(q.marksAwarded) || 0,
    })),
  });

  try {
    await score.save();
  } catch (err) {
    return next(
      new HttpError("Something went wrong while saving the score", 500),
    );
  }

  res.status(201).json({ score });
};

const getAllScores = async (req, res, next) => {
  let scores;
  try {
    scores = await Score.find({}).sort({ createdAt: -1 });
  } catch (err) {
    return next(
      new HttpError("Something went wrong while fetching scores", 500),
    );
  }
  res.status(200).json({ scores });
};

const getScoresByStudentId = async (req, res, next) => {
  const { studentId } = req.params;
  let scores;
  try {
    scores = await Score.find({ studentId }).sort({ createdAt: -1 });
  } catch (err) {
    return next(
      new HttpError("Something went wrong while fetching scores", 500),
    );
  }
  res.status(200).json({ scores });
};

const getScoresByTestId = async (req, res, next) => {
  const { testId } = req.params;
  let scores;
  try {
    scores = await Score.find({ testId }).sort({ createdAt: -1 });
  } catch (err) {
    return next(
      new HttpError("Something went wrong while fetching scores", 500),
    );
  }
  res.status(200).json({ scores });
};

const getScoreByTestAndStudent = async (req, res, next) => {
  const { testId, studentId } = req.params;
  let score;
  try {
    score = await Score.findOne({ testId, studentId });
  } catch (err) {
    return next(
      new HttpError("Something went wrong while fetching the score", 500),
    );
  }
  if (!score) return next(new HttpError("Score not found", 404));
  res.status(200).json({ score });
};

const getAttemptedTestsByStudentId = async (req, res, next) => {
  const { studentId } = req.params;
  let scores;
  try {
    scores = await Score.find({ studentId }, "-questions").sort({
      createdAt: -1,
    });
  } catch (err) {
    return next(
      new HttpError("Something went wrong while fetching attempted tests", 500),
    );
  }
  res.status(200).json({ tests: scores });
};

const deleteScoresByTestId = async (req, res, next) => {
  const { testId } = req.params;
  let result;
  try {
    result = await Score.deleteMany({ testId });
  } catch (err) {
    return next(
      new HttpError("Something went wrong while deleting scores", 500),
    );
  }
  if (result.deletedCount === 0)
    return next(new HttpError("No scores found for this test", 404));
  res.status(200).json({ message: `Deleted ${result.deletedCount} score(s)` });
};

exports.createScore = createScore;
exports.getAllScores = getAllScores;
exports.getScoresByStudentId = getScoresByStudentId;
exports.getScoresByTestId = getScoresByTestId;
exports.getScoreByTestAndStudent = getScoreByTestAndStudent;
exports.getAttemptedTestsByStudentId = getAttemptedTestsByStudentId;
exports.deleteScoresByTestId = deleteScoresByTestId;
