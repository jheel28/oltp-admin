const express = require("express");
const { check } = require("express-validator");
const router = express.Router();

const studentControllers = require("../../Controllers/v1/Student-Controllers");
const imageUpload = require("../../Middleware/image-upload");
const checkAuth = require("../../Middleware/check-auth");
const { loginRateLimiter } = require("../../Middleware/rate-limiter");

router.get(
  "/get/all/students",
  checkAuth("Admin"),
  studentControllers.getAllStudents,
);
router.get(
  "/get/student/byid/:id",
  checkAuth(["Admin", "Student"]),
  studentControllers.getStudentById,
);

router.post("/login", loginRateLimiter, studentControllers.login);

router.get("/verify/:token", studentControllers.verifyEmail);
router.post("/resend-verification", studentControllers.resendVerificationEmail);
router.post("/forgot-password", studentControllers.forgotPassword);
router.post("/reset-password", studentControllers.resetPassword);

const phoneValidation = (field, { required = true } = {}) => {
  const chain = check(field).trim();
  if (required) {
    return chain
      .notEmpty()
      .withMessage(`${field} is required`)
      .matches(/^\+[1-9]\d{6,14}$/)
      .withMessage(
        `${field} must be in international format (e.g. +919876543210)`,
      );
  }
  return chain
    .optional({ nullable: true, checkFalsy: true })
    .matches(/^\+[1-9]\d{6,14}$/)
    .withMessage(
      `${field} must be in international format (e.g. +919876543210)`,
    );
};

const studentValidation = [
  check("firstName").trim().isLength({ min: 1, max: 255 }),
  check("lastName").trim().isLength({ min: 1, max: 255 }),
  phoneValidation("phoneNumber", { required: true }),
  phoneValidation("alternateNumber", { required: false }),
  check("email").trim().normalizeEmail().isEmail(),
  check("password").isLength({ min: 6 }),
  check("admissionDate").trim().isLength({ min: 1, max: 255 }),
  check("city").trim().isLength({ min: 2, max: 255 }),
  check("pincode").trim().isNumeric().isLength({ min: 4, max: 10 }),
  check("state").trim().isLength({ min: 2, max: 255 }),
  check("country").trim().isLength({ min: 2, max: 255 }),
  check("fatherName")
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 255 }),
  check("motherName")
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 255 }),
];

const updateValidation = [
  check("firstName").optional().trim().isLength({ min: 1, max: 255 }),
  check("lastName").optional().trim().isLength({ min: 1, max: 255 }),
  check("phoneNumber")
    .optional()
    .trim()
    .matches(/^\+[1-9]\d{6,14}$/)
    .withMessage("phoneNumber must be in international format"),
  phoneValidation("alternateNumber", { required: false }),
  check("email").optional().trim().normalizeEmail().isEmail(),
  check("city").optional().trim().isLength({ min: 2, max: 255 }),
  check("pincode").optional().trim().isNumeric().isLength({ min: 4, max: 10 }),
  check("state").optional().trim().isLength({ min: 2, max: 255 }),
  check("country").optional().trim().isLength({ min: 2, max: 255 }),
  check("fatherName")
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 255 }),
  check("motherName")
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 255 }),
];

router.post(
  "/signup",
  imageUpload.single("image"),
  studentValidation,
  studentControllers.createStudent,
);

router.post(
  "/create/student",
  imageUpload.single("image"),
  checkAuth("Admin"),
  studentValidation,
  studentControllers.createStudent,
);

router.patch(
  "/update/student/byid/:id",
  imageUpload.single("image"),
  checkAuth("Admin"),
  updateValidation,
  studentControllers.updateStudentById,
);

router.patch(
  "/update/student/student/byid/:id",
  imageUpload.single("image"),
  checkAuth("Student"),
  updateValidation,
  studentControllers.updateStudentById,
);

router.patch(
  "/update/image/byid/:id",
  imageUpload.single("image"),
  checkAuth("Student"),
  studentControllers.updateImageById,
);

router.patch(
  "/update/password/byemail/:email",
  checkAuth(["Admin", "Student"]),
  [
    check("password").notEmpty().withMessage("Current password is required"),
    check("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters"),
  ],
  studentControllers.updatePasswordByEmail,
);

router.delete(
  "/delete/student/byid/:id",
  checkAuth("Admin"),
  studentControllers.deleteStudentById,
);

module.exports = router;