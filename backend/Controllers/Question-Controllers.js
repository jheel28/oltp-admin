const HttpError = require("../Middleware/http-error");
const { validationResult } = require("express-validator");
const Question = require("../Models/Question");
const QuestionPaper = require("../Models/QuestionPaper");

const _syncPaperTotals = async (paperId) => {
  const paper = await QuestionPaper.findOne({ paperId });
  if (!paper) return;
  const questions = await Question.find({ paperId });
  paper.totalQuestions = questions.length;
  paper.totalMarks = questions.reduce((sum, q) => {
    const marks =
      q.marksPositive != null ? q.marksPositive : paper.marksPerQuestion;
    return sum + marks;
  }, 0);
  await paper.save();
};

const createQuestion = async (req, res, next) => {
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
    text,
    type,
    options,
    correctOption,
    correctOptions,
    natMin,
    natMax,
    marksPositive,
    marksNegative,
    topic,
    difficulty,
  } = req.body;

  let parsedOptions = [];
  if (options) {
    try {
      parsedOptions =
        typeof options === "string" ? JSON.parse(options) : options;
    } catch {
      return res.status(422).json({ message: "Invalid options format" });
    }
  }

  let parsedCorrectOptions = [];
  if (correctOptions) {
    try {
      parsedCorrectOptions =
        typeof correctOptions === "string"
          ? JSON.parse(correctOptions)
          : correctOptions;
    } catch {
      return res.status(422).json({ message: "Invalid correctOptions format" });
    }
  }

  const question = new Question({
    paperId,
    text,
    type: type || "MCQ",
    options: parsedOptions,
    correctOption: type === "MSQ" ? undefined : correctOption,
    correctOptions: type === "MSQ" ? parsedCorrectOptions : undefined,
    natMin: type === "NAT" ? Number(natMin) : undefined,
    natMax: type === "NAT" ? Number(natMax) : undefined,
    marksPositive:
      marksPositive != null && marksPositive !== ""
        ? Number(marksPositive)
        : null,
    marksNegative:
      marksNegative != null && marksNegative !== ""
        ? Number(marksNegative)
        : null,
    topic: topic || "",
    difficulty: difficulty || "Medium",
  });

  if (req.files?.questionImage?.[0]) {
    question.questionImage = req.files.questionImage[0].path;
  }

  try {
    await question.save();
  } catch (err) {
    return next(
      new HttpError("Something went wrong while saving the question", 500),
    );
  }

  try {
    await _syncPaperTotals(paperId);
  } catch (_) {}

  res.status(201).json({ question });
};

const getAllQuestions = async (req, res, next) => {
  let questions;
  try {
    questions = await Question.find({});
  } catch (err) {
    return next(
      new HttpError("Something went wrong while fetching questions", 500),
    );
  }
  res.status(200).json({ questions });
};

const getQuestionsByPaperId = async (req, res, next) => {
  const { paperId } = req.params;
  let questions;
  try {
    questions = await Question.find({ paperId }).sort({ createdAt: 1 });
  } catch (err) {
    return next(
      new HttpError("Something went wrong while fetching questions", 500),
    );
  }
  res.status(200).json({ questions });
};

const getQuestionById = async (req, res, next) => {
  const { id } = req.params;
  let question;
  try {
    question = await Question.findById(id);
  } catch (err) {
    return next(
      new HttpError("Something went wrong while fetching the question", 500),
    );
  }
  if (!question) return next(new HttpError("Question not found", 404));
  res.status(200).json({ question });
};

const updateQuestionById = async (req, res, next) => {
  const { id } = req.params;
  let question;
  try {
    question = await Question.findById(id);
  } catch (err) {
    return next(
      new HttpError("Something went wrong while fetching the question", 500),
    );
  }
  if (!question) return next(new HttpError("Question not found", 404));

  const {
    text,
    type,
    options,
    correctOption,
    correctOptions,
    natMin,
    natMax,
    marksPositive,
    marksNegative,
    topic,
    difficulty,
  } = req.body;

  if (text !== undefined) question.text = text;
  if (type !== undefined) question.type = type;
  if (options !== undefined) {
    question.options =
      typeof options === "string" ? JSON.parse(options) : options;
  }
  if (correctOption !== undefined) question.correctOption = correctOption;
  if (correctOptions !== undefined) {
    question.correctOptions =
      typeof correctOptions === "string"
        ? JSON.parse(correctOptions)
        : correctOptions;
  }
  if (natMin !== undefined) question.natMin = Number(natMin);
  if (natMax !== undefined) question.natMax = Number(natMax);
  question.marksPositive =
    marksPositive != null && marksPositive !== ""
      ? Number(marksPositive)
      : null;
  question.marksNegative =
    marksNegative != null && marksNegative !== ""
      ? Number(marksNegative)
      : null;
  if (topic !== undefined) question.topic = topic;
  if (difficulty !== undefined) question.difficulty = difficulty;

  if (req.files?.questionImage?.[0]) {
    question.questionImage = req.files.questionImage[0].path;
  }

  try {
    await question.save();
  } catch (err) {
    return next(
      new HttpError("Something went wrong while updating the question", 500),
    );
  }

  try {
    await _syncPaperTotals(question.paperId);
  } catch (_) {}

  res.status(200).json({ question });
};

const deleteQuestionById = async (req, res, next) => {
  const { id } = req.params;
  let question;
  try {
    question = await Question.findById(id);
  } catch (err) {
    return next(
      new HttpError("Something went wrong while fetching the question", 500),
    );
  }
  if (!question) return next(new HttpError("Question not found", 404));

  const { paperId } = question;

  try {
    await question.deleteOne();
  } catch (err) {
    return next(
      new HttpError("Something went wrong while deleting the question", 500),
    );
  }

  try {
    await _syncPaperTotals(paperId);
  } catch (_) {}

  res.status(200).json({ message: "Question deleted successfully" });
};

exports.createQuestion = createQuestion;
exports.getAllQuestions = getAllQuestions;
exports.getQuestionsByPaperId = getQuestionsByPaperId;
exports.getQuestionById = getQuestionById;
exports.updateQuestionById = updateQuestionById;
exports.deleteQuestionById = deleteQuestionById;
