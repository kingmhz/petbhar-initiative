import { NextResponse } from 'next/server';
import { getSubmissions, saveSubmissions, PartnerSubmission, notifyWebhook } from '@/lib/storage';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);

    // Rate limiting: 10 inquiries per minute per IP
    const rateLimit = checkRateLimit(`partner:${clientIp}`, 10, 60 * 1000);
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a moment before trying again.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } }
      );
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON request payload' }, { status: 400 });
    }
    const { orgName, contactPerson, email, phone, type, message, honeypot } = body;

    // Anti-spam honeypot
    if (honeypot) {
      return NextResponse.json({ success: true, message: 'Proposal received.' });
    }

    const cleanOrgName = String(orgName || '').trim().slice(0, 150);
    const cleanContactPerson = String(contactPerson || '').trim().slice(0, 150);
    const cleanEmail = String(email || '').trim().slice(0, 150);
    const cleanPhone = String(phone || '').trim().slice(0, 50);
    const cleanType = String(type || 'Other').trim().slice(0, 100);
    const cleanMessage = String(message || '').trim().slice(0, 5000);

    if (!cleanOrgName || (!cleanEmail && !cleanPhone)) {
      return NextResponse.json(
        { error: 'Please provide your organisation name and contact details (email or phone).' },
        { status: 400 }
      );
    }

    const submissions = getSubmissions();
    const newPartner: PartnerSubmission = {
      id: `partner-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      orgName: cleanOrgName,
      contactPerson: cleanContactPerson,
      email: cleanEmail,
      phone: cleanPhone,
      type: cleanType,
      message: cleanMessage,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    submissions.partners.unshift(newPartner);
    saveSubmissions(submissions);

    // Notify team
    notifyWebhook('Partner Proposal', {
      Organisation: cleanOrgName,
      ContactPerson: cleanContactPerson || 'Not provided',
      Email: cleanEmail || 'Not provided',
      Phone: cleanPhone || 'Not provided',
      Type: cleanType,
      Message: cleanMessage || 'Not provided',
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for partnering with PetBhar Initiative! We will be in touch shortly.',
    });
  } catch (error) {
    console.error('Partner API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please contact us directly.' },
      { status: 500 }
    );
  }
}
