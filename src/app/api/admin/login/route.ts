import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { validateAdminPassword, getAdminSessionToken, getAdminCookieOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    
    // Rate limit: 15 attempts per 15 minutes (50 in development)
    const maxAttempts = process.env.NODE_ENV === 'development' ? 50 : 15;
    const rateLimit = checkRateLimit(`login:${clientIp}`, maxAttempts, 15 * 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { 
          error: `Too many login attempts. Please wait ${rateLimit.retryAfterSeconds} seconds before trying again.` 
        },
        { 
          status: 429,
          headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) }
        }
      );
    }

    let body: { password?: unknown };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON request payload' }, { status: 400 });
    }
    const { password } = body || {};

    if (validateAdminPassword(password)) {
      const token = getAdminSessionToken();
      const isHttps = request.headers.get('x-forwarded-proto') === 'https' || request.url.startsWith('https:');

      const cookieStore = await cookies();
      cookieStore.set('admin_session', token, getAdminCookieOptions(isHttps));

      return NextResponse.json({ success: true, token });
    }

    return NextResponse.json({ error: 'Invalid master password or PIN' }, { status: 401 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
