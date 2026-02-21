const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const ctrl = require("../Controllers/QuestionPaper-Controllers");
const checkAuth = require("../Middleware/check-auth");

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
  [
    check("paperId").isLength({ min: 1, max: 255 }),
    check("paperName").isLength({ min: 1, max: 255 }),
    check("category").isLength({ min: 1, max: 255 }),
  ],
  ctrl.createQuestionPaper,
);

router.patch(
  "/update/questionpaper/byid/:id",
  checkAuth("Admin"),
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
