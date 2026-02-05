const HttpError = require("../Middleware/http-error");
const { validationResult } = require("express-validator");
const Admin = require("../Models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const createAdmin = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Invalid inputs passed, please try again",
      errors: errors.array(),
    });
  }
  const {
    firstName,
    lastName,
    email,
    password,
    mobile,
  } = req.body;
  let existingAdmin;
  try {
    existingAdmin = await Admin.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong fetching the data, please try again",
      500
    );
    return next(error);
  }
  if (existingAdmin) {
    const error = new HttpError("email already exists, please try again", 500);
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
  // Checking if files are uploaded
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ message: "No files were uploaded." });
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
    const error = new HttpError(
      "Something went wrong while creating admin, please try again",
      500
    );
    return next(error);
  }
  let token;
  try {
    token = jwt.sign(
      {
        userId: createdAdmin.id,
        email: createdAdmin.email,
        role: createdAdmin.role,
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while creating the JWT token, please try again",
      500
    );
    return next(error);
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
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  res.json({ admins: admins });
};
const getAdminById = async (req, res, next) => {
  let admin;
  const id = req.params.id;
  try {
    admin = await Admin.findOne({ _id: id }, "-password");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  res.json({ admin: admin });
};
const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingAdmin;
  try {
    existingAdmin = await Admin.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while verification of the admin, please try again",
      500
    );
    return next(error);
  }
  if (!existingAdmin) {
    const error = new HttpError("Invalid email, please try again", 401);
    return next(error);
  }
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingAdmin.password);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while verification of the password, please try again",
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
        userId: existingAdmin.id,
        email: existingAdmin.email,
        role: existingAdmin.role,
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
    userId: existingAdmin.id,
    email: existingAdmin.email,
    role: existingAdmin.role,
    token: token,
  });
};
const forgotPassword = async (req, res, next) => {
  const email = req.params.email;

  const { password, newPassword, confirmPassword } = req.body;

  let existingAdmin;
  try {
    existingAdmin = await Admin.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while verifying the admin, please try again",
      500
    );
    return next(error);
  }

  if (!existingAdmin) {
    const error = new HttpError("Invalid email, please try again", 401);
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingAdmin.password);
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
  existingAdmin.password = hashedPassword;

  try {
    // Save the updated admin document
    await existingAdmin.save();
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

const updateAdminById = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new HttpError("Invalid inputs passed, please try again", 422);
    return next(error);
  }
  const id = req.params.id;

  const {
    firstName,
    lastName,
    password,
    mobile,
  } = req.body;
  let admin;
  try {
    admin = await Admin.findOne({ _id: id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  if (!admin) {
    const error = new HttpError("No admin found, please try again", 500);
    return next(error);
  }
  let hashedPassword;
  let updatedPassword;
  if (password == null) {
    updatedPassword = admin.password;
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

  let image = null;

  if (req.files && req.files["image"]) {
    image = req.files["image"][0].path;
  }

  if (image) {
    admin.image = image;
  }
  admin.firstName = firstName ? firstName : admin.firstName;
  admin.lastName = lastName ? lastName : admin.lastName;
  admin.password = updatedPassword;
  admin.mobile = mobile ? mobile : admin.mobile;
  admin.role = "Admin";
  admin.image = image ? image : admin.image;
  try {
    await admin.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while the updation of admin, please try again",
      500
    );
    return next(error);
  }
  try {
    token = jwt.sign(
      { userId: admin.id, email: admin.email, role: admin.role },
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
    const error = new HttpError("Something wrong while fetching the admin");
    return next(error);
  }
  if (!admin) {
    const error = new HttpError("Admin not found");
    return next(error);
  }
  admin.image = req.file.path;
  try {
    admin.save();
  } catch (err) {
    const error = new HttpError("Error occured while saving the admin");
    return next(error);
  }
  res.status(201).json({ message: "Admin updated successfully" });
};
const deleteAdmin = async (req, res, next) => {
  const id = req.params.id;
  let admin;
  try {
    admin = await Admin.findOne({ _id: id });
    if (!admin) {
      const error = new HttpError("no admin found, please try again", 500);
      return next(error);
    }
    const imagePath = admin.image;
    await admin.deleteOne();
    res.status(200).json({ message: "Admin successfully deleted" });
    fs.unlink(imagePath, (err) => {
      console.log(err);
    });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while deleting the admin, please try again",
      500
    );
    return next(error);
  }
};
exports.createAdmin = createAdmin;
exports.getAdminById = getAdminById;
exports.getAllAdmins = getAllAdmins;
exports.login = login;
exports.updateAdminById = updateAdminById;
exports.updateImageById = updateImageById;
exports.forgotPassword = forgotPassword;
exports.deleteAdmin = deleteAdmin;
