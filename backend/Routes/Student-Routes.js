const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const studentControllers = require("../Controllers/Student-Controllers");
const imageUpload = require("../Middleware/image-upload");
const checkAuth = require("../Middleware/check-auth");

router.get("/get/all/students", studentControllers.getAllStudents);
router.get("/get/student/byid/:id", studentControllers.getStudentById);
router.post("/login", studentControllers.login);
router.post(
  "/create/student",
  imageUpload.single("image"),
  checkAuth("Admin"),
  [
    check("firstName").isLength({ min: 1, max: 255 }),
    check("lastName").isLength({ min: 1, max: 255 }),
    check("fatherName").isLength({ min: 1, max: 255 }),
    check("motherName").isLength({ min: 1, max: 255 }),
    check("batch").isLength({ min: 1, max: 255 }),
    check("fatherNumber").isNumeric().isLength({ min: 1, max: 10 }),
    check("motherNumber").isNumeric().isLength({ min: 1, max: 10 }),
    check("email").isEmail(),
    check("password").isLength({ min: 6 }),
    check("studentId").isLength({ min: 1, max: 255 }),
    check("admissionDate").isLength({ min: 1, max: 255 }),
    check("address").isLength({ min: 2, max: 255 }),
    check("pincode").isNumeric().isLength({ min: 6, max: 6 }),
    check("state").isLength({ min: 2, max: 255 }),
    check("country").isLength({ min: 2, max: 255 }),
  ],
  studentControllers.createStudent
);
router.patch(
  "/update/student/byid/:id",
  imageUpload.single("image"),
  checkAuth("Admin"),
  studentControllers.updateStudentById
);
router.delete(
  "/delete/student/byid/:id",
  checkAuth("Admin"),
  studentControllers.deleteStudentById
);

router.post(
  "/create/student/superadmin",
  imageUpload.single("image"),
  checkAuth("SuperAdmin"),
  [
    check("firstName").isLength({ min: 1, max: 255 }),
    check("lastName").isLength({ min: 1, max: 255 }),
    check("fatherName").isLength({ min: 1, max: 255 }),
    check("motherName").isLength({ min: 1, max: 255 }),
    check("batch").isLength({ min: 1, max: 255 }),
    check("fatherNumber").isNumeric().isLength({ min: 1, max: 10 }),
    check("motherNumber").isNumeric().isLength({ min: 1, max: 10 }),
    check("email").isEmail(),
    check("password").isLength({ min: 6 }),
    check("studentId").isLength({ min: 1, max: 255 }),
    check("admissionDate").isLength({ min: 1, max: 255 }),
    check("address").isLength({ min: 2, max: 255 }),
    check("pincode").isNumeric().isLength({ min: 6, max: 6 }),
    check("state").isLength({ min: 2, max: 255 }),
    check("country").isLength({ min: 2, max: 255 }),
  ],
  studentControllers.createStudent
);
router.patch(
  "/update/student/superadmin/byid/:id",
  imageUpload.single("image"),
  checkAuth("SuperAdmin"),
  studentControllers.updateStudentById
);
router.delete(
  "/delete/student/superadmin/byid/:id",
  checkAuth("SuperAdmin"),
  studentControllers.deleteStudentById
);
router.patch(
  "/update/student/student/byid/:id",
  imageUpload.single("image"),
  checkAuth("Student"),
  studentControllers.updateStudentById
);
router.patch(
  "/update/image/byid/:id",
  imageUpload.single("image"),
  checkAuth("Student"),
  studentControllers.updateImageById
);
router.patch(
  "/update/password/byemail/:email",
  checkAuth("Student"),
  studentControllers.forgotPassword
);

module.exports = router;
