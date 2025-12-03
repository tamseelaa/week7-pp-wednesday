const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Generate JWT
const createToken = (_id, role) => {
  return jwt.sign({ _id, role }, process.env.SECRET, { expiresIn: "3d" });
};

// SIGNUP
const signupUser = async (req, res) => {
  try {
    const { name, email, password, role, address } = req.body;

    if (!name || !email || !password || !role || !address) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user exists
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hash,
      role,
      address
    });

    const token = createToken(user._id, user.role);

    return res.status(201).json({
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// LOGIN
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Incorrect email" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Incorrect password" });

    // update last login
    user.lastLogin = new Date();
    await user.save();

    const token = createToken(user._id, user.role);

    return res.status(200).json({
      email: user.email,
      role: user.role,
      token
    });

  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = { signupUser, loginUser };