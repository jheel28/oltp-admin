const HttpError = require("../Middleware/http-error");
const { validationResult } = require("express-validator");
const Query = require("../Models/Query");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const createQuery = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Invalid inputs passed, please try again",
      errors: errors.array(),
    });
  }
  const { firstName, lastName, email, question } = req.body;

  const createdQuery = new Query({
    firstName,
    lastName,
    email,
    question,
    status: "pending",
  });
  if (req.path) {
    createdQuery.image = req.file.path;
  }
  try {
    await createdQuery.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while creating query, please try again",
      500
    );
    return next(error);
  }

  res.status(201).json({
    createdQuery: createdQuery,
  });
};
const getAllQueries = async (req, res, next) => {
  let queries;
  try {
    queries = await Query.find({});
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  res.json({ queries: queries });
};
const getQueryById = async (req, res, next) => {
  let query;
  const id = req.params.id;
  try {
    query = await Query.findOne({ _id: id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  res.json({ query: query });
};

const updateQueryById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new HttpError("Invalid inputs passed, please try again", 422);
    return next(error);
  }
  const id = req.params.id;

  const { answer, status } = req.body;
  let query;
  try {
    query = await Query.findOne({ _id: id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  if (!query) {
    const error = new HttpError("No query found, please try again", 500);
    return next(error);
  }

  if (!query.answer) {
    query.answer = [];
  }

  // Add the new answer to the existing answers
  query.answer.push(answer);
  query.status = "resolved";

  try {
    await query.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while the updation of query, please try again",
      500
    );
    return next(error);
  }

  res.status(201).json({
    query: query,
  });
};

const deleteQuery = async (req, res, next) => {
  const id = req.params.id;
  let query;
  try {
    query = await Query.findOne({ _id: id });
    if (!query) {
      const error = new HttpError("no query found, please try again", 500);
      return next(error);
    }
    const imagePath = query.image;

    await query.deleteOne();
    res.status(200).json({ message: "Query successfully deleted" });
    fs.unlink(imagePath, (err) => {
      console.log(err);
    });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while deleting the query, please try again",
      500
    );
    return next(error);
  }
};
exports.createQuery = createQuery;
exports.getQueryById = getQueryById;
exports.getAllQueries = getAllQueries;
exports.updateQueryById = updateQueryById;
exports.deleteQuery = deleteQuery;
