const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const batchControllers = require("../Controllers/Batch-Controllers");
const checkAuth = require("../Middleware/check-auth");

router.get("/get/all/batches", batchControllers.getAllBatches);
router.post(
  "/create/batch",
  checkAuth("Admin"),
  [
    check("batchName")
      .trim()
      .notEmpty()
      .withMessage("Batch name is required")
      .isLength({ min: 2, max: 255 })
      .withMessage("Batch name must be between 2 and 255 characters"),
  ],
  batchControllers.createBatch,
);
router.patch(
  "/update/batch/byid/:id",
  checkAuth("Admin"),
  [
    check("batchName")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Batch name cannot be empty")
      .isLength({ min: 2, max: 255 })
      .withMessage("Batch name must be between 2 and 255 characters"),
  ],
  batchControllers.updateBatchById,
);
router.delete(
  "/delete/batch/byid/:id",
  checkAuth("Admin"),
  batchControllers.deleteBatchById,
);

module.exports = router;
