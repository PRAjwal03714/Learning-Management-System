const express = require("express");
const { authMiddleware } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/dashboard", authMiddleware, (req, res) => {
  res.json({ message: `Welcome ${req.user.role}! This is your dashboard.` });
});

module.exports = router;
