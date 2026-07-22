import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Admin from '@/models/Admin';
import { getAuthUser } from '@/lib/auth';

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

    return NextResponse.json({
      enabled: admin.twoFactorEnabled || false,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to check status' }, { status: 500 });
  }
}
