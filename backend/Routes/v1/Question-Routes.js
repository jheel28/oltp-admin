const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const ctrl = require("../../Controllers/v1/Question-Controllers");
const imageUpload = require("../../Middleware/image-upload");
const checkAuth = require("../../Middleware/check-auth");
const HttpError = require("../../Middleware/http-error");

const handleUpload = (req, res, next) => {
  imageUpload.any()(req, res, (err) => {
    if (err) return next(new HttpError(err.message || "File upload failed", 400));
    next();
  });
};

router.get(
  "/get/all/questions",
  checkAuth(["Admin", "Student"]),
  ctrl.getAllQuestions
);
router.get(
  "/get/questions/bypaperid/:paperId",
  checkAuth(["Admin", "Student"]),
  ctrl.getQuestionsByPaperId
);
router.get(
  "/get/question/byid/:id",
  checkAuth(["Admin", "Student"]),
  ctrl.getQuestionById
);

router.post(
  "/create/question",
  checkAuth("Admin"),
  handleUpload,
  [
    check("paperId").isLength({ min: 1, max: 255 }),
    check("text").notEmpty(),
    check("type").isIn(["MCQ", "MSQ", "NAT"]),
  ],
  ctrl.createQuestion
);

router.patch(
  "/update/question/byid/:id",
  checkAuth("Admin"),
  handleUpload,
  ctrl.updateQuestionById
);

router.delete(
  "/delete/question/byid/:id",
  checkAuth("Admin"),
  ctrl.deleteQuestionById
);

module.exports = router;