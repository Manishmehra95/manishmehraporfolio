import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Admin from '@/models/Admin';
import { getAuthUser } from '@/lib/auth';
import { verify } from 'otplib';

export async function POST(request: Request) {
  try {
    const user = await getAuthUser() as any;
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { code } = await request.json();
    if (!code) {
      return NextResponse.json({ error: 'Please enter verification code' }, { status: 400 });
    }

    await dbConnect();
    const admin = await Admin.findById(user.id);
    if (!admin || !admin.twoFactorSecret) {
      return NextResponse.json({ error: 'Admin configuration not found' }, { status: 404 });
    }

    // Verify 6-digit code (async in otplib v13)
    const result = await verify({
      token: code,
      secret: admin.twoFactorSecret,
    });

    if (!result.valid) {
      return NextResponse.json({ error: 'Invalid verification code. Please try again.' }, { status: 400 });
    }

    // Enable 2FA
    admin.twoFactorEnabled = true;
    await admin.save();

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Verification failed' }, { status: 500 });
  }
}
