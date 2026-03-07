const path = require("path");
const fs = require("fs");
const HttpError = require("../../Middleware/http-error");
const { validationResult } = require("express-validator");
const QuestionPaper = require("../../Models/QuestionPaper");
const Question = require("../../Models/Question");
const { parseDuplicateKeyError } = require("../../Middleware/duplicate-key");

const normalisePath = (filePath) =>
  filePath
    ? filePath.replace(/\\/g, "/").replace(/^.*?uploads\//, "uploads/")
    : "";

const deleteFileIfExists = (relPath) => {
  if (!relPath) return;
  try {
    const abs = path.join(__dirname, "../../", relPath);
    if (fs.existsSync(abs)) fs.unlinkSync(abs);
  } catch (_) { }
};

const createQuestionPaper = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.file) deleteFileIfExists(normalisePath(req.file.path));
    const errorDetails = errors.array().map(err => `${err.path || err.param}: ${err.msg}`).join(", ");
    return res.status(422).json({
      message: `Validation failed - ${errorDetails}`,
      errors: errors.array(),
    });
  }

  const {
    paperId,
    category,
    subjects,
    batch,
    difficulty,
    marksPerQuestion,
    negativeMarking,
    negativeFraction,
    passingPercentage,
    isActive,
    description,
  } = req.body;

  let existing;
  try {
    existing = await QuestionPaper.findOne({ paperId: paperId?.trim() });
  } catch (err) {
    if (req.file) deleteFileIfExists(normalisePath(req.file.path));
    return next(
      new HttpError("Something went wrong while checking for duplicates", 500),
    );
  }
  if (existing) {
    if (req.file) deleteFileIfExists(normalisePath(req.file.path));
    return next(
      new HttpError(
        "A question paper with this Paper ID already exists. Please choose a different ID.",
        422,
      ),
    );
  }

  const parsedSubjects = Array.isArray(subjects)
    ? subjects
    : typeof subjects === "string" && subjects.length > 0
      ? subjects
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
      : [];

  const paper = new QuestionPaper({
    paperId: paperId.trim(),
    category,
    subjects: parsedSubjects,
    batch: batch || "",
    difficulty: difficulty || "Medium",
    totalQuestions: 0,
    totalMarks: 0,
    marksPerQuestion: Number(marksPerQuestion) || 4,
    negativeMarking: negativeMarking === true || negativeMarking === "true",
    negativeFraction: Number(negativeFraction) || 0.25,
    passingPercentage:
      passingPercentage != null ? Number(passingPercentage) : 35,
    isActive: isActive !== false && isActive !== "false",
    description: description || "",
    answerKeyFile: req.file ? normalisePath(req.file.path) : "",
  });

  try {
    await paper.save();
  } catch (err) {
    if (req.file) deleteFileIfExists(normalisePath(req.file.path));
    const dupMsg = parseDuplicateKeyError(err, { paperId: "Paper ID" });
    if (dupMsg) return next(new HttpError(dupMsg, 422));
    return next(
      new HttpError(
        "Something went wrong while saving the question paper",
        500,
      ),
    );
  }

  res.status(201).json({ questionPaper: paper });
};

const getAllQuestionPapers = async (req, res, next) => {
  let papers;
  try {
    papers = await QuestionPaper.find({}).sort({ createdAt: -1 });
  } catch (err) {
    return next(
      new HttpError("Something went wrong while fetching question papers", 500),
    );
  }
  res.status(200).json({ questionPapers: papers });
};

const getQuestionPaperById = async (req, res, next) => {
  const { id } = req.params;
  let paper;
  try {
    paper = await QuestionPaper.findById(id);
  } catch (err) {
    return next(
      new HttpError(
        "Something went wrong while fetching the question paper",
        500,
      ),
    );
  }
  if (!paper) return next(new HttpError("Question paper not found", 404));
  res.status(200).json({ questionPaper: paper });
};

const getQuestionPaperByPaperId = async (req, res, next) => {
  const { paperId } = req.params;
  let paper;
  try {
    paper = await QuestionPaper.findOne({ paperId });
  } catch (err) {
    return next(
      new HttpError(
        "Something went wrong while fetching the question paper",
        500,
      ),
    );
  }
  if (!paper) return next(new HttpError("Question paper not found", 404));
  res.status(200).json({ questionPaper: paper });
};

const getQuestionPaperSummary = async (req, res, next) => {
  const { paperId } = req.params;
  let paper;
  try {
    paper = await QuestionPaper.findOne({ paperId });
  } catch (err) {
    return next(
      new HttpError(
        "Something went wrong while fetching the question paper",
        500,
      ),
    );
  }
  if (!paper) return next(new HttpError("Question paper not found", 404));

  let questions;
  try {
    questions = await Question.find({ paperId });
  } catch (err) {
    return next(
      new HttpError("Something went wrong while fetching questions", 500),
    );
  }

  const difficultyBreakdown = { Easy: 0, Medium: 0, Hard: 0 };
  const typeBreakdown = { MCQ: 0, MSQ: 0, NAT: 0 };
  questions.forEach((q) => {
    if (q.difficulty && difficultyBreakdown[q.difficulty] !== undefined)
      difficultyBreakdown[q.difficulty]++;
    if (q.type && typeBreakdown[q.type] !== undefined) typeBreakdown[q.type]++;
  });

  const liveTotal = questions.length;
  const liveMarks = questions.reduce((sum, q) => {
    const marks =
      q.marksPositive != null ? q.marksPositive : paper.marksPerQuestion || 4;
    return sum + marks;
  }, 0);

  res.status(200).json({
    summary: {
      paperId: paper.paperId,
      category: paper.category,
      subjects: paper.subjects,
      totalQuestions: liveTotal,
      totalMarks: liveMarks,
      marksPerQuestion: paper.marksPerQuestion,
      negativeMarking: paper.negativeMarking,
      negativeFraction: paper.negativeFraction,
      difficulty: paper.difficulty,
      isActive: paper.isActive,
      answerKeyFile: paper.answerKeyFile,
      difficultyBreakdown,
      typeBreakdown,
      questionsLoaded: liveTotal,
    },
  });
};

const updateQuestionPaperById = async (req, res, next) => {
  const { id } = req.params;
  let paper;
  try {
    paper = await QuestionPaper.findById(id);
  } catch (err) {
    if (req.file) deleteFileIfExists(normalisePath(req.file.path));
    return next(
      new HttpError(
        "Something went wrong while fetching the question paper",
        500,
      ),
    );
  }
  if (!paper) {
    if (req.file) deleteFileIfExists(normalisePath(req.file.path));
    return next(new HttpError("Question paper not found", 404));
  }

  const {
    category,
    subjects,
    batch,
    difficulty,
    marksPerQuestion,
    negativeMarking,
    negativeFraction,
    passingPercentage,
    isActive,
    description,
    clearAnswerKey,
  } = req.body;

  if (category !== undefined) paper.category = category;
  if (subjects !== undefined) {
    paper.subjects = Array.isArray(subjects)
      ? subjects
      : subjects
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
  }
  if (batch !== undefined) paper.batch = batch;
  if (difficulty !== undefined) paper.difficulty = difficulty;
  if (marksPerQuestion !== undefined)
    paper.marksPerQuestion = Number(marksPerQuestion);
  if (negativeMarking !== undefined)
    paper.negativeMarking =
      negativeMarking === true || negativeMarking === "true";
  if (negativeFraction !== undefined)
    paper.negativeFraction = Number(negativeFraction);
  if (passingPercentage !== undefined)
    paper.passingPercentage = Number(passingPercentage);
  if (isActive !== undefined)
    paper.isActive = isActive === true || isActive === "true";
  if (description !== undefined) paper.description = description;

  if (req.file) {
    if (paper.answerKeyFile) deleteFileIfExists(paper.answerKeyFile);
    paper.answerKeyFile = normalisePath(req.file.path);
  } else if (clearAnswerKey === "true" || clearAnswerKey === true) {
    if (paper.answerKeyFile) deleteFileIfExists(paper.answerKeyFile);
    paper.answerKeyFile = "";
  }

  try {
    await paper.save();
  } catch (err) {
    if (req.file) deleteFileIfExists(normalisePath(req.file.path));
    const dupMsg = parseDuplicateKeyError(err, { paperId: "Paper ID" });
    if (dupMsg) return next(new HttpError(dupMsg, 422));
    return next(
      new HttpError(
        "Something went wrong while updating the question paper",
        500,
      ),
    );
  }

  try {
    const questions = await Question.find({ paperId: paper.paperId });
    paper.totalQuestions = questions.length;
    paper.totalMarks = questions.reduce((sum, q) => {
      const marks =
        q.marksPositive != null ? q.marksPositive : paper.marksPerQuestion || 4;
      return sum + marks;
    }, 0);
    await paper.save();
  } catch (_) { }

  res.status(200).json({ questionPaper: paper });
};

const syncPaperTotals = async (req, res, next) => {
  const { id } = req.params;
  let paper;
  try {
    paper = await QuestionPaper.findById(id);
  } catch (err) {
    return next(
      new HttpError(
        "Something went wrong while fetching the question paper",
        500,
      ),
    );
  }
  if (!paper) return next(new HttpError("Question paper not found", 404));

  let questions;
  try {
    questions = await Question.find({ paperId: paper.paperId });
  } catch (err) {
    return next(
      new HttpError("Something went wrong while fetching questions", 500),
    );
  }

  paper.totalQuestions = questions.length;
  paper.totalMarks = questions.reduce((sum, q) => {
    const marks =
      q.marksPositive != null ? q.marksPositive : paper.marksPerQuestion || 4;
    return sum + marks;
  }, 0);

  try {
    await paper.save();
  } catch (err) {
    return next(
      new HttpError("Something went wrong while syncing totals", 500),
    );
  }

  res.status(200).json({ questionPaper: paper });
};

const deleteQuestionPaperById = async (req, res, next) => {
  const { id } = req.params;
  let paper;
  try {
    paper = await QuestionPaper.findById(id);
  } catch (err) {
    return next(
      new HttpError(
        "Something went wrong while fetching the question paper",
        500,
      ),
    );
  }
  if (!paper) return next(new HttpError("Question paper not found", 404));

  if (paper.answerKeyFile) deleteFileIfExists(paper.answerKeyFile);

  try {
    await paper.deleteOne();
  } catch (err) {
    return next(
      new HttpError(
        "Something went wrong while deleting the question paper",
        500,
      ),
    );
  }

  res.status(200).json({ message: "Question paper deleted successfully" });
};

exports.createQuestionPaper = createQuestionPaper;
exports.getAllQuestionPapers = getAllQuestionPapers;
exports.getQuestionPaperById = getQuestionPaperById;
exports.getQuestionPaperByPaperId = getQuestionPaperByPaperId;
exports.getQuestionPaperSummary = getQuestionPaperSummary;
exports.updateQuestionPaperById = updateQuestionPaperById;
exports.syncPaperTotals = syncPaperTotals;
exports.deleteQuestionPaperById = deleteQuestionPaperById;
