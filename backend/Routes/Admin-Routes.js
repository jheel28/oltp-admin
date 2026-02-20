const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const adminControllers = require("../Controllers/Admin-Controllers");
const imageUpload = require("../Middleware/image-upload");
const checkAuth = require("../Middleware/check-auth");
const { loginRateLimiter } = require("../Middleware/rate-limiter");

router.get("/get/all/admins",     checkAuth("Admin"), adminControllers.getAllAdmins);
router.get("/get/admin/byid/:id", checkAuth("Admin"), adminControllers.getAdminById);

router.post(
  "/create/admin",
  imageUpload.fields([{ name: "image", maxCount: 1 }]),
  [
    check("firstName").trim().isLength({ min: 2, max: 255 }),
    check("lastName").trim().isLength({ min: 2, max: 255 }),
    check("mobile").trim().isNumeric().isLength({ min: 10, max: 10 }),
    check("email").trim().normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  adminControllers.createAdmin,
);

router.post("/login", loginRateLimiter, adminControllers.login);

router.patch(
  "/update/admin/byid/:id",
  checkAuth("Admin"),
  imageUpload.fields([{ name: "image", maxCount: 1 }]),
  [
    check("firstName").optional().trim().isLength({ min: 2, max: 255 }),
    check("lastName").optional().trim().isLength({ min: 2, max: 255 }),
    check("mobile").optional().trim().isNumeric().isLength({ min: 10, max: 10 }),
    check("email").optional().trim().normalizeEmail().isEmail(),
  ],
  adminControllers.updateAdminById,
);

router.patch(
  "/update/image/byid/:id",
  checkAuth("Admin"),
  imageUpload.single("image"),
  adminControllers.updateImageById,
);

router.patch(
  "/update/password/byemail/:email",
  checkAuth("Admin"),
  [
    check("password").notEmpty().withMessage("Current password is required"),
    check("newPassword").isLength({ min: 6 }).withMessage("New password must be at least 6 characters"),
  ],
  adminControllers.updatePasswordByEmail,
);

router.delete(
  "/delete/admin/byid/:id",
  checkAuth("Admin"),
  adminControllers.deleteAdmin,
);

module.exports = router;