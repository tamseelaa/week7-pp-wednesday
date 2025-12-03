const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    // renamed: passwordHash -> password
    password: { type: String, required: true },

    // NEW FIELDS
    role: { type: String, required: true }, // Admin, Seller, Buyer
    address: { type: String, required: true },

    lastLogin: { type: Date, default: Date.now }
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("User", userSchema);