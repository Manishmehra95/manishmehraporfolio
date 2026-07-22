import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Seo from '@/models/Seo';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  try {
    await dbConnect();
    const seo = await Seo.findOne();
    return NextResponse.json(seo || {});
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
    let seo = await Seo.findOne();

    if (seo) {
      seo = await Seo.findByIdAndUpdate(seo._id, data, { new: true });
    } else {
      seo = await Seo.create(data);
    }

    return NextResponse.json(seo);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
