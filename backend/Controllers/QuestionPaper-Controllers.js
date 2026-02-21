const HttpError = require("../Middleware/http-error");
const { validationResult } = require("express-validator");
const QuestionPaper = require("../Models/QuestionPaper");
const Question = require("../Models/Question");

const createQuestionPaper = async (req, res, next) => {
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
    paperId,
    paperName,
    category,
    subjects,
    batch,
    difficulty,
    totalQuestions,
    totalMarks,
    marksPerQuestion,
    negativeMarking,
    negativeFraction,
    isActive,
    description,
  } = req.body;

  let existing;
  try {
    existing = await QuestionPaper.findOne({ paperId });
  } catch (err) {
    return next(
      new HttpError("Something went wrong while checking duplicates", 500),
    );
  }
  if (existing) {
    return next(
      new HttpError("A question paper with this ID already exists", 422),
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
    paperId,
    paperName,
    category,
    subjects: parsedSubjects,
    batch: batch || "",
    difficulty: difficulty || "Medium",
    totalQuestions: Number(totalQuestions) || 0,
    totalMarks: Number(totalMarks) || 0,
    marksPerQuestion: Number(marksPerQuestion) || 4,
    negativeMarking: negativeMarking === true || negativeMarking === "true",
    negativeFraction: Number(negativeFraction) || 0.25,
    isActive: isActive !== false && isActive !== "false",
    description: description || "",
  });

  try {
    await paper.save();
  } catch (err) {
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

  res.status(200).json({
    summary: {
      paperId: paper.paperId,
      paperName: paper.paperName,
      category: paper.category,
      subjects: paper.subjects,
      totalQuestions: paper.totalQuestions,
      totalMarks: paper.totalMarks,
      marksPerQuestion: paper.marksPerQuestion,
      negativeMarking: paper.negativeMarking,
      negativeFraction: paper.negativeFraction,
      difficulty: paper.difficulty,
      isActive: paper.isActive,
      difficultyBreakdown,
      typeBreakdown,
      questionsLoaded: questions.length,
    },
  });
};

const updateQuestionPaperById = async (req, res, next) => {
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

  const {
    paperName,
    category,
    subjects,
    batch,
    difficulty,
    totalQuestions,
    totalMarks,
    marksPerQuestion,
    negativeMarking,
    negativeFraction,
    isActive,
    description,
  } = req.body;

  if (paperName !== undefined) paper.paperName = paperName;
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
  if (totalQuestions !== undefined)
    paper.totalQuestions = Number(totalQuestions);
  if (totalMarks !== undefined) paper.totalMarks = Number(totalMarks);
  if (marksPerQuestion !== undefined)
    paper.marksPerQuestion = Number(marksPerQuestion);
  if (negativeMarking !== undefined)
    paper.negativeMarking =
      negativeMarking === true || negativeMarking === "true";
  if (negativeFraction !== undefined)
    paper.negativeFraction = Number(negativeFraction);
  if (isActive !== undefined)
    paper.isActive = isActive === true || isActive === "true";
  if (description !== undefined) paper.description = description;

  try {
    await paper.save();
  } catch (err) {
    return next(
      new HttpError(
        "Something went wrong while updating the question paper",
        500,
      ),
    );
  }

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

  const totalQuestions = questions.length;
  const totalMarks = questions.reduce((sum, q) => {
    const marks =
      q.marksPositive != null ? q.marksPositive : paper.marksPerQuestion;
    return sum + marks;
  }, 0);

  paper.totalQuestions = totalQuestions;
  paper.totalMarks = totalMarks;

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
