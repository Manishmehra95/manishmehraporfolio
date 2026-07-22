import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Education from '@/models/Education';
import { getAuthUser } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();
    const data = await request.json();
    const education = await Education.findByIdAndUpdate(id, data, { new: true });
    
    if (!education) {
      return NextResponse.json({ error: 'Education not found' }, { status: 404 });
    }

    return NextResponse.json(education);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();
    const education = await Education.findByIdAndDelete(id);

    if (!education) {
      return NextResponse.json({ error: 'Education not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Education deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
