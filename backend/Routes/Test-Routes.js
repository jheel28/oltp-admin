const express = require("express");
const router = express.Router();
const testControllers = require("../Controllers/Test-Controllers");
const { check } = require("express-validator");
const checkAuth = require("../Middleware/check-auth");

router.get("/get/all/tests", testControllers.getAllTests);
router.get("/get/test/bytestid/:testId", testControllers.getTestByTestId);
router.get("/get/test/byid/:id", testControllers.getTestById);
router.post(
  "/create/test",
  checkAuth("Admin"),
  [
    check("batchName").isLength({ min: 1, max: 255 }),
    check("testId").isNumeric().isLength({ min: 1, max: 255 }),
    check("score").isLength({ min: 1, max: 255 }),
    check("course").isLength({ min: 1, max: 255 }),
    check("examName").isLength({ min: 1, max: 255 }),
    check("questionPaperId").isNumeric().isLength({ min: 1, max: 255 }),
  ],
  testControllers.createTest
);
router.patch(
  "/update/test/byid/:id",
  checkAuth("Admin"),
  testControllers.updateTestById
);
router.delete(
  "/delete/test/byid/:id",
  checkAuth("Admin"),
  testControllers.deleteTestById
);
router.post(
  "/create/test/superadmin",
  checkAuth("SuperAdmin"),
  [
    check("batchName").isLength({ min: 1, max: 255 }),
    check("testId").isNumeric().isLength({ min: 1, max: 255 }),
    check("score").isLength({ min: 1, max: 255 }),
    check("course").isLength({ min: 1, max: 255 }),
    check("examName").isLength({ min: 1, max: 255 }),
    check("questionPaperId").isNumeric().isLength({ min: 1, max: 255 }),
  ],
  testControllers.createTest
);
router.patch(
  "/update/test/superadmin/byid/:id",
  checkAuth("SuperAdmin"),
  testControllers.updateTestById
);
router.delete(
  "/delete/test/superadmin/byid/:id",
  checkAuth("SuperAdmin"),
  testControllers.deleteTestById
);
module.exports = router;
