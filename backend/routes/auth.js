const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = new User({
      name,
      email,
      password, // Plain password, mongoose pre('save') middleware will hash it
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login body:", req.body);

    // Check if user exists
    const user = await User.findOne({ email });
    console.log("User from DB:", user);

    if (!user) {
      console.log("❌ No user found");
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Password comparison function
    async function checkPassword(plainPassword, user) {
      console.log(`Comparing passwords: ${plainPassword} with hashed: ${user.password}`);
      const isMatch = await bcrypt.compare(plainPassword, user.password);
      console.log("Password match result:", isMatch);
      return isMatch;
    }

    // Call checkPassword and await the result
    const isMatch = await checkPassword(password, user);

    if (!isMatch) {
      console.log("❌ Password does not match");
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate JWT token (replace secret key with your own)
    const token = jwt.sign(
      { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("✅ Login successful, token generated");

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ error: error.message });
  }
});


const authMiddleware = require('../middleware/middle');

router.get('/profile', authMiddleware, async (req, res) => {
  try {
    // req.user me user info milti hai jo JWT se mili hai
    const userId = req.user.userId;

    const user = await User.findById(userId).select('-password'); // password exclude karo

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
