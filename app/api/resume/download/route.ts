import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Profile from '@/models/Profile';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    await dbConnect();
    const profile = await Profile.findOne().lean();

    const defaultLocalResume = path.join(process.cwd(), 'public', 'uploads', '1784390797473-manish_cv.pdf');
    const resumeUrl = profile?.resumeUrl || '/uploads/1784390797473-manish_cv.pdf';

    // 1. Local path handling (starts with '/')
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

    // 2. Remote URL handling (HTTP/HTTPS)
    if (resumeUrl.startsWith('http://') || resumeUrl.startsWith('https://')) {
      try {
        const response = await fetch(resumeUrl);
        if (response.ok) {
          const buffer = await response.arrayBuffer();
          return new NextResponse(buffer, {
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': 'attachment; filename="Manish_Mehra_Resume.pdf"',
            },
          });
        }
      } catch (fetchErr) {
        console.error('Remote resume fetch error:', fetchErr);
      }
    }

    // 3. Fallback: serve default local PDF if remote fails or path not found
    if (fs.existsSync(defaultLocalResume)) {
      const fallbackBuffer = fs.readFileSync(defaultLocalResume);
      return new NextResponse(fallbackBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="Manish_Mehra_Resume.pdf"',
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    return NextResponse.json({ error: 'Resume file not found' }, { status: 404 });
  } catch (error: any) {
    console.error('Error in resume download endpoint:', error);
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
