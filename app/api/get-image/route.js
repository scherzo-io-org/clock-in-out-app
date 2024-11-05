import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  try {
    const imagePath = path.join('/mnt/clock-in-out-images', filename);

    if (!fs.existsSync(imagePath)) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    const imageBuffer = fs.readFileSync(imagePath);

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `inline; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error serving image:', error);
    return NextResponse.json({ error: 'Failed to retrieve image' }, { status: 500 });
  }
}
