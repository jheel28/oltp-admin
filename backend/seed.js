require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Admin         = require("./Models/Admin");
const Student       = require("./Models/Student");
const Batch         = require("./Models/Batch");
const Category      = require("./Models/Category");
const QuestionPaper = require("./Models/QuestionPaper");
const Question      = require("./Models/Question");
const Test          = require("./Models/Test");
const Score         = require("./Models/Score");

const MONGO_URL =
  process.env.MONGOURL ||
  "mongodb://localhost:27017/testseries";

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
  const wrong = options.filter((o) => o.text !== correct);
  if (wrong.length > 0) return wrong[Math.floor(Math.random() * wrong.length)].text;
  return options.find((o) => o.text !== correct)?.text ?? options[0].text;
}

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to MongoDB\n");

  console.log("=== Insert-only mode (existing data is preserved) ===\n");

  const DEFAULT_PASSWORD = "Student@123";
  const hashedPassword = await bcrypt.hash(DEFAULT_PASSWORD, 12);

  const accuracyMap = {};


  const seededStudentData = [
    { firstName: "Arjun",   lastName: "Mehta",      fatherName: "Rajesh Mehta",     motherName: "Sunita Mehta",      phoneNumber: "9876543210", alternateNumber: "9123456780", studentId: "TCS-2024-001", admissionDate: "2024-06-01", batch: "Dronacharya - 2024", address: "12 Nehru Nagar, Sector 5",        pincode: "302001", state: "Rajasthan",     country: "India", email: "arjun.mehta@student.tcs.com",     accuracy: 0.82 },
    { firstName: "Priya",   lastName: "Sharma",     fatherName: "Vikram Sharma",     motherName: "Anita Sharma",      phoneNumber: "9812345670", alternateNumber: "9012345670", studentId: "TCS-2024-002", admissionDate: "2024-06-01", batch: "Dronacharya - 2024", address: "45 Gandhi Road, Civil Lines",     pincode: "302006", state: "Rajasthan",     country: "India", email: "priya.sharma@student.tcs.com",    accuracy: 0.75 },
    { firstName: "Nathan",  lastName: "Brooks",     fatherName: "David Brooks",      motherName: "Linda Brooks",      phoneNumber: "9988001122", alternateNumber: "9877001122", studentId: "TCS-2024-003", admissionDate: "2024-06-10", batch: "Dronacharya - 2024", address: "88 MG Road, Fraser Town",         pincode: "560005", state: "Karnataka",     country: "India", email: "nathan.brooks@student.tcs.com",   accuracy: 0.60 },
    { firstName: "Ishaan",  lastName: "Kapoor",     fatherName: "Rohit Kapoor",      motherName: "Deepa Kapoor",      phoneNumber: "9966332211", alternateNumber: "9866332211", studentId: "TCS-2024-004", admissionDate: "2024-06-10", batch: "Dronacharya - 2024", address: "5 Rajouri Garden, Block C",       pincode: "110027", state: "Delhi",         country: "India", email: "ishaan.kapoor@student.tcs.com",   accuracy: 0.45 },
    { firstName: "Asel",    lastName: "Nurlanovna", fatherName: "Nurlan Asel",        motherName: "Aigul Nurlanovna",  phoneNumber: "9911887766", alternateNumber: "9811887766", studentId: "TCS-2024-005", admissionDate: "2024-07-01", batch: "Dronacharya - 2024", address: "22 Sector 18, Noida",             pincode: "201301", state: "Uttar Pradesh", country: "India", email: "asel.nurlanovna@student.tcs.com", accuracy: 0.70 },
    { firstName: "Vikram",  lastName: "Rajan",      fatherName: "Suresh Rajan",       motherName: "Usha Rajan",        phoneNumber: "9900554433", alternateNumber: "9800554433", studentId: "TCS-2024-006", admissionDate: "2024-07-01", batch: "Dronacharya - 2024", address: "67 Anna Nagar, 3rd Street",       pincode: "600040", state: "Tamil Nadu",    country: "India", email: "vikram.rajan@student.tcs.com",    accuracy: 0.55 },
    { firstName: "Sneha",   lastName: "Patel",      fatherName: "Bhavesh Patel",      motherName: "Rekha Patel",       phoneNumber: "9765432109", alternateNumber: "9865432100", studentId: "TCS-2024-007", admissionDate: "2024-06-15", batch: "Chanakya - 2024",    address: "22 Satellite Road, Bodakdev",    pincode: "380054", state: "Gujarat",       country: "India", email: "sneha.patel@student.tcs.com",     accuracy: 0.88 },
    { firstName: "Karan",   lastName: "Singh",      fatherName: "Gurpreet Singh",     motherName: "Harpreet Kaur",     phoneNumber: "9855667788", alternateNumber: "9755667788", studentId: "TCS-2024-008", admissionDate: "2024-07-01", batch: "Chanakya - 2024",    address: "33 Model Town, Phase 2",         pincode: "141002", state: "Punjab",        country: "India", email: "karan.singh@student.tcs.com",     accuracy: 0.65 },
    { firstName: "Ananya",  lastName: "Reddy",      fatherName: "Venkat Reddy",       motherName: "Padma Reddy",       phoneNumber: "9966778899", alternateNumber: "9866778899", studentId: "TCS-2024-009", admissionDate: "2024-07-01", batch: "Chanakya - 2024",    address: "56 Jubilee Hills, Road No. 10",  pincode: "500033", state: "Telangana",     country: "India", email: "ananya.reddy@student.tcs.com",    accuracy: 0.79 },
    { firstName: "Luca",    lastName: "Rossi",      fatherName: "Marco Rossi",        motherName: "Giulia Rossi",      phoneNumber: "9844223311", alternateNumber: "9744223311", studentId: "TCS-2024-010", admissionDate: "2024-07-15", batch: "Chanakya - 2024",    address: "14 Bandra West, Turner Road",    pincode: "400050", state: "Maharashtra",   country: "India", email: "luca.rossi@student.tcs.com",      accuracy: 0.50 },
    { firstName: "Meera",   lastName: "Iyer",       fatherName: "Krishnan Iyer",      motherName: "Lalitha Iyer",      phoneNumber: "9833445566", alternateNumber: "9733445566", studentId: "TCS-2024-011", admissionDate: "2024-07-15", batch: "Chanakya - 2024",    address: "9 T Nagar, Pondy Bazaar",        pincode: "600017", state: "Tamil Nadu",    country: "India", email: "meera.iyer@student.tcs.com",      accuracy: 0.83 },
    { firstName: "Omar",    lastName: "Hassan",     fatherName: "Hassan Al-Amin",     motherName: "Fatima Hassan",     phoneNumber: "9822334455", alternateNumber: "9722334455", studentId: "TCS-2024-012", admissionDate: "2024-08-01", batch: "Chanakya - 2024",    address: "41 Frazer Town, Mosque Road",    pincode: "560005", state: "Karnataka",     country: "India", email: "omar.hassan@student.tcs.com",     accuracy: 0.42 },
    { firstName: "Mihail",  lastName: "Popescu",    fatherName: "Ion Popescu",        motherName: "Elena Popescu",     phoneNumber: "9944556677", alternateNumber: "9844556677", studentId: "TCS-2025-001", admissionDate: "2025-01-10", batch: "Aryabhatta - 2025",  address: "14 Indiranagar, 100 Feet Road",   pincode: "560038", state: "Karnataka",     country: "India", email: "mihail.popescu@student.tcs.com",  accuracy: 0.68 },
    { firstName: "Sara",    lastName: "Ahmed",      fatherName: "Khalid Ahmed",       motherName: "Fatima Ahmed",      phoneNumber: "9933445566", alternateNumber: "9833445566", studentId: "TCS-2025-002", admissionDate: "2025-01-10", batch: "Aryabhatta - 2025",  address: "88 Banjara Hills, Road No. 3",   pincode: "500034", state: "Telangana",     country: "India", email: "sara.ahmed@student.tcs.com",      accuracy: 0.76 },
    { firstName: "Rohan",   lastName: "Verma",      fatherName: "Suresh Verma",       motherName: "Kavita Verma",      phoneNumber: "9988776655", alternateNumber: "9988776644", studentId: "TCS-2025-003", admissionDate: "2025-01-20", batch: "Aryabhatta - 2025",  address: "7 Shyam Nagar, Vaishali",        pincode: "201010", state: "Uttar Pradesh", country: "India", email: "rohan.verma@student.tcs.com",     accuracy: 0.57 },
    { firstName: "Yuna",    lastName: "Kim",        fatherName: "Jinwoo Kim",         motherName: "Sooyeon Kim",       phoneNumber: "9922667788", alternateNumber: "9822667788", studentId: "TCS-2025-004", admissionDate: "2025-01-20", batch: "Aryabhatta - 2025",  address: "3 Koregaon Park, Lane 4",        pincode: "411001", state: "Maharashtra",   country: "India", email: "yuna.kim@student.tcs.com",        accuracy: 0.90 },
    { firstName: "Aditi",   lastName: "Bose",       fatherName: "Subrata Bose",       motherName: "Chitralekha Bose",  phoneNumber: "9911334455", alternateNumber: "9811334455", studentId: "TCS-2025-005", admissionDate: "2025-02-01", batch: "Aryabhatta - 2025",  address: "19 Lake Gardens, Block B",       pincode: "700045", state: "West Bengal",   country: "India", email: "aditi.bose@student.tcs.com",      accuracy: 0.72 },
    { firstName: "Samuel",  lastName: "Osei",       fatherName: "Kwame Osei",         motherName: "Abena Osei",        phoneNumber: "9900887766", alternateNumber: "9800887766", studentId: "TCS-2025-006", admissionDate: "2025-02-01", batch: "Aryabhatta - 2025",  address: "62 Whitefield, ITPL Road",       pincode: "560066", state: "Karnataka",     country: "India", email: "samuel.osei@student.tcs.com",     accuracy: 0.38 },
    { firstName: "Divya",   lastName: "Nair",       fatherName: "Suresh Nair",        motherName: "Latha Nair",        phoneNumber: "9911223344", alternateNumber: "9811223344", studentId: "TCS-2025-007", admissionDate: "2025-01-20", batch: "Ramanujan - 2025",   address: "3 Palarivattom, NH Bypass",      pincode: "682025", state: "Kerala",        country: "India", email: "divya.nair@student.tcs.com",      accuracy: 0.85 },
    { firstName: "Ethan",   lastName: "Clarke",     fatherName: "James Clarke",       motherName: "Susan Clarke",      phoneNumber: "9900112233", alternateNumber: "9800112233", studentId: "TCS-2025-008", admissionDate: "2025-02-01", batch: "Ramanujan - 2025",   address: "19 Powai, Hiranandani Gardens",  pincode: "400076", state: "Maharashtra",   country: "India", email: "ethan.clarke@student.tcs.com",    accuracy: 0.62 },
    { firstName: "Tanvi",   lastName: "Joshi",      fatherName: "Pramod Joshi",       motherName: "Meena Joshi",       phoneNumber: "9887766554", alternateNumber: "9787766554", studentId: "TCS-2025-009", admissionDate: "2025-02-01", batch: "Ramanujan - 2025",   address: "28 Sadashiv Peth, Tilak Road",   pincode: "411030", state: "Maharashtra",   country: "India", email: "tanvi.joshi@student.tcs.com",     accuracy: 0.78 },
    { firstName: "Lucas",   lastName: "Fernandez",  fatherName: "Carlos Fernandez",   motherName: "Maria Fernandez",   phoneNumber: "9876001122", alternateNumber: "9776001122", studentId: "TCS-2025-010", admissionDate: "2025-02-10", batch: "Ramanujan - 2025",   address: "11 Jubilee Hills, Road No. 5",   pincode: "500033", state: "Telangana",     country: "India", email: "lucas.fernandez@student.tcs.com", accuracy: 0.47 },
    { firstName: "Ayaan",   lastName: "Khan",       fatherName: "Imran Khan",         motherName: "Nadia Khan",        phoneNumber: "9865443322", alternateNumber: "9765443322", studentId: "TCS-2025-011", admissionDate: "2025-02-10", batch: "Ramanujan - 2025",   address: "34 Aminabad, Hazratganj",        pincode: "226001", state: "Uttar Pradesh", country: "India", email: "ayaan.khan@student.tcs.com",      accuracy: 0.66 },
    { firstName: "Elena",   lastName: "Vasquez",    fatherName: "Miguel Vasquez",     motherName: "Carmen Vasquez",    phoneNumber: "9854332211", alternateNumber: "9754332211", studentId: "TCS-2025-012", admissionDate: "2025-02-15", batch: "Ramanujan - 2025",   address: "7 Kalyani Nagar, Airport Road",  pincode: "411006", state: "Maharashtra",   country: "India", email: "elena.vasquez@student.tcs.com",   accuracy: 0.53 },
  ];

  // { ordered: false } skips duplicates instead of crashing — safe for teammates
  const seededStudents = await Student.insertMany(
    seededStudentData.map(({ accuracy, ...rest }) => {
      accuracyMap[rest.email] = accuracy;
      return { ...rest, password: hashedPassword, role: "Student", image: "uploads/images/default.jpg" };
    })
  , { ordered: false });

  console.log(
    `Inserted ${seededStudents.length} seeded students (default password: ${DEFAULT_PASSWORD}):`
  );
  seededStudents.forEach((s) => {
    const acc = accuracyMap[s.email];
    const tier = acc >= 0.80 ? "High" : acc >= 0.60 ? "Mid" : "Low";
    console.log(
      `  [${s.studentId}] ${s.firstName} ${s.lastName.padEnd(12)} → ${s.batch.padEnd(22)} ${(acc * 100).toFixed(0)}% (${tier})`
    );
  });

  await Batch.insertMany([
    { batchName: "Dronacharya - 2024" },
    { batchName: "Chanakya - 2024" },
    { batchName: "Aryabhatta - 2025" },
    { batchName: "Ramanujan - 2025" },
    { batchName: "Default" },
  ], { ordered: false }).catch(() => {});
  console.log("\nInserted 5 batches (including Default)");

  await Category.insertMany([
    { name: "JEE Main",     subjects: ["Physics", "Chemistry", "Mathematics"], description: "Joint Entrance Examination - Main level preparation" },
    { name: "JEE Advanced", subjects: ["Physics", "Chemistry", "Mathematics"], description: "Joint Entrance Examination - Advanced level preparation" },
    { name: "NEET",         subjects: ["Physics", "Chemistry", "Biology"],     description: "National Eligibility cum Entrance Test preparation" },
    { name: "Foundation",   subjects: ["Physics", "Chemistry", "Mathematics", "Biology"], description: "Foundation course for class 9th and 10th students" },
  ], { ordered: false }).catch(() => {});
  console.log("Inserted 4 categories");

  const paperDefs = [
    { paperId: "QP-JEE-001",    paperName: "JEE Main Warm-Up",           category: "JEE Main",     subjects: ["Physics", "Chemistry", "Mathematics"], batch: "Dronacharya - 2024", difficulty: "Easy",   marksPerQuestion: 4, negativeMarking: true,  negativeFraction: 0.25, isActive: true,  description: "Entry-level JEE Main practice paper" },
    { paperId: "QP-JEE-002",    paperName: "JEE Main Phase 1",           category: "JEE Main",     subjects: ["Physics", "Chemistry", "Mathematics"], batch: "Dronacharya - 2024", difficulty: "Medium", marksPerQuestion: 4, negativeMarking: true,  negativeFraction: 0.25, isActive: true,  description: "Mid-term JEE Main practice paper" },
    { paperId: "QP-JEE-003",    paperName: "JEE Main Final Mock",        category: "JEE Main",     subjects: ["Physics", "Chemistry", "Mathematics"], batch: "Dronacharya - 2024", difficulty: "Hard",   marksPerQuestion: 4, negativeMarking: true,  negativeFraction: 0.25, isActive: true,  description: "Final mock before JEE Main" },
    { paperId: "QP-JEEADV-001", paperName: "JEE Advanced Diagnostic",   category: "JEE Advanced", subjects: ["Physics", "Chemistry", "Mathematics"], batch: "Chanakya - 2024",    difficulty: "Hard",   marksPerQuestion: 4, negativeMarking: true,  negativeFraction: 0.25, isActive: true,  description: "Diagnostic paper for JEE Advanced" },
    { paperId: "QP-JEEADV-002", paperName: "JEE Advanced Final Mock",   category: "JEE Advanced", subjects: ["Physics", "Chemistry", "Mathematics"], batch: "Chanakya - 2024",    difficulty: "Hard",   marksPerQuestion: 4, negativeMarking: true,  negativeFraction: 0.25, isActive: true,  description: "Final mock before JEE Advanced" },
    { paperId: "QP-NEET-001",   paperName: "NEET Warm-Up",               category: "NEET",         subjects: ["Physics", "Chemistry", "Biology"],     batch: "Aryabhatta - 2025",  difficulty: "Easy",   marksPerQuestion: 4, negativeMarking: true,  negativeFraction: 0.25, isActive: true,  description: "Entry-level NEET practice paper" },
    { paperId: "QP-NEET-002",   paperName: "NEET Phase 1",               category: "NEET",         subjects: ["Physics", "Chemistry", "Biology"],     batch: "Aryabhatta - 2025",  difficulty: "Medium", marksPerQuestion: 4, negativeMarking: true,  negativeFraction: 0.25, isActive: true,  description: "Mid-term NEET practice paper" },
    { paperId: "QP-NEET-003",   paperName: "NEET Final Mock",            category: "NEET",         subjects: ["Physics", "Chemistry", "Biology"],     batch: "Aryabhatta - 2025",  difficulty: "Hard",   marksPerQuestion: 4, negativeMarking: true,  negativeFraction: 0.25, isActive: true,  description: "Final mock before NEET" },
    { paperId: "QP-FOUND-001",  paperName: "Foundation Unit Test 1",     category: "Foundation",   subjects: ["Physics", "Mathematics"],              batch: "Ramanujan - 2025",   difficulty: "Easy",   marksPerQuestion: 4, negativeMarking: false, negativeFraction: 0,    isActive: true,  description: "Physics and Mathematics basics" },
    { paperId: "QP-FOUND-002",  paperName: "Foundation Unit Test 2",     category: "Foundation",   subjects: ["Chemistry", "Biology"],                batch: "Ramanujan - 2025",   difficulty: "Medium", marksPerQuestion: 4, negativeMarking: false, negativeFraction: 0,    isActive: true,  description: "Chemistry and Biology basics" },
  ];

  const insertedPapers = await QuestionPaper.insertMany(
    paperDefs.map((p) => ({ ...p, totalQuestions: 10, totalMarks: 40 })),
    { ordered: false }
  ).catch((e) => e.insertedDocs || []);
  console.log(`Inserted ${insertedPapers.length} question papers`);

  const questionDefs = [
    { paperId: "QP-JEE-001", text: "Two resistors of 4Ω and 6Ω connected in parallel. Equivalent resistance:", type: "MCQ", options: [{ text: "10 Ω" }, { text: "2.4 Ω" }, { text: "5 Ω" }, { text: "1.2 Ω" }], correctOption: "2.4 Ω", marksPositive: 4, marksNegative: 1, topic: "Current Electricity", difficulty: "Easy" },
    { paperId: "QP-JEE-001", text: "IUPAC name of CH₃-CH(OH)-CH₃:", type: "MCQ", options: [{ text: "1-propanol" }, { text: "2-propanol" }, { text: "propan-1-ol" }, { text: "methyl ethanol" }], correctOption: "2-propanol", marksPositive: 4, marksNegative: 1, topic: "Organic Chemistry", difficulty: "Easy" },
    { paperId: "QP-JEE-001", text: "HCF of 84 and 120:", type: "MCQ", options: [{ text: "6" }, { text: "12" }, { text: "24" }, { text: "42" }], correctOption: "12", marksPositive: 4, marksNegative: 1, topic: "Number Theory", difficulty: "Easy" },
    { paperId: "QP-JEE-001", text: "SI unit of electric charge:", type: "MCQ", options: [{ text: "Ampere" }, { text: "Volt" }, { text: "Coulomb" }, { text: "Ohm" }], correctOption: "Coulomb", marksPositive: 4, marksNegative: 1, topic: "Electrostatics", difficulty: "Easy" },
    { paperId: "QP-JEE-001", text: "Molecular mass of H₂SO₄ (H=1, S=32, O=16):", type: "MCQ", options: [{ text: "80 g/mol" }, { text: "96 g/mol" }, { text: "98 g/mol" }, { text: "100 g/mol" }], correctOption: "98 g/mol", marksPositive: 4, marksNegative: 1, topic: "Stoichiometry", difficulty: "Easy" },
    { paperId: "QP-JEE-001", text: "Value of sin 90°:", type: "MCQ", options: [{ text: "0" }, { text: "0.5" }, { text: "√2/2" }, { text: "1" }], correctOption: "1", marksPositive: 4, marksNegative: 1, topic: "Trigonometry", difficulty: "Easy" },
    { paperId: "QP-JEE-001", text: "Speed of light in vacuum:", type: "MCQ", options: [{ text: "3 × 10⁶ m/s" }, { text: "3 × 10⁸ m/s" }, { text: "3 × 10¹⁰ m/s" }, { text: "3 × 10⁴ m/s" }], correctOption: "3 × 10⁸ m/s", marksPositive: 4, marksNegative: 1, topic: "Modern Physics", difficulty: "Easy" },
    { paperId: "QP-JEE-001", text: "Valence electrons in sulphur:", type: "MCQ", options: [{ text: "2" }, { text: "4" }, { text: "6" }, { text: "8" }], correctOption: "6", marksPositive: 4, marksNegative: 1, topic: "Atomic Structure", difficulty: "Easy" },
    { paperId: "QP-JEE-001", text: "f(x) = x² + 3, then f(2):", type: "MCQ", options: [{ text: "5" }, { text: "7" }, { text: "9" }, { text: "11" }], correctOption: "7", marksPositive: 4, marksNegative: 1, topic: "Functions", difficulty: "Easy" },
    { paperId: "QP-JEE-001", text: "Net force on a body at rest:", type: "MCQ", options: [{ text: "Maximum" }, { text: "Minimum" }, { text: "Zero" }, { text: "Undefined" }], correctOption: "Zero", marksPositive: 4, marksNegative: 1, topic: "Laws of Motion", difficulty: "Easy" },

    { paperId: "QP-JEE-002", text: "Particle covers 10 m in 3rd second and 14 m in 5th second. Acceleration:", type: "MCQ", options: [{ text: "1 m/s²" }, { text: "2 m/s²" }, { text: "3 m/s²" }, { text: "4 m/s²" }], correctOption: "2 m/s²", marksPositive: 4, marksNegative: 1, topic: "Kinematics", difficulty: "Medium" },
    { paperId: "QP-JEE-002", text: "Atoms in 21 g of silicon (M=28):", type: "MCQ", options: [{ text: "3.011 × 10²³" }, { text: "4.515 × 10²³" }, { text: "6.022 × 10²³" }, { text: "1.204 × 10²³" }], correctOption: "4.515 × 10²³", marksPositive: 4, marksNegative: 1, topic: "Mole Concept", difficulty: "Medium" },
    { paperId: "QP-JEE-002", text: "Sum of roots of x³ - 6x² + 11x - 6 = 0:", type: "MCQ", options: [{ text: "3" }, { text: "6" }, { text: "11" }, { text: "1" }], correctOption: "6", marksPositive: 4, marksNegative: 1, topic: "Polynomials", difficulty: "Medium" },
    { paperId: "QP-JEE-002", text: "∫₀¹ x² dx:", type: "MCQ", options: [{ text: "1/2" }, { text: "1/3" }, { text: "1/4" }, { text: "1" }], correctOption: "1/3", marksPositive: 4, marksNegative: 1, topic: "Integral Calculus", difficulty: "Medium" },
    { paperId: "QP-JEE-002", text: "pH when [H⁺] = 10⁻³ mol/L:", type: "MCQ", options: [{ text: "3" }, { text: "11" }, { text: "-3" }, { text: "7" }], correctOption: "3", marksPositive: 4, marksNegative: 1, topic: "Ionic Equilibrium", difficulty: "Medium" },
    { paperId: "QP-JEE-002", text: "Sigma bonds in ethyne C₂H₂:", type: "MCQ", options: [{ text: "2" }, { text: "3" }, { text: "4" }, { text: "5" }], correctOption: "3", marksPositive: 4, marksNegative: 1, topic: "Chemical Bonding", difficulty: "Medium" },
    { paperId: "QP-JEE-002", text: "Highest electronegativity element:", type: "MCQ", options: [{ text: "Oxygen" }, { text: "Nitrogen" }, { text: "Fluorine" }, { text: "Chlorine" }], correctOption: "Fluorine", marksPositive: 4, marksNegative: 1, topic: "Periodic Table", difficulty: "Medium" },
    { paperId: "QP-JEE-002", text: "Derivative of sin²(x):", type: "MCQ", options: [{ text: "2sin(x)" }, { text: "sin(2x)" }, { text: "2cos(x)" }, { text: "cos(2x)" }], correctOption: "sin(2x)", marksPositive: 4, marksNegative: 1, topic: "Differential Calculus", difficulty: "Medium" },
    { paperId: "QP-JEE-002", text: "2 kg body moving at 3 m/s. Kinetic energy:", type: "MCQ", options: [{ text: "3 J" }, { text: "6 J" }, { text: "9 J" }, { text: "12 J" }], correctOption: "9 J", marksPositive: 4, marksNegative: 1, topic: "Work and Energy", difficulty: "Medium" },
    { paperId: "QP-JEE-002", text: "Projectile at 45° with speed u. Range:", type: "MCQ", options: [{ text: "u²/g" }, { text: "2u²/g" }, { text: "u²/2g" }, { text: "√2u²/g" }], correctOption: "u²/g", marksPositive: 4, marksNegative: 1, topic: "Projectile Motion", difficulty: "Medium" },

    { paperId: "QP-JEE-003", text: "Uniform rod pivoted at one end, released from horizontal. Angular velocity when vertical:", type: "MCQ", options: [{ text: "√(3g/L)" }, { text: "√(2g/L)" }, { text: "√(g/L)" }, { text: "√(6g/L)" }], correctOption: "√(3g/L)", marksPositive: 4, marksNegative: 1, topic: "Rotational Motion", difficulty: "Hard" },
    { paperId: "QP-JEE-003", text: "Real solutions of x² - 5|x| + 6 = 0:", type: "MCQ", options: [{ text: "0" }, { text: "2" }, { text: "4" }, { text: "1" }], correctOption: "4", marksPositive: 4, marksNegative: 1, topic: "Algebra", difficulty: "Hard" },
    { paperId: "QP-JEE-003", text: "de Broglie wavelength of electron through 100 V:", type: "MCQ", options: [{ text: "0.123 nm" }, { text: "1.23 nm" }, { text: "0.0123 nm" }, { text: "12.3 nm" }], correctOption: "0.123 nm", marksPositive: 4, marksNegative: 1, topic: "Modern Physics", difficulty: "Hard" },
    { paperId: "QP-JEE-003", text: "Young's double slit — slit separation halved, screen distance doubled. Fringe width:", type: "MCQ", options: [{ text: "Halved" }, { text: "Doubled" }, { text: "Four times" }, { text: "Unchanged" }], correctOption: "Four times", marksPositive: 4, marksNegative: 1, topic: "Wave Optics", difficulty: "Hard" },
    { paperId: "QP-JEE-003", text: "Charged particle moves perpendicular to magnetic field. Path:", type: "MCQ", options: [{ text: "Straight line" }, { text: "Parabola" }, { text: "Circle" }, { text: "Ellipse" }], correctOption: "Circle", marksPositive: 4, marksNegative: 1, topic: "Magnetism", difficulty: "Hard" },
    { paperId: "QP-JEE-003", text: "Hybridisation of carbon in benzene:", type: "MCQ", options: [{ text: "sp" }, { text: "sp²" }, { text: "sp³" }, { text: "sp³d" }], correctOption: "sp²", marksPositive: 4, marksNegative: 1, topic: "Organic Chemistry", difficulty: "Hard" },
    { paperId: "QP-JEE-003", text: "Limit of (sin x)/x as x → 0:", type: "MCQ", options: [{ text: "0" }, { text: "∞" }, { text: "1" }, { text: "-1" }], correctOption: "1", marksPositive: 4, marksNegative: 1, topic: "Limits", difficulty: "Hard" },
    { paperId: "QP-JEE-003", text: "Quantum number determining shape of orbital:", type: "MCQ", options: [{ text: "Principal (n)" }, { text: "Azimuthal (l)" }, { text: "Magnetic (m)" }, { text: "Spin (s)" }], correctOption: "Azimuthal (l)", marksPositive: 4, marksNegative: 1, topic: "Quantum Mechanics", difficulty: "Hard" },
    { paperId: "QP-JEE-003", text: "Entropy change in reversible adiabatic process:", type: "MCQ", options: [{ text: "Positive" }, { text: "Negative" }, { text: "Zero" }, { text: "Undefined" }], correctOption: "Zero", marksPositive: 4, marksNegative: 1, topic: "Thermodynamics", difficulty: "Hard" },
    { paperId: "QP-JEE-003", text: "Rank of matrix [[1,2],[2,4]]:", type: "MCQ", options: [{ text: "0" }, { text: "1" }, { text: "2" }, { text: "3" }], correctOption: "1", marksPositive: 4, marksNegative: 1, topic: "Matrices", difficulty: "Hard" },

    { paperId: "QP-JEEADV-001", text: "Geometrical isomers for [Co(en)₂Cl₂]⁺:", type: "MCQ", options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }], correctOption: "2", marksPositive: 4, marksNegative: 1, topic: "Coordination Chemistry", difficulty: "Hard" },
    { paperId: "QP-JEEADV-001", text: "Particle in SHM has maximum KE at:", type: "MCQ", options: [{ text: "Extreme position" }, { text: "Mean position" }, { text: "Any position" }, { text: "Between mean and extreme" }], correctOption: "Mean position", marksPositive: 4, marksNegative: 1, topic: "Oscillations", difficulty: "Hard" },
    { paperId: "QP-JEEADV-001", text: "Radial nodes in 3p orbital:", type: "MCQ", options: [{ text: "0" }, { text: "1" }, { text: "2" }, { text: "3" }], correctOption: "1", marksPositive: 4, marksNegative: 1, topic: "Quantum Mechanics", difficulty: "Hard" },
    { paperId: "QP-JEEADV-001", text: "2 kg block on spring k=50 N/m. Period of oscillation:", type: "MCQ", options: [{ text: "π/5 s" }, { text: "2π/5 s" }, { text: "π s" }, { text: "2π s" }], correctOption: "2π/5 s", marksPositive: 4, marksNegative: 1, topic: "Oscillations", difficulty: "Hard" },
    { paperId: "QP-JEEADV-001", text: "Entropy of universe in an irreversible process:", type: "MCQ", options: [{ text: "Decreases" }, { text: "Remains constant" }, { text: "Increases" }, { text: "Becomes zero" }], correctOption: "Increases", marksPositive: 4, marksNegative: 1, topic: "Thermodynamics", difficulty: "Hard" },
    { paperId: "QP-JEEADV-001", text: "Product of NH₃ and excess HCl:", type: "MCQ", options: [{ text: "N₂" }, { text: "NH₄Cl" }, { text: "N₂H₄" }, { text: "NO₂" }], correctOption: "NH₄Cl", marksPositive: 4, marksNegative: 1, topic: "p-Block Elements", difficulty: "Hard" },
    { paperId: "QP-JEEADV-001", text: "Area bounded by y=x² and y=x:", type: "MCQ", options: [{ text: "1/6" }, { text: "1/3" }, { text: "1/2" }, { text: "2/3" }], correctOption: "1/6", marksPositive: 4, marksNegative: 1, topic: "Integral Calculus", difficulty: "Hard" },
    { paperId: "QP-JEEADV-001", text: "Dipole moment of CO₂:", type: "MCQ", options: [{ text: "Non-zero, large" }, { text: "Non-zero, small" }, { text: "Zero" }, { text: "Undefined" }], correctOption: "Zero", marksPositive: 4, marksNegative: 1, topic: "Chemical Bonding", difficulty: "Hard" },
    { paperId: "QP-JEEADV-001", text: "Momentum of photon of frequency ν:", type: "MCQ", options: [{ text: "hν/c" }, { text: "hc/ν" }, { text: "hν" }, { text: "h/ν" }], correctOption: "hν/c", marksPositive: 4, marksNegative: 1, topic: "Modern Physics", difficulty: "Hard" },
    { paperId: "QP-JEEADV-001", text: "Curl of a conservative vector field:", type: "MCQ", options: [{ text: "A constant" }, { text: "Non-zero" }, { text: "Zero" }, { text: "Infinity" }], correctOption: "Zero", marksPositive: 4, marksNegative: 1, topic: "Vector Calculus", difficulty: "Hard" },

    { paperId: "QP-JEEADV-002", text: "ΔG in terms of EMF:", type: "MCQ", options: [{ text: "-nFE" }, { text: "nFE" }, { text: "-nRT ln K" }, { text: "nRT/F" }], correctOption: "-nFE", marksPositive: 4, marksNegative: 1, topic: "Electrochemistry", difficulty: "Hard" },
    { paperId: "QP-JEEADV-002", text: "Angular momentum of electron in nth Bohr orbit:", type: "MCQ", options: [{ text: "nh/π" }, { text: "nh/2π" }, { text: "n²h/2π" }, { text: "nh²/2π" }], correctOption: "nh/2π", marksPositive: 4, marksNegative: 1, topic: "Atomic Structure", difficulty: "Hard" },
    { paperId: "QP-JEEADV-002", text: "Steric number of SF₆:", type: "MCQ", options: [{ text: "4" }, { text: "5" }, { text: "6" }, { text: "8" }], correctOption: "6", marksPositive: 4, marksNegative: 1, topic: "Chemical Bonding", difficulty: "Hard" },
    { paperId: "QP-JEEADV-002", text: "Lens f=10 cm, object at 30 cm. Image distance:", type: "MCQ", options: [{ text: "10 cm" }, { text: "15 cm" }, { text: "20 cm" }, { text: "30 cm" }], correctOption: "15 cm", marksPositive: 4, marksNegative: 1, topic: "Ray Optics", difficulty: "Hard" },
    { paperId: "QP-JEEADV-002", text: "Stereoisomers of 2,3-dibromobutane:", type: "MCQ", options: [{ text: "1" }, { text: "2" }, { text: "3" }, { text: "4" }], correctOption: "3", marksPositive: 4, marksNegative: 1, topic: "Stereochemistry", difficulty: "Hard" },
    { paperId: "QP-JEEADV-002", text: "P(A∪B) = P(A) + P(B) - ?:", type: "MCQ", options: [{ text: "P(A)P(B)" }, { text: "P(A∩B)" }, { text: "P(A|B)" }, { text: "1" }], correctOption: "P(A∩B)", marksPositive: 4, marksNegative: 1, topic: "Probability", difficulty: "Hard" },
    { paperId: "QP-JEEADV-002", text: "Magnetic flux through coil of area A in field B at angle θ:", type: "MCQ", options: [{ text: "BA" }, { text: "BA sin θ" }, { text: "BA cos θ" }, { text: "BA tan θ" }], correctOption: "BA cos θ", marksPositive: 4, marksNegative: 1, topic: "Electromagnetic Induction", difficulty: "Hard" },
    { paperId: "QP-JEEADV-002", text: "Oxidation state of Mn in KMnO₄:", type: "MCQ", options: [{ text: "+4" }, { text: "+5" }, { text: "+6" }, { text: "+7" }], correctOption: "+7", marksPositive: 4, marksNegative: 1, topic: "d-Block Elements", difficulty: "Hard" },
    { paperId: "QP-JEEADV-002", text: "Circle with centre (1,2) and radius 3:", type: "MCQ", options: [{ text: "(x-1)²+(y-2)²=3" }, { text: "(x-1)²+(y-2)²=9" }, { text: "(x+1)²+(y+2)²=9" }, { text: "(x-1)²+(y-2)²=6" }], correctOption: "(x-1)²+(y-2)²=9", marksPositive: 4, marksNegative: 1, topic: "Coordinate Geometry", difficulty: "Hard" },
    { paperId: "QP-JEEADV-002", text: "Work done by ideal gas in isothermal reversible expansion V₁→V₂:", type: "MCQ", options: [{ text: "nRT(V₂-V₁)" }, { text: "nRT ln(V₂/V₁)" }, { text: "nR(T₂-T₁)" }, { text: "zero" }], correctOption: "nRT ln(V₂/V₁)", marksPositive: 4, marksNegative: 1, topic: "Thermodynamics", difficulty: "Hard" },

    { paperId: "QP-NEET-001", text: "Universal donor blood group:", type: "MCQ", options: [{ text: "A" }, { text: "B" }, { text: "AB" }, { text: "O" }], correctOption: "O", marksPositive: 4, marksNegative: 1, topic: "Body Fluids and Circulation", difficulty: "Easy" },
    { paperId: "QP-NEET-001", text: "Transcription in eukaryotes occurs in:", type: "MCQ", options: [{ text: "Cytoplasm" }, { text: "Mitochondria" }, { text: "Nucleus" }, { text: "Ribosome" }], correctOption: "Nucleus", marksPositive: 4, marksNegative: 1, topic: "Molecular Biology", difficulty: "Easy" },
    { paperId: "QP-NEET-001", text: "Mendel's experimental plant:", type: "MCQ", options: [{ text: "Maize" }, { text: "Garden pea" }, { text: "Drosophila" }, { text: "Snapdragon" }], correctOption: "Garden pea", marksPositive: 4, marksNegative: 1, topic: "Genetics", difficulty: "Easy" },
    { paperId: "QP-NEET-001", text: "Powerhouse of the cell:", type: "MCQ", options: [{ text: "Nucleus" }, { text: "Ribosome" }, { text: "Mitochondria" }, { text: "Golgi apparatus" }], correctOption: "Mitochondria", marksPositive: 4, marksNegative: 1, topic: "Cell Biology", difficulty: "Easy" },
    { paperId: "QP-NEET-001", text: "Body thrown up, v=0 after 2 s. Initial velocity (g=10):", type: "MCQ", options: [{ text: "10 m/s" }, { text: "20 m/s" }, { text: "30 m/s" }, { text: "40 m/s" }], correctOption: "20 m/s", marksPositive: 4, marksNegative: 1, topic: "Kinematics", difficulty: "Easy" },
    { paperId: "QP-NEET-001", text: "Atomic number of element with config 2,8,8,1:", type: "MCQ", options: [{ text: "11" }, { text: "19" }, { text: "18" }, { text: "20" }], correctOption: "19", marksPositive: 4, marksNegative: 1, topic: "Atomic Structure", difficulty: "Easy" },
    { paperId: "QP-NEET-001", text: "Gas released during photosynthesis:", type: "MCQ", options: [{ text: "CO₂" }, { text: "N₂" }, { text: "O₂" }, { text: "H₂" }], correctOption: "O₂", marksPositive: 4, marksNegative: 1, topic: "Plant Physiology", difficulty: "Easy" },
    { paperId: "QP-NEET-001", text: "Tissue lining the trachea:", type: "MCQ", options: [{ text: "Squamous epithelium" }, { text: "Ciliated epithelium" }, { text: "Cuboidal epithelium" }, { text: "Glandular epithelium" }], correctOption: "Ciliated epithelium", marksPositive: 4, marksNegative: 1, topic: "Histology", difficulty: "Easy" },
    { paperId: "QP-NEET-001", text: "Chemical formula of common salt:", type: "MCQ", options: [{ text: "KCl" }, { text: "NaCl" }, { text: "CaCl₂" }, { text: "MgCl₂" }], correctOption: "NaCl", marksPositive: 4, marksNegative: 1, topic: "Basic Chemistry", difficulty: "Easy" },
    { paperId: "QP-NEET-001", text: "Unicellular organism:", type: "MCQ", options: [{ text: "Earthworm" }, { text: "Amoeba" }, { text: "Fern" }, { text: "Mushroom" }], correctOption: "Amoeba", marksPositive: 4, marksNegative: 1, topic: "Diversity of Life", difficulty: "Easy" },

    { paperId: "QP-NEET-002", text: "Not part of electron transport chain:", type: "MCQ", options: [{ text: "NADH dehydrogenase" }, { text: "Cytochrome bc1 complex" }, { text: "ATP synthase" }, { text: "Pyruvate dehydrogenase" }], correctOption: "Pyruvate dehydrogenase", marksPositive: 4, marksNegative: 1, topic: "Cellular Respiration", difficulty: "Medium" },
    { paperId: "QP-NEET-002", text: "Hormone from adrenal cortex:", type: "MCQ", options: [{ text: "Adrenaline" }, { text: "Cortisol" }, { text: "Insulin" }, { text: "Thyroxine" }], correctOption: "Cortisol", marksPositive: 4, marksNegative: 1, topic: "Chemical Coordination", difficulty: "Medium" },
    { paperId: "QP-NEET-002", text: "Bond angle in water molecule:", type: "MCQ", options: [{ text: "180°" }, { text: "120°" }, { text: "109.5°" }, { text: "104.5°" }], correctOption: "104.5°", marksPositive: 4, marksNegative: 1, topic: "Chemical Bonding", difficulty: "Medium" },
    { paperId: "QP-NEET-002", text: "Brain region regulating body temperature:", type: "MCQ", options: [{ text: "Cerebellum" }, { text: "Hypothalamus" }, { text: "Medulla oblongata" }, { text: "Thalamus" }], correctOption: "Hypothalamus", marksPositive: 4, marksNegative: 1, topic: "Neural Control", difficulty: "Medium" },
    { paperId: "QP-NEET-002", text: "Cross Tt × Tt. Ratio tall:short:", type: "MCQ", options: [{ text: "1:1" }, { text: "2:1" }, { text: "3:1" }, { text: "1:3" }], correctOption: "3:1", marksPositive: 4, marksNegative: 1, topic: "Genetics", difficulty: "Medium" },
    { paperId: "QP-NEET-002", text: "Hormone promoting root development:", type: "MCQ", options: [{ text: "Gibberellin" }, { text: "Cytokinin" }, { text: "Auxin" }, { text: "Ethylene" }], correctOption: "Auxin", marksPositive: 4, marksNegative: 1, topic: "Plant Hormones", difficulty: "Medium" },
    { paperId: "QP-NEET-002", text: "Site of protein synthesis:", type: "MCQ", options: [{ text: "Nucleus" }, { text: "Golgi body" }, { text: "Ribosome" }, { text: "Lysosome" }], correctOption: "Ribosome", marksPositive: 4, marksNegative: 1, topic: "Cell Biology", difficulty: "Medium" },
    { paperId: "QP-NEET-002", text: "Independent assortment applies to genes on:", type: "MCQ", options: [{ text: "Same chromosome" }, { text: "Different chromosomes" }, { text: "X chromosome only" }, { text: "Mitochondrial DNA" }], correctOption: "Different chromosomes", marksPositive: 4, marksNegative: 1, topic: "Genetics", difficulty: "Medium" },
    { paperId: "QP-NEET-002", text: "pH of neutral solution at 25°C:", type: "MCQ", options: [{ text: "0" }, { text: "7" }, { text: "14" }, { text: "5" }], correctOption: "7", marksPositive: 4, marksNegative: 1, topic: "Ionic Equilibrium", difficulty: "Medium" },
    { paperId: "QP-NEET-002", text: "Action potential caused by influx of:", type: "MCQ", options: [{ text: "K⁺" }, { text: "Ca²⁺" }, { text: "Na⁺" }, { text: "Cl⁻" }], correctOption: "Na⁺", marksPositive: 4, marksNegative: 1, topic: "Neural Control", difficulty: "Medium" },

    { paperId: "QP-NEET-003", text: "Enzyme that unwinds DNA during replication:", type: "MCQ", options: [{ text: "Ligase" }, { text: "Primase" }, { text: "Helicase" }, { text: "Polymerase I" }], correctOption: "Helicase", marksPositive: 4, marksNegative: 1, topic: "Molecular Biology", difficulty: "Hard" },
    { paperId: "QP-NEET-003", text: "Competitive inhibition reversed by:", type: "MCQ", options: [{ text: "Decreasing substrate" }, { text: "Increasing inhibitor" }, { text: "Increasing substrate" }, { text: "Temperature decrease" }], correctOption: "Increasing substrate", marksPositive: 4, marksNegative: 1, topic: "Enzymology", difficulty: "Hard" },
    { paperId: "QP-NEET-003", text: "Immunoglobulin that crosses the placenta:", type: "MCQ", options: [{ text: "IgA" }, { text: "IgE" }, { text: "IgM" }, { text: "IgG" }], correctOption: "IgG", marksPositive: 4, marksNegative: 1, topic: "Immunology", difficulty: "Hard" },
    { paperId: "QP-NEET-003", text: "Reaction rate doubling per 10°C rise is called:", type: "MCQ", options: [{ text: "Arrhenius equation" }, { text: "Q₁₀ rule" }, { text: "Le Chatelier principle" }, { text: "Hess law" }], correctOption: "Q₁₀ rule", marksPositive: 4, marksNegative: 1, topic: "Enzymology", difficulty: "Hard" },
    { paperId: "QP-NEET-003", text: "lac operon in E. coli activated by:", type: "MCQ", options: [{ text: "Glucose" }, { text: "Lactose" }, { text: "Sucrose" }, { text: "Fructose" }], correctOption: "Lactose", marksPositive: 4, marksNegative: 1, topic: "Gene Expression", difficulty: "Hard" },
    { paperId: "QP-NEET-003", text: "RNA that carries genetic code to ribosome:", type: "MCQ", options: [{ text: "tRNA" }, { text: "rRNA" }, { text: "mRNA" }, { text: "snRNA" }], correctOption: "mRNA", marksPositive: 4, marksNegative: 1, topic: "Molecular Biology", difficulty: "Hard" },
    { paperId: "QP-NEET-003", text: "Hardy-Weinberg equilibrium violated by:", type: "MCQ", options: [{ text: "Random mating" }, { text: "Large population" }, { text: "Natural selection" }, { text: "No mutation" }], correctOption: "Natural selection", marksPositive: 4, marksNegative: 1, topic: "Evolution", difficulty: "Hard" },
    { paperId: "QP-NEET-003", text: "Vasa recta is associated with:", type: "MCQ", options: [{ text: "Glomerulus" }, { text: "Loop of Henle" }, { text: "Bowman's capsule" }, { text: "Collecting duct" }], correctOption: "Loop of Henle", marksPositive: 4, marksNegative: 1, topic: "Excretion", difficulty: "Hard" },
    { paperId: "QP-NEET-003", text: "C₄ plants fix CO₂ initially into:", type: "MCQ", options: [{ text: "PGA" }, { text: "RuBP" }, { text: "OAA" }, { text: "PEP" }], correctOption: "OAA", marksPositive: 4, marksNegative: 1, topic: "Photosynthesis", difficulty: "Hard" },
    { paperId: "QP-NEET-003", text: "ATP produced per glucose in aerobic respiration:", type: "MCQ", options: [{ text: "2" }, { text: "8" }, { text: "36-38" }, { text: "28" }], correctOption: "36-38", marksPositive: 4, marksNegative: 1, topic: "Cellular Respiration", difficulty: "Hard" },

    { paperId: "QP-FOUND-001", text: "sin 30° + cos 60°:", type: "MCQ", options: [{ text: "0" }, { text: "1" }, { text: "√2" }, { text: "2" }], correctOption: "1", marksPositive: 4, marksNegative: 0, topic: "Trigonometry", difficulty: "Easy" },
    { paperId: "QP-FOUND-001", text: "SI unit of force:", type: "MCQ", options: [{ text: "Joule" }, { text: "Watt" }, { text: "Newton" }, { text: "Pascal" }], correctOption: "Newton", marksPositive: 4, marksNegative: 0, topic: "Laws of Motion", difficulty: "Easy" },
    { paperId: "QP-FOUND-001", text: "Train covers 120 km in 2 hours. Speed:", type: "MCQ", options: [{ text: "30 km/h" }, { text: "60 km/h" }, { text: "90 km/h" }, { text: "240 km/h" }], correctOption: "60 km/h", marksPositive: 4, marksNegative: 0, topic: "Motion", difficulty: "Easy" },
    { paperId: "QP-FOUND-001", text: "HCF of 36 and 48:", type: "MCQ", options: [{ text: "6" }, { text: "12" }, { text: "18" }, { text: "24" }], correctOption: "12", marksPositive: 4, marksNegative: 0, topic: "Number Theory", difficulty: "Easy" },
    { paperId: "QP-FOUND-001", text: "Object at rest possesses:", type: "MCQ", options: [{ text: "Kinetic energy" }, { text: "Potential energy" }, { text: "Thermal energy" }, { text: "No energy" }], correctOption: "Potential energy", marksPositive: 4, marksNegative: 0, topic: "Work and Energy", difficulty: "Easy" },
    { paperId: "QP-FOUND-001", text: "Area of circle radius 7 cm (π=22/7):", type: "MCQ", options: [{ text: "44 cm²" }, { text: "154 cm²" }, { text: "49 cm²" }, { text: "22 cm²" }], correctOption: "154 cm²", marksPositive: 4, marksNegative: 0, topic: "Mensuration", difficulty: "Easy" },
    { paperId: "QP-FOUND-001", text: "Boiling point of water at sea level:", type: "MCQ", options: [{ text: "90°C" }, { text: "95°C" }, { text: "100°C" }, { text: "110°C" }], correctOption: "100°C", marksPositive: 4, marksNegative: 0, topic: "Heat", difficulty: "Easy" },
    { paperId: "QP-FOUND-001", text: "√169:", type: "MCQ", options: [{ text: "11" }, { text: "12" }, { text: "13" }, { text: "14" }], correctOption: "13", marksPositive: 4, marksNegative: 0, topic: "Number Theory", difficulty: "Easy" },
    { paperId: "QP-FOUND-001", text: "Ohm's law: V =", type: "MCQ", options: [{ text: "I/R" }, { text: "IR" }, { text: "I²R" }, { text: "R/I" }], correctOption: "IR", marksPositive: 4, marksNegative: 0, topic: "Current Electricity", difficulty: "Easy" },
    { paperId: "QP-FOUND-001", text: "Momentum = mass × ___:", type: "MCQ", options: [{ text: "acceleration" }, { text: "force" }, { text: "velocity" }, { text: "distance" }], correctOption: "velocity", marksPositive: 4, marksNegative: 0, topic: "Laws of Motion", difficulty: "Easy" },

    { paperId: "QP-FOUND-002", text: "Photosynthesis occurs in which plant part:", type: "MCQ", options: [{ text: "Root" }, { text: "Stem" }, { text: "Leaf" }, { text: "Flower" }], correctOption: "Leaf", marksPositive: 4, marksNegative: 0, topic: "Plant Biology", difficulty: "Medium" },
    { paperId: "QP-FOUND-002", text: "Gas released in photosynthesis:", type: "MCQ", options: [{ text: "CO₂" }, { text: "N₂" }, { text: "O₂" }, { text: "H₂" }], correctOption: "O₂", marksPositive: 4, marksNegative: 0, topic: "Plant Biology", difficulty: "Medium" },
    { paperId: "QP-FOUND-002", text: "Carbon atom electrons:", type: "MCQ", options: [{ text: "4" }, { text: "6" }, { text: "8" }, { text: "12" }], correctOption: "6", marksPositive: 4, marksNegative: 0, topic: "Atomic Structure", difficulty: "Medium" },
    { paperId: "QP-FOUND-002", text: "Unicellular organism:", type: "MCQ", options: [{ text: "Earthworm" }, { text: "Amoeba" }, { text: "Fern" }, { text: "Mushroom" }], correctOption: "Amoeba", marksPositive: 4, marksNegative: 0, topic: "Diversity of Life", difficulty: "Medium" },
    { paperId: "QP-FOUND-002", text: "Chemical symbol for Gold:", type: "MCQ", options: [{ text: "Go" }, { text: "Gd" }, { text: "Au" }, { text: "Ag" }], correctOption: "Au", marksPositive: 4, marksNegative: 0, topic: "Periodic Table", difficulty: "Medium" },
    { paperId: "QP-FOUND-002", text: "Protein digestion begins in:", type: "MCQ", options: [{ text: "Mouth" }, { text: "Stomach" }, { text: "Small intestine" }, { text: "Large intestine" }], correctOption: "Stomach", marksPositive: 4, marksNegative: 0, topic: "Digestion", difficulty: "Medium" },
    { paperId: "QP-FOUND-002", text: "Indicator turning red in acid:", type: "MCQ", options: [{ text: "Methyl orange" }, { text: "Phenolphthalein" }, { text: "Litmus" }, { text: "Universal indicator" }], correctOption: "Litmus", marksPositive: 4, marksNegative: 0, topic: "Acids and Bases", difficulty: "Medium" },
    { paperId: "QP-FOUND-002", text: "Blood cells carrying oxygen:", type: "MCQ", options: [{ text: "White blood cells" }, { text: "Platelets" }, { text: "Red blood cells" }, { text: "Plasma" }], correctOption: "Red blood cells", marksPositive: 4, marksNegative: 0, topic: "Circulatory System", difficulty: "Medium" },
    { paperId: "QP-FOUND-002", text: "Products of electrolysis of water:", type: "MCQ", options: [{ text: "H₂ and O₂" }, { text: "CO₂ and H₂O" }, { text: "H₂ and H₂O₂" }, { text: "O₂ and OH⁻" }], correctOption: "H₂ and O₂", marksPositive: 4, marksNegative: 0, topic: "Electrochemistry", difficulty: "Medium" },
    { paperId: "QP-FOUND-002", text: "Water loss through plant leaves:", type: "MCQ", options: [{ text: "Respiration" }, { text: "Photosynthesis" }, { text: "Transpiration" }, { text: "Osmosis" }], correctOption: "Transpiration", marksPositive: 4, marksNegative: 0, topic: "Plant Physiology", difficulty: "Medium" },
  ];

  const questions = await Question.insertMany(questionDefs, { ordered: false }).catch((e) => e.insertedDocs || []);
  console.log(`Inserted ${questions.length} questions`);

  const testDefs = [
    { testId: "TEST-JEE-001",   testName: "JEE Main Warm-Up Test",       paperId: "QP-JEE-001",    batchName: "Dronacharya - 2024", course: "JEE Main",     date: "2024-09-10", startTime: "09:00", endTime: "12:00", duration: 180, isPublished: true },
    { testId: "TEST-JEE-002",   testName: "JEE Main Phase 1 Test",       paperId: "QP-JEE-002",    batchName: "Dronacharya - 2024", course: "JEE Main",     date: "2024-11-15", startTime: "09:00", endTime: "12:00", duration: 180, isPublished: true },
    { testId: "TEST-JEE-003",   testName: "JEE Main Final Mock",         paperId: "QP-JEE-003",    batchName: "Dronacharya - 2024", course: "JEE Main",     date: "2025-01-20", startTime: "09:00", endTime: "12:00", duration: 180, isPublished: true },
    { testId: "TEST-ADV-001",   testName: "JEE Advanced Diagnostic Test",paperId: "QP-JEEADV-001", batchName: "Chanakya - 2024",    course: "JEE Advanced", date: "2024-09-20", startTime: "09:00", endTime: "15:00", duration: 360, isPublished: true },
    { testId: "TEST-ADV-002",   testName: "JEE Advanced Phase 1 Test",   paperId: "QP-JEEADV-001", batchName: "Chanakya - 2024",    course: "JEE Advanced", date: "2024-11-20", startTime: "09:00", endTime: "15:00", duration: 360, isPublished: true },
    { testId: "TEST-ADV-003",   testName: "JEE Advanced Final Mock",     paperId: "QP-JEEADV-002", batchName: "Chanakya - 2024",    course: "JEE Advanced", date: "2025-01-25", startTime: "09:00", endTime: "15:00", duration: 360, isPublished: true },
    { testId: "TEST-NEET-001",  testName: "NEET Warm-Up Test",           paperId: "QP-NEET-001",   batchName: "Aryabhatta - 2025",  course: "NEET",         date: "2025-02-01", startTime: "10:00", endTime: "13:20", duration: 200, isPublished: true },
    { testId: "TEST-NEET-002",  testName: "NEET Phase 1 Test",           paperId: "QP-NEET-002",   batchName: "Aryabhatta - 2025",  course: "NEET",         date: "2025-03-01", startTime: "10:00", endTime: "13:20", duration: 200, isPublished: true },
    { testId: "TEST-NEET-003",  testName: "NEET Final Mock Test",        paperId: "QP-NEET-003",   batchName: "Aryabhatta - 2025",  course: "NEET",         date: "2025-04-05", startTime: "10:00", endTime: "13:20", duration: 200, isPublished: true },
    { testId: "TEST-FOUND-001", testName: "Foundation Unit Test 1",      paperId: "QP-FOUND-001",  batchName: "Ramanujan - 2025",   course: "Foundation",   date: "2025-01-10", startTime: "10:00", endTime: "11:40", duration: 100, isPublished: true },
    { testId: "TEST-FOUND-002", testName: "Foundation Unit Test 2",      paperId: "QP-FOUND-002",  batchName: "Ramanujan - 2025",   course: "Foundation",   date: "2025-02-10", startTime: "10:00", endTime: "11:40", duration: 100, isPublished: true },
    { testId: "TEST-FOUND-003", testName: "Foundation Mid-Term Test",    paperId: "QP-FOUND-001",  batchName: "Ramanujan - 2025",   course: "Foundation",   date: "2025-03-10", startTime: "10:00", endTime: "11:40", duration: 100, isPublished: true },
  ];

  const insertedTests = await Test.insertMany(testDefs, { ordered: false }).catch((e) => e.insertedDocs || []);
  console.log(`Inserted ${insertedTests.length} tests`);

  const batchTestMap = {
    "Dronacharya - 2024": [
      { testId: "TEST-JEE-001",   paperId: "QP-JEE-001",    testName: "JEE Main Warm-Up Test",        totalMarks: 40 },
      { testId: "TEST-JEE-002",   paperId: "QP-JEE-002",    testName: "JEE Main Phase 1 Test",        totalMarks: 40 },
      { testId: "TEST-JEE-003",   paperId: "QP-JEE-003",    testName: "JEE Main Final Mock",          totalMarks: 40 },
    ],
    "Chanakya - 2024": [
      { testId: "TEST-ADV-001",   paperId: "QP-JEEADV-001", testName: "JEE Advanced Diagnostic Test", totalMarks: 40 },
      { testId: "TEST-ADV-002",   paperId: "QP-JEEADV-001", testName: "JEE Advanced Phase 1 Test",   totalMarks: 40 },
      { testId: "TEST-ADV-003",   paperId: "QP-JEEADV-002", testName: "JEE Advanced Final Mock",     totalMarks: 40 },
    ],
    "Aryabhatta - 2025": [
      { testId: "TEST-NEET-001",  paperId: "QP-NEET-001",   testName: "NEET Warm-Up Test",            totalMarks: 40 },
      { testId: "TEST-NEET-002",  paperId: "QP-NEET-002",   testName: "NEET Phase 1 Test",            totalMarks: 40 },
      { testId: "TEST-NEET-003",  paperId: "QP-NEET-003",   testName: "NEET Final Mock Test",         totalMarks: 40 },
    ],
    "Ramanujan - 2025": [
      { testId: "TEST-FOUND-001", paperId: "QP-FOUND-001",  testName: "Foundation Unit Test 1",       totalMarks: 40 },
      { testId: "TEST-FOUND-002", paperId: "QP-FOUND-002",  testName: "Foundation Unit Test 2",       totalMarks: 40 },
      { testId: "TEST-FOUND-003", paperId: "QP-FOUND-001",  testName: "Foundation Mid-Term Test",     totalMarks: 40 },
    ],
  };

  const questionsByPaper = {};
  questions.forEach((q) => {
    if (!questionsByPaper[q.paperId]) questionsByPaper[q.paperId] = [];
    questionsByPaper[q.paperId].push(q);
  });

  const allStudents = [...seededStudents];
  const scoreInserts = [];

  for (const student of allStudents) {
    const testsForBatch = batchTestMap[student.batch];
    if (!testsForBatch) continue;

    const baseAccuracy = accuracyMap[student.email] ?? 0.60;
    const studentName = `${student.firstName} ${student.lastName}`;

    for (let i = 0; i < testsForBatch.length; i++) {
      const { testId, paperId, testName, totalMarks } = testsForBatch[i];
      const paperQs = questionsByPaper[paperId] || [];
      if (paperQs.length === 0) continue;

      const progressBonus = i * 0.04;
      const jitter = (Math.random() - 0.5) * 0.12;
      const accuracy = Math.min(0.97, Math.max(0.05, baseAccuracy + progressBonus + jitter));

      const numCorrect = weightedCorrect(paperQs.length, accuracy);
      const marksObtained = numCorrect * 4;
      const passed = marksObtained / totalMarks >= 0.35;

      const indices = shuffle(paperQs.map((_, idx) => idx));
      const correctSet = new Set(indices.slice(0, numCorrect));

      scoreInserts.push({
        testId,
        testName,
        studentId: student._id.toString(),
        studentName,
        paperId,
        batch: student.batch,
        marksObtained,
        totalMarks,
        passed,
        questions: paperQs.map((q, idx) => {
          const isCorrect = correctSet.has(idx);
          const chosenAnswer = isCorrect
            ? q.correctOption.toString()
            : pickWrong(q.options, q.correctOption.toString());
          return {
            questionId:    q._id.toString(),
            correctAnswer: q.correctOption.toString(),
            chosenAnswer,
            marksAwarded:  isCorrect ? (q.marksPositive ?? 4) : 0,
          };
        }),
      });
    }
  }

  await Score.insertMany(scoreInserts);
  console.log(`\nInserted ${scoreInserts.length} score records`);
  console.log(`  ${seededStudents.length} seeded students × up to 3 tests each`);

  console.log("\n=== Seed complete ===");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});