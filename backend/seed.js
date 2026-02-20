require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGO_URL =
  process.env.MONGOURL ||
  "mongodb+srv://vardhanallapuram1_db_user:qd57WQbvTgkNPAkw@correct.poxthp4.mongodb.net/testseries?appName=correct";

const adminSchema = new mongoose.Schema({
  firstName: String, lastName: String, mobile: Number,
  email: { type: String, unique: true }, password: String,
  image: String, role: String,
});
const studentSchema = new mongoose.Schema({
  firstName: String, lastName: String, fatherName: String, motherName: String,
  phoneNumber: String, alternateNumber: String, role: String, image: String,
  email: { type: String, unique: true }, password: String, studentId: String,
  admissionDate: String, batch: String, address: String, pincode: String,
  state: String, country: String,
});
const batchSchema = new mongoose.Schema({ batchName: { type: String, unique: true } });
const categorySchema = new mongoose.Schema({
  name: { type: String, unique: true, trim: true },
  subjects: [String], description: String, createdAt: { type: Date, default: Date.now },
});
const questionPaperSchema = new mongoose.Schema({
  questionPaperId: { type: String, unique: true }, score: Number,
  noOfQuestions: Number, category: String, difficulty: String,
  subjects: [String], keySheet: String,
});
const optionSchema = new mongoose.Schema({ text: String, image: String });
const questionSchema = new mongoose.Schema({
  questionPaperId: String, text: String, questionImage: String,
  options: [optionSchema], correctOption: mongoose.Schema.Types.Mixed,
  marks: Number, difficulty: String, topic: String,
  type: { type: String, enum: ["MCQ", "Numerical"], default: "MCQ" },
});
const testSchema = new mongoose.Schema({
  batchName: String, testId: { type: String, unique: true }, score: String, course: String,
  examName: String, date: String, startTime: String, endTime: String,
  questionPaperId: String, subjects: String, difficulty: String, duration: Number,
});
const scoreQuestionSchema = new mongoose.Schema({
  questionId: String, correctAnswer: String, chosenAnswer: String,
});
const scoreSchema = new mongoose.Schema({
  testId: String, studentId: String, questionPaperId: String,
  marks: Number, maxscore: Number, questions: [scoreQuestionSchema],
});

const Admin         = mongoose.models.Admin         || mongoose.model("Admin",         adminSchema);
const Student       = mongoose.models.Student       || mongoose.model("Student",       studentSchema);
const Batch         = mongoose.models.Batch         || mongoose.model("Batch",         batchSchema);
const Category      = mongoose.models.Category      || mongoose.model("Category",      categorySchema);
const QuestionPaper = mongoose.models.QuestionPaper || mongoose.model("QuestionPaper", questionPaperSchema);
const Question      = mongoose.models.Question      || mongoose.model("Question",      questionSchema);
const Test          = mongoose.models.Test          || mongoose.model("Test",          testSchema);
const Score         = mongoose.models.Score         || mongoose.model("Score",         scoreSchema);

const BATCH_NAMES = [
  "Dronacharya - 2024",
  "Chanakya - 2024",
  "Aryabhatta - 2025",
  "Ramanujan - 2025",
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function weightedCorrect(total, accuracy) {
  let count = 0;
  for (let i = 0; i < total; i++) {
    if (Math.random() < accuracy) count++;
  }
  return count;
}

function pickWrong(options, correct) {
  const wrong = options.filter(o => o.text !== correct);
  if (wrong.length > 0) return wrong[Math.floor(Math.random() * wrong.length)].text;
  return options.find(o => o.text !== correct)?.text ?? options[0].text;
}

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to MongoDB\n");

  const existingAdmins = await Admin.find({}, "-password");
  console.log(`=== Existing Admins (${existingAdmins.length}) ===`);
  existingAdmins.forEach((a) => {
    console.log(`  ID     : ${a._id}`);
    console.log(`  Name   : ${a.firstName} ${a.lastName}`);
    console.log(`  Email  : ${a.email}`);
    console.log(`  Mobile : ${a.mobile}`);
    console.log("  ---");
  });

  const existingStudentsSnapshot = await Student.find({});
  console.log(`\n=== Existing Students (${existingStudentsSnapshot.length}) — snapshotted before wipe ===`);
  existingStudentsSnapshot.forEach((s, i) => {
    const newBatch = BATCH_NAMES[i % BATCH_NAMES.length];
    console.log(`  [${s.studentId || "no-id"}] ${s.firstName} ${s.lastName}`);
    console.log(`    Email     : ${s.email}`);
    console.log(`    Old Batch : ${s.batch || "(none)"}`);
    console.log(`    New Batch : ${newBatch}`);
    console.log("  ---");
  });

  console.log("\n=== Wiping all collections ===");
  await Student.deleteMany({});
  await Batch.deleteMany({});
  await Category.deleteMany({});
  await QuestionPaper.deleteMany({});
  await Question.deleteMany({});
  await Test.deleteMany({});
  await Score.deleteMany({});
  console.log("Wiped: Student, Batch, Category, QuestionPaper, Question, Test, Score\n");

  const DEFAULT_PASSWORD = "Student@123";
  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 12);

  const accuracyMap = {};
  const EXISTING_ACCURACIES = [0.72, 0.58, 0.84, 0.46, 0.67, 0.79, 0.53, 0.91, 0.38, 0.70];

  const reinsertDocs = existingStudentsSnapshot.map((s, i) => {
    const newBatch = BATCH_NAMES[i % BATCH_NAMES.length];
    const accuracy = EXISTING_ACCURACIES[i % EXISTING_ACCURACIES.length];
    accuracyMap[s.email] = accuracy;
    return {
      firstName:       s.firstName,
      lastName:        s.lastName,
      fatherName:      s.fatherName || "",
      motherName:      s.motherName || "",
      phoneNumber:     s.phoneNumber,
      alternateNumber: s.alternateNumber,
      role:            s.role || "Student",
      image:           s.image || "uploads/images/default.jpg",
      email:           s.email,
      password:        s.password,
      studentId:       s.studentId || `EXIST-${i + 1}`,
      admissionDate:   s.admissionDate || "2024-01-01",
      batch:           newBatch,
      address:         s.address || "N/A",
      pincode:         s.pincode || "000000",
      state:           s.state || "N/A",
      country:         s.country || "India",
    };
  });

  const reinsertedStudents = reinsertDocs.length > 0
    ? await Student.insertMany(reinsertDocs)
    : [];

  if (reinsertedStudents.length > 0) {
    console.log(`Re-inserted ${reinsertedStudents.length} existing students with new batches (passwords unchanged):`);
    reinsertedStudents.forEach((s) => {
      console.log(`  [${s.studentId}] ${s.firstName} ${s.lastName.padEnd(14)} → ${s.batch.padEnd(22)} accuracy: ${(accuracyMap[s.email] * 100).toFixed(0)}%`);
    });
    console.log();
  }

  const seededStudentData = [
    { firstName: "Arjun",   lastName: "Mehta",      fatherName: "Rajesh Mehta",      motherName: "Sunita Mehta",      phoneNumber: "9876543210", alternateNumber: "9123456780", studentId: "TCS-2024-001", admissionDate: "2024-06-01", batch: "Dronacharya - 2024", address: "12 Nehru Nagar, Sector 5",        pincode: "302001", state: "Rajasthan",     country: "India", email: "arjun.mehta@student.tcs.com",        accuracy: 0.82 },
    { firstName: "Priya",   lastName: "Sharma",     fatherName: "Vikram Sharma",     motherName: "Anita Sharma",      phoneNumber: "9812345670", alternateNumber: "9012345670", studentId: "TCS-2024-002", admissionDate: "2024-06-01", batch: "Dronacharya - 2024", address: "45 Gandhi Road, Civil Lines",     pincode: "302006", state: "Rajasthan",     country: "India", email: "priya.sharma@student.tcs.com",       accuracy: 0.75 },
    { firstName: "Nathan",  lastName: "Brooks",     fatherName: "David Brooks",      motherName: "Linda Brooks",      phoneNumber: "9988001122", alternateNumber: "9877001122", studentId: "TCS-2024-003", admissionDate: "2024-06-10", batch: "Dronacharya - 2024", address: "88 MG Road, Fraser Town",         pincode: "560005", state: "Karnataka",     country: "India", email: "nathan.brooks@student.tcs.com",      accuracy: 0.60 },
    { firstName: "Ishaan",  lastName: "Kapoor",     fatherName: "Rohit Kapoor",      motherName: "Deepa Kapoor",      phoneNumber: "9966332211", alternateNumber: "9866332211", studentId: "TCS-2024-004", admissionDate: "2024-06-10", batch: "Dronacharya - 2024", address: "5 Rajouri Garden, Block C",       pincode: "110027", state: "Delhi",         country: "India", email: "ishaan.kapoor@student.tcs.com",      accuracy: 0.45 },
    { firstName: "Asel",    lastName: "Nurlanovna", fatherName: "Nurlan Asel",       motherName: "Aigul Nurlanovna",  phoneNumber: "9911887766", alternateNumber: "9811887766", studentId: "TCS-2024-005", admissionDate: "2024-07-01", batch: "Dronacharya - 2024", address: "22 Sector 18, Noida",             pincode: "201301", state: "Uttar Pradesh", country: "India", email: "asel.nurlanovna@student.tcs.com",    accuracy: 0.70 },
    { firstName: "Vikram",  lastName: "Rajan",      fatherName: "Suresh Rajan",      motherName: "Usha Rajan",        phoneNumber: "9900554433", alternateNumber: "9800554433", studentId: "TCS-2024-006", admissionDate: "2024-07-01", batch: "Dronacharya - 2024", address: "67 Anna Nagar, 3rd Street",       pincode: "600040", state: "Tamil Nadu",    country: "India", email: "vikram.rajan@student.tcs.com",       accuracy: 0.55 },
    { firstName: "Sneha",   lastName: "Patel",      fatherName: "Bhavesh Patel",     motherName: "Rekha Patel",       phoneNumber: "9765432109", alternateNumber: "9865432100", studentId: "TCS-2024-007", admissionDate: "2024-06-15", batch: "Chanakya - 2024",    address: "22 Satellite Road, Bodakdev",    pincode: "380054", state: "Gujarat",       country: "India", email: "sneha.patel@student.tcs.com",        accuracy: 0.88 },
    { firstName: "Karan",   lastName: "Singh",      fatherName: "Gurpreet Singh",    motherName: "Harpreet Kaur",     phoneNumber: "9855667788", alternateNumber: "9755667788", studentId: "TCS-2024-008", admissionDate: "2024-07-01", batch: "Chanakya - 2024",    address: "33 Model Town, Phase 2",         pincode: "141002", state: "Punjab",        country: "India", email: "karan.singh@student.tcs.com",        accuracy: 0.65 },
    { firstName: "Ananya",  lastName: "Reddy",      fatherName: "Venkat Reddy",      motherName: "Padma Reddy",       phoneNumber: "9966778899", alternateNumber: "9866778899", studentId: "TCS-2024-009", admissionDate: "2024-07-01", batch: "Chanakya - 2024",    address: "56 Jubilee Hills, Road No. 10",  pincode: "500033", state: "Telangana",     country: "India", email: "ananya.reddy@student.tcs.com",       accuracy: 0.79 },
    { firstName: "Luca",    lastName: "Rossi",      fatherName: "Marco Rossi",       motherName: "Giulia Rossi",      phoneNumber: "9844223311", alternateNumber: "9744223311", studentId: "TCS-2024-010", admissionDate: "2024-07-15", batch: "Chanakya - 2024",    address: "14 Bandra West, Turner Road",    pincode: "400050", state: "Maharashtra",   country: "India", email: "luca.rossi@student.tcs.com",         accuracy: 0.50 },
    { firstName: "Meera",   lastName: "Iyer",       fatherName: "Krishnan Iyer",     motherName: "Lalitha Iyer",      phoneNumber: "9833445566", alternateNumber: "9733445566", studentId: "TCS-2024-011", admissionDate: "2024-07-15", batch: "Chanakya - 2024",    address: "9 T Nagar, Pondy Bazaar",        pincode: "600017", state: "Tamil Nadu",    country: "India", email: "meera.iyer@student.tcs.com",         accuracy: 0.83 },
    { firstName: "Omar",    lastName: "Hassan",     fatherName: "Hassan Al-Amin",    motherName: "Fatima Hassan",     phoneNumber: "9822334455", alternateNumber: "9722334455", studentId: "TCS-2024-012", admissionDate: "2024-08-01", batch: "Chanakya - 2024",    address: "41 Frazer Town, Mosque Road",    pincode: "560005", state: "Karnataka",     country: "India", email: "omar.hassan@student.tcs.com",        accuracy: 0.42 },
    { firstName: "Mihail",  lastName: "Popescu",    fatherName: "Ion Popescu",       motherName: "Elena Popescu",     phoneNumber: "9944556677", alternateNumber: "9844556677", studentId: "TCS-2025-001", admissionDate: "2025-01-10", batch: "Aryabhatta - 2025",  address: "14 Indiranagar, 100 Feet Road",   pincode: "560038", state: "Karnataka",     country: "India", email: "mihail.popescu@student.tcs.com",     accuracy: 0.68 },
    { firstName: "Sara",    lastName: "Ahmed",      fatherName: "Khalid Ahmed",      motherName: "Fatima Ahmed",      phoneNumber: "9933445566", alternateNumber: "9833445566", studentId: "TCS-2025-002", admissionDate: "2025-01-10", batch: "Aryabhatta - 2025",  address: "88 Banjara Hills, Road No. 3",   pincode: "500034", state: "Telangana",     country: "India", email: "sara.ahmed@student.tcs.com",         accuracy: 0.76 },
    { firstName: "Rohan",   lastName: "Verma",      fatherName: "Suresh Verma",      motherName: "Kavita Verma",      phoneNumber: "9988776655", alternateNumber: "9988776644", studentId: "TCS-2025-003", admissionDate: "2025-01-20", batch: "Aryabhatta - 2025",  address: "7 Shyam Nagar, Vaishali",        pincode: "201010", state: "Uttar Pradesh", country: "India", email: "rohan.verma@student.tcs.com",        accuracy: 0.57 },
    { firstName: "Yuna",    lastName: "Kim",        fatherName: "Jinwoo Kim",        motherName: "Sooyeon Kim",       phoneNumber: "9922667788", alternateNumber: "9822667788", studentId: "TCS-2025-004", admissionDate: "2025-01-20", batch: "Aryabhatta - 2025",  address: "3 Koregaon Park, Lane 4",        pincode: "411001", state: "Maharashtra",   country: "India", email: "yuna.kim@student.tcs.com",           accuracy: 0.90 },
    { firstName: "Aditi",   lastName: "Bose",       fatherName: "Subrata Bose",      motherName: "Chitralekha Bose",  phoneNumber: "9911334455", alternateNumber: "9811334455", studentId: "TCS-2025-005", admissionDate: "2025-02-01", batch: "Aryabhatta - 2025",  address: "19 Lake Gardens, Block B",       pincode: "700045", state: "West Bengal",   country: "India", email: "aditi.bose@student.tcs.com",         accuracy: 0.72 },
    { firstName: "Samuel",  lastName: "Osei",       fatherName: "Kwame Osei",        motherName: "Abena Osei",        phoneNumber: "9900887766", alternateNumber: "9800887766", studentId: "TCS-2025-006", admissionDate: "2025-02-01", batch: "Aryabhatta - 2025",  address: "62 Whitefield, ITPL Road",       pincode: "560066", state: "Karnataka",     country: "India", email: "samuel.osei@student.tcs.com",        accuracy: 0.38 },
    { firstName: "Divya",   lastName: "Nair",       fatherName: "Suresh Nair",       motherName: "Latha Nair",        phoneNumber: "9911223344", alternateNumber: "9811223344", studentId: "TCS-2025-007", admissionDate: "2025-01-20", batch: "Ramanujan - 2025",   address: "3 Palarivattom, NH Bypass",      pincode: "682025", state: "Kerala",        country: "India", email: "divya.nair@student.tcs.com",         accuracy: 0.85 },
    { firstName: "Ethan",   lastName: "Clarke",     fatherName: "James Clarke",      motherName: "Susan Clarke",      phoneNumber: "9900112233", alternateNumber: "9800112233", studentId: "TCS-2025-008", admissionDate: "2025-02-01", batch: "Ramanujan - 2025",   address: "19 Powai, Hiranandani Gardens",  pincode: "400076", state: "Maharashtra",   country: "India", email: "ethan.clarke@student.tcs.com",       accuracy: 0.62 },
    { firstName: "Tanvi",   lastName: "Joshi",      fatherName: "Pramod Joshi",      motherName: "Meena Joshi",       phoneNumber: "9887766554", alternateNumber: "9787766554", studentId: "TCS-2025-009", admissionDate: "2025-02-01", batch: "Ramanujan - 2025",   address: "28 Sadashiv Peth, Tilak Road",   pincode: "411030", state: "Maharashtra",   country: "India", email: "tanvi.joshi@student.tcs.com",        accuracy: 0.78 },
    { firstName: "Lucas",   lastName: "Fernandez",  fatherName: "Carlos Fernandez",  motherName: "Maria Fernandez",   phoneNumber: "9876001122", alternateNumber: "9776001122", studentId: "TCS-2025-010", admissionDate: "2025-02-10", batch: "Ramanujan - 2025",   address: "11 Jubilee Hills, Road No. 5",   pincode: "500033", state: "Telangana",     country: "India", email: "lucas.fernandez@student.tcs.com",    accuracy: 0.47 },
    { firstName: "Ayaan",   lastName: "Khan",       fatherName: "Imran Khan",        motherName: "Nadia Khan",        phoneNumber: "9865443322", alternateNumber: "9765443322", studentId: "TCS-2025-011", admissionDate: "2025-02-10", batch: "Ramanujan - 2025",   address: "34 Aminabad, Hazratganj",        pincode: "226001", state: "Uttar Pradesh", country: "India", email: "ayaan.khan@student.tcs.com",         accuracy: 0.66 },
    { firstName: "Elena",   lastName: "Vasquez",    fatherName: "Miguel Vasquez",    motherName: "Carmen Vasquez",    phoneNumber: "9854332211", alternateNumber: "9754332211", studentId: "TCS-2025-012", admissionDate: "2025-02-15", batch: "Ramanujan - 2025",   address: "7 Kalyani Nagar, Airport Road",  pincode: "411006", state: "Maharashtra",   country: "India", email: "elena.vasquez@student.tcs.com",      accuracy: 0.53 },
  ];

  const seededStudents = await Student.insertMany(
    seededStudentData.map(({ accuracy, ...rest }) => {
      accuracyMap[rest.email] = accuracy;
      return { ...rest, password: hashedPassword, role: "Student", image: "uploads/images/default.jpg" };
    })
  );

  console.log(`Inserted ${seededStudents.length} seeded students (default password: ${DEFAULT_PASSWORD}):`);
  seededStudents.forEach((s) => {
    const acc = accuracyMap[s.email];
    const tier = acc >= 0.80 ? "High" : acc >= 0.60 ? "Mid" : "Low";
    console.log(`  [${s.studentId}] ${s.firstName} ${s.lastName.padEnd(12)} → ${s.batch.padEnd(22)} ${(acc * 100).toFixed(0)}% (${tier})`);
  });

  await Batch.insertMany([
    { batchName: "Dronacharya - 2024" },
    { batchName: "Chanakya - 2024" },
    { batchName: "Aryabhatta - 2025" },
    { batchName: "Ramanujan - 2025" },
  ]);
  console.log("\nInserted 4 batches");

  await Category.insertMany([
    { name: "JEE Main",     subjects: ["Physics", "Chemistry", "Mathematics"], description: "Joint Entrance Examination - Main level preparation" },
    { name: "JEE Advanced", subjects: ["Physics", "Chemistry", "Mathematics"], description: "Joint Entrance Examination - Advanced level preparation" },
    { name: "NEET",         subjects: ["Physics", "Chemistry", "Biology"],     description: "National Eligibility cum Entrance Test preparation" },
    { name: "Foundation",   subjects: ["Physics", "Chemistry", "Mathematics", "Biology"], description: "Foundation course for class 9th and 10th students" },
  ]);
  console.log("Inserted 4 categories");

  await QuestionPaper.insertMany([
    { questionPaperId: "QP-JEE-001",    score: 300, noOfQuestions: 75,  category: "JEE Main",     difficulty: "Easy",   subjects: ["Physics", "Chemistry", "Mathematics"] },
    { questionPaperId: "QP-JEE-002",    score: 300, noOfQuestions: 75,  category: "JEE Main",     difficulty: "Medium", subjects: ["Physics", "Chemistry", "Mathematics"] },
    { questionPaperId: "QP-JEE-003",    score: 300, noOfQuestions: 75,  category: "JEE Main",     difficulty: "Hard",   subjects: ["Physics", "Chemistry", "Mathematics"] },
    { questionPaperId: "QP-JEEADV-001", score: 360, noOfQuestions: 90,  category: "JEE Advanced", difficulty: "Hard",   subjects: ["Physics", "Chemistry", "Mathematics"] },
    { questionPaperId: "QP-JEEADV-002", score: 360, noOfQuestions: 90,  category: "JEE Advanced", difficulty: "Hard",   subjects: ["Physics", "Chemistry", "Mathematics"] },
    { questionPaperId: "QP-NEET-001",   score: 720, noOfQuestions: 180, category: "NEET",         difficulty: "Easy",   subjects: ["Physics", "Chemistry", "Biology"] },
    { questionPaperId: "QP-NEET-002",   score: 720, noOfQuestions: 180, category: "NEET",         difficulty: "Medium", subjects: ["Physics", "Chemistry", "Biology"] },
    { questionPaperId: "QP-NEET-003",   score: 720, noOfQuestions: 180, category: "NEET",         difficulty: "Hard",   subjects: ["Physics", "Chemistry", "Biology"] },
    { questionPaperId: "QP-FOUND-001",  score: 200, noOfQuestions: 50,  category: "Foundation",   difficulty: "Easy",   subjects: ["Physics", "Mathematics"] },
    { questionPaperId: "QP-FOUND-002",  score: 200, noOfQuestions: 50,  category: "Foundation",   difficulty: "Medium", subjects: ["Chemistry", "Biology"] },
  ]);
  console.log("Inserted 10 question papers");

  const questionDefs = [
    { questionPaperId: "QP-JEE-001", text: "Two resistors of 4Ω and 6Ω in parallel. Equivalent resistance:", options: [{ text: "10 Ω" }, { text: "2.4 Ω" }, { text: "5 Ω" }, { text: "1.2 Ω" }], correctOption: "2.4 Ω", marks: 4, difficulty: "Easy", topic: "Current Electricity", type: "MCQ" },
    { questionPaperId: "QP-JEE-001", text: "IUPAC name of CH₃-CH(OH)-CH₃:", options: [{ text: "1-propanol" }, { text: "2-propanol" }, { text: "propan-1-ol" }, { text: "methyl ethanol" }], correctOption: "2-propanol", marks: 4, difficulty: "Easy", topic: "Organic Chemistry", type: "MCQ" },
    { questionPaperId: "QP-JEE-001", text: "HCF of 84 and 120:", options: [{ text: "6" }, { text: "12" }, { text: "24" }, { text: "42" }], correctOption: "12", marks: 4, difficulty: "Easy", topic: "Number Theory", type: "MCQ" },
    { questionPaperId: "QP-JEE-001", text: "SI unit of electric charge:", options: [{ text: "Ampere" }, { text: "Volt" }, { text: "Coulomb" }, { text: "Ohm" }], correctOption: "Coulomb", marks: 4, difficulty: "Easy", topic: "Electrostatics", type: "MCQ" },
    { questionPaperId: "QP-JEE-001", text: "Molecular mass of H₂SO₄ (H=1, S=32, O=16):", options: [{ text: "80 g/mol" }, { text: "96 g/mol" }, { text: "98 g/mol" }, { text: "100 g/mol" }], correctOption: "98 g/mol", marks: 4, difficulty: "Easy", topic: "Stoichiometry", type: "MCQ" },
    { questionPaperId: "QP-JEE-001", text: "Value of sin 90°:", options: [{ text: "0" }, { text: "0.5" }, { text: "√2/2" }, { text: "1" }], correctOption: "1", marks: 4, difficulty: "Easy", topic: "Trigonometry", type: "MCQ" },
    { questionPaperId: "QP-JEE-001", text: "Speed of light in vacuum:", options: [{ text: "3 × 10⁶ m/s" }, { text: "3 × 10⁸ m/s" }, { text: "3 × 10¹⁰ m/s" }, { text: "3 × 10⁴ m/s" }], correctOption: "3 × 10⁸ m/s", marks: 4, difficulty: "Easy", topic: "Modern Physics", type: "MCQ" },
    { questionPaperId: "QP-JEE-001", text: "Valence electrons in sulphur:", options: [{ text: "2" }, { text: "4" }, { text: "6" }, { text: "8" }], correctOption: "6", marks: 4, difficulty: "Easy", topic: "Atomic Structure", type: "MCQ" },
    { questionPaperId: "QP-JEE-001", text: "f(x) = x² + 3, then f(2):", options: [{ text: "5" }, { text: "7" }, { text: "9" }, { text: "11" }], correctOption: "7", marks: 4, difficulty: "Easy", topic: "Functions", type: "MCQ" },
    { questionPaperId: "QP-JEE-001", text: "Net force on a body at rest:", options: [{ text: "Maximum" }, { text: "Minimum" }, { text: "Zero" }, { text: "Undefined" }], correctOption: "Zero", marks: 4, difficulty: "Easy", topic: "Laws of Motion", type: "MCQ" },

    { questionPaperId: "QP-JEE-002", text: "Particle covers 10 m in 3rd second and 14 m in 5th second. Acceleration:", options: [{ text: "1 m/s²" }, { text: "2 m/s²" }, { text: "3 m/s²" }, { text: "4 m/s²" }], correctOption: "2 m/s²", marks: 4, difficulty: "Medium", topic: "Kinematics", type: "MCQ" },
    { questionPaperId: "QP-JEE-002", text: "Atoms in 21 g of silicon (M=28):", options: [{ text: "3.011 × 10²³" }, { text: "4.515 × 10²³" }, { text: "6.022 × 10²³" }, { text: "1.204 × 10²³" }], correctOption: "4.515 × 10²³", marks: 4, difficulty: "Medium", topic: "Mole Concept", type: "MCQ" },
    { questionPaperId: "QP-JEE-002", text: "Sum of roots of x³ - 6x² + 11x - 6 = 0:", options: [{ text: "3" }, { text: "6" }, { text: "11" }, { text: "1" }], correctOption: "6", marks: 4, difficulty: "Medium", topic: "Polynomials", type: "MCQ" },
    { questionPaperId: "QP-JEE-002", text: "∫₀¹ x² dx:", options: [{ text: "1/2" }, { text: "1/3" }, { text: "1/4" }, { text: "1" }], correctOption: "1/3", marks: 4, difficulty: "Medium", topic: "Integral Calculus", type: "MCQ" },
    { questionPaperId: "QP-JEE-002", text: "pH when [H⁺] = 10⁻³ mol/L:", options: [{ text: "3" }, { text: "11" }, { text: "-3" }, { text: "7" }], correctOption: "3", marks: 4, difficulty: "Medium", topic: "Ionic Equilibrium", type: "MCQ" },
    { questionPaperId: "QP-JEE-002", text: "Sigma bonds in ethyne C₂H₂:", options: [{ text: "2" }, { text: "3" }, { text: "4" }, { text: "5" }], correctOption: "3", marks: 4, difficulty: "Medium", topic: "Chemical Bonding", type: "MCQ" },
    { questionPaperId: "QP-JEE-002", text: "Highest electronegativity element:", options: [{ text: "Oxygen" }, { text: "Nitrogen" }, { text: "Fluorine" }, { text: "Chlorine" }], correctOption: "Fluorine", marks: 4, difficulty: "Medium", topic: "Periodic Table", type: "MCQ" },
    { questionPaperId: "QP-JEE-002", text: "Derivative of sin²(x):", options: [{ text: "2sin(x)" }, { text: "sin(2x)" }, { text: "2cos(x)" }, { text: "cos(2x)" }], correctOption: "sin(2x)", marks: 4, difficulty: "Medium", topic: "Differential Calculus", type: "MCQ" },
    { questionPaperId: "QP-JEE-002", text: "2 kg body at 3 m/s. Kinetic energy:", options: [{ text: "3 J" }, { text: "6 J" }, { text: "9 J" }, { text: "12 J" }], correctOption: "9 J", marks: 4, difficulty: "Medium", topic: "Work and Energy", type: "MCQ" },
    { questionPaperId: "QP-JEE-002", text: "Projectile at 45° with speed u. Range:", options: [{ text: "u²/g" }, { text: "2u²/g" }, { text: "u²/2g" }, { text: "√2u²/g" }], correctOption: "u²/g", marks: 4, difficulty: "Medium", topic: "Projectile Motion", type: "MCQ" },

    { questionPaperId: "QP-JEE-003", text: "Uniform rod pivoted at one end, released from horizontal. Angular velocity when vertical:", options: [{ text: "√(3g/L)" }, { text: "√(2g/L)" }, { text: "√(g/L)" }, { text: "√(6g/L)" }], correctOption: "√(3g/L)", marks: 4, difficulty: "Hard", topic: "Rotational Motion", type: "MCQ" },
    { questionPaperId: "QP-JEE-003", text: "Real solutions of x² - 5|x| + 6 = 0:", options: [{ text: "0" }, { text: "2" }, { text: "4" }, { text: "1" }], correctOption: "4", marks: 4, difficulty: "Hard", topic: "Algebra", type: "MCQ" },
    { questionPaperId: "QP-JEE-003", text: "de Broglie wavelength of electron through 100 V:", options: [{ text: "0.123 nm" }, { text: "1.23 nm" }, { text: "0.0123 nm" }, { text: "12.3 nm" }], correctOption: "0.123 nm", marks: 4, difficulty: "Hard", topic: "Modern Physics", type: "MCQ" },
    { questionPaperId: "QP-JEE-003", text: "Young's double slit — slit separation halved, screen distance doubled. Fringe width:", options: [{ text: "Halved" }, { text: "Doubled" }, { text: "Four times" }, { text: "Unchanged" }], correctOption: "Four times", marks: 4, difficulty: "Hard", topic: "Wave Optics", type: "MCQ" },
    { questionPaperId: "QP-JEE-003", text: "Charged particle moves perpendicular to magnetic field. Path:", options: [{ text: "Straight line" }, { text: "Parabola" }, { text: "Circle" }, { text: "Ellipse" }], correctOption: "Circle", marks: 4, difficulty: "Hard", topic: "Magnetism", type: "MCQ" },
    { questionPaperId: "QP-JEE-003", text: "Hybridisation of carbon in benzene:", options: [{ text: "sp" }, { text: "sp²" }, { text: "sp³" }, { text: "sp³d" }], correctOption: "sp²", marks: 4, difficulty: "Hard", topic: "Organic Chemistry", type: "MCQ" },
    { questionPaperId: "QP-JEE-003", text: "Limit of (sin x)/x as x → 0:", options: [{ text: "0" }, { text: "∞" }, { text: "1" }, { text: "-1" }], correctOption: "1", marks: 4, difficulty: "Hard", topic: "Limits", type: "MCQ" },
    { questionPaperId: "QP-JEE-003", text: "Quantum number determining shape of orbital:", options: [{ text: "Principal (n)" }, { text: "Azimuthal (l)" }, { text: "Magnetic (m)" }, { text: "Spin (s)" }], correctOption: "Azimuthal (l)", marks: 4, difficulty: "Hard", topic: "Quantum Mechanics", type: "MCQ" },
    { questionPaperId: "QP-JEE-003", text: "Entropy change in reversible adiabatic process:", options: [{ text: "Positive" }, { text: "Negative" }, { text: "Zero" }, { text: "Undefined" }], correctOption: "Zero", marks: 4, difficulty: "Hard", topic: "Thermodynamics", type: "MCQ" },
    { questionPaperId: "QP-JEE-003", text: "Rank of matrix [[1,2],[2,4]]:", options: [{ text: "0" }, { text: "1" }, { text: "2" }, { text: "3" }], correctOption: "1", marks: 4, difficulty: "Hard", topic: "Matrices", type: "MCQ" },

    { questionPaperId: "QP-JEEADV-001", text: "Geometrical isomers for [Co(en)₂Cl₂]⁺:", options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }], correctOption: "2", marks: 4, difficulty: "Hard", topic: "Coordination Chemistry", type: "MCQ" },
    { questionPaperId: "QP-JEEADV-001", text: "Particle in SHM has maximum KE at:", options: [{ text: "Extreme position" }, { text: "Mean position" }, { text: "Any position" }, { text: "Between mean and extreme" }], correctOption: "Mean position", marks: 4, difficulty: "Hard", topic: "Oscillations", type: "MCQ" },
    { questionPaperId: "QP-JEEADV-001", text: "Radial nodes in 3p orbital:", options: [{ text: "0" }, { text: "1" }, { text: "2" }, { text: "3" }], correctOption: "1", marks: 4, difficulty: "Hard", topic: "Quantum Mechanics", type: "MCQ" },
    { questionPaperId: "QP-JEEADV-001", text: "2 kg block on spring k=50 N/m. Period of oscillation:", options: [{ text: "π/5 s" }, { text: "2π/5 s" }, { text: "π s" }, { text: "2π s" }], correctOption: "2π/5 s", marks: 4, difficulty: "Hard", topic: "Oscillations", type: "MCQ" },
    { questionPaperId: "QP-JEEADV-001", text: "Entropy of universe in irreversible process:", options: [{ text: "Decreases" }, { text: "Remains constant" }, { text: "Increases" }, { text: "Becomes zero" }], correctOption: "Increases", marks: 4, difficulty: "Hard", topic: "Thermodynamics", type: "MCQ" },
    { questionPaperId: "QP-JEEADV-001", text: "Product of NH₃ and excess HCl:", options: [{ text: "N₂" }, { text: "NH₄Cl" }, { text: "N₂H₄" }, { text: "NO₂" }], correctOption: "NH₄Cl", marks: 4, difficulty: "Hard", topic: "p-Block Elements", type: "MCQ" },
    { questionPaperId: "QP-JEEADV-001", text: "Area bounded by y=x² and y=x:", options: [{ text: "1/6" }, { text: "1/3" }, { text: "1/2" }, { text: "2/3" }], correctOption: "1/6", marks: 4, difficulty: "Hard", topic: "Integral Calculus", type: "MCQ" },
    { questionPaperId: "QP-JEEADV-001", text: "Dipole moment of CO₂:", options: [{ text: "Non-zero, large" }, { text: "Non-zero, small" }, { text: "Zero" }, { text: "Undefined" }], correctOption: "Zero", marks: 4, difficulty: "Hard", topic: "Chemical Bonding", type: "MCQ" },
    { questionPaperId: "QP-JEEADV-001", text: "Momentum of photon of frequency ν:", options: [{ text: "hν/c" }, { text: "hc/ν" }, { text: "hν" }, { text: "h/ν" }], correctOption: "hν/c", marks: 4, difficulty: "Hard", topic: "Modern Physics", type: "MCQ" },
    { questionPaperId: "QP-JEEADV-001", text: "Curl of a conservative vector field:", options: [{ text: "A constant" }, { text: "Non-zero" }, { text: "Zero" }, { text: "Infinity" }], correctOption: "Zero", marks: 4, difficulty: "Hard", topic: "Vector Calculus", type: "MCQ" },

    { questionPaperId: "QP-JEEADV-002", text: "ΔG = ? (Gibbs and EMF relation):", options: [{ text: "-nFE" }, { text: "nFE" }, { text: "-nRT ln K" }, { text: "nRT/F" }], correctOption: "-nFE", marks: 4, difficulty: "Hard", topic: "Electrochemistry", type: "MCQ" },
    { questionPaperId: "QP-JEEADV-002", text: "Angular momentum of electron in nth Bohr orbit:", options: [{ text: "nh/π" }, { text: "nh/2π" }, { text: "n²h/2π" }, { text: "nh²/2π" }], correctOption: "nh/2π", marks: 4, difficulty: "Hard", topic: "Atomic Structure", type: "MCQ" },
    { questionPaperId: "QP-JEEADV-002", text: "Steric number of SF₆:", options: [{ text: "4" }, { text: "5" }, { text: "6" }, { text: "8" }], correctOption: "6", marks: 4, difficulty: "Hard", topic: "Chemical Bonding", type: "MCQ" },
    { questionPaperId: "QP-JEEADV-002", text: "Lens f=10 cm, object at 30 cm. Image distance:", options: [{ text: "10 cm" }, { text: "15 cm" }, { text: "20 cm" }, { text: "30 cm" }], correctOption: "15 cm", marks: 4, difficulty: "Hard", topic: "Ray Optics", type: "MCQ" },
    { questionPaperId: "QP-JEEADV-002", text: "Stereoisomers of 2,3-dibromobutane:", options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }], correctOption: "3", marks: 4, difficulty: "Hard", topic: "Stereochemistry", type: "MCQ" },
    { questionPaperId: "QP-JEEADV-002", text: "P(A∪B) = P(A) + P(B) - ?:", options: [{ text: "P(A)P(B)" }, { text: "P(A∩B)" }, { text: "P(A|B)" }, { text: "1" }], correctOption: "P(A∩B)", marks: 4, difficulty: "Hard", topic: "Probability", type: "MCQ" },
    { questionPaperId: "QP-JEEADV-002", text: "Magnetic flux through coil of area A in field B at angle θ:", options: [{ text: "BA" }, { text: "BA sin θ" }, { text: "BA cos θ" }, { text: "BA tan θ" }], correctOption: "BA cos θ", marks: 4, difficulty: "Hard", topic: "Electromagnetic Induction", type: "MCQ" },
    { questionPaperId: "QP-JEEADV-002", text: "Oxidation state of Mn in KMnO₄:", options: [{ text: "+4" }, { text: "+5" }, { text: "+6" }, { text: "+7" }], correctOption: "+7", marks: 4, difficulty: "Hard", topic: "d-Block Elements", type: "MCQ" },
    { questionPaperId: "QP-JEEADV-002", text: "Circle with centre (1,2) and radius 3:", options: [{ text: "(x-1)²+(y-2)²=3" }, { text: "(x-1)²+(y-2)²=9" }, { text: "(x+1)²+(y+2)²=9" }, { text: "(x-1)²+(y-2)²=6" }], correctOption: "(x-1)²+(y-2)²=9", marks: 4, difficulty: "Hard", topic: "Coordinate Geometry", type: "MCQ" },
    { questionPaperId: "QP-JEEADV-002", text: "Work done by ideal gas in isothermal reversible expansion V₁→V₂:", options: [{ text: "nRT(V₂-V₁)" }, { text: "nRT ln(V₂/V₁)" }, { text: "nR(T₂-T₁)" }, { text: "zero" }], correctOption: "nRT ln(V₂/V₁)", marks: 4, difficulty: "Hard", topic: "Thermodynamics", type: "MCQ" },

    { questionPaperId: "QP-NEET-001", text: "Universal donor blood group:", options: [{ text: "A" }, { text: "B" }, { text: "AB" }, { text: "O" }], correctOption: "O", marks: 4, difficulty: "Easy", topic: "Body Fluids and Circulation", type: "MCQ" },
    { questionPaperId: "QP-NEET-001", text: "Transcription in eukaryotes occurs in:", options: [{ text: "Cytoplasm" }, { text: "Mitochondria" }, { text: "Nucleus" }, { text: "Ribosome" }], correctOption: "Nucleus", marks: 4, difficulty: "Easy", topic: "Molecular Biology", type: "MCQ" },
    { questionPaperId: "QP-NEET-001", text: "Mendel's experimental plant:", options: [{ text: "Maize" }, { text: "Garden pea" }, { text: "Drosophila" }, { text: "Snapdragon" }], correctOption: "Garden pea", marks: 4, difficulty: "Easy", topic: "Genetics", type: "MCQ" },
    { questionPaperId: "QP-NEET-001", text: "Powerhouse of the cell:", options: [{ text: "Nucleus" }, { text: "Ribosome" }, { text: "Mitochondria" }, { text: "Golgi apparatus" }], correctOption: "Mitochondria", marks: 4, difficulty: "Easy", topic: "Cell Biology", type: "MCQ" },
    { questionPaperId: "QP-NEET-001", text: "Body thrown up, v=0 after 2 s. Initial velocity (g=10):", options: [{ text: "10 m/s" }, { text: "20 m/s" }, { text: "30 m/s" }, { text: "40 m/s" }], correctOption: "20 m/s", marks: 4, difficulty: "Easy", topic: "Kinematics", type: "MCQ" },
    { questionPaperId: "QP-NEET-001", text: "Atomic number of element with config 2,8,8,1:", options: [{ text: "11" }, { text: "19" }, { text: "18" }, { text: "20" }], correctOption: "19", marks: 4, difficulty: "Easy", topic: "Atomic Structure", type: "MCQ" },
    { questionPaperId: "QP-NEET-001", text: "Gas released during photosynthesis:", options: [{ text: "CO₂" }, { text: "N₂" }, { text: "O₂" }, { text: "H₂" }], correctOption: "O₂", marks: 4, difficulty: "Easy", topic: "Plant Physiology", type: "MCQ" },
    { questionPaperId: "QP-NEET-001", text: "Tissue lining the trachea:", options: [{ text: "Squamous epithelium" }, { text: "Ciliated epithelium" }, { text: "Cuboidal epithelium" }, { text: "Glandular epithelium" }], correctOption: "Ciliated epithelium", marks: 4, difficulty: "Easy", topic: "Histology", type: "MCQ" },
    { questionPaperId: "QP-NEET-001", text: "Chemical formula of common salt:", options: [{ text: "KCl" }, { text: "NaCl" }, { text: "CaCl₂" }, { text: "MgCl₂" }], correctOption: "NaCl", marks: 4, difficulty: "Easy", topic: "Basic Chemistry", type: "MCQ" },
    { questionPaperId: "QP-NEET-001", text: "Unicellular organism:", options: [{ text: "Earthworm" }, { text: "Amoeba" }, { text: "Fern" }, { text: "Mushroom" }], correctOption: "Amoeba", marks: 4, difficulty: "Easy", topic: "Diversity of Life", type: "MCQ" },

    { questionPaperId: "QP-NEET-002", text: "Not part of electron transport chain:", options: [{ text: "NADH dehydrogenase" }, { text: "Cytochrome bc1 complex" }, { text: "ATP synthase" }, { text: "Pyruvate dehydrogenase" }], correctOption: "Pyruvate dehydrogenase", marks: 4, difficulty: "Medium", topic: "Cellular Respiration", type: "MCQ" },
    { questionPaperId: "QP-NEET-002", text: "Hormone from adrenal cortex:", options: [{ text: "Adrenaline" }, { text: "Cortisol" }, { text: "Insulin" }, { text: "Thyroxine" }], correctOption: "Cortisol", marks: 4, difficulty: "Medium", topic: "Chemical Coordination", type: "MCQ" },
    { questionPaperId: "QP-NEET-002", text: "Bond angle in water molecule:", options: [{ text: "180°" }, { text: "120°" }, { text: "109.5°" }, { text: "104.5°" }], correctOption: "104.5°", marks: 4, difficulty: "Medium", topic: "Chemical Bonding", type: "MCQ" },
    { questionPaperId: "QP-NEET-002", text: "Brain region regulating body temperature:", options: [{ text: "Cerebellum" }, { text: "Hypothalamus" }, { text: "Medulla oblongata" }, { text: "Thalamus" }], correctOption: "Hypothalamus", marks: 4, difficulty: "Medium", topic: "Neural Control", type: "MCQ" },
    { questionPaperId: "QP-NEET-002", text: "Cross Tt × Tt. Ratio tall:short:", options: [{ text: "1:1" }, { text: "2:1" }, { text: "3:1" }, { text: "1:3" }], correctOption: "3:1", marks: 4, difficulty: "Medium", topic: "Genetics", type: "MCQ" },
    { questionPaperId: "QP-NEET-002", text: "Hormone promoting root development:", options: [{ text: "Gibberellin" }, { text: "Cytokinin" }, { text: "Auxin" }, { text: "Ethylene" }], correctOption: "Auxin", marks: 4, difficulty: "Medium", topic: "Plant Hormones", type: "MCQ" },
    { questionPaperId: "QP-NEET-002", text: "Site of protein synthesis:", options: [{ text: "Nucleus" }, { text: "Golgi body" }, { text: "Ribosome" }, { text: "Lysosome" }], correctOption: "Ribosome", marks: 4, difficulty: "Medium", topic: "Cell Biology", type: "MCQ" },
    { questionPaperId: "QP-NEET-002", text: "Independent assortment applies to genes on:", options: [{ text: "Same chromosome" }, { text: "Different chromosomes" }, { text: "X chromosome only" }, { text: "Mitochondrial DNA" }], correctOption: "Different chromosomes", marks: 4, difficulty: "Medium", topic: "Genetics", type: "MCQ" },
    { questionPaperId: "QP-NEET-002", text: "pH of neutral solution at 25°C:", options: [{ text: "0" }, { text: "7" }, { text: "14" }, { text: "5" }], correctOption: "7", marks: 4, difficulty: "Medium", topic: "Ionic Equilibrium", type: "MCQ" },
    { questionPaperId: "QP-NEET-002", text: "Action potential caused by influx of:", options: [{ text: "K⁺" }, { text: "Ca²⁺" }, { text: "Na⁺" }, { text: "Cl⁻" }], correctOption: "Na⁺", marks: 4, difficulty: "Medium", topic: "Neural Control", type: "MCQ" },

    { questionPaperId: "QP-NEET-003", text: "Enzyme that unwinds DNA during replication:", options: [{ text: "Ligase" }, { text: "Primase" }, { text: "Helicase" }, { text: "Polymerase I" }], correctOption: "Helicase", marks: 4, difficulty: "Hard", topic: "Molecular Biology", type: "MCQ" },
    { questionPaperId: "QP-NEET-003", text: "Competitive inhibition reversed by:", options: [{ text: "Decreasing substrate" }, { text: "Increasing inhibitor" }, { text: "Increasing substrate" }, { text: "Temperature decrease" }], correctOption: "Increasing substrate", marks: 4, difficulty: "Hard", topic: "Enzymology", type: "MCQ" },
    { questionPaperId: "QP-NEET-003", text: "Immunoglobulin that crosses the placenta:", options: [{ text: "IgA" }, { text: "IgE" }, { text: "IgM" }, { text: "IgG" }], correctOption: "IgG", marks: 4, difficulty: "Hard", topic: "Immunology", type: "MCQ" },
    { questionPaperId: "QP-NEET-003", text: "Reaction rate doubling per 10°C is called:", options: [{ text: "Arrhenius equation" }, { text: "Q₁₀ rule" }, { text: "Le Chatelier principle" }, { text: "Hess law" }], correctOption: "Q₁₀ rule", marks: 4, difficulty: "Hard", topic: "Enzymology", type: "MCQ" },
    { questionPaperId: "QP-NEET-003", text: "lac operon in E. coli activated by:", options: [{ text: "Glucose" }, { text: "Lactose" }, { text: "Sucrose" }, { text: "Fructose" }], correctOption: "Lactose", marks: 4, difficulty: "Hard", topic: "Gene Expression", type: "MCQ" },
    { questionPaperId: "QP-NEET-003", text: "RNA that carries genetic code to ribosome:", options: [{ text: "tRNA" }, { text: "rRNA" }, { text: "mRNA" }, { text: "snRNA" }], correctOption: "mRNA", marks: 4, difficulty: "Hard", topic: "Molecular Biology", type: "MCQ" },
    { questionPaperId: "QP-NEET-003", text: "Hardy-Weinberg equilibrium violated by:", options: [{ text: "Random mating" }, { text: "Large population" }, { text: "Natural selection" }, { text: "No mutation" }], correctOption: "Natural selection", marks: 4, difficulty: "Hard", topic: "Evolution", type: "MCQ" },
    { questionPaperId: "QP-NEET-003", text: "Vasa recta is associated with:", options: [{ text: "Glomerulus" }, { text: "Loop of Henle" }, { text: "Bowman's capsule" }, { text: "Collecting duct" }], correctOption: "Loop of Henle", marks: 4, difficulty: "Hard", topic: "Excretion", type: "MCQ" },
    { questionPaperId: "QP-NEET-003", text: "C₄ plants fix CO₂ initially into:", options: [{ text: "PGA" }, { text: "RuBP" }, { text: "OAA" }, { text: "PEP" }], correctOption: "OAA", marks: 4, difficulty: "Hard", topic: "Photosynthesis", type: "MCQ" },
    { questionPaperId: "QP-NEET-003", text: "ATP produced per glucose in aerobic respiration:", options: [{ text: "2" }, { text: "8" }, { text: "36-38" }, { text: "28" }], correctOption: "36-38", marks: 4, difficulty: "Hard", topic: "Cellular Respiration", type: "MCQ" },

    { questionPaperId: "QP-FOUND-001", text: "sin 30° + cos 60°:", options: [{ text: "0" }, { text: "1" }, { text: "√2" }, { text: "2" }], correctOption: "1", marks: 4, difficulty: "Easy", topic: "Trigonometry", type: "MCQ" },
    { questionPaperId: "QP-FOUND-001", text: "SI unit of force:", options: [{ text: "Joule" }, { text: "Watt" }, { text: "Newton" }, { text: "Pascal" }], correctOption: "Newton", marks: 4, difficulty: "Easy", topic: "Laws of Motion", type: "MCQ" },
    { questionPaperId: "QP-FOUND-001", text: "Train covers 120 km in 2 hours. Speed:", options: [{ text: "30 km/h" }, { text: "60 km/h" }, { text: "90 km/h" }, { text: "240 km/h" }], correctOption: "60 km/h", marks: 4, difficulty: "Easy", topic: "Motion", type: "MCQ" },
    { questionPaperId: "QP-FOUND-001", text: "HCF of 36 and 48:", options: [{ text: "6" }, { text: "12" }, { text: "18" }, { text: "24" }], correctOption: "12", marks: 4, difficulty: "Easy", topic: "Number Theory", type: "MCQ" },
    { questionPaperId: "QP-FOUND-001", text: "Object at rest possesses:", options: [{ text: "Kinetic energy" }, { text: "Potential energy" }, { text: "Thermal energy" }, { text: "No energy" }], correctOption: "Potential energy", marks: 4, difficulty: "Easy", topic: "Work and Energy", type: "MCQ" },
    { questionPaperId: "QP-FOUND-001", text: "Area of circle radius 7 cm (π=22/7):", options: [{ text: "44 cm²" }, { text: "154 cm²" }, { text: "49 cm²" }, { text: "22 cm²" }], correctOption: "154 cm²", marks: 4, difficulty: "Easy", topic: "Mensuration", type: "MCQ" },
    { questionPaperId: "QP-FOUND-001", text: "Boiling point of water at sea level:", options: [{ text: "90°C" }, { text: "95°C" }, { text: "100°C" }, { text: "110°C" }], correctOption: "100°C", marks: 4, difficulty: "Easy", topic: "Heat", type: "MCQ" },
    { questionPaperId: "QP-FOUND-001", text: "√169:", options: [{ text: "11" }, { text: "12" }, { text: "13" }, { text: "14" }], correctOption: "13", marks: 4, difficulty: "Easy", topic: "Number Theory", type: "MCQ" },
    { questionPaperId: "QP-FOUND-001", text: "Ohm's law: V =", options: [{ text: "I/R" }, { text: "IR" }, { text: "I²R" }, { text: "R/I" }], correctOption: "IR", marks: 4, difficulty: "Easy", topic: "Current Electricity", type: "MCQ" },
    { questionPaperId: "QP-FOUND-001", text: "Momentum = mass × ___:", options: [{ text: "acceleration" }, { text: "force" }, { text: "velocity" }, { text: "distance" }], correctOption: "velocity", marks: 4, difficulty: "Easy", topic: "Laws of Motion", type: "MCQ" },

    { questionPaperId: "QP-FOUND-002", text: "Photosynthesis occurs in which plant part:", options: [{ text: "Root" }, { text: "Stem" }, { text: "Leaf" }, { text: "Flower" }], correctOption: "Leaf", marks: 4, difficulty: "Medium", topic: "Plant Biology", type: "MCQ" },
    { questionPaperId: "QP-FOUND-002", text: "Gas released in photosynthesis:", options: [{ text: "CO₂" }, { text: "N₂" }, { text: "O₂" }, { text: "H₂" }], correctOption: "O₂", marks: 4, difficulty: "Medium", topic: "Plant Biology", type: "MCQ" },
    { questionPaperId: "QP-FOUND-002", text: "Carbon atom electrons:", options: [{ text: "4" }, { text: "6" }, { text: "8" }, { text: "12" }], correctOption: "6", marks: 4, difficulty: "Medium", topic: "Atomic Structure", type: "MCQ" },
    { questionPaperId: "QP-FOUND-002", text: "Unicellular organism:", options: [{ text: "Earthworm" }, { text: "Amoeba" }, { text: "Fern" }, { text: "Mushroom" }], correctOption: "Amoeba", marks: 4, difficulty: "Medium", topic: "Diversity of Life", type: "MCQ" },
    { questionPaperId: "QP-FOUND-002", text: "Chemical symbol for Gold:", options: [{ text: "Go" }, { text: "Gd" }, { text: "Au" }, { text: "Ag" }], correctOption: "Au", marks: 4, difficulty: "Medium", topic: "Periodic Table", type: "MCQ" },
    { questionPaperId: "QP-FOUND-002", text: "Protein digestion begins in:", options: [{ text: "Mouth" }, { text: "Stomach" }, { text: "Small intestine" }, { text: "Large intestine" }], correctOption: "Stomach", marks: 4, difficulty: "Medium", topic: "Digestion", type: "MCQ" },
    { questionPaperId: "QP-FOUND-002", text: "Indicator turning red in acid:", options: [{ text: "Methyl orange" }, { text: "Phenolphthalein" }, { text: "Litmus" }, { text: "Universal indicator" }], correctOption: "Litmus", marks: 4, difficulty: "Medium", topic: "Acids and Bases", type: "MCQ" },
    { questionPaperId: "QP-FOUND-002", text: "Blood cells carrying oxygen:", options: [{ text: "White blood cells" }, { text: "Platelets" }, { text: "Red blood cells" }, { text: "Plasma" }], correctOption: "Red blood cells", marks: 4, difficulty: "Medium", topic: "Circulatory System", type: "MCQ" },
    { questionPaperId: "QP-FOUND-002", text: "Products of electrolysis of water:", options: [{ text: "H₂ and O₂" }, { text: "CO₂ and H₂O" }, { text: "H₂ and H₂O₂" }, { text: "O₂ and OH⁻" }], correctOption: "H₂ and O₂", marks: 4, difficulty: "Medium", topic: "Electrochemistry", type: "MCQ" },
    { questionPaperId: "QP-FOUND-002", text: "Water loss through plant leaves:", options: [{ text: "Respiration" }, { text: "Photosynthesis" }, { text: "Transpiration" }, { text: "Osmosis" }], correctOption: "Transpiration", marks: 4, difficulty: "Medium", topic: "Plant Physiology", type: "MCQ" },
  ];

  const questions = await Question.insertMany(questionDefs);
  console.log(`Inserted ${questions.length} questions`);

  await Test.insertMany([
    { batchName: "Dronacharya - 2024", testId: "TEST-JEE-001",   score: "300", course: "JEE Main",     examName: "JEE Main Warm-Up Test",       date: "2024-09-10", startTime: "09:00", endTime: "12:00", questionPaperId: "QP-JEE-001",    subjects: "Physics,Chemistry,Mathematics", difficulty: "Easy",   duration: 180 },
    { batchName: "Dronacharya - 2024", testId: "TEST-JEE-002",   score: "300", course: "JEE Main",     examName: "JEE Main Phase 1 Test",        date: "2024-11-15", startTime: "09:00", endTime: "12:00", questionPaperId: "QP-JEE-002",    subjects: "Physics,Chemistry,Mathematics", difficulty: "Medium", duration: 180 },
    { batchName: "Dronacharya - 2024", testId: "TEST-JEE-003",   score: "300", course: "JEE Main",     examName: "JEE Main Final Mock",          date: "2025-01-20", startTime: "09:00", endTime: "12:00", questionPaperId: "QP-JEE-003",    subjects: "Physics,Chemistry,Mathematics", difficulty: "Hard",   duration: 180 },
    { batchName: "Chanakya - 2024",    testId: "TEST-ADV-001",   score: "360", course: "JEE Advanced", examName: "JEE Advanced Diagnostic Test", date: "2024-09-20", startTime: "09:00", endTime: "15:00", questionPaperId: "QP-JEEADV-001", subjects: "Physics,Chemistry,Mathematics", difficulty: "Hard",   duration: 360 },
    { batchName: "Chanakya - 2024",    testId: "TEST-ADV-002",   score: "360", course: "JEE Advanced", examName: "JEE Advanced Phase 1 Test",    date: "2024-11-20", startTime: "09:00", endTime: "15:00", questionPaperId: "QP-JEEADV-001", subjects: "Physics,Chemistry,Mathematics", difficulty: "Hard",   duration: 360 },
    { batchName: "Chanakya - 2024",    testId: "TEST-ADV-003",   score: "360", course: "JEE Advanced", examName: "JEE Advanced Final Mock",      date: "2025-01-25", startTime: "09:00", endTime: "15:00", questionPaperId: "QP-JEEADV-002", subjects: "Physics,Chemistry,Mathematics", difficulty: "Hard",   duration: 360 },
    { batchName: "Aryabhatta - 2025",  testId: "TEST-NEET-001",  score: "720", course: "NEET",         examName: "NEET Warm-Up Test",            date: "2025-02-01", startTime: "10:00", endTime: "13:20", questionPaperId: "QP-NEET-001",   subjects: "Physics,Chemistry,Biology",    difficulty: "Easy",   duration: 200 },
    { batchName: "Aryabhatta - 2025",  testId: "TEST-NEET-002",  score: "720", course: "NEET",         examName: "NEET Phase 1 Test",            date: "2025-03-01", startTime: "10:00", endTime: "13:20", questionPaperId: "QP-NEET-002",   subjects: "Physics,Chemistry,Biology",    difficulty: "Medium", duration: 200 },
    { batchName: "Aryabhatta - 2025",  testId: "TEST-NEET-003",  score: "720", course: "NEET",         examName: "NEET Final Mock Test",         date: "2025-04-05", startTime: "10:00", endTime: "13:20", questionPaperId: "QP-NEET-003",   subjects: "Physics,Chemistry,Biology",    difficulty: "Hard",   duration: 200 },
    { batchName: "Ramanujan - 2025",   testId: "TEST-FOUND-001", score: "200", course: "Foundation",   examName: "Foundation Unit Test 1",       date: "2025-01-10", startTime: "10:00", endTime: "11:40", questionPaperId: "QP-FOUND-001",  subjects: "Physics,Mathematics",          difficulty: "Easy",   duration: 100 },
    { batchName: "Ramanujan - 2025",   testId: "TEST-FOUND-002", score: "200", course: "Foundation",   examName: "Foundation Unit Test 2",       date: "2025-02-10", startTime: "10:00", endTime: "11:40", questionPaperId: "QP-FOUND-002",  subjects: "Chemistry,Biology",            difficulty: "Medium", duration: 100 },
    { batchName: "Ramanujan - 2025",   testId: "TEST-FOUND-003", score: "200", course: "Foundation",   examName: "Foundation Mid-Term Test",     date: "2025-03-10", startTime: "10:00", endTime: "11:40", questionPaperId: "QP-FOUND-001",  subjects: "Physics,Mathematics",          difficulty: "Easy",   duration: 100 },
  ]);
  console.log("Inserted 12 tests");

  const batchTestMap = {
    "Dronacharya - 2024": [
      { testId: "TEST-JEE-001",   qpId: "QP-JEE-001",    maxscore: 300 },
      { testId: "TEST-JEE-002",   qpId: "QP-JEE-002",    maxscore: 300 },
      { testId: "TEST-JEE-003",   qpId: "QP-JEE-003",    maxscore: 300 },
    ],
    "Chanakya - 2024": [
      { testId: "TEST-ADV-001",   qpId: "QP-JEEADV-001", maxscore: 360 },
      { testId: "TEST-ADV-002",   qpId: "QP-JEEADV-001", maxscore: 360 },
      { testId: "TEST-ADV-003",   qpId: "QP-JEEADV-002", maxscore: 360 },
    ],
    "Aryabhatta - 2025": [
      { testId: "TEST-NEET-001",  qpId: "QP-NEET-001",   maxscore: 720 },
      { testId: "TEST-NEET-002",  qpId: "QP-NEET-002",   maxscore: 720 },
      { testId: "TEST-NEET-003",  qpId: "QP-NEET-003",   maxscore: 720 },
    ],
    "Ramanujan - 2025": [
      { testId: "TEST-FOUND-001", qpId: "QP-FOUND-001",  maxscore: 200 },
      { testId: "TEST-FOUND-002", qpId: "QP-FOUND-002",  maxscore: 200 },
      { testId: "TEST-FOUND-003", qpId: "QP-FOUND-001",  maxscore: 200 },
    ],
  };

  const questionsByPaper = {};
  questions.forEach((q) => {
    if (!questionsByPaper[q.questionPaperId]) questionsByPaper[q.questionPaperId] = [];
    questionsByPaper[q.questionPaperId].push(q);
  });

  const allStudents = [...reinsertedStudents, ...seededStudents];
  const scoreInserts = [];

  for (const student of allStudents) {
    const testsForBatch = batchTestMap[student.batch];
    if (!testsForBatch) continue;

    const baseAccuracy = accuracyMap[student.email] ?? 0.60;

    for (let i = 0; i < testsForBatch.length; i++) {
      const { testId, qpId, maxscore } = testsForBatch[i];
      const paperQs = questionsByPaper[qpId] || [];
      if (paperQs.length === 0) continue;

      const progressBonus = i * 0.04;
      const jitter = (Math.random() - 0.5) * 0.12;
      const accuracy = Math.min(0.97, Math.max(0.05, baseAccuracy + progressBonus + jitter));

      const numCorrect = weightedCorrect(paperQs.length, accuracy);
      const earnedMarks = numCorrect * 4;

      const indices = shuffle(paperQs.map((_, idx) => idx));
      const correctSet = new Set(indices.slice(0, numCorrect));

      scoreInserts.push({
        testId,
        studentId: student._id.toString(),
        questionPaperId: qpId,
        marks: earnedMarks,
        maxscore,
        questions: paperQs.map((q, idx) => ({
          questionId:    q._id.toString(),
          correctAnswer: q.correctOption.toString(),
          chosenAnswer:  correctSet.has(idx)
            ? q.correctOption.toString()
            : pickWrong(q.options, q.correctOption.toString()),
        })),
      });
    }
  }

  await Score.insertMany(scoreInserts);
  console.log(`\nInserted ${scoreInserts.length} score records`);
  console.log(`  ${reinsertedStudents.length} existing students × up to 3 tests each`);
  console.log(`  ${seededStudents.length} seeded students × up to 3 tests each`);

  console.log("\n=== Seed complete ===");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});