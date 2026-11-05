require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/User");

const createAdmin = async () => {
  try {
    const { ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME, ADMIN_PHONE, MONGODB_URI } =
      process.env;

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !MONGODB_URI) {
      throw new Error(
        "ADMIN_EMAIL, ADMIN_PASSWORD, and MONGODB_URI must be configured."
      );
    }

    await mongoose.connect(MONGODB_URI);

    const existingAdmin = await User.findOne({
      email: ADMIN_EMAIL,
    });

    if (existingAdmin) {
      console.log("Admin account already exists.");
      return;
    }

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);

    await User.create({
      name: ADMIN_NAME || "FoodBridge Admin",
      email: ADMIN_EMAIL,
      password: hashedPassword,
      phone: ADMIN_PHONE || "0000000000",
      role: "ADMIN",
      isActive: true,
    });

    console.log("Admin account created successfully.");
  } catch (error) {
    console.error("Admin creation failed:", error.message);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
  }
};

createAdmin();
