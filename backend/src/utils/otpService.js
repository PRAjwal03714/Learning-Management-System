const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const otpStore = {};

// 🟢 Generate and Send OTP
exports.sendOTP = async (email) => {
  if (!email || typeof email !== "string") {
    console.error("❌ Invalid email received:", email);
    return { success: false, message: "Invalid email address" };
  }

  email = email.trim(); // Remove spaces

  console.log("📨 Sending OTP to:", email);

  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 }; // Valid for 5 mins

  // ✅ Send OTP via email
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
    return { success: true, message: "OTP sent to email." };
  } catch (error) {
    console.error("❌ Error sending OTP email:", error);
    return { success: false, message: "Error sending OTP email." };
  }
};

// Export this so other files can access otpStore if needed
exports.otpStore = otpStore;
