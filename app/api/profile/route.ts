import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Profile from '@/models/Profile';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  try {
    await dbConnect();
    const profile = await Profile.findOne();
    return NextResponse.json(profile || {});
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const data = await request.json();
    let profile = await Profile.findOne();

    if (profile) {
      profile = await Profile.findByIdAndUpdate(profile._id, data, { new: true });
    } else {
      profile = await Profile.create(data);
    }

    return NextResponse.json(profile);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
