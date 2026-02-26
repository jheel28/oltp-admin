const nodemailer = require("nodemailer");

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

const sendVerificationEmail = async (email, firstName, token) => {
  const transporter = createTransporter();
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const verificationUrl = `${frontendUrl}/auth/verify-email/${token}`;

  const mailOptions = {
    from: `"${process.env.APP_NAME || "The Correct Steps"}" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Verify your email address",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; border-radius: 8px;">
        <h2 style="color: #1e3a8a; margin-bottom: 8px;">Welcome, ${firstName}!</h2>
        <p style="color: #374151; font-size: 15px;">Thank you for registering. Please verify your email address to activate your account.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${verificationUrl}"
             style="background: #3b82f6; color: #fff; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-size: 16px; font-weight: 600;">
            Verify Email Address
          </a>
        </div>
        <p style="color: #6b7280; font-size: 13px;">This link will expire in 24 hours. If you did not create an account, you can safely ignore this email.</p>
        <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">If the button doesn't work, copy and paste this link into your browser:<br/>
          <span style="color: #3b82f6;">${verificationUrl}</span>
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendPasswordResetEmail = async (email, firstName, token) => {
  const transporter = createTransporter();
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const resetUrl = `${frontendUrl}/auth/reset-password/${token}`;

  const mailOptions = {
    from: `"${process.env.APP_NAME || "The Correct Steps"}" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Reset your password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb; border-radius: 8px;">
        <h2 style="color: #1e3a8a;">Password Reset Request</h2>
        <p style="color: #374151;">Hi ${firstName}, we received a request to reset your password.</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetUrl}"
             style="background: #ef4444; color: #fff; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-size: 16px; font-weight: 600;">
            Reset Password
          </a>
        </div>
        <p style="color: #6b7280; font-size: 13px;">This link will expire in 1 hour. If you did not request a password reset, ignore this email.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail };