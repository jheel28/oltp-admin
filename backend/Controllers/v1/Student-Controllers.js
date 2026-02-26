const HttpError = require("../../Middleware/http-error");
const { validationResult } = require("express-validator");
const Student = require("../../Models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const crypto = require("crypto");
const { sendVerificationEmail } = require("../../Utils/email");
const { validatePhoneNumber } = require("../../Utils/phoneValidation");

const JWT_EXPIRY = process.env.JWT_EXPIRY || "7d";
const VERIFICATION_EXPIRY_HOURS = 24;
const REQUIRE_EMAIL_VERIFICATION = process.env.REQUIRE_EMAIL_VERIFICATION !== "false";

const createStudent = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: "Invalid inputs passed, please try again",
      errors: errors.array(),
    });
  }

  const {
    firstName, lastName, email, password, fatherName, motherName,
    phoneNumber, alternateNumber, studentId, admissionDate,
    batch, address, pincode, state, country,
  } = req.body;

  const phoneCheck = validatePhoneNumber(phoneNumber);
  if (!phoneCheck.valid) {
    return next(new HttpError(`Phone number: ${phoneCheck.error}`, 422));
  }

  const altPhoneCheck = validatePhoneNumber(alternateNumber);
  if (!altPhoneCheck.valid) {
    return next(new HttpError(`Alternate number: ${altPhoneCheck.error}`, 422));
  }

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

  const verificationToken = REQUIRE_EMAIL_VERIFICATION
    ? crypto.randomBytes(32).toString("hex")
    : null;
  const verificationTokenExpiry = REQUIRE_EMAIL_VERIFICATION
    ? new Date(Date.now() + VERIFICATION_EXPIRY_HOURS * 60 * 60 * 1000)
    : null;

  const imagePath = req.file ? req.file.path : null;

  const createdStudent = new Student({
    firstName, lastName, email, password: hashedPassword,
    fatherName: fatherName || null,
    motherName: motherName || null,
    phoneNumber: phoneCheck.e164,
    alternateNumber: altPhoneCheck.e164,
    studentId, role: "Student", admissionDate,
    image: imagePath,
    batch, address, pincode, state, country,
    isVerified: !REQUIRE_EMAIL_VERIFICATION,
    verificationToken,
    verificationTokenExpiry,
  });

  try {
    await createdStudent.save();
  } catch (err) {
    return next(new HttpError("Something went wrong while creating the student, please try again", 500));
  }

  if (REQUIRE_EMAIL_VERIFICATION) {
    try {
      await sendVerificationEmail(email, firstName, verificationToken);
    } catch (err) {
      console.error("Verification email failed:", err.message);
    }

    return res.status(201).json({
      message: "Account created. Please check your email to verify your account before logging in.",
      requiresVerification: true,
    });
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

const verifyEmail = async (req, res, next) => {
  const { token } = req.params;

  if (!token) {
    return next(new HttpError("Verification token is required", 400));
  }

  let student;
  try {
    student = await Student.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() },
    });
  } catch (err) {
    return next(new HttpError("Something went wrong, please try again", 500));
  }

  if (!student) {
    return next(new HttpError("Invalid or expired verification token. Please register again.", 400));
  }

  student.isVerified = true;
  student.verificationToken = null;
  student.verificationTokenExpiry = null;

  try {
    await student.save();
  } catch (err) {
    return next(new HttpError("Something went wrong while verifying your email, please try again", 500));
  }

  res.status(200).json({ message: "Email verified successfully. You can now log in." });
};

const resendVerificationEmail = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new HttpError("Email is required", 422));
  }

  let student;
  try {
    student = await Student.findOne({ email });
  } catch (err) {
    return next(new HttpError("Something went wrong, please try again", 500));
  }

  if (!student) {
    return next(new HttpError("No account found with this email", 404));
  }
  if (student.isVerified) {
    return next(new HttpError("This account is already verified", 422));
  }

  const newToken = crypto.randomBytes(32).toString("hex");
  const newExpiry = new Date(Date.now() + VERIFICATION_EXPIRY_HOURS * 60 * 60 * 1000);

  student.verificationToken = newToken;
  student.verificationTokenExpiry = newExpiry;

  try {
    await student.save();
  } catch (err) {
    return next(new HttpError("Something went wrong, please try again", 500));
  }

  try {
    await sendVerificationEmail(email, student.firstName, newToken);
  } catch (err) {
    return next(new HttpError("Failed to send verification email. Please try again.", 500));
  }

  res.status(200).json({ message: "Verification email resent. Please check your inbox." });
};

const getAllStudents = async (req, res, next) => {
  let students;
  try {
    students = await Student.find({}, "-password -verificationToken -verificationTokenExpiry");
  } catch (err) {
    return next(new HttpError("Something went wrong while fetching the data, please try again", 500));
  }
  res.json({ students });
};

const getStudentById = async (req, res, next) => {
  const id = req.params.id;
  let student;
  try {
    student = await Student.findOne({ _id: id }, "-password -verificationToken -verificationTokenExpiry");
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

  if (!email || !password) {
    return next(new HttpError("Email and password are required", 422));
  }

  let existingStudent;
  try {
    existingStudent = await Student.findOne({ email });
  } catch (err) {
    return next(new HttpError("Something went wrong while fetching the data, please try again", 500));
  }
  if (!existingStudent) {
    return next(new HttpError("Invalid email, please try again", 401));
  }

  if (REQUIRE_EMAIL_VERIFICATION && !existingStudent.isVerified) {
    return next(new HttpError("Please verify your email address before logging in. Check your inbox for the verification link.", 403));
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

  if (phoneNumber !== undefined && phoneNumber !== student.phoneNumber) {
    const phoneCheck = validatePhoneNumber(phoneNumber);
    if (!phoneCheck.valid) {
      return next(new HttpError(`Phone number: ${phoneCheck.error}`, 422));
    }
    student.phoneNumber = phoneCheck.e164;
  }

  if (alternateNumber !== undefined && alternateNumber !== student.alternateNumber) {
    const altCheck = validatePhoneNumber(alternateNumber);
    if (!altCheck.valid) {
      return next(new HttpError(`Alternate number: ${altCheck.error}`, 422));
    }
    student.alternateNumber = altCheck.e164;
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
  if (fatherName !== undefined) student.fatherName = fatherName || null;
  if (motherName !== undefined) student.motherName = motherName || null;
  if (studentId !== undefined) student.studentId = studentId;
  if (batch !== undefined) student.batch = batch;
  if (address !== undefined) student.address = address;
  if (pincode !== undefined) student.pincode = pincode;
  if (state !== undefined) student.state = state;
  if (country !== undefined) student.country = country;
  if (admissionDate !== undefined) student.admissionDate = admissionDate;
  student.password = updatedPassword;

  if (req.file) {
    const oldImagePath = student.image;
    student.image = req.file.path;
    if (oldImagePath) {
      fs.unlink(oldImagePath, (err) => {
        if (err) console.log("Old image cleanup error:", err);
      });
    }
  }

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
  const oldImagePath = student.image;
  student.image = req.file.path;
  try {
    await student.save();
  } catch (err) {
    return next(new HttpError("Error occurred while saving the student", 500));
  }
  if (oldImagePath) {
    fs.unlink(oldImagePath, (err) => {
      if (err) console.log("Old image cleanup error:", err);
    });
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
exports.verifyEmail = verifyEmail;
exports.resendVerificationEmail = resendVerificationEmail;
exports.getAllStudents = getAllStudents;
exports.getStudentById = getStudentById;
exports.login = login;
exports.updateImageById = updateImageById;
exports.updateStudentById = updateStudentById;
exports.updatePasswordByEmail = updatePasswordByEmail;
exports.deleteStudentById = deleteStudentById;