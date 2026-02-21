const HttpError = require("../Middleware/http-error");
const { validationResult } = require("express-validator");
const Test = require("../Models/Test");

const createTest = async (req, res, next) => {
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
    testName,
    paperId,
    batchName,
    course,
    date,
    startTime,
    endTime,
    duration,
    isPublished,
  } = req.body;

  let existing;
  try {
    existing = await Test.findOne({ testId });
  } catch (err) {
    return next(
      new HttpError("Something went wrong while checking for duplicates", 500),
    );
  }
  if (existing)
    return next(new HttpError("A test with this ID already exists", 422));

  const test = new Test({
    testId,
    testName,
    paperId,
    batchName,
    course: course || "",
    date,
    startTime,
    endTime,
    duration: Number(duration),
    isPublished: isPublished === true || isPublished === "true",
  });

  try {
    await test.save();
  } catch (err) {
    return next(
      new HttpError("Something went wrong while creating the test", 500),
    );
  }

  res.status(201).json({ test });
};

const getAllTests = async (req, res, next) => {
  let tests;
  try {
    tests = await Test.find({}).sort({ createdAt: -1 });
  } catch (err) {
    return next(
      new HttpError("Something went wrong while fetching tests", 500),
    );
  }
  res.status(200).json({ tests });
};

const getTestByTestId = async (req, res, next) => {
  const { testId } = req.params;
  let test;
  try {
    test = await Test.findOne({ testId });
  } catch (err) {
    return next(
      new HttpError("Something went wrong while fetching the test", 500),
    );
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
    return next(
      new HttpError("Something went wrong while fetching the test", 500),
    );
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
    return next(
      new HttpError("Something went wrong while fetching the test", 500),
    );
  }
  if (!test) return next(new HttpError("Test not found", 404));

  const {
    testName,
    paperId,
    batchName,
    course,
    date,
    startTime,
    endTime,
    duration,
    isPublished,
  } = req.body;

  if (testName !== undefined) test.testName = testName;
  if (paperId !== undefined) test.paperId = paperId;
  if (batchName !== undefined) test.batchName = batchName;
  if (course !== undefined) test.course = course;
  if (date !== undefined) test.date = date;
  if (startTime !== undefined) test.startTime = startTime;
  if (endTime !== undefined) test.endTime = endTime;
  if (duration !== undefined) test.duration = Number(duration);
  if (isPublished !== undefined)
    test.isPublished = isPublished === true || isPublished === "true";

  try {
    await test.save();
  } catch (err) {
    return next(
      new HttpError("Something went wrong while updating the test", 500),
    );
  }

  res.status(200).json({ test });
};

const deleteTestById = async (req, res, next) => {
  const { id } = req.params;
  let test;
  try {
    test = await Test.findById(id);
  } catch (err) {
    return next(
      new HttpError("Something went wrong while fetching the test", 500),
    );
  }
  if (!test) return next(new HttpError("Test not found", 404));

  try {
    await test.deleteOne();
  } catch (err) {
    return next(
      new HttpError("Something went wrong while deleting the test", 500),
    );
  }

  res.status(200).json({ message: "Test deleted successfully" });
};

exports.createTest = createTest;
exports.getAllTests = getAllTests;
exports.getTestByTestId = getTestByTestId;
exports.getTestById = getTestById;
exports.updateTestById = updateTestById;
exports.deleteTestById = deleteTestById;
