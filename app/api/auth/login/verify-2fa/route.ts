import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/db';
import Admin from '@/models/Admin';
import { verifyToken, signToken } from '@/lib/auth';
import { verify } from 'otplib';

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ error: 'Please enter verification code' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const tempToken = cookieStore.get('temp_2fa_token')?.value;

    if (!tempToken) {
      return NextResponse.json({ error: 'Session expired. Please enter password again.' }, { status: 401 });
    }

    const decoded = verifyToken(tempToken) as any;
    if (!decoded || decoded.step !== '2fa') {
      return NextResponse.json({ error: 'Invalid authentication session.' }, { status: 401 });
    }

    await dbConnect();
    const admin = await Admin.findOne({ email: decoded.email });
    
    if (!admin || !admin.twoFactorSecret) {
      return NextResponse.json({ error: 'Admin configuration not found.' }, { status: 400 });
    }

    // Verify 6-digit TOTP code (async in otplib v13)
    const result = await verify({
      token: code,
      secret: admin.twoFactorSecret,
    });

    if (!result.valid) {
      return NextResponse.json({ error: 'Invalid 2FA verification code. Please try again.' }, { status: 400 });
    }

    // Login successful - Clear temporary token
    cookieStore.delete('temp_2fa_token');

    // Sign final authentication token
    const token = signToken({ id: admin._id, email: admin.email, name: admin.name });

    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return NextResponse.json({ success: true, user: { name: admin.name, email: admin.email } });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
