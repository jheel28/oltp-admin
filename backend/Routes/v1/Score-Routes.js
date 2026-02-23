const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const ctrl = require("../../Controllers/v1/Score-Controllers");
const checkAuth = require("../../Middleware/check-auth");

router.get("/get/all/scores", checkAuth("Admin"), ctrl.getAllScores);
router.get("/get/scores/bystudentid/:studentId", ctrl.getScoresByStudentId);
router.get("/get/scores/bytestid/:testId", ctrl.getScoresByTestId);
router.get(
  "/get/score/bytestid/:testId/studentid/:studentId",
  ctrl.getScoreByTestAndStudent,
);
router.get(
  "/get/attempted/tests/bystudentid/:studentId",
  ctrl.getAttemptedTestsByStudentId,
);
router.get(
  "/get/leaderboard/bytestid/:testId",
  checkAuth(["Admin", "Student"]),
  ctrl.getLeaderboardByTestId,
);
router.get(
  "/get/live/status/:testId",
  checkAuth("Admin"),
  ctrl.getLiveTestStatus,
);

router.post(
  "/create/score",
  checkAuth("Student"),
  [
    check("testId").notEmpty(),
    check("studentId").notEmpty(),
    check("paperId").notEmpty(),
    check("marksObtained").isNumeric(),
    check("totalMarks").isNumeric(),
    check("questions").isArray(),
  ],
  ctrl.createScore,
);

router.delete(
  "/delete/scores/bytestid/:testId",
  checkAuth("Admin"),
  ctrl.deleteScoresByTestId,
);

router.patch(
  "/update/:scoreId",
  checkAuth("Admin"),
  ctrl.updateScore
);

router.delete(
  "/delete/single/:scoreId",
  checkAuth("Admin"),
  ctrl.deleteSingleScore
);

module.exports = router;