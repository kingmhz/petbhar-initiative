import { NextResponse } from 'next/server';
import { getSubmissions, saveSubmissions, DedicationSubmission, notifyWebhook } from '@/lib/storage';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);

    // Rate limiting: 10 dedications per minute per IP
    const rateLimit = checkRateLimit(`dedicate:${clientIp}`, 10, 60 * 1000);
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
    const { occasion, honoreeName, donorName, phone, email, tier, amount, message, honeypot } = body;

    // Anti-spam honeypot
    if (honeypot) {
      return NextResponse.json({ success: true, message: 'Dedication received.' });
    }

    const cleanOccasion = String(occasion || 'Birthday Celebration').trim().slice(0, 100);
    const cleanHonoree = String(honoreeName || '').trim().slice(0, 150);
    const cleanDonor = String(donorName || '').trim().slice(0, 150);
    const cleanPhone = String(phone || '').trim().slice(0, 50);
    const cleanEmail = String(email || '').trim().slice(0, 150);
    const cleanTier = String(tier || '100 Meals + Banner').trim().slice(0, 100);
    const cleanAmount = Number(amount) || 6000;
    const cleanMessage = String(message || '').trim().slice(0, 1000);

    if (!cleanHonoree || !cleanPhone) {
      return NextResponse.json(
        { error: "Please provide the honoree's name and a WhatsApp number for field photo delivery." },
        { status: 400 }
      );
    }

    const submissions = getSubmissions();
    submissions.dedications = submissions.dedications || [];

    const newDedication: DedicationSubmission = {
      id: `ded-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      occasion: cleanOccasion,
      honoreeName: cleanHonoree,
      donorName: cleanDonor || 'Anonymous Supporter',
      phone: cleanPhone,
      email: cleanEmail,
      tier: cleanTier,
      amount: cleanAmount,
      message: cleanMessage,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    submissions.dedications.unshift(newDedication);
    saveSubmissions(submissions);

    // Notify team via webhook
    notifyWebhook('Drive Dedication Sponsored', {
      Occasion: cleanOccasion,
      'Honoree Name': cleanHonoree,
      'Donor Name': cleanDonor || 'Anonymous',
      'WhatsApp Phone': cleanPhone,
      Tier: `${cleanTier} (₹${cleanAmount})`,
      'Banner Message': cleanMessage || 'None',
    });

    return NextResponse.json({
      success: true,
      message: 'Your dedication has been recorded! Our ground team will coordinate photos and videos via WhatsApp.',
      dedication: newDedication,
    });
  } catch (error) {
    console.error('Dedication submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error while processing dedication.' },
      { status: 500 }
    );
  }
}
