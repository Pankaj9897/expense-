const express = require("express");
const Expense = require("../models/Expense");
const verifyToken = require("../middleware/middle");

const router = express.Router();

// Add Expense
router.post("/", verifyToken, async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Decoded User:", req.user);

    const expense = new Expense({
      title: req.body.title,
      category: req.body.category, // Frontend se bhejna hoga
      amount: req.body.amount,
      user: req.user.userId // ✅ yaha "user" use karo, na ki "userId"
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (err) {
    console.error("Expense save error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all expenses for logged-in user
router.get("/", verifyToken, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.userId }).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update expense
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updated = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete expense
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Expense.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
    res.json({ message: "Expense deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
