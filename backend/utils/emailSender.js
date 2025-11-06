import nodemailer from "nodemailer";
import emailConfig from "../config/emailConfig.js";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: emailConfig.service,
  auth: emailConfig.auth,
});

// Verify transporter configuration
transporter.verify((error) => {
  if (error) {
    console.error("❌ Email transporter verification failed:", error);
  } else {
    console.log("✅ Email server is ready to send messages");
  }
});

const sendVerificationEmail = async (email, code) => {
  try {
    console.log(`📧 Attempting to send OTP to: ${email}`);
    console.log(`🔑 OTP Code: ${code}`);
    
    const mailOptions = {
      from: emailConfig.from,
      to: email,
      subject: "Verify Your Email Address",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
          <div style="text-align: center;">
            <h1 style="color: #007bff; margin: 0;">Nextute</h1>
            <h2 style="color: #333;">Email Verification</h2>
          </div>
          <p>Hi there,</p>
          <p>Thank you for signing up. To complete your registration, please use the verification code below:</p>
          <div style="background: #f3f3f3; padding: 15px; text-align: center; border-radius: 5px; font-size: 24px; font-weight: bold; letter-spacing: 2px; margin: 20px 0;">
            ${code}
          </div>
          <p>This code will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
          <p>Best regards,<br><strong>Nextute Team</strong></p>
          <hr style="margin-top: 30px;" />
          <div style="font-size: 12px; color: #888; text-align: center;">
            © ${new Date().getFullYear()} Nextute. All rights reserved.
          </div>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", info.messageId);
    console.log("📬 Response:", info.response);
    return info;
  } catch (error) {
    console.error("❌ Failed to send verification email:", error);
    console.error("Error details:", {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
    });
    throw error;
  }
};


export const sendAdminAlertEmail = async (action, adminEmail) => {
  const mailOptions = {
    from: emailConfig.from,
    to: process.env.EMAIL_USER,
    subject: `Admin ${action} Alert`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
        <h2 style="color: #333;">Admin ${action} Notification</h2>
        <p>An admin has just <strong>${action}</strong>.</p>
        <p>Email: <strong>${adminEmail}</strong></p>
        <p>Time: ${new Date().toLocaleString()}</p>
        <hr style="margin-top: 30px;" />
        <div style="font-size: 12px; color: #888; text-align: center;">
          © ${new Date().getFullYear()} Nextute. All rights reserved.
        </div>
      </div>
    `,
  };
  await transporter.sendMail(mailOptions);
};

export default sendVerificationEmail;
