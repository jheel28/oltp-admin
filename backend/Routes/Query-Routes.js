const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const queryControllers = require("../Controllers/Query-Controllers");
const imageUpload = require("../Middleware/image-upload");

router.get("/get/all/queries", queryControllers.getAllQueries);
router.get("/get/query/byid/:id", queryControllers.getQueryById);
router.post(
  "/create/query",
  imageUpload.single("image"),
  [
    check("firstName").isLength({ min: 2, max: 255 }),
    check("lastName").isLength({ min: 2, max: 255 }),
    check("email").isEmail(),
    check("question").notEmpty(),
  ],
  queryControllers.createQuery
);

router.patch("/update/query/byid/:id", queryControllers.updateQueryById);

router.delete("/delete/query/byid/:id", queryControllers.deleteQuery);
module.exports = router;
