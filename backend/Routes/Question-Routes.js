const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const questionControllers = require("../Controllers/Question-Controllers");
const imageUpload = require("../Middleware/image-upload");
const checkAuth = require("../Middleware/check-auth");
router.get("/get/all/questions", questionControllers.getAllQuestions);
router.get(
  "/get/questions/byquestionpaperid/:questionPaperId",
  questionControllers.getQuestionsByQuestionPaperId
);
router.get("/get/question/byid/:id", questionControllers.getQuestionById);
router.post(
  "/create/question",
  checkAuth("Admin"),
  imageUpload.fields([
    { name: "image", maxCount: 10 },
    { name: "questionImage", maxCount: 1 },
  ]),
  [
    check("questionPaperId").isNumeric().isLength({ min: 1, max: 255 }),
    check("text").notEmpty(),
    check("options").notEmpty(),
    check("correctOption").isNumeric().notEmpty(),
    check("marks").isNumeric().notEmpty(),
  ],
  questionControllers.createQuestion
);
router.patch(
  "/update/question/byid/:id",
  checkAuth("Admin"),
  questionControllers.updateQuestionById
);
router.delete(
  "/delete/question/byid/:id",
  checkAuth("Admin"),
  questionControllers.deleteQuestionById
);
router.post(
  "/create/question/superadmin",
  checkAuth("SuperAdmin"),
  imageUpload.fields([
    { name: "image", maxCount: 10 },
    { name: "questionImage", maxCount: 1 },
  ]),
  [
    check("questionPaperId").isNumeric().isLength({ min: 1, max: 255 }),
    check("text").notEmpty(),
    check("options").notEmpty(),
    check("correctOption").isNumeric().notEmpty(),
    check("marks").isNumeric().notEmpty(),
  ],
  questionControllers.createQuestion
);
router.patch(
  "/update/question/superadmin/byid/:id",
  checkAuth("SuperAdmin"),
  questionControllers.updateQuestionById
);
router.delete(
  "/delete/question/superadmin/byid/:id",
  checkAuth("SuperAdmin"),
  questionControllers.deleteQuestionById
);
module.exports = router;
