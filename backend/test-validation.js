const { check, validationResult } = require("express-validator");
const express = require("express");
const multer = require("multer");
const upload = multer();

const app = express();

const phoneValidation = (field, { required = true } = {}) => {
    const chain = check(field).trim();
    if (required) {
        return chain
            .notEmpty()
            .withMessage(`${field} is required`)
            .matches(/^\+[1-9]\d{6,14}$/)
            .withMessage(
                `${field} must be in international format (e.g. +919876543210)`,
            );
    }
    return chain
        .optional({ nullable: true, checkFalsy: true })
        .matches(/^\+[1-9]\d{6,14}$/)
        .withMessage(
            `${field} must be in international format (e.g. +919876543210)`,
        );
};

const studentValidation = [
    check("firstName").trim().isLength({ min: 1, max: 255 }),
    check("lastName").trim().isLength({ min: 1, max: 255 }),
    phoneValidation("phoneNumber", { required: true }),
    phoneValidation("alternateNumber", { required: false }),
    check("email").trim().normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
    check("studentId").trim().isLength({ min: 1, max: 255 }),
    check("admissionDate").trim().isLength({ min: 1, max: 255 }),
    check("address").trim().isLength({ min: 2, max: 255 }),
    check("pincode").trim().isNumeric().isLength({ min: 4, max: 10 }),
    check("state").trim().isLength({ min: 2, max: 255 }),
    check("country").trim().isLength({ min: 2, max: 255 }),
    check("fatherName")
        .optional({ nullable: true, checkFalsy: true })
        .trim()
        .isLength({ max: 255 }),
    check("motherName")
        .optional({ nullable: true, checkFalsy: true })
        .trim()
        .isLength({ max: 255 }),
];

app.post("/test", upload.none(), studentValidation, (req, res) => {
    const errors = validationResult(req);
    res.json({ body: req.body, errors: errors.array() });
});

app.listen(8888, () => console.log("Server listening on 8888"));
