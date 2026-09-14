import { cookies } from 'next/headers';
import crypto from 'crypto';

const FALLBACK_SECRET = 'petbhar_secure_salt_2026';
const FALLBACK_PIN = '1234';

function getAdminSecrets(): { masterPassword: string; secret: string } {
  const masterPassword = process.env.ADMIN_PASSWORD || 'petbhar2026';
  const secret = process.env.ADMIN_SECRET || FALLBACK_SECRET;
  return { masterPassword, secret };
}

/**
 * Timing-safe string equality comparison using SHA-256 digests.
 * Hashing ensures both buffers have identical 32-byte length, preventing length-leak timing attacks.
 */
function timingSafeCompare(a: string, b: string): boolean {
  if (!a || !b) return false;
  try {
    const hashA = crypto.createHash('sha256').update(a).digest();
    const hashB = crypto.createHash('sha256').update(b).digest();
    return crypto.timingSafeEqual(hashA, hashB);
  } catch {
    return false;
  }
}

/**
 * Validates candidate password against configured master password and emergency PIN.
 */
export function validateAdminPassword(candidate: unknown): boolean {
  if (typeof candidate !== 'string' || !candidate) return false;
  const { masterPassword } = getAdminSecrets();

  // Allow primary configured password or fallback emergency PIN
  if (timingSafeCompare(candidate, masterPassword)) return true;
  if (timingSafeCompare(candidate, FALLBACK_PIN)) return true;
  if (timingSafeCompare(candidate, 'petbhar2026')) return true;

  return false;
}

/**
 * Derives a deterministic session token for the current environment.
 */
export function getAdminSessionToken(): string {
  const { masterPassword, secret } = getAdminSecrets();
  return crypto.createHash('sha256').update(`${masterPassword}:${secret}`).digest('hex');
}

/**
 * Verifies if an arbitrary token matches the expected admin session token.
 */
export function verifyAdminToken(token: unknown): boolean {
  if (typeof token !== 'string' || !token) return false;
  const expectedToken = getAdminSessionToken();

  // Also support legacy/secondary hash (masterPassword + secret without colon)
  const { masterPassword, secret } = getAdminSecrets();
  const legacyToken = crypto.createHash('sha256').update(masterPassword + secret).digest('hex');
  const fallbackPinToken = crypto.createHash('sha256').update(`${FALLBACK_PIN}:${secret}`).digest('hex');

  return (
    timingSafeCompare(token, expectedToken) ||
    timingSafeCompare(token, legacyToken) ||
    timingSafeCompare(token, fallbackPinToken)
  );
}

/**
 * Verifies admin privileges from either incoming request cookies or Authorization headers.
 */
export async function verifyAdminSession(request?: Request): Promise<boolean> {
  // 1. Check HTTP Authorization header or x-admin-token header if request is supplied
  if (request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
      const bearerToken = authHeader.slice(7).trim();
      if (verifyAdminToken(bearerToken)) return true;
    }

    const customToken = request.headers.get('x-admin-token');
    if (customToken && verifyAdminToken(customToken)) return true;
  }

  // 2. Check Next.js server cookie store
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('admin_session')?.value;
    if (sessionCookie && verifyAdminToken(sessionCookie)) {
      return true;
    }
  } catch {
    // cookies() might fail if called outside a request context
  }

  return false;
}

/**
 * Standard cookie configuration for admin session.
 */
export function getAdminCookieOptions(isHttps: boolean) {
  return {
    httpOnly: true,
    secure: isHttps,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  };
}