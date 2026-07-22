import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const useCloudinary =
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_CLOUD_NAME !== 'placeholder_cloud_name';

    if (useCloudinary) {
      const uploadResult = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: 'portfolio',
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        ).end(buffer);
      });

      return NextResponse.json({
        success: true,
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      });
    } else {
      // Local fallback when Cloudinary is not configured
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      // Ensure local directory exists
      await mkdir(uploadDir, { recursive: true });

      const safeFileName = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
      const filePath = path.join(uploadDir, safeFileName);

      await writeFile(filePath, buffer);

      return NextResponse.json({
        success: true,
        url: `/api/uploads/${safeFileName}`,
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}
