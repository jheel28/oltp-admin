const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const adminControllers = require("../Controllers/Admin-Controllers");
const imageUpload = require("../Middleware/image-upload");
const checkAuth = require("../Middleware/check-auth");

router.get("/get/all/admins", adminControllers.getAllAdmins);
router.get("/get/admin/byid/:id", adminControllers.getAdminById);
router.post(
  "/create/admin",
  checkAuth("SuperAdmin"),
  imageUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "universityLogo", maxCount: 1 },
  ]),
  [
    check("firstName").isLength({ min: 2, max: 255 }),
    check("lastName").isLength({ min: 2, max: 255 }),
    check("mobile").isNumeric().isLength({ min: 10, max: 10 }),
    check("email").isEmail(),
    check("password").isLength({ min: 6 }),
    check("universityName").isLength({ min: 2, max: 255 }),
    check("address").isLength({ min: 2, max: 255 }),
    check("landmark").isLength({ min: 2, max: 255 }),
    check("pincode").isNumeric().isLength({ min: 6, max: 6 }),
    check("state").isLength({ min: 2, max: 255 }),
    check("country").isLength({ min: 2, max: 255 }),
    check("dateOfEstablishment").notEmpty(),
  ],
  adminControllers.createAdmin
);
router.post("/login", adminControllers.login);
router.patch(
  "/update/admin/byid/:id",
  checkAuth("Admin"),

  imageUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "universityLogo", maxCount: 1 },
  ]),
  adminControllers.updateAdminById
);
router.patch(
  "/update/admin/superadmin/byid/:id",
  checkAuth("SuperAdmin"),

  imageUpload.fields([
    { name: "image", maxCount: 1 },
    { name: "universityLogo", maxCount: 1 },
  ]),
  adminControllers.updateAdminById
);
router.patch(
  "/update/password/byemail/:email",
  checkAuth("Admin"),
  adminControllers.forgotPassword
);
router.patch(
  "/update/image/byid/:id",
  checkAuth("Admin"),
  imageUpload.single("image"),
  adminControllers.updateImageById
);
router.delete(
  "/delete/admin/byid/:id",
  checkAuth("SuperAdmin"),
  adminControllers.deleteAdmin
);
module.exports = router;

