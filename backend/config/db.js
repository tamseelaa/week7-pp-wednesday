const mongoose = require("mongoose");
const config = require("../utils/config");

const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
  } catch (err) {
    console.error("DB Connection Error:", err.message);
  }
};

module.exports = connectDB;
