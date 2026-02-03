const HttpError = require("../Middleware/http-error");
const { validationResult } = require("express-validator");
const Test = require("../Models/Test");

const createTest = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Invalid inputs passed, please try again",
      errors: errors.array,
    });
  }
  const {
    batchName,
    testId,
    score,
    course,
    examName,
    date,
    startTime,
    endTime,
    questionPaperId,
  } = req.body;
  let existingTest;
  try {
    existingTest = await Test.findOne({ testId: testId });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  if (existingTest) {
    const error = new HttpError(
      "The test already exists, please try again",
      500
    );
    return next(error);
  }
  const createdTest = new Test({
    batchName,
    testId,
    score,
    course,
    examName,
    questionPaperId,
    date,
    startTime,
    endTime,
  });
  try {
    await createdTest.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while creating the test, please try again",
      500
    );
    return next(error);
  }
  res.status(201).json({ test: createdTest });
};
const getAllTests = async (req, res, next) => {
  let tests;
  try {
    tests = await Test.find({});
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ tests: tests });
};
const getTestByTestId = async (req, res, next) => {
  const testId = req.params.testId;
  let test;
  try {
    test = await Test.findOne({ testId: testId });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ test: test });
};
const getTestById = async (req, res, next) => {
  const id = req.params.id;
  let test;
  try {
    test = await Test.findOne({ _id: id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ test: test });
};
const updateTestById = async (req, res, next) => {
  const id = req.params.id;
  let test;
  const {
    batchName,
    score,
    course,
    examName,
    questionPaperId,
    date,
    startTime,
    endTime,
  } = req.body;
  try {
    test = await Test.findOne({ _id: id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  if (!test) {
    const error = new HttpError("The test not found, please try again", 500);
    return next(error);
  }
  (test.batchName = batchName ? batchName : test.batchName),
    (test.score = score ? score : test.score),
    (test.course = course ? course : test.course),
    (test.examName = examName ? examName : test.examName);
  test.date = date ? date : test.date;
  test.startTime = startTime ? startTime : test.startTime;
  test.endTime = endTime ? endTime : test.endTime;
  test.questionPaperId = questionPaperId
    ? questionPaperId
    : test.questionPaperId;
  try {
    await test.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while updating the data, please try again",
      500
    );
    return next(error);
  }
  res.status(201).json({ test: test });
};
const deleteTestById = async (req, res, next) => {
  const id = req.params.id;
  let test;
  try {
    test = await Test.findOne({ _id: id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  if (!test) {
    const error = new HttpError("Test not found, please try again", 500);
    return next(error);
  }
  try {
    test.deleteOne();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while deleting the test, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "Test successfully deleted" });
};
exports.createTest = createTest;
exports.getAllTests = getAllTests;
exports.getTestById = getTestById;
exports.getTestByTestId = getTestByTestId;
exports.updateTestById = updateTestById;
exports.deleteTestById = deleteTestById;
