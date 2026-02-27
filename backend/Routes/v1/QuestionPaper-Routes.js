const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const ctrl = require("../../Controllers/v1/QuestionPaper-Controllers");
const checkAuth = require("../../Middleware/check-auth");
const { answerKeyUpload } = require("../../Middleware/upload");

router.get("/get/all/questionpapers", ctrl.getAllQuestionPapers);
router.get("/get/questionpaper/byid/:id", ctrl.getQuestionPaperById);
router.get(
  "/get/questionpaper/bypaperid/:paperId",
  ctrl.getQuestionPaperByPaperId,
);
router.get("/get/questionpaper/summary/:paperId", ctrl.getQuestionPaperSummary);

router.post(
  "/create/questionpaper",
  checkAuth("Admin"),
  answerKeyUpload.single("answerKeyFile"),
  [
    check("paperId")
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage("Paper ID is required and must be at most 255 characters"),
    check("category")
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage("Category is required"),
  ],
  ctrl.createQuestionPaper,
);

router.patch(
  "/update/questionpaper/byid/:id",
  checkAuth("Admin"),
  answerKeyUpload.single("answerKeyFile"),
  ctrl.updateQuestionPaperById,
);

router.patch(
  "/sync/questionpaper/totals/:id",
  checkAuth("Admin"),
  ctrl.syncPaperTotals,
);

router.delete(
  "/delete/questionpaper/byid/:id",
  checkAuth("Admin"),
  ctrl.deleteQuestionPaperById,
);

module.exports = router;
