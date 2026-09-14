import { NextResponse } from 'next/server';
import { getSubmissions, saveSubmissions } from '@/lib/storage';
import { verifyAdminSession } from '@/lib/auth';

export async function GET(request: Request) {
  if (!(await verifyAdminSession(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const submissions = getSubmissions();
    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Failed to get submissions:', error);
    return NextResponse.json({ error: 'Failed to retrieve submissions' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await verifyAdminSession(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON request payload' }, { status: 400 });
    }
    const { type, id, updates } = body as { 
      type: 'contacts' | 'volunteers' | 'partners' | 'dedications' | 'beacons' | 'wallPosts';
      id: string;
      updates: Record<string, unknown>;
    };

    if (!type || !id || !updates) {
      return NextResponse.json({ error: 'Type, ID, and updates are required' }, { status: 400 });
    }

    const submissions = getSubmissions();

    if (type === 'beacons') {
      submissions.beacons = (submissions.beacons || []).map(b => 
        b.id === id ? { ...b, ...updates } : b
      );
    } else if (type === 'dedications') {
      submissions.dedications = (submissions.dedications || []).map(d => 
        d.id === id ? { ...d, ...updates } : d
      );
    } else if (type === 'wallPosts') {
      submissions.wallPosts = (submissions.wallPosts || []).map(w => 
        w.id === id ? { ...w, ...updates } : w
      );
    } else if (type === 'volunteers') {
      submissions.volunteers = (submissions.volunteers || []).map(v => 
        v.id === id ? { ...v, ...updates } : v
      );
    } else if (type === 'contacts') {
      submissions.contacts = (submissions.contacts || []).map(c => 
        c.id === id ? { ...c, ...updates } : c
      );
    } else if (type === 'partners') {
      submissions.partners = (submissions.partners || []).map(p => 
        p.id === id ? { ...p, ...updates } : p
      );
    }

    saveSubmissions(submissions);
    return NextResponse.json({ success: true, message: 'Submission updated' });
  } catch (error) {
    console.error('Failed to update submission:', error);
    return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await verifyAdminSession(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as 'contacts' | 'volunteers' | 'partners' | 'dedications' | 'beacons' | 'wallPosts';
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json({ error: 'Type and ID are required' }, { status: 400 });
    }

    const submissions = getSubmissions();
    if (type === 'contacts') {
      submissions.contacts = submissions.contacts.filter((item) => item.id !== id);
    } else if (type === 'volunteers') {
      submissions.volunteers = submissions.volunteers.filter((item) => item.id !== id);
    } else if (type === 'partners') {
      submissions.partners = submissions.partners.filter((item) => item.id !== id);
    } else if (type === 'dedications') {
      submissions.dedications = (submissions.dedications || []).filter((item) => item.id !== id);
    } else if (type === 'beacons') {
      submissions.beacons = (submissions.beacons || []).filter((item) => item.id !== id);
    } else if (type === 'wallPosts') {
      submissions.wallPosts = (submissions.wallPosts || []).filter((item) => item.id !== id);
    }

    saveSubmissions(submissions);
    return NextResponse.json({ success: true, message: 'Submission deleted' });
  } catch (error) {
    console.error('Failed to delete submission:', error);
    return NextResponse.json({ error: 'Failed to delete submission' }, { status: 500 });
  }
}
