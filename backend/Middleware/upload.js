const multer = require("multer");
const path = require("path");
const fs = require("fs");

const ALLOWED_ANSWER_KEY_MIMETYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

const MAX_ANSWER_KEY_SIZE = 10 * 1024 * 1024; 

const answerKeyStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(__dirname, "../uploads/answer-keys");
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname).toLowerCase());
  },
});

const answerKeyFilter = (req, file, cb) => {
  if (ALLOWED_ANSWER_KEY_MIMETYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Answer key must be a PDF or image file (JPEG, PNG, GIF, WEBP)"));
  }
};

const answerKeyUpload = multer({
  storage: answerKeyStorage,
  limits: { fileSize: MAX_ANSWER_KEY_SIZE },
  fileFilter: answerKeyFilter,
});

module.exports = { answerKeyUpload };