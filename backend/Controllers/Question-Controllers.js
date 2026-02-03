const HttpError = require("../Middleware/http-error");
const { validationResult } = require("express-validator");
const Question = require("../Models/Question");

const createQuestion = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Invalid inputs passed, please try again",
      errors: errors.array(),
    });
  }
  const { questionPaperId, text, options, correctOption, marks } = req.body;

  const processedOptions = [];

  const optionRegex = /"text":"([^"]*)"/g;
  let match;
  while ((match = optionRegex.exec(options)) !== null) {
    const textValue = match[1];
    processedOptions.push({ text: textValue });
  }

  const createdQuestion = new Question({
    questionPaperId,
    text,
    options: processedOptions,
    correctOption,
    marks,
  });
  if (
    req.files &&
    req.files["questionImage"] &&
    req.files["questionImage"].length > 0
  ) {
    createdQuestion.questionImage = req.files["questionImage"][0].path;
  }
  try {
    await createdQuestion.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while saving the question, please try again",
      500
    );
    return next(error);
  }
  res.status(201).json({ question: createdQuestion });
};
const getAllQuestions = async (req, res, next) => {
  let questions;
  try {
    questions = await Question.find({});
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ questions: questions });
};
const getQuestionsByQuestionPaperId = async (req, res, next) => {
  const questionPaperId = req.params.questionPaperId;
  let questions;
  try {
    questions = await Question.find({
      questionPaperId: questionPaperId,
    });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }

  res.status(200).json({ questions: questions });
};
const getQuestionById = async (req, res, next) => {
  const id = req.params.id;
  let question;
  try {
    question = await Question.findOne({
      _id: id,
    });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ question: question });
};
const updateQuestionById = async (req, res, next) => {
  const id = req.params.id;
  const { text, options, correctOption, marks, questionPaperId } = req.body;
  let question;
  try {
    question = await Question.findOne({ _id: id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  if (!question) {
    const error = new HttpError("Question not found, please try again", 500);
    return next(error);
  }
  (question.text = text ? text : question.text),
    (question.options = options ? options : question.options);
  question.correctOption = correctOption
    ? correctOption
    : question.correctOption;
  question.marks = marks ? marks : question.marks;

  try {
    await question.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while saving the question, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ question: question });
};
const deleteQuestionById = async (req, res, next) => {
  const id = req.params.id;
  let question;
  try {
    question = await Question.findOne({ _id: id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  if (!question) {
    const error = new HttpError("Question not found, please try again", 500);
    return next(error);
  }
  try {
    await question.deleteOne();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while deleting the question, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "The question deleted successfully" });
};
exports.createQuestion = createQuestion;
exports.getAllQuestions = getAllQuestions;
exports.getQuestionById = getQuestionById;
exports.getQuestionsByQuestionPaperId = getQuestionsByQuestionPaperId;
exports.updateQuestionById = updateQuestionById;
exports.deleteQuestionById = deleteQuestionById;
