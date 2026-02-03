const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const questionPaperControllers = require("../Controllers/QuestionPaper-Controllers");
const checkAuth = require("../Middleware/check-auth");
const imageUpload = require("../Middleware/image-upload");
router.get(
  "/get/all/questionpapers",
  questionPaperControllers.getAllQuestionPapers
);
router.get(
  "/get/questionpaper/byquestionpaperid/:questionPaperId",
  questionPaperControllers.getQuestionPaperByQuestionPaperId
);
router.get(
  "/get/questionpaper/byid/:id",
  questionPaperControllers.getQuestionPaperById
);
router.post(
  "/create/questionpaper",
  checkAuth("Admin"),
  imageUpload.single("keySheet"),
  [
    check("questionPaperId").isLength({ min: 1, max: 255 }),
    check("score").isNumeric().notEmpty(),
    check("noOfQuestions").isNumeric().notEmpty(),
    check("category").isLength({ min: 1, max: 255 }),
  ],
  questionPaperControllers.createQuestionPaper
);
router.patch(
  "/update/questionpaper/byid/:id",
  checkAuth("Admin"),
  questionPaperControllers.updateQuestionPaperById
);
router.delete(
  "/delete/questionpaper/byid/:id",
  checkAuth("Admin"),
  questionPaperControllers.deleteQuestionPaperById
);
router.post(
  "/create/questionpaper/superadmin",
  checkAuth("SuperAdmin"),
  imageUpload.single("keySheet"),
  [
    check("questionPaperId").isLength({ min: 1, max: 255 }),
    check("score").isNumeric().notEmpty(),
    check("noOfQuestions").isNumeric().notEmpty(),
    check("category").isLength({ min: 1, max: 255 }),
  ],
  questionPaperControllers.createQuestionPaper
);
router.patch(
  "/update/questionpaper/superadmin/byid/:id",
  checkAuth("SuperAdmin"),
  questionPaperControllers.updateQuestionPaperById
);
router.delete(
  "/delete/questionpaper/superadmin/byid/:id",
  checkAuth("SuperAdmin"),
  questionPaperControllers.deleteQuestionPaperById
);
module.exports = router;
