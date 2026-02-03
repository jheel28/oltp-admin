const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const scoreControllers = require("../Controllers/Score-Controllers");
const checkAuth = require("../Middleware/check-auth");

router.get("/get/all/scores", scoreControllers.getAllScore);
router.get(
  "/get/scores/bystudentId/:studentId",
  scoreControllers.getScoreByStudentId
);
router.get(
  "/get/attempted/tests/bystudentId/:studentId",
  scoreControllers.getAttemptedTestsByStudentId
);
router.get(
  "/get/attempted/tests/bystudentIdandtestId/:studentId/:testId",
  scoreControllers.getScoreByTestIdAndStudentId
);
router.get("/get/scores/bytestId/:testId", scoreControllers.getScoreByTestId);
router.post(
  "/create/score",
  checkAuth("Student"),
  [
    check("studentId").isLength({ min: 1, max: 255 }),
    check("testId").isNumeric().isLength({ min: 1, max: 255 }),
    check("marks").notEmpty(),
    check("maxscore").notEmpty(),
    check("questions").isArray().withMessage("Questions must be an array"),
    check("questions.*.questionId")
      .notEmpty()
      .withMessage("Question ID is required"),
    check("questions.*.correctAnswer")
      .notEmpty()
      .withMessage("Correct answer is required"),
    check("questions.*.chosenAnswer").optional(), // Chosen answer is optional
  ],
  scoreControllers.createScore
);

router.delete(
  "/delete/score/superadmin/bytestId/:testId",
  checkAuth("SuperAdmin"),
  scoreControllers.deleteScoreByTestId
);
router.delete(
  "/delete/score/bytestId/:testId",
  checkAuth("Admin"),
  scoreControllers.deleteScoreByTestId
);
module.exports = router;
