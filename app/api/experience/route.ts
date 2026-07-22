import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Experience from '@/models/Experience';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  try {
    await dbConnect();
    const experience = await Experience.find().sort({ createdAt: -1 });
    return NextResponse.json(experience);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const data = await request.json();
    const experience = await Experience.create(data);
    return NextResponse.json(experience, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
