const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const categoryControllers = require("../../Controllers/v1/Category-Controllers");
const checkAuth = require("../../Middleware/check-auth");

router.get("/get/all", categoryControllers.getAllCategories);
router.get("/get/:id", categoryControllers.getCategoryById);

router.post(
  "/create",
  checkAuth("Admin"),
  [check("name").trim().isLength({ min: 1, max: 100 })],
  categoryControllers.createCategory
);

router.patch(
  "/update/:id",
  checkAuth("Admin"),
  categoryControllers.updateCategoryById
);

router.patch(
  "/add-subject/:id",
  checkAuth("Admin"),
  categoryControllers.addSubjectToCategory
);

router.delete(
  "/remove-subject/:id/:subject",
  checkAuth("Admin"),
  categoryControllers.removeSubjectFromCategory
);

router.delete(
  "/delete/:id",
  checkAuth("Admin"),
  categoryControllers.deleteCategoryById
);

module.exports = router;