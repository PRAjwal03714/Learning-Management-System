const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { register, login } = require("../controllers/authController");
const { check } = require("express-validator");
const { sendOTP, verifyOTP } = require("../controllers/authController");
const { requestPasswordReset, resetPassword } = require("../controllers/authController");
const { verifySecurityQuestion } = require("../controllers/authController");
const { startDuoAuth, duoCallback } = require("../controllers/authController");


const pool = require("../config/db");

const router = express.Router();

router.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() as current_time;");
    res.json({ message: "Database connection successful!", time: result.rows[0].current_time });
  } catch (error) {
    res.status(500).json({ message: "Database connection failed!", error: error.message });
  }
});

// 🟢 User Registration (Manual)
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Enter a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({ min: 6 }),
    check("role", "Role is required").isIn(["student", "instructor", "admin"])
  ],
  register
);

// 🟢 Request Password Reset
router.post("/request-password-reset", requestPasswordReset);
// 🟢 Reset Password
router.post("/reset-password/", resetPassword);
// 🟢 Send OTP for Reset
router.post("/send-otp", sendOTP);

// 🟢 Verify OTP
router.post("/verify-otp", verifyOTP);

// 🟢 User Login (Manual)
router.post("/login", login);

// 🟢 Google Login Route
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// 🟢 Google OAuth Callback
router.get("/google/callback", passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id, name: req.user.name, provider: req.user.provider }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ message: "Google login successful", token });
  }
);

// 🟢 Facebook Login Route
router.get("/facebook", passport.authenticate("facebook"));

// 🟢 Facebook OAuth Callback
router.get("/facebook/callback", passport.authenticate("facebook", { session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id, name: req.user.name, provider: req.user.provider }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ message: "Facebook login successful", token });
  }
);
router.post("/duo/auth", startDuoAuth); // Step 1: Initiate Duo Auth
router.get("/duo/callback", duoCallback); // Step 2: Handle Duo Callback


module.exports = router;
router.post("/verify-security-question", verifySecurityQuestion);
