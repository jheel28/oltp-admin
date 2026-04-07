const HttpError = require("../../Middleware/http-error");
const { validationResult } = require("express-validator");
const Batch = require("../../Models/Batch");
const Student = require("../../Models/Student");

const createBatch = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorDetails = errors.array().map(err => `${err.path || err.param}: ${err.msg}`).join(", ");
    return res.status(422).json({
      message: `Validation failed - ${errorDetails}`,
      errors: errors.array(),
    });
  }
  const batchName = (req.body.batchName || "").trim();
  if (!batchName) {
    return next(new HttpError("Batch name cannot be empty", 422));
  }
  let existingBatch;
  try {
    existingBatch = await Batch.findOne({ batchName });
  } catch (err) {
    return next(
      new HttpError(
        "Something went wrong while fetching the data, please try again",
        500,
      ),
    );
  }
  if (existingBatch) {
    return next(
      new HttpError(
        "This batch already exists, please try again with another batch name",
        422,
      ),
    );
  }
  const createdBatch = new Batch({ batchName });
  try {
    await createdBatch.save();
  } catch (err) {
    return next(
      new HttpError(
        "Something went wrong while creating batch, please try again",
        500,
      ),
    );
  }
  res
    .status(201)
    .json({ message: "Batch successfully created", batch: createdBatch });
};

const getAllBatches = async (req, res, next) => {
  let batches;
  try {
    batches = await Batch.find({});
  } catch (err) {
    return next(
      new HttpError(
        "Something went wrong while fetching the batches, please try again",
        500,
      ),
    );
  }
  res.status(200).json({ batches });
};

const updateBatchById = async (req, res, next) => {
  const id = req.params.id;
  const newBatchName = (req.body.batchName || "").trim();

  if (!newBatchName) {
    return next(new HttpError("Batch name cannot be empty", 422));
  }

  let batch;
  try {
    batch = await Batch.findOne({ _id: id });
  } catch (err) {
    return next(
      new HttpError(
        "Something went wrong while fetching the data, please try again",
        500,
      ),
    );
  }
  if (!batch) {
    return next(new HttpError("Batch not found, please try again", 404));
  }

  let existing;
  try {
    existing = await Batch.findOne({ batchName: newBatchName });
  } catch (err) {
    return next(
      new HttpError(
        "Something went wrong while checking batch name, please try again",
        500,
      ),
    );
  }
  if (existing && existing._id.toString() !== id) {
    return next(new HttpError("A batch with this name already exists", 422));
  }

  const oldBatchName = batch.batchName;
  batch.batchName = newBatchName;

  try {
    await batch.save();
  } catch (err) {
    return next(
      new HttpError(
        "Something went wrong while updating the batch, please try again",
        500,
      ),
    );
  }

  try {
    await Student.updateMany(
      { batch: oldBatchName },
      { $set: { batch: newBatchName } },
    );
  } catch (err) {
    return next(
      new HttpError(
        "Batch renamed but failed to update students, please check manually",
        500,
      ),
    );
  }

  res.status(200).json({ batch });
};

const deleteBatchById = async (req, res, next) => {
  const id = req.params.id;

  let batch;
  try {
    batch = await Batch.findOne({ _id: id });
  } catch (err) {
    return next(
      new HttpError(
        "Something went wrong while fetching the data, please try again",
        500,
      ),
    );
  }
  if (!batch) {
    return next(new HttpError("Batch not found, please try again", 404));
  }

  try {
    await Student.updateMany(
      { batch: batch.batchName },
      { $set: { batch: "" } },
    );
  } catch (err) {
    return next(
      new HttpError(
        "Something went wrong while unassigning students, please try again",
        500,
      ),
    );
  }

  try {
    await batch.deleteOne();
  } catch (err) {
    return next(
      new HttpError(
        "Something went wrong while deleting the batch, please try again",
        500,
      ),
    );
  }

  res.status(200).json({
    message:
      "Batch successfully deleted. Students from this batch have been marked as unassigned.",
  });
};

exports.createBatch = createBatch;
exports.getAllBatches = getAllBatches;
exports.updateBatchById = updateBatchById;
exports.deleteBatchById = deleteBatchById;