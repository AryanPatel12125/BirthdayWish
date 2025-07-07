import { NextRequest, NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const magazineId = resolvedParams.id;
    
    // Path to the magazine folder in public directory
    const magazinePath = join(process.cwd(), 'public', 'magazines', magazineId);
    
    // Check if the magazine folder exists
    if (!existsSync(magazinePath)) {
      return NextResponse.json(
        { error: `Magazine folder '${magazineId}' not found` },
        { status: 404 }
      );
    }
    
    // Read all files from the magazine directory
    const files = await readdir(magazinePath);
    
    // Filter for image files and sort them numerically
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    const imageFiles = files
      .filter(file => {
        const ext = file.toLowerCase().substring(file.lastIndexOf('.'));
        return imageExtensions.includes(ext);
      })
      .filter(file => {
        // Only include files that start with a number (like 1.jpg, 2.png, etc.)
        const fileName = file.split('.')[0];
        return /^\d+$/.test(fileName);
      })
      .sort((a, b) => {
        // Sort by the numeric part of the filename
        const aNum = parseInt(a.split('.')[0]);
        const bNum = parseInt(b.split('.')[0]);
        return aNum - bNum;
      });
    
    return NextResponse.json(imageFiles);
    
  } catch (error) {
    console.error('Error reading magazine directory:', error);
    return NextResponse.json(
      { error: 'Failed to read magazine directory' },
      { status: 500 }
    );
  }
}
