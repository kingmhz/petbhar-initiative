import { NextResponse } from 'next/server';
import { getSubmissions, saveSubmissions, ContactSubmission, notifyWebhook } from '@/lib/storage';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);

    // Rate limiting: 10 inquiries per minute per IP
    const rateLimit = checkRateLimit(`contact:${clientIp}`, 10, 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many submissions. Please wait a moment before trying again.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } }
      );
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON request payload' }, { status: 400 });
    }
    const { name, contact, purpose, message, honeypot } = body;

    // Honeypot anti-spam check
    if (honeypot) {
      // Silently return success to fool bots without storing spam
      return NextResponse.json({ success: true, message: 'Message received.' });
    }

    // Validation
    const cleanName = String(name || '').trim().slice(0, 150);
    const cleanContact = String(contact || '').trim().slice(0, 150);
    const cleanPurpose = String(purpose || 'General enquiry').trim().slice(0, 100);
    const cleanMessage = String(message || '').trim().slice(0, 5000);

    if (!cleanName || !cleanContact || !cleanMessage) {
      return NextResponse.json(
        { error: 'Please provide your name, contact information, and message.' },
        { status: 400 }
      );
    }

    const submissions = getSubmissions();
    const newSubmission: ContactSubmission = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: cleanName,
      contact: cleanContact,
      purpose: cleanPurpose,
      message: cleanMessage,
      createdAt: new Date().toISOString(),
      read: false,
    };

    submissions.contacts.unshift(newSubmission);
    saveSubmissions(submissions);

    // Asynchronous webhook alert to team
    notifyWebhook('Contact Message', {
      Name: cleanName,
      Contact: cleanContact,
      Purpose: cleanPurpose,
      Message: cleanMessage,
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for reaching out. We will get back to you shortly.',
    });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please email us directly.' },
      { status: 500 }
    );
  }
}
