const nodemailer = require("nodemailer");

const baseUrl = process.env.NEXT_PUBLIC_API_URL;


const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendResetEmail = async (email, token) => {
  const resetLink = `${baseUrl}/api/auth/reset-password/${token}`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset Request",
    html: `<p>You requested a password reset.</p>
           <p>Click <a href="${resetLink}">here</a> to reset your password.</p>
           <p>This link is valid for 15 minutes.</p>`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email Sent:", info.response);
    return { success: true, message: "Reset email sent successfully." };
  } catch (error) {
    console.error("Email Sending Error:", error);
    return { success: false, message: "Error sending email.", error };
  }
};
