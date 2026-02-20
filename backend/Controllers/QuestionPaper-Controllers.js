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

  const {
    questionPaperId,
    score,
    noOfQuestions,
    category,
    difficulty,
    subjects,
  } = req.body;

  let existingQuestionPaper;
  try {
    existingQuestionPaper = await QuestionPaper.findOne({
      questionPaperId: questionPaperId,
    });
  } catch (err) {
    return next(
      new HttpError(
        "Something went wrong while fetching data, please try again",
        500,
      ),
    );
  }
  if (existingQuestionPaper) {
    return next(new HttpError("The question paper already exists", 422));
  }

  const parsedSubjects = Array.isArray(subjects)
    ? subjects
    : typeof subjects === "string" && subjects.length > 0
      ? subjects
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

  const createdQuestionPaper = new QuestionPaper({
    questionPaperId,
    score,
    noOfQuestions,
    category,
    difficulty,
    subjects: parsedSubjects,
  });
  if (req.file) {
    createdQuestionPaper.keySheet = req.file.path;
  }

  try {
    await createdQuestionPaper.save();
  } catch (err) {
    return next(
      new HttpError(
        "Something went wrong while saving the question paper, please try again",
        500,
      ),
    );
  }

  res.status(201).json({ questionPaper: createdQuestionPaper });
};

const getAllQuestionPapers = async (req, res, next) => {
  let questionPapers;
  try {
    questionPapers = await QuestionPaper.find({});
  } catch (err) {
    return next(
      new HttpError(
        "Something went wrong while fetching the data, please try again",
        500,
      ),
    );
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
    return next(
      new HttpError(
        "Something went wrong while fetching the data, please try again",
        500,
      ),
    );
  }
  if (!questionPaper) {
    return next(new HttpError("Question paper not found", 404));
  }
  res.status(200).json({ questionPaper: questionPaper });
};

const getQuestionPaperById = async (req, res, next) => {
  const id = req.params.id;
  let questionPaper;
  try {
    questionPaper = await QuestionPaper.findOne({ _id: id });
  } catch (err) {
    return next(
      new HttpError(
        "Something went wrong while fetching the data, please try again",
        500,
      ),
    );
  }
  if (!questionPaper) {
    return next(new HttpError("Question paper not found", 404));
  }
  res.status(200).json({ questionPaper: questionPaper });
};

const updateQuestionPaperById = async (req, res, next) => {
  const id = req.params.id;
  const { score, noOfQuestions, category, difficulty, subjects } = req.body;

  let questionPaper;
  try {
    questionPaper = await QuestionPaper.findOne({ _id: id });
  } catch (err) {
    return next(
      new HttpError(
        "Something went wrong while fetching the data, please try again",
        500,
      ),
    );
  }
  if (!questionPaper) {
    return next(
      new HttpError("Question paper not found, please try again", 404),
    );
  }

  if (score !== undefined) questionPaper.score = score;
  if (noOfQuestions !== undefined) questionPaper.noOfQuestions = noOfQuestions;
  if (category !== undefined) questionPaper.category = category;
  if (difficulty !== undefined) questionPaper.difficulty = difficulty;
  if (subjects !== undefined) {
    questionPaper.subjects = Array.isArray(subjects)
      ? subjects
      : subjects
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
  }

  try {
    await questionPaper.save();
  } catch (err) {
    return next(
      new HttpError(
        "Something went wrong while saving the question paper, please try again",
        500,
      ),
    );
  }

  res.status(200).json({ updatedQuestionPaper: questionPaper });
};

const deleteQuestionPaperById = async (req, res, next) => {
  const id = req.params.id;
  let questionPaper;
  try {
    questionPaper = await QuestionPaper.findOne({ _id: id });
  } catch (err) {
    return next(
      new HttpError(
        "Something went wrong while fetching the data, please try again",
        500,
      ),
    );
  }
  if (!questionPaper) {
    return next(
      new HttpError("Question paper not found, please try again", 404),
    );
  }
  try {
    await questionPaper.deleteOne();
  } catch (err) {
    return next(
      new HttpError(
        "Something went wrong while deleting the question paper, please try again",
        500,
      ),
    );
  }
  res.status(200).json({ message: "The question paper deleted successfully" });
};

exports.createQuestionPaper = createQuestionPaper;
exports.getAllQuestionPapers = getAllQuestionPapers;
exports.getQuestionPaperById = getQuestionPaperById;
exports.getQuestionPaperByQuestionPaperId = getQuestionPaperByQuestionPaperId;
exports.updateQuestionPaperById = updateQuestionPaperById;
exports.deleteQuestionPaperById = deleteQuestionPaperById;
