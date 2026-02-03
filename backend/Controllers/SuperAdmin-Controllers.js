const HttpError = require("../Middleware/http-error");
const { validationResult } = require("express-validator");
const SuperAdmin = require("../Models/SuperAdmin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const createSuperAdmin = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Invalid inputs passed, please try again",
      errors: errors.array(),
    });
  }
  const { firstName, lastName, email, password, mobile } = req.body;
  let existingSuperAdmin;
  try {
    existingSuperAdmin = await SuperAdmin.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  if (existingSuperAdmin) {
    const error = new HttpError(
      "Email already exists, please try again with other email",
      500
    );
    return next(error);
  }
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while encrypting the password, please try again",
      500
    );
    return next(error);
  }
  const createdSuperAdmin = new SuperAdmin({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role: "SuperAdmin",
    image: req.file.path,
    mobile,
  });
  try {
    await createdSuperAdmin.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong creating super admin, please try again",
      500
    );
    return next(error);
  }
  let token;
  try {
    token = jwt.sign(
      {
        userId: createdSuperAdmin.id,
        email: createdSuperAdmin.email,
        role: createdSuperAdmin.role,
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the JWT token, please try again later",
      500
    );
    return next(error);
  }
  res.status(201).json({
    userId: createdSuperAdmin.id,
    email: createdSuperAdmin.email,
    role: createdSuperAdmin.role,
    token: token,
  });
};
const getAllSuperAdmins = async (req, res, next) => {
  let superAdmins;
  try {
    superAdmins = await SuperAdmin.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong fetching the data, please try again",
      500
    );
    return next(error);
  }
  res.json({ superAdmins: superAdmins });
};
const getAdminByEmail = async (req, res, next) => {
  const superAdminEmail = req.params.email;
  let superAdmin;
  try {
    superAdmin = await SuperAdmin.findOne(
      { email: superAdminEmail },
      "-password"
    );
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  res.json({ superAdmin: superAdmin });
};
const getAdminById = async (req, res, next) => {
  const id = req.params.id;
  let superAdmin;
  try {
    superAdmin = await SuperAdmin.findOne({ _id: id }, "-password");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong fetching the data, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({ superAdmin: superAdmin });
};
const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingSuperAdmin;
  try {
    existingSuperAdmin = await SuperAdmin.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again later",
      500
    );
    return next(error);
  }
  if (!existingSuperAdmin) {
    const error = new HttpError("Invalid email, please try again", 401);
    return next(error);
  }
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(
      password,
      existingSuperAdmin.password
    );
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while verification of password, please try again",
      500
    );
    return next(error);
  }
  if (!isValidPassword) {
    const error = new HttpError("Invalid crudentials, please try again", 401);
    return next(error);
  }
  let token;
  try {
    token = jwt.sign(
      {
        userId: existingSuperAdmin.id,
        email: existingSuperAdmin.email,
        role: existingSuperAdmin.role,
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the JWT token, please try again",
      500
    );
    return next(error);
  }
  res.status(200).json({
    userId: existingSuperAdmin.id,
    email: existingSuperAdmin.email,
    role: existingSuperAdmin.role,
    token: token,
  });
};
const forgotPassword = async (req, res, next) => {
  const email = req.params.email;

  const { password, newPassword, confirmPassword } = req.body;

  let existingSuperAdmin;
  try {
    existingSuperAdmin = await SuperAdmin.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while verifying the super admin, please try again",
      500
    );
    return next(error);
  }

  if (!existingSuperAdmin) {
    const error = new HttpError("Invalid email, please try again", 401);
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(
      password,
      existingSuperAdmin.password
    );
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while verifying the password, please try again",
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError("Invalid credentials, please try again", 401);
    return next(error);
  }
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(newPassword, 12);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while encrypting the password, please try again",
      500
    );
    return next(error);
  }

  // Update the password
  existingSuperAdmin.password = hashedPassword;

  try {
    // Save the updated admin document
    await existingSuperAdmin.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while updating the password, please try again",
      500
    );
    return next(error);
  }

  res.status(200).json({
    message: "Password updated successfully",
  });
};
const updateSuperAdminById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errors = new HttpError(
      "Invalid inputs passed, please try again",
      422
    );
    return next(error);
  }
  const id = req.params.id;
  const { firstName, lastName, password, mobile } = req.body;
  let superAdmin;
  try {
    superAdmin = await SuperAdmin.findOne({ _id: id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  if (!superAdmin) {
    const error = new HttpError("Super admin not found, please try again", 500);
    return next(error);
  }
  let hashedPassword;
  let updatedPassword;
  if (!password) {
    updatedPassword = superAdmin.password;
  } else {
    try {
      hashedPassword = await bcrypt.hash(password, 12);
      updatedPassword = hashedPassword;
    } catch (err) {
      const error = new HttpError(
        "Something went wrong while encrypting the password, please try again",
        500
      );
      return next(error);
    }
  }

  (superAdmin.firstName = firstName ? firstName : superAdmin.firstName),
    (superAdmin.lastName = lastName ? lastName : superAdmin.lastName),
    (superAdmin.password = updatedPassword),
    (superAdmin.role = "SuperAdmin"),
    (superAdmin.mobile = mobile ? mobile : superAdmin.mobile);
  superAdmin.image = req.file ? req.file.path : superAdmin.image;
  try {
    await superAdmin.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while updating the super admin, please try again",
      500
    );
    return next(error);
  }
  try {
    token = jwt.sign(
      { userId: superAdmin.id, email: superAdmin.email, role: superAdmin.role },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the JWT token, please try again",
      500
    );
    return next(error);
  }
  res.status(201).json({
    userId: superAdmin.id,
    email: superAdmin.email,
    role: superAdmin.role,
    token: token,
  });
};
const updateImageById = async (req, res, next) => {
  const id = req.params.id;
  let superAdmin;
  try {
    superAdmin = await SuperAdmin.findById(id);
  } catch (err) {
    const error = new HttpError(
      "Something wrong while fetching the super admin"
    );
    return next(error);
  }
  if (!superAdmin) {
    const error = new HttpError("Super admin not found");
    return next(error);
  }
  superAdmin.image = req.file.path;
  try {
    superAdmin.save();
  } catch (err) {
    const error = new HttpError("Error occured while saving the super admin");
    return next(error);
  }
  res.status(201).json({ message: "Super admin updated successfully" });
};
const deleteSuperAdmin = async (req, res, next) => {
  const id = req.params.id;
  let superAdmin;
  let imagePath;
  try {
    superAdmin = await SuperAdmin.findOne({ _id: id });
    if (!superAdmin) {
      return next(
        new HttpError("Super admin not found, please try again", 500)
      );
    }

    await superAdmin.deleteOne();
    imagePath = superAdmin.image;
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while deleting the super admin, please try again",
      500
    );
    return next(error);
  }
  fs.unlink(imagePath, (err) => {
    console.log(err);
  });
  res.status(200).json({ messsage: "Super admin deleted successfully" });
};
exports.createSuperAdmin = createSuperAdmin;
exports.getAllSuperAdmins = getAllSuperAdmins;
exports.getAdminByEmail = getAdminByEmail;
exports.getAdminById = getAdminById;
exports.login = login;
exports.forgotPassword = forgotPassword;
exports.updateImageById = updateImageById;
exports.updateSuperAdminById = updateSuperAdminById;
exports.deleteSuperAdmin = deleteSuperAdmin;
