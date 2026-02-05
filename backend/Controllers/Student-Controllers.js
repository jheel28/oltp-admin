const HttpError = require("../Middleware/http-error");
const { validationResult } = require("express-validator");
const Student = require("../Models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const createStudent = async (req, res, next) => {
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
    fatherName,
    motherName,
    phoneNumber,
    alternateNumber,
    studentId,
    admissionDate,
    batch,
    address,
    pincode,
    state,
    country,
  } = req.body;
  let existingStudent;
  try {
    existingStudent = await Student.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  if (existingStudent) {
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
  const createdStudent = new Student({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    fatherName,
    motherName,
    phoneNumber,
    alternateNumber,
    studentId,
    role: "Student",
    admissionDate,
    image: req.file.path,
    batch,
    address,
    pincode,
    state,
    country,
  });
  try {
    await createdStudent.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while creating the student, please try again",
      500
    );
    return next(error);
  }
  let token;
  try {
    token = jwt.sign(
      {
        userId: createdStudent.id,
        email: createdStudent.email,
        role: createdStudent.role,
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
  res.status(201).json({
    userId: createdStudent.id,
    email: createdStudent.email,
    role: createdStudent.role,
    token: token,
  });
};
const getAllStudents = async (req, res, next) => {
  let students;
  try {
    students = await Student.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  res.json({ students: students });
};
const getStudentById = async (req, res, next) => {
  const id = req.params.id;
  let student;
  try {
    student = await Student.findOne({ _id: id }, "-password");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong fetching the data, please try again",
      500
    );
    return next(error);
  }
  res.json({ student: student });
};
const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingStudent;
  try {
    existingStudent = await Student.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  if (!existingStudent) {
    const error = new HttpError("No email found, please try again", 500);
    return next(error);
  }
  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingStudent.password);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while verification of the password, please try again",
      500
    );
    return next(error);
  }
  if (!isValidPassword) {
    const error = new HttpError("Invalid credentials, please try again", 401);
    return next(error);
  }
  let token;
  try {
    token = jwt.sign(
      {
        userId: existingStudent.id,
        email: existingStudent.email,
        role: existingStudent.role,
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the JWT token, please try agian",
      500
    );
    return next(error);
  }
  res.status(200).json({
    userId: existingStudent.id,
    email: existingStudent.email,
    role: existingStudent.role,
    token: token,
  });
};
const forgotPassword = async (req, res, next) => {
  const email = req.params.email;

  const { password, newPassword, confirmPassword } = req.body;

  let existingStudent;
  try {
    existingStudent = await Student.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while verifying the admin, please try again",
      500
    );
    return next(error);
  }

  if (!existingStudent) {
    const error = new HttpError("Invalid email, please try again", 401);
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingStudent.password);
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
  existingStudent.password = hashedPassword;

  try {
    // Save the updated admin document
    await existingStudent.save();
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
    firstName,
    lastName,
    password,
    fatherName,
    motherName,
    phoneNumber,
    alternateNumber,
    studentId,
    admissionDate,
    batch,
    address,
    pincode,
    state,
    country,
  } = req.body;

  let student;
  try {
    student = await Student.findOne({ _id: id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  if (!student) {
    const error = new HttpError("Student not found, please try again", 500);
    return next(error);
  }
  let hashedPassword;
  let updatedPassword;
  if (password == null) {
    updatedPassword = student.password;
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

  (student.firstName = firstName ? firstName : student.firstName),
    (student.lastName = lastName ? lastName : student.lastName),
    (student.password = updatedPassword),
    (student.fatherName = fatherName ? fatherName : student.fatherName),
    (student.motherName = motherName ? motherName : student.motherName),
    (student.phoneNumber = phoneNumber ? phoneNumber : student.phoneNumber),
    (student.alternateNumber = alternateNumber ? alternateNumber : student.alternateNumber),
    (student.studentId = studentId ? studentId : student.studentId),
    (student.batch = batch ? batch : student.batch),
    (student.address = address ? address : student.address),
    (student.pincode = pincode ? pincode : student.pincode),
    (student.state = state ? state : student.state),
    (student.country = country ? country : student.country),
    (student.admissionDate = admissionDate
      ? admissionDate
      : student.admissionDate),
    (student.image = req.file ? req.file.path : student.image);

  try {
    await student.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while updating the student, please try again",
      500
    );
    return next(error);
  }
  try {
    token = jwt.sign(
      { userId: student.id, email: student.email, role: student.role },
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
    userId: student.id,
    email: student.email,
    role: student.role,
    token: token,
  });
};
const updateImageById = async (req, res, next) => {
  const id = req.params.id;
  let student;
  try {
    student = await Student.findById(id);
  } catch (err) {
    const error = new HttpError("Something wrong while fetching the student");
    return next(error);
  }
  if (!student) {
    const error = new HttpError("Student not found");
    return next(error);
  }
  student.image = req.file.path;
  try {
    student.save();
  } catch (err) {
    const error = new HttpError("Error occured while saving the student");
    return next(error);
  }
  res.status(201).json({ message: "Student updated successfully" });
};
const deleteStudentById = async (req, res, next) => {
  const id = req.params.id;
  let student;
  try {
    student = await Student.findOne({ _id: id });
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while fetching the data, please try again",
      500
    );
    return next(error);
  }
  if (!student) {
    const error = new HttpError("Student not found, please try again", 500);
    return next(error);
  }
  const imagePath = student.image;
  try {
    student.deleteOne();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong while deleting the student, please try again",
      500
    );
    return next(error);
  }
  fs.unlink(imagePath, (err) => {
    console.log(err);
  });
  res.status(200).json({ message: "Student successfully deleted" });
};
exports.createStudent = createStudent;
exports.getAllStudents = getAllStudents;
exports.getStudentById = getStudentById;
exports.login = login;
exports.updateImageById = updateImageById;
exports.forgotPassword = forgotPassword;
exports.updateStudentById = updateStudentById;
exports.deleteStudentById = deleteStudentById;
