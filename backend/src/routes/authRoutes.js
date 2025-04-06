const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const { register, login } = require("../controllers/authController");
const { check } = require("express-validator");
const { requestPasswordReset, resetPassword } = require("../controllers/authController");
const { verifySecurityQuestion } = require("../controllers/authController");
const {  adminLogin, checkUserExists, resetPasswordWithOtp} = require("../controllers/authController");

const { sendOtpByEmail, verifyOtpByEmail } = require("../controllers/authController");

const { startDuoAuth, handleDuoCallback, changePassword } = require("../controllers/authController");

const { instructorLogin } = require("../controllers/authController");



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
router.post("/send-otp-email", sendOtpByEmail);
router.post("/verify-otp-email", verifyOtpByEmail);
router.post("/duo/auth", startDuoAuth);
router.get("/duo/callback", handleDuoCallback);

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
// backend/routes/authRoutes.js

router.post("/admin-login", adminLogin);

// 🟢 Request Password Reset
router.post("/request-password-reset", requestPasswordReset);
// 🟢 Reset Password
router.post("/reset-password/", resetPassword);
// 🟢 Send OTP for Reset


// 🟢 User Login (Manual)
router.post("/login", login);

// 🟢 Google Login Route
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false,
  prompt: 'consent select_account'

}));

router.get('/google/callback', passport.authenticate('google', {
  session: false,
  failureRedirect: '/login' // fallback on failure
}), (req, res) => {
  const token = jwt.sign(
    { id: req.user.id, name: req.user.name, provider: req.user.provider },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  // ✅ REDIRECT instead of res.json
  res.redirect(`http://localhost:3000/oauth-callback?token=${token}`);
});

router.get('/facebook', passport.authenticate('facebook', { session: false ,   prompt: 'consent select_account'
}));

router.get('/facebook/callback', passport.authenticate('facebook', {
  session: false,
  failureRedirect: '/login'
}), (req, res) => {
  const token = jwt.sign(
    { id: req.user.id, name: req.user.name, provider: req.user.provider },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.redirect(`http://localhost:3000/oauth-callback?token=${token}`);
});

router.post("/instructor-login", instructorLogin);


router.post('/check-user', checkUserExists);
router.post("/change-password", changePassword);

// routes/authRoutes.js
router.post("/reset-password-otp", resetPasswordWithOtp);
router.post("/verify-security-question", verifySecurityQuestion);

module.exports = router;
