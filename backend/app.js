require("dotenv").config();
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
const dashboardRoutes = require("./Routes/Dashboard-Routes");
const path = require("path");
app.use(bodyParser.json());
app.use(cors());
app.use("/uploads/images", express.static(path.join("uploads", "images")));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET",
    "POST",
    "PATCH",
    "DELETE",
    "OPTIONS"
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
app.use("/api/beta/dashboard", dashboardRoutes);
app.get("/", (req, res) => {
  return res.status(200).json({ message: "Hello World" });
});
// mongoose
//   .connect(
//     `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.rw3waqy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`
//   )
//   .then(app.listen(3000))
//   .catch((err) => {
//     console.log(err);
//   });

const PORT = process.env.PORT || 5005;

mongoose
  .connect("mongodb://127.0.0.1:27017/testseries")
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use. Please run 'npm run cleanup' or kill the process manually.`);
      } else {
        console.error("Server error:", err);
      }
    });
  })
  .catch((err) => {
    console.log(err);
  });

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

