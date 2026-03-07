require("dotenv").config({ path: "../.env" }); 
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const readline = require("readline");

const Admin = require("../Models/Admin"); 
const { normalizeEmail } = require("../Utils/emailNormalization");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query) => {
  return new Promise((resolve) => rl.question(query, resolve));
};

const overwritePassword = async () => {
  try {
    const emailInput = await askQuestion("Enter the admin email: ");
    const newPasswordInput = await askQuestion("Enter the new password: ");

    if (!emailInput || !newPasswordInput) {
      console.error("❌ Both email and new password are required.");
      return;
    }

    const dbUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/your_database_name";
    await mongoose.connect(dbUri);
    console.log("✅ Connected to the database.");

    const rawEmail = emailInput.trim().toLowerCase();
    const normEmail = normalizeEmail(rawEmail);

    let admin = await Admin.findOne({ normalizedEmail: normEmail });
    if (!admin) {
        admin = await Admin.findOne({ email: rawEmail });
    }

    if (!admin) {
      console.error(`❌ No admin found with the email: ${rawEmail}`);
      return;
    }

    console.log("Encrypting new password...");
    const hashedPassword = await bcrypt.hash(newPasswordInput, 12);

    admin.password = hashedPassword;
    await admin.save();

    console.log(`🎉 Success! Password has been overwritten for admin: ${admin.email}`);
    
  } catch (error) {
    console.error("❌ An error occurred:", error);
  } finally {
    rl.close();
    await mongoose.disconnect();
    console.log("Database connection closed.");
    process.exit(0);
  }
};

overwritePassword();