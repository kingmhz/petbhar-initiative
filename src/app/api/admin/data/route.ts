import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getSiteData, saveSiteData } from '@/lib/storage';
import { verifyAdminSession } from '@/lib/auth';

export async function GET(request: Request) {
  if (!(await verifyAdminSession(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = getSiteData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Failed to read site data:', error);
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!(await verifyAdminSession(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let data: Record<string, unknown>;
    try {
      data = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON request payload' }, { status: 400 });
    }
    
    // Validation
    if (!data || !data.org || !data.contact || !data.upi) {
      return NextResponse.json({ error: 'Invalid data structure' }, { status: 400 });
    }

    const result = saveSiteData(data);
    if (!result.success) {
      return NextResponse.json({ error: result.error || 'Failed to save data' }, { status: 500 });
    }

    try {
      revalidatePath('/', 'layout');
    } catch (revalError) {
      console.warn('Revalidation warning:', revalError);
    }

    return NextResponse.json({ success: true, message: 'Changes saved and revalidated across all routes' });
  } catch (error) {
    console.error('Failed to write data:', error);
    return NextResponse.json({ error: 'Failed to write data' }, { status: 500 });
  }
}
