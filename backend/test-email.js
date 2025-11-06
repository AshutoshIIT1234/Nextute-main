import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

console.log("🔍 Testing Email Configuration...\n");

// Check environment variables
console.log("📋 Environment Variables:");
console.log("EMAIL_USER:", process.env.EMAIL_USER ? "✅ Set" : "❌ Missing");
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ Set" : "❌ Missing");
console.log("Email User Value:", process.env.EMAIL_USER);
console.log("\n");

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Test connection
console.log("🔌 Testing SMTP connection...");
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Connection failed:", error.message);
    console.error("Full error:", error);
  } else {
    console.log("✅ SMTP server is ready to send emails");
    
    // Send test email
    console.log("\n📧 Sending test email...");
    const testCode = "123456";
    
    const mailOptions = {
      from: `"Nextute EdTech Pvt. Ltd." <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to yourself for testing
      subject: "Test OTP Email",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <h2 style="color: #333;">Test Email Verification</h2>
          <p>This is a test email to verify OTP sending functionality.</p>
          <div style="background: #f3f3f3; padding: 15px; text-align: center; border-radius: 5px; font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 20px 0;">
            ${testCode}
          </div>
          <p>If you received this, your email configuration is working!</p>
        </div>
      `,
    };
    
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("❌ Failed to send test email:", err.message);
        console.error("Full error:", err);
      } else {
        console.log("✅ Test email sent successfully!");
        console.log("Message ID:", info.messageId);
        console.log("Response:", info.response);
      }
      process.exit(0);
    });
  }
});
