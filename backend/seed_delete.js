require("dotenv").config();
const mongoose = require("mongoose");

const Student = require("./Models/Student");
const Batch = require("./Models/Batch");
const Category = require("./Models/Category");
const QuestionPaper = require("./Models/QuestionPaper");
const Question = require("./Models/Question");
const Test = require("./Models/Test");
const Score = require("./Models/Score");

async function wipe() {
  try {
    await mongoose.connect("mongodb+srv://vardhanallapuram1_db_user:qd57WQbvTgkNPAkw@correct.poxthp4.mongodb.net/testseries?appName=correct");
    console.log("Connected to MongoDB. Starting wipe...");

    // Delete sequentially without a transaction session
    await Student.deleteMany({});
    await Batch.deleteMany({});
    await Category.deleteMany({});
    await QuestionPaper.deleteMany({});
    await Question.deleteMany({});
    await Test.deleteMany({});
    await Score.deleteMany({});

    console.log("✅ All non-admin data deleted successfully.");
  } catch (err) {
    console.error("❌ Wipe failed:", err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

wipe();