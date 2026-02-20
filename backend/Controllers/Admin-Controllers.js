const HttpError = require("../Middleware/http-error");
const { validationResult } = require("express-validator");
const Admin = require("../Models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const JWT_EXPIRY = process.env.JWT_EXPIRY || "7d";

const createAdmin = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Invalid inputs passed, please try again",
      errors: errors.array(),
    });
  }
  const { firstName, lastName, email, password, mobile } = req.body;

  let existingAdmin;
  try {
    existingAdmin = await Admin.findOne({ email: email });
  } catch (err) {
    return next(new HttpError("Something went wrong fetching the data, please try again", 500));
  }
  if (existingAdmin) {
    return next(new HttpError("Email already exists, please try again", 422));
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return next(new HttpError("Something went wrong while encrypting the password, please try again", 500));
  }

  if (!req.files || !req.files["image"] || req.files["image"].length === 0) {
    return next(new HttpError("No image was uploaded.", 400));
  }
  const image = req.files["image"][0].path;

  const createdAdmin = new Admin({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    image,
    role: "Admin",
    mobile,
  });
  try {
    await createdAdmin.save();
  } catch (err) {
    return next(new HttpError("Something went wrong while creating admin, please try again", 500));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdAdmin.id, email: createdAdmin.email, role: createdAdmin.role },
      process.env.JWT_KEY,
      { expiresIn: JWT_EXPIRY }
    );
  } catch (err) {
    return next(new HttpError("Something went wrong while creating the JWT token, please try again", 500));
  }

  res.status(201).json({
    userId: createdAdmin.id,
    email: createdAdmin.email,
    role: createdAdmin.role,
    token: token,
  });
};

const getAllAdmins = async (req, res, next) => {
  let admins;
  try {
    admins = await Admin.find({}, "-password");
  } catch (err) {
    return next(new HttpError("Something went wrong while fetching the data, please try again", 500));
  }
  res.json({ admins: admins });
};

const getAdminById = async (req, res, next) => {
  const id = req.params.id;
  let admin;
  try {
    admin = await Admin.findOne({ _id: id }, "-password");
  } catch (err) {
    return next(new HttpError("Something went wrong while fetching the data, please try again", 500));
  }
  if (!admin) {
    return next(new HttpError("Admin not found", 404));
  }
  res.json({ admin: admin });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingAdmin;
  try {
    existingAdmin = await Admin.findOne({ email: email });
  } catch (err) {
    return next(new HttpError("Something went wrong while verification of the admin, please try again", 500));
  }
  if (!existingAdmin) {
    return next(new HttpError("Invalid email, please try again", 401));
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingAdmin.password);
  } catch (err) {
    return next(new HttpError("Something went wrong while verification of the password, please try again", 500));
  }
  if (!isValidPassword) {
    return next(new HttpError("Invalid credentials, please try again", 401));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingAdmin.id, email: existingAdmin.email, role: existingAdmin.role },
      process.env.JWT_KEY,
      { expiresIn: JWT_EXPIRY }
    );
  } catch (err) {
    return next(new HttpError("Something went wrong while fetching the JWT token, please try again", 500));
  }

  res.status(200).json({
    userId: existingAdmin.id,
    email: existingAdmin.email,
    role: existingAdmin.role,
    token: token,
  });
};

const updateAdminById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Invalid inputs passed, please try again", 422));
  }

  const id = req.params.id;
  const { firstName, lastName, password, mobile } = req.body;

  let admin;
  try {
    admin = await Admin.findOne({ _id: id });
  } catch (err) {
    return next(new HttpError("Something went wrong while fetching the data, please try again", 500));
  }
  if (!admin) {
    return next(new HttpError("No admin found, please try again", 404));
  }

  let updatedPassword;
  if (password == null) {
    updatedPassword = admin.password;
  } else {
    try {
      updatedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
      return next(new HttpError("Something went wrong while encrypting the password, please try again", 500));
    }
  }

  if (firstName !== undefined) admin.firstName = firstName;
  if (lastName !== undefined) admin.lastName = lastName;
  if (mobile !== undefined) admin.mobile = mobile;
  admin.password = updatedPassword;
  admin.role = "Admin";
  if (req.files && req.files["image"] && req.files["image"].length > 0) {
    admin.image = req.files["image"][0].path;
  }

  try {
    await admin.save();
  } catch (err) {
    return next(new HttpError("Something went wrong while updating admin, please try again", 500));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: admin.id, email: admin.email, role: admin.role },
      process.env.JWT_KEY,
      { expiresIn: JWT_EXPIRY }
    );
  } catch (err) {
    return next(new HttpError("Something went wrong while fetching the JWT token, please try again", 500));
  }

  res.status(200).json({
    userId: admin.id,
    email: admin.email,
    role: admin.role,
    token: token,
  });
};

const updateImageById = async (req, res, next) => {
  const id = req.params.id;
  let admin;
  try {
    admin = await Admin.findById(id);
  } catch (err) {
    return next(new HttpError("Something went wrong while fetching the admin", 500));
  }
  if (!admin) {
    return next(new HttpError("Admin not found", 404));
  }
  admin.image = req.file.path;
  try {
    await admin.save();
  } catch (err) {
    return next(new HttpError("Error occurred while saving the admin", 500));
  }
  res.status(200).json({ message: "Admin updated successfully" });
};

const deleteAdmin = async (req, res, next) => {
  const id = req.params.id;
  let admin;
  try {
    admin = await Admin.findOne({ _id: id });
  } catch (err) {
    return next(new HttpError("Something went wrong while fetching the data, please try again", 500));
  }
  if (!admin) {
    return next(new HttpError("No admin found, please try again", 404));
  }

  const imagePath = admin.image;
  try {
    await admin.deleteOne();
  } catch (err) {
    return next(new HttpError("Something went wrong while deleting the admin, please try again", 500));
  }

  res.status(200).json({ message: "Admin successfully deleted" });

  if (imagePath) {
    fs.unlink(imagePath, (err) => {
      if (err) console.log("Image cleanup error:", err);
    });
  }
};

exports.createAdmin = createAdmin;
exports.getAdminById = getAdminById;
exports.getAllAdmins = getAllAdmins;
exports.login = login;
exports.updateAdminById = updateAdminById;
exports.updateImageById = updateImageById;
exports.deleteAdmin = deleteAdmin;