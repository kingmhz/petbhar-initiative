import { NextResponse } from 'next/server';
import { getSubmissions, saveSubmissions, VolunteerSubmission, notifyWebhook } from '@/lib/storage';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);

    // Rate limiting: 10 applications per minute per IP
    const rateLimit = checkRateLimit(`volunteer:${clientIp}`, 10, 60 * 1000);
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
    const { name, phone, email, city, skills, availability, activity, honeypot } = body;

    // Anti-spam honeypot
    if (honeypot) {
      return NextResponse.json({ success: true, message: 'Application received.' });
    }

    const cleanName = String(name || '').trim().slice(0, 150);
    const cleanPhone = String(phone || '').trim().slice(0, 50);
    const cleanEmail = String(email || '').trim().slice(0, 150);
    const cleanCity = String(city || '').trim().slice(0, 100);
    const cleanSkills = String(skills || '').trim().slice(0, 2000);
    const cleanAvailability = String(availability || 'Flexible').trim().slice(0, 100);
    const cleanActivity = String(activity || 'Food Distribution').trim().slice(0, 100);

    if (!cleanName || (!cleanPhone && !cleanEmail)) {
      return NextResponse.json(
        { error: 'Please provide your name and at least a phone number or email address.' },
        { status: 400 }
      );
    }

    const submissions = getSubmissions();
    const newVolunteer: VolunteerSubmission = {
      id: `vol-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: cleanName,
      phone: cleanPhone,
      email: cleanEmail,
      city: cleanCity,
      skills: cleanSkills,
      availability: cleanAvailability,
      activity: cleanActivity,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    submissions.volunteers.unshift(newVolunteer);
    saveSubmissions(submissions);

    // Notify team
    notifyWebhook('Volunteer Application', {
      Name: cleanName,
      Phone: cleanPhone || 'Not provided',
      Email: cleanEmail || 'Not provided',
      City: cleanCity || 'Not provided',
      Activity: cleanActivity,
      Availability: cleanAvailability,
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you for volunteering with PetBhar! We will reach out soon.',
    });
  } catch (error) {
    console.error('Volunteer API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please reach out directly.' },
      { status: 500 }
    );
  }
}
