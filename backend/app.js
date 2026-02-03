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
const attemptRoutes = require("./Routes/Attempt-Routes");
const questionAPIRoutes = require("./Routes/QuestionAPI-Routes");
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
app.use("/api/beta/attempt", attemptRoutes);
app.use("/api", questionAPIRoutes);

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

mongoose
  .connect("mongodb://127.0.0.1:27017/testseries")
  .then(() => {
    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  })
  .catch((err) => {
    console.log(err);
  });

