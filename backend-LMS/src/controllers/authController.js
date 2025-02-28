const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
const { sendResetEmail } = require("../utils/emailService");

const usersFilePath = path.join(__dirname, "../users.json");

// Load users from file
const loadUsers = () => {
  if (!fs.existsSync(usersFilePath)) return [];
  return JSON.parse(fs.readFileSync(usersFilePath, "utf-8"));
};

// Save users to file
const saveUsers = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

let resetTokens = {}; // Temporary storage for reset tokens
let otpStore = {}; // Temporary storage for OTPs

// 🟢 User Registration
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password, role } = req.body;
  let users = loadUsers();

  // Check if email already exists
  if (users.some(user => user.email === email)) {
    return res.status(400).json({ message: "Email already in use" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = { id: users.length + 1, name, email, password: hashedPassword, role };
  users.push(newUser);
  saveUsers(users);

  res.status(201).json({ message: "User registered successfully", user: newUser });
};

// 🟢 User Login
exports.login = async (req, res) => {
  const { email, password } = req.body;
  const users = loadUsers();
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ message: "Login successful", token });
};

// 🟢 Request Password Reset (Generates Reset Token)
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  let users = loadUsers();
  const user = users.find(u => u.email === email);
  if (!user) return res.status(404).json({ message: "User not found" });

  // Generate a reset token
  const token = uuidv4();
  resetTokens[email] = { token, expires: Date.now() + 15 * 60 * 1000 }; // Valid for 15 mins

  // Send reset email
  const emailResponse = await sendResetEmail(email, token);
  if (!emailResponse.success) return res.status(500).json({ message: emailResponse.message });

  res.json({ message: "Password reset link sent to email." });
};

// 🟢 Reset Password (Verify Token & Update Password)
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { email, newPassword } = req.body;
  let users = loadUsers();

  // Check if token is valid
  if (!resetTokens[email] || resetTokens[email].token !== token || Date.now() > resetTokens[email].expires) {
    return res.status(400).json({ message: "Invalid or expired reset token" });
  }

  // Find user and update password
  const userIndex = users.findIndex((u) => u.email === email);
  if (userIndex === -1) return res.status(404).json({ message: "User not found" });

  users[userIndex].password = await bcrypt.hash(newPassword, 10);
  saveUsers(users);
  delete resetTokens[email]; // Remove token after use

  res.json({ message: "Password reset successful. You can now log in with your new password." });
};

// 🟢 Send OTP for Password Reset
exports.sendOTP = async (req, res) => {
  const { email } = req.body;
  let users = loadUsers();

  // Check if user exists
  const user = users.find(u => u.email === email);
  if (!user) return res.status(404).json({ message: "User not found" });

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 }; // Valid for 5 mins

  // Simulate sending OTP (replace with actual email/SMS logic)
  console.log(`OTP for ${email}: ${otp}`);

  res.json({ message: "OTP sent to email. Check your inbox." });
};

// 🟢 Verify OTP and Allow Password Reset
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!otpStore[email] || otpStore[email].otp !== parseInt(otp) || Date.now() > otpStore[email].expires) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  delete otpStore[email]; // Remove OTP after use
  res.json({ message: "OTP verified. You can now reset your password." });
};
