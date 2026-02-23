const HttpError = require("../../Middleware/http-error");
const { validationResult } = require("express-validator");
const Score = require("../../Models/Score");
const Student = require("../../Models/Student");
const Test = require("../../Models/Test");
const QuestionPaper = require("../../Models/QuestionPaper");

const _getCorrectAnswer = (q) => {
  if (q.questionType === "MSQ") return q.correctOptions || [];
  if (q.questionType === "NAT") return { min: q.natMin, max: q.natMax };
  return q.correctOption;
};

const createScore = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
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
  let paperName = "";
  let category = "";
  let subjects = [];

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

  try {
    const paper = await QuestionPaper.findOne({ paperId });
    if (paper) {
      paperName = paper.paperName || paperId;
      category = paper.category || "";
      subjects = paper.subjects || [];
    }
  } catch (_) {}

  const marks = Number(marksObtained);
  const total = Number(totalMarks);
  const pct = total > 0 ? Math.round((marks / total) * 10000) / 100 : 0;

  const score = new Score({
    testId,
    testName,
    studentId,
    studentName,
    paperId,
    paperName,
    category,
    subjects,
    batch,
    marksObtained: marks,
    totalMarks: total,
    percentage: pct,
    passed: passed === true || passed === "true" || pct >= 35,
    questions: (questions || []).map((q) => ({
      questionId: q.questionId,
      questionType: q.questionType || "MCQ",
      correctAnswer: q.correctAnswer,
      chosenAnswer: q.chosenAnswer,
      marksAwarded: Number(q.marksAwarded) || 0,
    })),
  });

  try {
    await score.save();
  } catch (err) {
    console.error("Score save error:", err);
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

const getLeaderboardByTestId = async (req, res, next) => {
  const { testId } = req.params;
  let scores;
  try {
    scores = await Score.find({ testId }, "-questions").sort({
      marksObtained: -1,
      createdAt: 1,
    });
  } catch (err) {
    return next(
      new HttpError("Something went wrong while fetching leaderboard", 500),
    );
  }
  const leaderboard = scores.map((s, i) => ({
    rank: i + 1,
    studentId: s.studentId,
    studentName: s.studentName,
    batch: s.batch,
    marksObtained: s.marksObtained,
    totalMarks: s.totalMarks,
    percentage: s.percentage,
    passed: s.passed,
    submittedAt: s.createdAt,
  }));
  res.status(200).json({ leaderboard, count: leaderboard.length });
};

const getLiveTestStatus = async (req, res, next) => {
  const { testId } = req.params;
  let scores;
  try {
    scores = await Score.find({ testId }, "-questions").sort({ createdAt: -1 });
  } catch (err) {
    return next(
      new HttpError("Something went wrong while fetching live status", 500),
    );
  }
  const submissions = scores.map((s) => ({
    studentId: s.studentId,
    studentName: s.studentName,
    batch: s.batch,
    marksObtained: s.marksObtained,
    totalMarks: s.totalMarks,
    percentage: s.percentage,
    passed: s.passed,
    submittedAt: s.createdAt,
  }));
  res.status(200).json({ submissions, count: submissions.length });
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

// ... existing code ...

const updateScore = async (req, res, next) => {
  const { scoreId } = req.params;
  const { marksObtained, totalMarks, passed } = req.body;

  let score;
  try {
    score = await Score.findById(scoreId);
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not find score.", 500),
    );
  }
  if (!score) return next(new HttpError("Score not found.", 404));

  if (marksObtained !== undefined) score.marksObtained = Number(marksObtained);
  if (totalMarks !== undefined) score.totalMarks = Number(totalMarks);
  if (passed !== undefined) score.passed = passed === true || passed === "true";

  // Recalculate percentage based on updated marks
  if (score.totalMarks > 0) {
    score.percentage =
      Math.round((score.marksObtained / score.totalMarks) * 10000) / 100;
  }

  try {
    await score.save();
  } catch (err) {
    return next(
      new HttpError("Something went wrong while updating the score.", 500),
    );
  }

  res.status(200).json({ score, message: "Score updated successfully" });
};

const deleteSingleScore = async (req, res, next) => {
  const { scoreId } = req.params;

  let score;
  try {
    score = await Score.findById(scoreId);
  } catch (err) {
    return next(
      new HttpError("Something went wrong, could not find score.", 500),
    );
  }
  if (!score) return next(new HttpError("Score not found.", 404));

  try {
    await score.deleteOne();
  } catch (err) {
    return next(
      new HttpError("Something went wrong while deleting the score.", 500),
    );
  }

  res.status(200).json({ message: "Score deleted successfully" });
};

exports.createScore = createScore;
exports.getAllScores = getAllScores;
exports.getScoresByStudentId = getScoresByStudentId;
exports.getScoresByTestId = getScoresByTestId;
exports.getScoreByTestAndStudent = getScoreByTestAndStudent;
exports.getAttemptedTestsByStudentId = getAttemptedTestsByStudentId;
exports.getLeaderboardByTestId = getLeaderboardByTestId;
exports.getLiveTestStatus = getLiveTestStatus;
exports.deleteScoresByTestId = deleteScoresByTestId;
exports.updateScore = updateScore;
exports.deleteSingleScore = deleteSingleScore;
