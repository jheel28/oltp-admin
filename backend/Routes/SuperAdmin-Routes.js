const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const superAdminControllers = require("../Controllers/SuperAdmin-Controllers");
const imageUpload = require("../Middleware/image-upload");
const checkAuth = require("../Middleware/check-auth");

router.get("/get/all/superadmins", superAdminControllers.getAllSuperAdmins);
router.get(
  "/get/superadmin/byemail/:email",
  superAdminControllers.getAdminByEmail
);
router.get("/get/superadmin/byid/:id", superAdminControllers.getAdminById);
router.post("/login", superAdminControllers.login);
router.post(
  "/create/superadmin",
  imageUpload.single("image"),
  [
    check("firstName").isLength({ min: 1, max: 255 }),
    check("lastName").isLength({ min: 1, max: 255 }),
    check("email").isEmail(),
    check("password").isLength({ min: 6 }),
    check("mobile").isNumeric().isLength({ min: 1, max: 10 }),
  ],
  superAdminControllers.createSuperAdmin
);
router.patch(
  "/update/password/byemail/:email",
  checkAuth("SuperAdmin"),
  superAdminControllers.forgotPassword
);
router.patch(
  "/update/superadmin/byid/:id",
  imageUpload.single("image"),
  checkAuth("SuperAdmin"),
  superAdminControllers.updateSuperAdminById
);
router.patch(
  "/update/image/byid/:id",
  imageUpload.single("image"),
  checkAuth("SuperAdmin"),
  superAdminControllers.updateImageById
);
router.delete(
  "/delete/superadmin/byid/:id",
  checkAuth("SuperAdmin"),
  superAdminControllers.deleteSuperAdmin
);

module.exports = router;
