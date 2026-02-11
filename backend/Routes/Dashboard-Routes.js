const express = require("express");
const router = express.Router();
const dashboardControllers = require("../Controllers/Dashboard-Controllers");
const checkAuth = require("../Middleware/check-auth");

// Currently open for initial testing, but should be protected by checkAuth in production
router.get("/superadmin", dashboardControllers.getSuperAdminStats);
router.get("/admin", dashboardControllers.getAdminStats);

module.exports = router;
