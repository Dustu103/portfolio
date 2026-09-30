import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import type { ContactFormInput } from '@/types/portfolio';

// HTML email template
const generateEmailTemplate = (name: string, email: string, userMessage: string): string => `
  <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1a202c; padding: 24px; background-color: #f7fafc;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 32px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); border: 1px solid #e2e8f0;">
      <div style="border-bottom: 2px solid #16f2b3; padding-bottom: 16px; margin-bottom: 24px;">
        <h2 style="color: #0d1224; margin: 0; font-size: 22px;">Portfolio Message Received</h2>
        <p style="color: #718096; margin: 4px 0 0 0; font-size: 14px;">Someone submitted the contact form on your portfolio.</p>
      </div>

      <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
        <tr>
          <td style="padding: 8px 0; color: #718096; font-size: 14px; width: 80px;"><strong>From:</strong></td>
          <td style="padding: 8px 0; color: #1a202c; font-size: 15px; font-weight: 600;">${name}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #718096; font-size: 14px;"><strong>Email:</strong></td>
          <td style="padding: 8px 0; color: #0070f3; font-size: 15px;"><a href="mailto:${email}" style="color: #0070f3; text-decoration: none;">${email}</a></td>
        </tr>
      </table>

      <div style="margin-top: 16px;">
        <p style="color: #718096; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 8px 0;"><strong>Message:</strong></p>
        <div style="background-color: #f8fafc; border-left: 4px solid #16f2b3; padding: 16px; border-radius: 4px; font-size: 15px; line-height: 1.6; color: #2d3748; white-space: pre-wrap;">${userMessage}</div>
      </div>

      <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #edf2f7; text-align: center;">
        <a href="mailto:${email}?subject=${encodeURIComponent(`Re: Portfolio message from ${name}`)}" style="display: inline-block; background-color: #16f2b3; color: #0d1224; padding: 10px 24px; font-weight: 600; font-size: 14px; text-decoration: none; border-radius: 6px;">Reply Directly to ${name}</a>
      </div>
    </div>
  </div>
`;

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

// Helper function to send an email via Nodemailer
async function sendEmail(payload: ContactFormInput): Promise<{ success: boolean; error?: string }> {
  const emailUser = process.env.EMAIL_ADDRESS;
  const rawPass = process.env.GMAIL_PASSKEY;
  const receiverEmail = process.env.RECEIVER_EMAIL || 'arnabpramanik103@gmail.com';

  if (!emailUser || !rawPass) {
    return { success: false, error: 'Email credentials not configured in environment' };
  }

  const emailPass = rawPass.replace(/\s+/g, '');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  const { name, email, message: userMessage } = payload;
  const mailOptions = {
    from: `"Portfolio Contact Form" <${emailUser}>`,
    to: receiverEmail,
    subject: `New Message From ${name} (Portfolio)`,
    text: `New message from ${name} (${email}):\n\n${userMessage}`,
    html: generateEmailTemplate(name, email, userMessage),
    replyTo: email,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    const err = error as { message?: string };
    console.error('Error while sending email:', err.message);
    return { success: false, error: err.message };
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload: ContactFormInput = await request.json();
    const { name, email, message: userMessage } = payload;

    if (!name?.trim() || !email?.trim() || !userMessage?.trim()) {
      return NextResponse.json({
        success: false,
        message: 'Name, email, and message are all required.',
      }, { status: 400 });
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chat_id = process.env.TELEGRAM_CHAT_ID;
    const emailConfigured = Boolean(process.env.EMAIL_ADDRESS && process.env.GMAIL_PASSKEY);
    const telegramConfigured = Boolean(token && chat_id);

    if (!emailConfigured && !telegramConfigured) {
      return NextResponse.json({
        success: false,
        configured: false,
        message: 'Email service is pending credentials. You can click below to send directly via mail.',
      }, { status: 503 });
    }

    let telegramSuccess = false;
    let emailResult: { success: boolean; error?: string } = { success: false };

    // Try email if configured
    if (emailConfigured) {
      emailResult = await sendEmail(payload);
    }

    // Try Telegram if configured
    if (telegramConfigured && token && chat_id) {
      const tgText = `📬 New Portfolio Message\n\nFrom: ${name}\nEmail: ${email}\n\nMessage:\n${userMessage}`;
      telegramSuccess = await sendTelegramMessage(token, chat_id, tgText);
    }

    // Succeed if at least one channel worked
    if (emailResult.success || telegramSuccess) {
      return NextResponse.json({
        success: true,
        message: 'Message sent successfully! I will get back to you soon.',
      }, { status: 200 });
    }

    return NextResponse.json({
      success: false,
      message: emailResult.error || 'Failed to send message. Please try emailing directly.',
    }, { status: 500 });
  } catch (error) {
    const err = error as { message?: string };
    console.error('API Error:', err.message);
    return NextResponse.json({
      success: false,
      message: 'Server error occurred while processing message.',
    }, { status: 500 });
  }
}
