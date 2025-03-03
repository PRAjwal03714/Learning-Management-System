require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// ✅ Change this to YOUR email
const testEmail = "prajwalgowda464@gmail.com";

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: testEmail,
  subject: "Test Email from LMS Backend",
  text: "This is a test email to verify SMTP configuration."
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error("❌ Error sending test email:", error);
  } else {
    console.log("✅ Test email sent successfully:", info.response);
  }
});
