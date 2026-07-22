import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Admin from '@/models/Admin';
import { getAuthUser } from '@/lib/auth';
import { generateSecret, generateURI } from 'otplib';
import qrcode from 'qrcode';

export async function GET() {
  try {
    const user = await getAuthUser() as any;
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const admin = await Admin.findById(user.id);
    if (!admin) {
      return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    }

    // Generate new secret key and URI in otplib v13 style
    const secret = generateSecret();
    const keyuri = generateURI({
      issuer: 'Manish Mehra Portfolio',
      label: admin.email,
      secret: secret,
    });
    const qrCodeUrl = await qrcode.toDataURL(keyuri);

    // Save secret temporarily (not enabled until confirmed)
    admin.twoFactorSecret = secret;
    await admin.save();

    return NextResponse.json({
      secret,
      qrCode: qrCodeUrl,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Setup failed' }, { status: 500 });
  }
}
