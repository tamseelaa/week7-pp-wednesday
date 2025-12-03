const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Helper to create JWT
const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// SIGNUP CONTROLLER
const signupUser = async (req, res) => {
  try {
    const { email, password, name, phone_number, gender, date_of_birth, membership_status } = req.body;

    // Check if exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      email,
      name,
      phone_number,
      gender,
      date_of_birth,
      membership_status,
      passwordHash: hash,
    });

    // Generate token
    const token = createToken(user._id);

    // SUCCESS RESPONSE MUST RETURN
    return res.status(201).json({
      email: user.email,
      token,
    });

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// LOGIN CONTROLLER
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Incorrect email" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ error: "Incorrect password" });

    const token = createToken(user._id);

    return res.status(200).json({ email, token });

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = { signupUser, loginUser };
