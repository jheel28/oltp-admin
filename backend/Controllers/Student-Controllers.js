const HttpError = require("../Middleware/http-error");
const { validationResult } = require("express-validator");
const Student = require("../Models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const JWT_EXPIRY = process.env.JWT_EXPIRY || "7d";

const createStudent = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Invalid inputs passed, please try again",
      errors: errors.array(),
    });
  }

  if (!req.file) {
    return next(new HttpError("No image was uploaded.", 400));
  }

  const {
    firstName, lastName, email, password, fatherName, motherName,
    phoneNumber, alternateNumber, studentId, admissionDate,
    batch, address, pincode, state, country,
  } = req.body;

  let existingStudent;
  try {
    existingStudent = await Student.findOne({ email });
  } catch (err) {
    return next(new HttpError("Something went wrong while fetching the data, please try again", 500));
  }
  if (existingStudent) {
    return next(new HttpError("Email already exists, please try again", 422));
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    return next(new HttpError("Something went wrong while encrypting the password, please try again", 500));
  }

  const createdStudent = new Student({
    firstName, lastName, email, password: hashedPassword,
    fatherName, motherName, phoneNumber, alternateNumber,
    studentId, role: "Student", admissionDate,
    image: req.file.path,
    batch, address, pincode, state, country,
  });

  try {
    await createdStudent.save();
  } catch (err) {
    return next(new HttpError("Something went wrong while creating the student, please try again", 500));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdStudent.id, email: createdStudent.email, role: createdStudent.role },
      process.env.JWT_KEY,
      { expiresIn: JWT_EXPIRY }
    );
  } catch (err) {
    return next(new HttpError("Something went wrong while creating the JWT token, please try again", 500));
  }

  res.status(201).json({
    userId: createdStudent.id,
    email: createdStudent.email,
    role: createdStudent.role,
    token,
  });
};

const getAllStudents = async (req, res, next) => {
  let students;
  try {
    students = await Student.find({}, "-password");
  } catch (err) {
    return next(new HttpError("Something went wrong while fetching the data, please try again", 500));
  }
  res.json({ students });
};

const getStudentById = async (req, res, next) => {
  const id = req.params.id;
  let student;
  try {
    student = await Student.findOne({ _id: id }, "-password");
  } catch (err) {
    return next(new HttpError("Something went wrong fetching the data, please try again", 500));
  }
  if (!student) {
    return next(new HttpError("Student not found", 404));
  }
  res.json({ student });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingStudent;
  try {
    existingStudent = await Student.findOne({ email });
  } catch (err) {
    return next(new HttpError("Something went wrong while fetching the data, please try again", 500));
  }
  if (!existingStudent) {
    return next(new HttpError("Invalid email, please try again", 401));
  }

  let isValidPassword;
  try {
    isValidPassword = await bcrypt.compare(password, existingStudent.password);
  } catch (err) {
    return next(new HttpError("Something went wrong while verifying the password, please try again", 500));
  }
  if (!isValidPassword) {
    return next(new HttpError("Invalid credentials, please try again", 401));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingStudent.id, email: existingStudent.email, role: existingStudent.role },
      process.env.JWT_KEY,
      { expiresIn: JWT_EXPIRY }
    );
  } catch (err) {
    return next(new HttpError("Something went wrong while creating the JWT token, please try again", 500));
  }

  res.status(200).json({
    userId: existingStudent.id,
    email: existingStudent.email,
    role: existingStudent.role,
    token,
  });
};

const updateStudentById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Invalid inputs passed, please try again",
      errors: errors.array(),
    });
  }

  const id = req.params.id;
  const {
    firstName, lastName, email, password, fatherName, motherName,
    phoneNumber, alternateNumber, studentId, admissionDate,
    batch, address, pincode, state, country,
  } = req.body;

  let student;
  try {
    student = await Student.findOne({ _id: id });
  } catch (err) {
    return next(new HttpError("Something went wrong while fetching the data, please try again", 500));
  }
  if (!student) {
    return next(new HttpError("Student not found, please try again", 404));
  }

  if (email && email !== student.email) {
    let emailTaken;
    try {
      emailTaken = await Student.findOne({ email });
    } catch (err) {
      return next(new HttpError("Something went wrong while checking email, please try again", 500));
    }
    if (emailTaken) {
      return next(new HttpError("This email is already in use by another account", 422));
    }
    student.email = email;
  }

  let updatedPassword;
  if (password == null || password === "") {
    updatedPassword = student.password;
  } else {
    try {
      updatedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
      return next(new HttpError("Something went wrong while encrypting the password, please try again", 500));
    }
  }

  if (firstName !== undefined) student.firstName = firstName;
  if (lastName !== undefined) student.lastName = lastName;
  if (fatherName !== undefined) student.fatherName = fatherName;
  if (motherName !== undefined) student.motherName = motherName;
  if (phoneNumber !== undefined) student.phoneNumber = phoneNumber;
  if (alternateNumber !== undefined) student.alternateNumber = alternateNumber;
  if (studentId !== undefined) student.studentId = studentId;
  if (batch !== undefined) student.batch = batch;
  if (address !== undefined) student.address = address;
  if (pincode !== undefined) student.pincode = pincode;
  if (state !== undefined) student.state = state;
  if (country !== undefined) student.country = country;
  if (admissionDate !== undefined) student.admissionDate = admissionDate;
  student.password = updatedPassword;
  if (req.file) student.image = req.file.path;

  try {
    await student.save();
  } catch (err) {
    return next(new HttpError("Something went wrong while updating the student, please try again", 500));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: student.id, email: student.email, role: student.role },
      process.env.JWT_KEY,
      { expiresIn: JWT_EXPIRY }
    );
  } catch (err) {
    return next(new HttpError("Something went wrong while creating the JWT token, please try again", 500));
  }

  res.status(200).json({
    userId: student.id,
    email: student.email,
    role: student.role,
    token,
  });
};

const updateImageById = async (req, res, next) => {
  const id = req.params.id;
  let student;
  try {
    student = await Student.findById(id);
  } catch (err) {
    return next(new HttpError("Something went wrong while fetching the student", 500));
  }
  if (!student) {
    return next(new HttpError("Student not found", 404));
  }
  if (!req.file) {
    return next(new HttpError("No image was uploaded", 400));
  }
  student.image = req.file.path;
  try {
    await student.save();
  } catch (err) {
    return next(new HttpError("Error occurred while saving the student", 500));
  }
  res.status(200).json({ message: "Student image updated successfully" });
};

const updatePasswordByEmail = async (req, res, next) => {
  const email = req.params.email;
  const { password, newPassword } = req.body;

  if (!password || !newPassword) {
    return next(new HttpError("Current password and new password are required", 422));
  }
  if (newPassword.length < 6) {
    return next(new HttpError("New password must be at least 6 characters", 422));
  }

  let student;
  try {
    student = await Student.findOne({ email });
  } catch (err) {
    return next(new HttpError("Something went wrong while fetching the data, please try again", 500));
  }
  if (!student) {
    return next(new HttpError("No account found with this email", 404));
  }

  let isValidPassword;
  try {
    isValidPassword = await bcrypt.compare(password, student.password);
  } catch (err) {
    return next(new HttpError("Something went wrong while verifying the password, please try again", 500));
  }
  if (!isValidPassword) {
    return next(new HttpError("Current password is incorrect", 401));
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(newPassword, 12);
  } catch (err) {
    return next(new HttpError("Something went wrong while encrypting the password, please try again", 500));
  }

  student.password = hashedPassword;
  try {
    await student.save();
  } catch (err) {
    return next(new HttpError("Something went wrong while updating the password, please try again", 500));
  }

  res.status(200).json({ message: "Password updated successfully" });
};

const deleteStudentById = async (req, res, next) => {
  const id = req.params.id;
  let student;
  try {
    student = await Student.findOne({ _id: id });
  } catch (err) {
    return next(new HttpError("Something went wrong while fetching the data, please try again", 500));
  }
  if (!student) {
    return next(new HttpError("Student not found, please try again", 404));
  }

  const imagePath = student.image;
  try {
    await student.deleteOne();
  } catch (err) {
    return next(new HttpError("Something went wrong while deleting the student, please try again", 500));
  }

  res.status(200).json({ message: "Student successfully deleted" });

  if (imagePath) {
    fs.unlink(imagePath, (err) => {
      if (err) console.log("Image cleanup error:", err);
    });
  }
};

exports.createStudent = createStudent;
exports.getAllStudents = getAllStudents;
exports.getStudentById = getStudentById;
exports.login = login;
exports.updateImageById = updateImageById;
exports.updateStudentById = updateStudentById;
exports.updatePasswordByEmail = updatePasswordByEmail;
exports.deleteStudentById = deleteStudentById;