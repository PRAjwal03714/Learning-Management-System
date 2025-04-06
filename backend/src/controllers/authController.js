const pool = require("../config/db"); // PostgreSQL connection
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const { sendResetEmail } = require("../utils/emailService");
const DuoUniversal = require("@duosecurity/duo_universal").Client;

// let resetTokens = {}; // Temporary storage for reset tokens

// console.log("DUO_CLIENT_ID:", process.env.DUO_CLIENT_ID);
// console.log("DUO_CLIENT_SECRET:", process.env.DUO_CLIENT_SECRET);
// console.log("DUO_API_HOSTNAME:", process.env.DUO_API_HOSTNAME);
// console.log("DUO_REDIRECT_URI:", process.env.DUO_REDIRECT_URI);


const duo = new DuoUniversal({
  clientId: process.env.DUO_CLIENT_ID,
  clientSecret: process.env.DUO_CLIENT_SECRET,
  apiHost: process.env.DUO_API_HOSTNAME,
  redirectUrl: process.env.DUO_REDIRECT_URI,
});
// backend/controllers/authController.js

const nodemailer = require("nodemailer");

const otpStore = {}; // in-memory storage


exports.sendOtpByEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };

  // Inline transporter setup
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your OTP Code",
    html: `<p>Your OTP code is: <strong>${otp}</strong></p>
           <p>This code is valid for 5 minutes.</p>`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ OTP Email sent successfully:", info.response);
    return res.json({ message: "OTP sent to email." });
  } catch (error) {
    console.error("❌ Error sending OTP email:", error);
    return res.status(500).json({ message: "Failed to send OTP email." });
  }
};

exports.verifyOtpByEmail = (req, res) => {
  const { email, otp } = req.body;

  if (
    !otpStore[email] ||
    otpStore[email].otp !== parseInt(otp) ||
    Date.now() > otpStore[email].expires
  ) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  delete otpStore[email];
  return res.json({ message: "OTP verified successfully" });
};




// Initiate Duo


exports.startDuoAuth = async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ message: "Username required" });

  const state = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "5m" });
  const authUrl = duo.createAuthUrl(username, state);
  res.json({ authUrl });
};

exports.handleDuoCallback = async (req, res) => {
  const { duo_code, state } = req.query;
  if (!duo_code || !state) return res.status(400).json({ message: "Missing Duo code or state" });

  try {
    const decoded = jwt.verify(state, process.env.JWT_SECRET);
    const username = decoded.username;

    const result = await duo.exchangeAuthorizationCodeFor2FAResult(duo_code, username);
    if (result?.auth_result?.result !== "allow") {
      return res.status(401).json({ message: "Duo Authentication Failed" });
    }

    const token = jwt.sign(
      { username, duoVerified: true },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    
    // 👇 redirect to frontend with token as query param
    res.redirect(`http://localhost:3000/duo-auth?token=${token}`);
  } catch (err) {
    console.error("Duo Callback Error:", err);
    res.status(500).json({ message: "Duo verification failed" });
  }
};
exports.changePassword = async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.rows[0].password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password = $1 WHERE email = $2", [hashed, email]);

    res.json({ message: "Password updated successfully." });
  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (user.rows.length === 0) {
      return res.status(401).json({ message: "Admin not found" });
    }

    const admin = user.rows[0];

    if (admin.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Not an admin" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: admin.id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Admin login successful", token });

  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟢 Register User with Security Question
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, username, email, password, role, securityQuestion, securityAnswer } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedAnswer = await bcrypt.hash(securityAnswer, 10);
    const userId = uuidv4();

    // Insert into users table
    const newUser = await pool.query(
      `INSERT INTO users (id, name, username, email, password, role, security_question, security_answer)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, name, username, email, role`,
      [userId, name, username, email, hashedPassword, role, securityQuestion, hashedAnswer]
    );

    // If instructor, add to instructors table
    if (role === 'instructor') {
      const instructorId = `INST-${Math.floor(100000 + Math.random() * 900000)}`; // Generate instructor ID
      await pool.query(
        `INSERT INTO instructors (user_id, instructor_id, is_approved)
         VALUES ($1, $2, $3)`,
        [userId, instructorId, false]
      );
    }

    res.status(201).json({ message: "User registered successfully", user: newUser.rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      let msg = "Username or email already exists";
      if (error.detail.includes("username")) msg = "Username already taken";
      else if (error.detail.includes("email")) msg = "Email already registered";
      return res.status(400).json({ message: msg });
    }
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// 🟢 User Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = userResult.rows[0];

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // 🔐 If the user is an instructor, check approval status
    if (user.role === 'instructor') {
      const instructorResult = await pool.query(
        "SELECT is_approved FROM instructors WHERE user_id = $1",
        [user.id]
      );

      const instructor = instructorResult.rows[0];
      if (!instructor || !instructor.is_approved) {
        return res.status(403).json({ message: "Instructor account not approved by admin yet." });
      }
    }

    // 👇 If 2FA/Duo is required (customize this condition)
    const requiresDuo = true;
    if (requiresDuo) {
      return res.status(200).json({ duoRequired: true });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Login successful", token });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.instructorLogin = async (req, res) => {
  const { instructorId, password } = req.body;

  if (!instructorId || !password) {
    return res.status(400).json({ message: "Instructor ID and password are required." });
  }

  try {
    // Get instructor by instructor_id
    const instructorRes = await pool.query(
      `SELECT i.*, u.password, u.role FROM instructors i
       JOIN users u ON u.id = i.user_id
       WHERE i.instructor_id = $1`,
      [instructorId]
    );

    if (instructorRes.rows.length === 0) {
      return res.status(404).json({ message: "Instructor not found." });
    }

    const instructor = instructorRes.rows[0];

    // Check if approved
    if (!instructor.is_approved) {
      return res.status(403).json({ message: "Approval pending by admin." });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, instructor.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password." });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: instructor.user_id, role: instructor.role, instructorId },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ message: "Instructor login successful", token });
  } catch (err) {
    console.error("Instructor login error:", err);
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
exports.checkUserExists = async (req, res) => {
  const { email } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ exists: false, message: "User not found" });
    }

    return res.status(200).json({ exists: true, message: "User found" });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ exists: false, message: "Internal server error" });
  }
};


// controllers/authController.js
exports.resetPasswordWithOtp = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password = $1 WHERE email = $2", [hashedPassword, email]);

    res.json({ message: "Password reset successful via OTP." });
  } catch (error) {
    console.error("Error resetting password via OTP:", error);
    res.status(500).json({ message: "Server error" });
  }
};

