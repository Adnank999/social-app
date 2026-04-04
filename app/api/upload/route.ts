import cloudinary from '@/app/lib/cloudinary';
import { NextResponse } from 'next/server';

function bufferToDataUri(file: File, buffer: Buffer) {
  return `data:${file.type};base64,${buffer.toString('base64')}`;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('images') as File[];

    if (!files.length) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    const uploaded = await Promise.all(
      files.map(async (file) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const dataUri = bufferToDataUri(file, buffer);

        const result = await cloudinary.uploader.upload(dataUri, {
          folder: 'social-app',
          resource_type: 'image',
        });

        return {
          publicId: result.public_id,
          url: result.secure_url,
          width: result.width,
          height: result.height,
        };
      })
    );

    return NextResponse.json({ images: uploaded });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
