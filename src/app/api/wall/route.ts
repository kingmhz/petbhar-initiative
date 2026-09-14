import { NextResponse } from 'next/server';
import { getSubmissions, saveSubmissions, WallPost } from '@/lib/storage';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function GET() {
  try {
    const submissions = getSubmissions();
    const approvedPosts: WallPost[] = (submissions.wallPosts || []).filter(p => p.approved);

    // Also include approved dedications marked with showOnWall
    const dedicationPosts: WallPost[] = (submissions.dedications || [])
      .filter(d => d.showOnWall)
      .map(d => ({
        id: `wall-ded-${d.id}`,
        donorName: d.donorName || 'Generous Supporter',
        amount: d.amount,
        impactDescription: `Dedicated drive in honor of ${d.honoreeName} (${d.tier})`,
        message: d.message || 'Dedicated with warm love and blessings.',
        occasion: d.occasion,
        createdAt: d.createdAt,
        approved: true,
      }));

    const allFeed = [...approvedPosts, ...dedicationPosts].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({
      posts: allFeed,
      totalCount: allFeed.length,
    });
  } catch (error) {
    console.error('Error fetching wall posts:', error);
    return NextResponse.json({ posts: [], totalCount: 0 });
  }
}

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);

    // Rate limiting: 5 wall notes per 5 minutes
    const rateLimit = checkRateLimit(`wall:${clientIp}`, 5, 5 * 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many messages submitted. Please wait a few minutes.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } }
      );
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON request payload' }, { status: 400 });
    }
    const { donorName, message, city, occasion, honeypot } = body;

    if (honeypot) {
      return NextResponse.json({ success: true, message: 'Message queued for review.' });
    }

    const cleanName = String(donorName || '').trim().slice(0, 100);
    const cleanMessage = String(message || '').trim().slice(0, 500);
    const cleanCity = String(city || '').trim().slice(0, 80);
    const cleanOccasion = String(occasion || 'Community Support').trim().slice(0, 100);

    if (!cleanName || !cleanMessage) {
      return NextResponse.json(
        { error: 'Please share your name and a short uplifting message.' },
        { status: 400 }
      );
    }

    const submissions = getSubmissions();
    submissions.wallPosts = submissions.wallPosts || [];

    const newPost: WallPost = {
      id: `wall-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      donorName: cleanName,
      impactDescription: 'Supporter & Community Ally',
      message: cleanMessage,
      occasion: cleanOccasion,
      city: cleanCity || undefined,
      createdAt: new Date().toISOString(),
      approved: false, // Requires admin approval for social proof safety
    };

    submissions.wallPosts.unshift(newPost);
    saveSubmissions(submissions);

    return NextResponse.json({
      success: true,
      message: 'Thank you for your warmth! Your note has been submitted and will appear on the Wall of Kindness once reviewed.',
      post: newPost,
    });
  } catch (error) {
    console.error('Wall post error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
