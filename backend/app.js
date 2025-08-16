const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',  // frontend ka URL
  credentials: true,                 // agar cookies ya auth headers use kar rahe ho
}));

const authRoutes = require('./routes/auth');


app.use(express.json());
const expenseRoutes = require("./routes/expense2");
app.use("/api/expenses", expenseRoutes);
app.use(cors({
  origin: ["https://expense-wzf1.vercel.app"],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true             // agar cookies ya auth headers use kar rahe ho
}));

// Connect to DB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ DB error:", err));

// Routes
app.use(cors({
  origin: 'http://localhost:5173',  // frontend ka URL
  credentials: true,                 // agar cookies ya auth headers use kar rahe ho
}));


app.use('/api/auth', authRoutes);
const protectedRoutes = require("./routes/protected");

app.use("/api", protectedRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
