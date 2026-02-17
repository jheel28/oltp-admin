// require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");
const cors = require("cors");
const superAdminRoutes = require("./Routes/SuperAdmin-Routes");
const adminRoutes = require("./Routes/Admin-Routes");
const studentRoutes = require("./Routes/Student-Routes");
const batchRoutes = require("./Routes/Batch-Routes");
const questionPaperRoutes = require("./Routes/QuestionPaper-Routes");
const testRoutes = require("./Routes/Test-Routes");
const scoreRoutes = require("./Routes/Score-Routes");
const queryRoutes = require("./Routes/Query-Routes");
const questionRoutes = require("./Routes/Question-Routes");
const path = require("path");
app.use(bodyParser.json());
app.use(cors());
app.use("/uploads/images", express.static(path.join("uploads", "images")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,DELETE,OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method == "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use("/api/beta/superadmin", superAdminRoutes);
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
  throw error;
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

mongoose
  .connect(process.env.MONGOURL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((err) => {
    console.log(err);
  });
