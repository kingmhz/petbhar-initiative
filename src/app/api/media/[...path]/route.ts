import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export const dynamic = 'force-dynamic';

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime'
};

export async function GET(
  request: Request,
  props: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await props.params;
    if (!pathSegments || pathSegments.length === 0) {
      return NextResponse.json({ error: 'File not specified' }, { status: 400 });
    }

    const relativePath = path.join(...pathSegments).replace(/\.\./g, '');
    
    // Check tmp dir first, then public/uploads
    const candidates = [
      path.join('/tmp', 'petbhar-data', 'uploads', relativePath),
      path.join(process.cwd(), 'public', 'uploads', relativePath),
    ];

    let foundPath: string | null = null;
    for (const cand of candidates) {
      if (fs.existsSync(/*turbopackIgnore: true*/ cand)) {
        foundPath = cand;
        break;
      }
    }

    if (!foundPath) {
      return NextResponse.json({ error: 'Media file not found' }, { status: 404 });
    }

    const stat = fs.statSync(/*turbopackIgnore: true*/ foundPath);
    const ext = path.extname(foundPath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    // Handle range requests for smooth video scrubbing/streaming
    const range = request.headers.get('range');
    if (range && ext === '.mp4') {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
      const chunkSize = end - start + 1;
      const stream = fs.createReadStream(/*turbopackIgnore: true*/ foundPath, { start, end });

      // Convert Node stream to web ReadableStream
      const webStream = new ReadableStream({
        start(controller) {
          stream.on('data', (chunk) => controller.enqueue(chunk));
          stream.on('end', () => controller.close());
          stream.on('error', (err) => controller.error(err));
        }
      });

      return new Response(webStream, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${stat.size}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize.toString(),
          'Content-Type': contentType,
        }
      });
    }

    const fileBuffer = fs.readFileSync(/*turbopackIgnore: true*/ foundPath);
    return new Response(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': stat.size.toString(),
        'Cache-Control': 'public, max-age=86400, immutable'
      }
    });
  } catch (error) {
    console.error('Media serve error:', error);
    return NextResponse.json({ error: 'Failed to serve media' }, { status: 500 });
  }
}
