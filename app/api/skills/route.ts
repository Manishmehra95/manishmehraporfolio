import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Skill from '@/models/Skill';
import { getAuthUser } from '@/lib/auth';

export async function GET() {
  try {
    await dbConnect();
    const skills = await Skill.find().sort({ createdAt: -1 });
    return NextResponse.json(skills);
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
    const skill = await Skill.create(data);
    return NextResponse.json(skill, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
