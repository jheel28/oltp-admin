const HttpError = require("../Middleware/http-error");
const { validationResult } = require("express-validator");
const Batch = require("../Models/Batch");

const createBatch = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation errors in createBatch:", errors.array());
    return res.status(422).json({
      message: "Invalid inputs passed, please try again",
      errors: errors.array(),
    });
  }
  let { batchName, sectionName, studentId } = req.body;

  // Robust array handling: convert strings to arrays if they come as single strings
  if (typeof sectionName === 'string') {
    sectionName = sectionName.split(',').map(s => s.trim()).filter(s => s !== "");
  }
  if (typeof studentId === 'string') {
    studentId = studentId.split(',').map(s => s.trim()).filter(s => s !== "");
  }

  let existingBatch;
  try {
    existingBatch = await Batch.findOne({ batchName: batchName });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  if (existingBatch) {
    const error = new HttpError(
      "This batch already exists, please try again with other bacth",
      500
    );
    return next(error);
  }
  const createdBatch = new Batch({
    batchName,
    sectionName,
    studentId,
  });
  try {
    await createdBatch.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while creating batch, please try again",
      500
    );
    return next(error);
  }
  res.status(201).json({ message: "Batch successfully created" });
};
const getAllBatches = async (req, res, next) => {
  let batches;
  try {
    batches = await Batch.find({});
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the batches, please try again",
      500
    );
    return next(error);
  }

  res.status(200).json({ batches: batches });
};
const updateBatchById = async (req, res, next) => {
  const id = req.params.id;
  const { batchName, sectionName, studentId } = req.body;
  let batch;
  try {
    batch = await Batch.findOne({ _id: id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  if (!batch) {
    const error = new HttpError("Batch not found, please try again", 500);
    return next(error);
  }
  (batch.batchName = batchName ? batchName : batch.batchName),
    (batch.sectionName = sectionName ? sectionName : batch.sectionName),
    (batch.studentId = studentId ? studentId : batch.studentId);
  try {
    await batch.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while updating the batch, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ batch: batch });
};
const deleteBatchById = async (req, res, next) => {
  const id = req.params.id;
  let batch;
  try {
    batch = await Batch.findOne({ _id: id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  if (!batch) {
    const error = new HttpError("Batch not found, please try again", 500);
    return next(error);
  }
  try {
    await batch.deleteOne();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while deleting the batch, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ message: "Batch successfully deleted" });
};
exports.createBatch = createBatch;
exports.getAllBatches = getAllBatches;
exports.updateBatchById = updateBatchById;
exports.deleteBatchById = deleteBatchById;
