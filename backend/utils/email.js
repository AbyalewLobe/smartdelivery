import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

// Ensure env vars are loaded (handles ES module import hoisting issue)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

// Log email configuration on startup (without sensitive data)
console.log('Email Configuration:', {
  host: process.env.EMAIL_HOST || 'NOT SET',
  port: process.env.EMAIL_PORT || 'NOT SET',
  user: process.env.EMAIL_USER || 'NOT SET',
  hasPassword: !!process.env.EMAIL_PASSWORD,
  passwordLength: process.env.EMAIL_PASSWORD?.length || 0
});

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

export const sendEmail = async (to, subject, html) => {
  // Skip if email is not configured
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.log('Email not configured, skipping email send');
    return;
  }

  try {
    await transporter.sendMail({
      from: `"Market Zone" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
};
