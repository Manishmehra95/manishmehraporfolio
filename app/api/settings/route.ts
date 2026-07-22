import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Settings from '@/models/Settings';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  try {
    await dbConnect();
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({ theme: 'dark', visitorsCount: 0 });
    }
    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST() {
  try {
    await dbConnect();
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({ theme: 'dark', visitorsCount: 1 });
    } else {
      settings.visitorsCount += 1;
      await settings.save();
    }
    return NextResponse.json({ success: true, visitorsCount: settings.visitorsCount });
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
    let settings = await Settings.findOne();

    if (settings) {
      settings = await Settings.findByIdAndUpdate(settings._id, data, { new: true });
    } else {
      settings = await Settings.create(data);
    }

    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
