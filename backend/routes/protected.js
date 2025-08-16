const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Middleware to verify token
function verifyToken(req, res, next) {
    const token = req.headers["authorization"]?.split(" ")[1]; // "Bearer token"
    if (!token) return res.status(403).json({ error: "No token provided" });

    jwt.verify(token,process.env.JWT_SECRET,
 (err, decoded) => {
        if (err) return res.status(401).json({ error: "Invalid token" });
        req.user = decoded; // decoded me id, email etc. hoga
        next();
    });
}

// Example protected route
router.get("/dashboard", verifyToken, (req, res) => {
    res.json({ message: `Welcome, ${req.user.email}`, userId: req.user.userId });
});

module.exports = router;
