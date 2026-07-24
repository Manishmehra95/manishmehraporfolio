import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Profile from '@/models/Profile';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    await dbConnect();
    const profile = await Profile.findOne().lean();

    if (!profile || !profile.resumeUrl) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }

    const resumeUrl = profile.resumeUrl;

    // Case 1: Local file in public/ or public/uploads/
    if (resumeUrl.startsWith('/')) {
      const filePath = path.join(process.cwd(), 'public', resumeUrl);
      if (fs.existsSync(filePath)) {
        const fileBuffer = fs.readFileSync(filePath);
        return new NextResponse(fileBuffer, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="Manish_Mehra_Resume.pdf"',
            'Cache-Control': 'public, max-age=3600',
          },
        });
      }
    }

    // Case 2: Remote URL (Cloudinary or HTTP/HTTPS)
    if (resumeUrl.startsWith('http://') || resumeUrl.startsWith('https://')) {
      // Modify Cloudinary URL to include attachment flag if it's a Cloudinary link
      let fetchUrl = resumeUrl;
      if (fetchUrl.includes('cloudinary.com') && fetchUrl.includes('/upload/') && !fetchUrl.includes('fl_attachment')) {
        fetchUrl = fetchUrl.replace('/upload/', '/upload/fl_attachment:Manish_Mehra_Resume/');
      }

      const response = await fetch(fetchUrl);
      if (!response.ok) {
        // Fallback: try fetching original URL without transformation
        const origResponse = await fetch(resumeUrl);
        if (!origResponse.ok) {
          return NextResponse.json({ error: 'Failed to fetch resume file' }, { status: 500 });
        }
        const buffer = await origResponse.arrayBuffer();
        return new NextResponse(buffer, {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="Manish_Mehra_Resume.pdf"',
          },
        });
      }

      const buffer = await response.arrayBuffer();
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="Manish_Mehra_Resume.pdf"',
        },
      });
    }

    return NextResponse.json({ error: 'Invalid resume URL configuration' }, { status: 400 });
  } catch (error: any) {
    console.error('Error downloading resume:', error);
    return NextResponse.json({ error: error.message || 'Server error downloading resume' }, { status: 500 });
  }
}
