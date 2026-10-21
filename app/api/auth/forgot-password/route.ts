import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Admin from '@/models/Admin';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Please enter your email address' }, { status: 400 });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      // Return success even if not found to prevent user enumeration security vulnerability,
      // but do not send email.
      return NextResponse.json({
        success: true,
        message: 'If the email matches our records, a password reset link has been sent.',
      });
    }

    // Generate reset token and expiry
    const resetToken = crypto.randomBytes(32).toString('hex');
    admin.resetPasswordToken = resetToken;
    admin.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour expiry
    await admin.save();

    // Dynamically resolve live app URL with intelligent platform fallbacks (Vercel & Netlify)
    const rawHost = request.headers.get('x-forwarded-host') || request.headers.get('host');
    const proto = request.headers.get('x-forwarded-proto') || 'https';
    
    let appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!appUrl) {
      if (rawHost && !rawHost.includes('localhost') && !rawHost.includes('127.0.0.1')) {
        appUrl = `${proto}://${rawHost}`;
      } else if (process.env.VERCEL_URL) {
        appUrl = `https://${process.env.VERCEL_URL}`;
      } else if (process.env.URL) {
        appUrl = process.env.URL;
      } else if (rawHost) {
        appUrl = `${proto}://${rawHost}`;
      } else {
        appUrl = 'http://localhost:3000';
      }
    }
    
    const resetLink = `${appUrl}/admin/reset-password?token=${resetToken}`;

    const emailUser = process.env.EMAIL_SERVER_USER;
    const emailPass = process.env.EMAIL_SERVER_PASSWORD;

    if (!emailUser || !emailPass) {
      return NextResponse.json({
        error: 'Email service is not configured on the server. Please configure SMTP credentials.',
      }, { status: 500 });
    }

    // Configure SMTP nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_SERVER_PORT || '465'),
      secure: process.env.EMAIL_SERVER_PORT === '465', // true for port 465
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM || emailUser,
      to: admin.email,
      subject: 'Reset Password - Admin Portal',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 16px;">
          <h2 style="color: #f97316; font-size: 24px; font-weight: bold; margin-bottom: 20px;">Password Reset Request</h2>
          <p style="font-size: 16px; color: #334155; line-height: 1.6;">You are receiving this email because you requested a password reset for your Admin Portal.</p>
          <p style="font-size: 16px; color: #334155; line-height: 1.6; margin-bottom: 30px;">Please click the button below to choose a new password. This link is valid for 1 hour:</p>
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${resetLink}" target="_blank" style="background-color: #f97316; color: white; padding: 12px 24px; text-decoration: none; font-size: 16px; font-weight: bold; border-radius: 8px; display: inline-block;">Reset Password</a>
          </div>
          <p style="font-size: 14px; color: #64748b; line-height: 1.5;">If you did not request this, please ignore this email and your password will remain unchanged.</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
          <p style="font-size: 12px; color: #94a3b8; text-align: center;">Manish Mehra Portfolio Admin Portal Security</p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);

      return NextResponse.json({
        success: true,
        message: 'A password reset link has been sent securely to your Gmail address.',
      });
    } catch (mailError: any) {
      console.error('SMTP Mail error:', mailError.message);
      return NextResponse.json({
        error: `Failed to send email to Gmail (${mailError.message}). Please check Google App Password.`,
      }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
