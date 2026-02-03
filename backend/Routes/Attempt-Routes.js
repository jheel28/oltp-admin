const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const attemptControllers = require("../Controllers/Attempt-Controllers");
const checkAuth = require("../Middleware/check-auth");

// Create attempt (student submits answer)
router.post(
  "/create/attempt",
  checkAuth("Student"),
  [
    check("userId").notEmpty(),
    check("questionId").notEmpty(),
    check("testId").notEmpty(),
    check("selectedOption.text").notEmpty(),
    check("selectedOption.index").isNumeric(),
    check("timeTaken").isNumeric()
  ],
  attemptControllers.createAttempt
);

// Get all attempts by user for a specific test
router.get(
  "/get/attempts/:userId/:testId",
  checkAuth("Student"),
  attemptControllers.getAttemptsByUserTest
);

// Get single attempt details
router.get(
  "/get/attempt/:attemptId",
  checkAuth("Student"),
  attemptControllers.getAttemptById
);

// Get statistics for a question
router.get(
  "/get/question/statistics/:questionId",
  attemptControllers.getQuestionStats
);

// Admin routes
// Get all attempts (Admin/SuperAdmin)
router.get(
  "/admin/get/all/attempts",
  checkAuth("Admin"),
  attemptControllers.getAllAttempts
);

// Update attempt (Admin - for marking/review)
router.patch(
  "/admin/update/attempt/:attemptId",
  checkAuth("Admin"),
  attemptControllers.updateAttemptById
);

// Delete attempt
router.delete(
  "/admin/delete/attempt/:attemptId",
  checkAuth("Admin"),
  attemptControllers.deleteAttemptById
);

// SuperAdmin routes
router.get(
  "/superadmin/get/all/attempts",
  checkAuth("SuperAdmin"),
  attemptControllers.getAllAttempts
);

router.patch(
  "/superadmin/update/attempt/:attemptId",
  checkAuth("SuperAdmin"),
  attemptControllers.updateAttemptById
);

router.delete(
  "/superadmin/delete/attempt/:attemptId",
  checkAuth("SuperAdmin"),
  attemptControllers.deleteAttemptById
);

module.exports = router;
