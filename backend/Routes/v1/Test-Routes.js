const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const testControllers = require("../../Controllers/v1/Test-Controllers");
const checkAuth = require("../../Middleware/check-auth");

router.get("/get/all/tests", testControllers.getAllTests);
router.get("/get/test/bytestid/:testId", testControllers.getTestByTestId);
router.get("/get/test/byid/:id", testControllers.getTestById);

router.post(
  "/create/test",
  checkAuth("Admin"),
  [
    check("testId").isLength({ min: 1, max: 255 }),
    check("testName").isLength({ min: 1, max: 255 }),
    check("paperId").isLength({ min: 1, max: 255 }),
    check("batchName").optional({ nullable: true, checkFalsy: true }).isLength({ max: 255 }),
    check("date").custom((value, { req }) => {
      const isPerm = req.body.isPermanent === true || req.body.isPermanent === "true";
      if (!isPerm && !value) throw new Error("Date is required");
      return true;
    }),
    check("startTime").custom((value, { req }) => {
      const isPerm = req.body.isPermanent === true || req.body.isPermanent === "true";
      if (!isPerm && !value) throw new Error("Start time is required");
      return true;
    }),
    check("endTime").custom((value, { req }) => {
      const isPerm = req.body.isPermanent === true || req.body.isPermanent === "true";
      if (!isPerm && !value) throw new Error("End time is required");
      return true;
    }),
    check("duration").isNumeric(),
  ],
  testControllers.createTest
);

router.patch("/update/test/byid/:id", checkAuth("Admin"), testControllers.updateTestById);
router.delete("/delete/test/byid/:id", checkAuth("Admin"), testControllers.deleteTestById);

module.exports = router;