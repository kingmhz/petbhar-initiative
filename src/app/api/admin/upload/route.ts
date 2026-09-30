import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { verifyAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

const MAX_IMAGE_SIZE = 15 * 1024 * 1024; // 15MB
const MAX_VIDEO_SIZE = 60 * 1024 * 1024; // 60MB

const ALLOWED_IMAGE_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/avif',
  'image/svg+xml'
]);

const ALLOWED_VIDEO_TYPES = new Set([
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-msvideo',
  'video/mpeg'
]);

function sanitizeFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '_')
    .replace(/_+/g, '_');
}

export async function POST(request: Request) {
  if (!(await verifyAdminSession(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const requestedType = (formData.get('type') as string) || '';
    const originalName = file.name || 'uploaded_media';
    const mimeType = file.type || '';
    const size = file.size;

    const isVideo = requestedType === 'video' || ALLOWED_VIDEO_TYPES.has(mimeType) || /\.(mp4|webm|mov|avi)$/i.test(originalName);
    const isImage = requestedType === 'image' || ALLOWED_IMAGE_TYPES.has(mimeType) || /\.(jpe?g|png|webp|gif|avif|svg)$/i.test(originalName);

    if (!isVideo && !isImage) {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload a standard photo (JPG, PNG, WebP) or video (MP4, WebM).' },
        { status: 400 }
      );
    }

    const maxSize = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
    if (size > maxSize) {
      return NextResponse.json(
        { error: `File is too large (${(size / (1024 * 1024)).toFixed(1)}MB). Max size is ${isVideo ? '60MB for videos' : '15MB for images'}.` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const folder = isVideo ? 'videos' : 'images';
    const cleanExt = path.extname(originalName) || (isVideo ? '.mp4' : '.jpg');
    const baseName = sanitizeFileName(path.basename(originalName, cleanExt)).slice(0, 40) || 'media';
    const fileName = `${baseName}_${Date.now()}${cleanExt}`;

    // Target local public/uploads directory
    const publicDir = path.join(process.cwd(), 'public', 'uploads', folder);
    
    let savedToDisk = false;
    let publicUrl = `/uploads/${folder}/${fileName}`;

    try {
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }
      const targetPath = path.join(publicDir, fileName);
      fs.writeFileSync(targetPath, buffer);
      savedToDisk = true;
    } catch (fsError) {
      console.warn('Storage: direct public upload write failed (serverless environment detected):', fsError);
    }

    // In serverless / read-only environment:
    if (!savedToDisk) {
      if (isImage && size <= 4 * 1024 * 1024) {
        // Return base64 data url for images under 4MB
        const base64 = buffer.toString('base64');
        const resolvedMime = mimeType || 'image/jpeg';
        publicUrl = `data:${resolvedMime};base64,${base64}`;
      } else {
        // Write to /tmp/petbhar-data/uploads and serve via /api/media
        const tmpDir = path.join('/tmp', 'petbhar-data', 'uploads', folder);
        if (!fs.existsSync(tmpDir)) {
          fs.mkdirSync(tmpDir, { recursive: true });
        }
        const tmpPath = path.join(tmpDir, fileName);
        fs.writeFileSync(tmpPath, buffer);
        publicUrl = `/api/media/${folder}/${fileName}`;
      }
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      size,
      type: isVideo ? 'video' : 'image',
      message: `${isVideo ? 'Video' : 'Photo'} uploaded successfully!`
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to process file upload' }, { status: 500 });
  }
}
