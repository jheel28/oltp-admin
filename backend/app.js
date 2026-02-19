require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoSanitize = require("express-mongo-sanitize");
const HttpError = require("./Middleware/http-error");
const adminRoutes = require("./Routes/Admin-Routes");
const studentRoutes = require("./Routes/Student-Routes");
const batchRoutes = require("./Routes/Batch-Routes");
const questionPaperRoutes = require("./Routes/QuestionPaper-Routes");
const testRoutes = require("./Routes/Test-Routes");
const scoreRoutes = require("./Routes/Score-Routes");
const queryRoutes = require("./Routes/Query-Routes");
const questionRoutes = require("./Routes/Question-Routes");
const path = require("path");

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: [
          "'self'",
          "data:",
          process.env.CORS_ORIGIN || "http://localhost:3000",
        ],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "https:", "'unsafe-inline'"],
      },
    },
  }),
);
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
app.use(mongoSanitize());
app.use(
  "/uploads/images",
  express.static(path.join(__dirname, "uploads", "images")),
);

app.use("/api/beta/admin", adminRoutes);
app.use("/api/beta/student", studentRoutes);
app.use("/api/beta/batch", batchRoutes);
app.use("/api/beta/questionpaper", questionPaperRoutes);
app.use("/api/beta/test", testRoutes);
app.use("/api/beta/score", scoreRoutes);
app.use("/api/beta/query", queryRoutes);
app.use("/api/beta/question", questionRoutes);

app.get("/", (req, res) => {
  return res.status(200).json({ message: "Hello World" });
});

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  return next(error);
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGOURL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
