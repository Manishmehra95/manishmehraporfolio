import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Admin from '@/models/Admin';
import { comparePassword, signToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Please enter all fields' }, { status: 400 });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }

    const isMatch = await comparePassword(password, admin.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
    }

    const cookieStore = await cookies();

    // Check if 2FA is enabled
    if (admin.twoFactorEnabled && admin.twoFactorSecret) {
      // Create a short-lived temporary 2FA token
      const tempToken = signToken({ id: admin._id, email: admin.email, step: '2fa' }, '5m');
      
      cookieStore.set('temp_2fa_token', tempToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 5 * 60, // 5 minutes
        path: '/',
      });

      return NextResponse.json({ twoFactorRequired: true });
    }

    // Standard login if 2FA is not enabled
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
