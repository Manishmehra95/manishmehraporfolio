import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Hero from '@/models/Hero';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  try {
    await dbConnect();
    const hero = await Hero.findOne();
    return NextResponse.json(hero || {});
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
    let hero = await Hero.findOne();

    if (hero) {
      hero = await Hero.findByIdAndUpdate(hero._id, data, { new: true });
    } else {
      hero = await Hero.create(data);
    }

    return NextResponse.json(hero);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
