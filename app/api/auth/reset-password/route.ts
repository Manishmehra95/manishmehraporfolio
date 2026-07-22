import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { recoveryKey, newPassword } = await request.json();

    if (!recoveryKey || !newPassword) {
      return NextResponse.json({ error: 'Please enter recovery key and new password' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
    }

    // Find the admin user (only one admin exists)
    const admin = await Admin.findOne();
    if (!admin || !admin.recoveryKey) {
      return NextResponse.json({ error: 'Admin recovery configuration not found' }, { status: 400 });
    }

    // Verify recovery key
    const isRecoveryMatch = await bcrypt.compare(recoveryKey, admin.recoveryKey);
    if (!isRecoveryMatch) {
      return NextResponse.json({ error: 'Invalid security recovery key' }, { status: 400 });
    }

    // Hash and update new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedNewPassword;

    // Auto-disable 2FA upon recovery key reset (in case they lost their 2FA device)
    admin.twoFactorEnabled = false;
    admin.twoFactorSecret = undefined;

    await admin.save();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
