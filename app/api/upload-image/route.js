import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  try {
    const { imageData } = await request.json();

    if (!imageData) {
      return NextResponse.json({ error: 'No image data provided' }, { status: 400 });
    }

    // Extract the base64 data from the Data URL
    const matches = imageData.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return NextResponse.json({ error: 'Invalid image data' }, { status: 400 });
    }

    const extension = matches[1];
    const base64Data = matches[2];

    // Decode the base64 data
    const buffer = Buffer.from(base64Data, 'base64');

    // Generate a unique filename
    const filename = `${uuidv4()}.${extension}`;

    // Define the directory to save the images
    const imageDirectory = '/mnt/clock-in-out-images' //path.join(process.cwd(), 'public', 'uploads');

    // Ensure the directory exists
    fs.mkdirSync(imageDirectory, { recursive: true });

    // Save the image to the directory
    const filePath = path.join(imageDirectory, filename);
    fs.writeFileSync(filePath, buffer);

    // Generate the image URL (assuming 'public' is served at the root)
    const imageUrl = `/api/get-image?filename=${encodeURIComponent(filename)}`;

    // Return the image URL
    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
