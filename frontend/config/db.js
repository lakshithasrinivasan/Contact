const mongoose = require("mongoose");

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI;
  const fallbackUri = "mongodb://127.0.0.1:27017/contacts";

  try {
    const conn = await mongoose.connect(primaryUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return;
  } catch (primaryError) {
    console.warn(
      "Primary MongoDB connection failed. Attempting fallback local MongoDB...",
      primaryError.message
    );
  }

  try {
    const conn = await mongoose.connect(fallbackUri);
    console.log(`MongoDB Connected (fallback): ${conn.connection.host}`);
  } catch (fallbackError) {
    console.error(
      "Database connection failed (primary + fallback):",
      fallbackError.message
    );
    process.exit(1);
  }
};

module.exports = connectDB;
