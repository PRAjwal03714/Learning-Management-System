const pool = require("../config/db"); // PostgreSQL connection
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const { sendResetEmail } = require("../utils/emailService");
const DuoUniversal = require("@duosecurity/duo_universal").Client;

let resetTokens = {}; // Temporary storage for reset tokens
let otpStore = {}; // Temporary storage for OTPs

console.log("DUO_CLIENT_ID:", process.env.DUO_CLIENT_ID);
console.log("DUO_CLIENT_SECRET:", process.env.DUO_CLIENT_SECRET);
console.log("DUO_API_HOSTNAME:", process.env.DUO_API_HOSTNAME);
console.log("DUO_REDIRECT_URI:", process.env.DUO_REDIRECT_URI);

const duo = new DuoUniversal({
  clientId: process.env.DUO_CLIENT_ID?.trim(),
  clientSecret: process.env.DUO_CLIENT_SECRET?.trim(),
  apiHost: process.env.DUO_API_HOSTNAME?.trim(),
  redirectUrl: process.env.DUO_REDIRECT_URI?.trim(),
});


exports.startDuoAuth = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ message: "Username is required" });

    // Generate Duo Authentication URL
    const state = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "5m" });
    const authUrl = duo.createAuthUrl(username, state);

    res.json({ authUrl });
  } catch (error) {
    console.error("Error initiating Duo Authentication:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Step 2: Handle Duo Callback After Verification
exports.duoCallback = async (req, res) => {
  try {
    const { state, duo_code } = req.query;

    // Verify JWT state token
    const decoded = jwt.verify(state, process.env.JWT_SECRET);
    const username = decoded.username;

    // Exchange Duo code for authentication result
    const duoResponse = await duo.exchangeAuthorizationCodeFor2FAResult(duo_code, username);

    if (!duoResponse.success) {
      return res.status(401).json({ message: "Duo Authentication Failed" });
    }

    // Generate final session token for the user
    const token = jwt.sign({ username, duoVerified: true }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ message: "Duo Authentication Successful", token });
  } catch (error) {
    console.error("Error in Duo Callback:", error);
    res.status(500).json({ message: "Duo Authentication Error" });
  }
};

// 🟢 Register User with Security Question
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  const { name, username, email, password, role, securityQuestion, securityAnswer } = req.body;

  if (!username || username.length < 3) {
      return res.status(400).json({ message: "Username must be at least 3 characters long" });
  }

  try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const hashedSecurityAnswer = await bcrypt.hash(securityAnswer, 10);

      const newUser = await pool.query(
          `INSERT INTO users (id, name, username, email, password, role, security_question, security_answer)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, name, username, email, role`,
          [uuidv4(), name, username, email, hashedPassword, role, securityQuestion, hashedSecurityAnswer]
      );

      res.status(201).json({ message: "User registered successfully", user: newUser.rows[0] });
  } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: "Server error", error: error.message });
  }
};


// 🟢 User Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.rows[0].password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Generate JWT Token
    const token = jwt.sign(
      { id: user.rows[0].id, role: user.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", token });

  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟢 Request Password Reset (Generates Reset Token)
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) return res.status(404).json({ message: "User not found" });

    // Generate a reset token
    const token = uuidv4();
    resetTokens[email] = { token, expires: Date.now() + 15 * 60 * 1000 }; // Valid for 15 mins

    // Send reset email
    const emailResponse = await sendResetEmail(email, token);
    if (!emailResponse.success) return res.status(500).json({ message: emailResponse.message });

    res.json({ message: "Password reset link sent to email." });

  } catch (error) {
    console.error("Error in password reset request:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟢 Reset Password Using Reset Token
exports.resetPassword = async (req, res) => {
  const { email, newPassword, resetToken } = req.body;

  try {
    if (!resetTokens[email] || resetTokens[email].token !== resetToken || Date.now() > resetTokens[email].expires) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password in PostgreSQL
    await pool.query("UPDATE users SET password = $1 WHERE email = $2", [hashedPassword, email]);

    delete resetTokens[email]; // Remove token after use

    res.json({ message: "Password reset successful. You can now log in with your new password." });

  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟢 Send OTP for Password Reset
exports.sendOTP = async (req, res) => {
  const { email } = req.body;

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 }; // Valid for 5 mins

  console.log(`OTP for ${email}: ${otp}`); // Replace this with actual email/SMS logic

  res.json({ message: "OTP sent to email. Check your inbox." });
};

// 🟢 Verify OTP
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!otpStore[email] || otpStore[email].otp !== parseInt(otp) || Date.now() > otpStore[email].expires) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  delete otpStore[email]; // Remove OTP after use
  res.json({ message: "OTP verified. You can now reset your password." });
};

// 🟢 Verify Security Question Before Resetting Password
exports.verifySecurityQuestion = async (req, res) => {
  const { email, securityAnswer } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(securityAnswer, user.rows[0].security_answer);
    if (!isMatch) return res.status(400).json({ message: "Incorrect security answer" });

    const resetToken = uuidv4();
    resetTokens[email] = { token: resetToken, expires: Date.now() + 15 * 60 * 1000 };

    res.json({ message: "Security answer verified. Use this token to reset your password.", resetToken });

  } catch (error) {
    console.error("Error verifying security question:", error);
    res.status(500).json({ message: "Server error" });
  }
};
