import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import type { ContactFormInput } from '@/types/portfolio';

// Create and configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.GMAIL_PASSKEY,
  },
});

// Helper function to send a message via Telegram
async function sendTelegramMessage(token: string, chat_id: string, message: string): Promise<boolean> {
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  try {
    const res = await axios.post(url, { text: message, chat_id });
    return res.data.ok;
  } catch (error) {
    const err = error as { response?: { data?: unknown }; message?: string };
    console.error('Error sending Telegram message:', err.response?.data ?? err.message);
    return false;
  }
}

// HTML email template
const generateEmailTemplate = (name: string, email: string, userMessage: string): string => `
  <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
      <h2 style="color: #007BFF;">New Message Received</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <blockquote style="border-left: 4px solid #007BFF; padding-left: 10px; margin-left: 0;">
        ${userMessage}
      </blockquote>
      <p style="font-size: 12px; color: #888;">Click reply to respond to the sender.</p>
    </div>
  </div>
`;

// Helper function to send an email via Nodemailer
async function sendEmail(payload: ContactFormInput, message: string): Promise<boolean> {
  const { name, email, message: userMessage } = payload;

  const mailOptions = {
    from: "Portfolio",
    to: process.env.EMAIL_ADDRESS,
    subject: `New Message From ${name}`,
    text: message,
    html: generateEmailTemplate(name, email, userMessage),
    replyTo: email,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    const err = error as { message?: string };
    console.error('Error while sending email:', err.message);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload: ContactFormInput = await request.json();
    const { name, email, message: userMessage } = payload;
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chat_id = process.env.TELEGRAM_CHAT_ID;

    const message = `New message from ${name}\n\nEmail: ${email}\n\nMessage:\n\n${userMessage}\n\n`;

    let telegramSuccess = false;
    let emailSuccess = false;

    // Try Telegram if configured
    if (token && chat_id) {
      telegramSuccess = await sendTelegramMessage(token, chat_id, message);
    }

    // Try email if configured
    if (process.env.EMAIL_ADDRESS && process.env.GMAIL_PASSKEY) {
      emailSuccess = await sendEmail(payload, message);
    }

    // Succeed if at least one channel worked (graceful fallback)
    if (telegramSuccess || emailSuccess) {
      return NextResponse.json({
        success: true,
        message: 'Message sent successfully!',
      }, { status: 200 });
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to send message. Please check your contact configuration.',
    }, { status: 500 });
  } catch (error) {
    const err = error as { message?: string };
    console.error('API Error:', err.message);
    return NextResponse.json({
      success: false,
      message: 'Server error occurred.',
    }, { status: 500 });
  }
}
