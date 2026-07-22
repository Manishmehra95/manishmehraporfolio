import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import About from '@/models/About';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  try {
    await dbConnect();
    const about = await About.findOne();
    return NextResponse.json(about || {});
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
    let about = await About.findOne();

    if (about) {
      about = await About.findByIdAndUpdate(about._id, data, { new: true });
    } else {
      about = await About.create(data);
    }

    return NextResponse.json(about);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
