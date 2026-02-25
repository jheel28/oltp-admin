const HttpError = require("../../Middleware/http-error");
const { validationResult } = require("express-validator");
const Test = require("../../Models/Test");
const QuestionPaper = require("../../Models/QuestionPaper");

const bindPaperFields = async (paperId, next) => {
  let paper;
  try {
    paper = await QuestionPaper.findOne({ paperId });
  } catch (err) {
    return { error: new HttpError("Something went wrong while looking up the question paper", 500) };
  }
  if (!paper) {
    return { error: new HttpError("Question paper with this ID does not exist", 404) };
  }
  return {
    category: paper.category || "",
    subjects: paper.subjects || [],
    totalMarks: paper.totalMarks || 0,
    totalQuestions: paper.totalQuestions || 0,
  };
};

const createTest = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Invalid inputs passed, please try again",
      errors: errors.array(),
    });
  }

  const {
    testId, testName, paperId, batchName, date, startTime, endTime,
    duration, isPermanent, isPublished, allowCalculator, allowWatermark, description,
  } = req.body;

  const permanent = isPermanent === true || isPermanent === "true";

  let existing;
  try {
    existing = await Test.findOne({ testId });
  } catch (err) {
    return next(new HttpError("Something went wrong while checking for duplicates", 500));
  }
  if (existing) return next(new HttpError("A test with this ID already exists", 422));

  const bound = await bindPaperFields(paperId, next);
  if (bound.error) return next(bound.error);

  const test = new Test({
    testId,
    testName,
    paperId,
    batchName,
    category: bound.category,
    subjects: bound.subjects,
    totalMarks: bound.totalMarks,
    totalQuestions: bound.totalQuestions,
    isPermanent: permanent,
    date: permanent ? "" : date,
    startTime: permanent ? "" : startTime,
    endTime: permanent ? "" : endTime,
    duration: Number(duration),
    isPublished: isPublished === true || isPublished === "true",
    allowCalculator: allowCalculator === false || allowCalculator === "false" ? false : true,
    allowWatermark: allowWatermark === false || allowWatermark === "false" ? false : true,
    description: description || "",
  });

  try {
    await test.save();
  } catch (err) {
    return next(new HttpError("Something went wrong while creating the test", 500));
  }

  res.status(201).json({ test });
};

const getAllTests = async (req, res, next) => {
  let tests;
  try {
    tests = await Test.find({}).sort({ createdAt: -1 });
  } catch (err) {
    return next(new HttpError("Something went wrong while fetching tests", 500));
  }
  res.status(200).json({ tests });
};

const getTestByTestId = async (req, res, next) => {
  const { testId } = req.params;
  let test;
  try {
    test = await Test.findOne({ testId });
  } catch (err) {
    return next(new HttpError("Something went wrong while fetching the test", 500));
  }
  if (!test) return next(new HttpError("Test not found", 404));
  res.status(200).json({ test });
};

const getTestById = async (req, res, next) => {
  const { id } = req.params;
  let test;
  try {
    test = await Test.findById(id);
  } catch (err) {
    return next(new HttpError("Something went wrong while fetching the test", 500));
  }
  if (!test) return next(new HttpError("Test not found", 404));
  res.status(200).json({ test });
};

const updateTestById = async (req, res, next) => {
  const { id } = req.params;
  let test;
  try {
    test = await Test.findById(id);
  } catch (err) {
    return next(new HttpError("Something went wrong while fetching the test", 500));
  }
  if (!test) return next(new HttpError("Test not found", 404));

  const {
    testName, paperId, batchName, date, startTime, endTime,
    duration, isPermanent, isPublished, allowCalculator, allowWatermark, description,
  } = req.body;

  if (testName !== undefined) test.testName = testName;
  if (batchName !== undefined) test.batchName = batchName;
  if (isPermanent !== undefined)
    test.isPermanent = isPermanent === true || isPermanent === "true";
  if (test.isPermanent) {
    test.date = "";
    test.startTime = "";
    test.endTime = "";
  } else {
    if (date !== undefined) test.date = date;
    if (startTime !== undefined) test.startTime = startTime;
    if (endTime !== undefined) test.endTime = endTime;
  }
  if (duration !== undefined) test.duration = Number(duration);
  if (isPublished !== undefined)
    test.isPublished = isPublished === true || isPublished === "true";
  if (allowCalculator !== undefined)
    test.allowCalculator = allowCalculator === true || allowCalculator === "true";
  if (allowWatermark !== undefined)
    test.allowWatermark = allowWatermark === true || allowWatermark === "true";
  if (description !== undefined) test.description = description;

  const resolvedPaperId = paperId !== undefined ? paperId : test.paperId;
  const bound = await bindPaperFields(resolvedPaperId, next);
  if (bound.error) return next(bound.error);

  test.paperId = resolvedPaperId;
  test.category = bound.category;
  test.subjects = bound.subjects;
  test.totalMarks = bound.totalMarks;
  test.totalQuestions = bound.totalQuestions;

  try {
    await test.save();
  } catch (err) {
    return next(new HttpError("Something went wrong while updating the test", 500));
  }

  res.status(200).json({ test });
};

const deleteTestById = async (req, res, next) => {
  const { id } = req.params;
  let test;
  try {
    test = await Test.findById(id);
  } catch (err) {
    return next(new HttpError("Something went wrong while fetching the test", 500));
  }
  if (!test) return next(new HttpError("Test not found", 404));

  try {
    await test.deleteOne();
  } catch (err) {
    return next(new HttpError("Something went wrong while deleting the test", 500));
  }

  res.status(200).json({ message: "Test deleted successfully" });
};

exports.createTest = createTest;
exports.getAllTests = getAllTests;
exports.getTestByTestId = getTestByTestId;
exports.getTestById = getTestById;
exports.updateTestById = updateTestById;
exports.deleteTestById = deleteTestById;