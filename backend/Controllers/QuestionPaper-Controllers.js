const HttpError = require("../Middleware/http-error");
const { validationResult } = require("express-validator");
const QuestionPaper = require("../Models/QuestionPaper");

const createQuestionPaper = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Invalid inputs passed, please try again",
      errors: errors.array(),
    });
  }

  const { questionPaperId, score, noOfQuestions, category, keySheet } =
    req.body;

  let existingQuestionPaper;
  try {
    existingQuestionPaper = await QuestionPaper.findOne({
      questionPaperId: questionPaperId,
    });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching data, please try again",
      500
    );
    return next(error);
  }
  if (existingQuestionPaper) {
    const error = new HttpError("The question paper already exists", 500);
    return next(error);
  }

  const createdQuestionPaper = new QuestionPaper({
    questionPaperId,

    score,
    noOfQuestions,
    category,
  });
  if (req.file) {
    createdQuestionPaper.keySheet = req.file.path;
  }
  try {
    createdQuestionPaper.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while saving the question paper, please try again",
      500
    );
    return next(error);
  }
  res.status(201).json({ questionPaper: createdQuestionPaper });
};
const getAllQuestionPapers = async (req, res, next) => {
  let questionPapers;
  try {
    questionPapers = await QuestionPaper.find({});
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ questionPapers: questionPapers });
};
const getQuestionPaperByQuestionPaperId = async (req, res, next) => {
  const questionPaperId = req.params.questionPaperId;
  let questionPaper;
  try {
    questionPaper = await QuestionPaper.findOne({
      questionPaperId: questionPaperId,
    });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ questionPaper: questionPaper });
};
const getQuestionPaperById = async (req, res, next) => {
  const id = req.params.id;
  let questionPaper;
  try {
    questionPaper = await QuestionPaper.findOne({
      _id: id,
    });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ QuestionPaper: questionPaper });
};
const updateQuestionPaperById = async (req, res, next) => {
  const id = req.params.id;
  const { questions, answers, score, noOfQuestions, category } = req.body;
  let questionPaper;
  try {
    questionPaper = await QuestionPaper.findOne({ _id: id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  if (!questionPaper) {
    const error = new HttpError(
      "Question paper not found, please try again",
      500
    );
    return next(error);
  }

  questionPaper.score = score ? score : questionPaper.score;
  questionPaper.noOfQuestions = noOfQuestions
    ? noOfQuestions
    : questionPaper.noOfQuestions;
  questionPaper.category = category ? category : questionPaper.category;
  try {
    await questionPaper.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while saving the question paper please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ updatedQuestionPaper: questionPaper });
};
const deleteQuestionPaperById = async (req, res, next) => {
  const id = req.params.id;
  let questionPaper;
  try {
    questionPaper = await QuestionPaper.findOne({ _id: id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  if (!questionPaper) {
    const error = new HttpError(
      "Question paper not found, please try again",
      500
    );
    return next(error);
  }
  try {
    await questionPaper.deleteOne();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while deleting the question paper, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "The question paper deleted successfully" });
};
exports.createQuestionPaper = createQuestionPaper;
exports.getAllQuestionPapers = getAllQuestionPapers;
exports.getQuestionPaperById = getQuestionPaperById;
exports.getQuestionPaperByQuestionPaperId = getQuestionPaperByQuestionPaperId;
exports.updateQuestionPaperById = updateQuestionPaperById;
exports.deleteQuestionPaperById = deleteQuestionPaperById;
