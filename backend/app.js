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
const path = require("path");

const HttpError = require("./Middleware/http-error");
const adminRoutes = require("./Routes/v1/Admin-Routes");
const studentRoutes = require("./Routes/v1/Student-Routes");
const batchRoutes = require("./Routes/v1/Batch-Routes");
const questionPaperRoutes = require("./Routes/v1/QuestionPaper-Routes");
const testRoutes = require("./Routes/v1/Test-Routes");
const scoreRoutes = require("./Routes/v1/Score-Routes");
const questionRoutes = require("./Routes/v1/Question-Routes");
const categoryRoutes = require("./Routes/v1/Category-Routes");

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
app.use(bodyParser.json({ limit: "2mb" }));
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

app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/student", studentRoutes);
app.use("/api/v1/batch", batchRoutes);
app.use("/api/v1/questionpaper", questionPaperRoutes);
app.use("/api/v1/test", testRoutes);
app.use("/api/v1/score", scoreRoutes);
app.use("/api/v1/question", questionRoutes);
app.use("/api/v1/category", categoryRoutes);

app.get("/", (req, res) => {
  return res.status(200).json({ message: "API running" });
});

app.use((req, res, next) => {
  return next(new HttpError("Route not found", 404));
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Failed to delete orphaned file:", err);
    });
  }

  if (req.files) {
    Object.values(req.files)
      .flat()
      .forEach((f) => {
        fs.unlink(f.path, (err) => {
          if (err) console.error("Failed to delete orphaned file:", err);
        });
      });
  }

  if (res.headersSent) {
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
    console.error("MongoDB Connection Error:", err);
  });
