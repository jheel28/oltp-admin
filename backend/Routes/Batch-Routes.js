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
    check("batchName").isLength({ min: 2, max: 255 }),
    check("sectionName").isLength({ min: 2, max: 255 }),
    check("studentId").isLength({ min: 2, max: 255 }),
  ],
  batchControllers.createBatch
);
router.patch(
  "/update/batch/byid/:id",
  checkAuth("Admin"),
  batchControllers.updateBatchById
);
router.delete(
  "/delete/batch/byid/:id",
  checkAuth("Admin"),
  batchControllers.deleteBatchById
);
module.exports = router;
