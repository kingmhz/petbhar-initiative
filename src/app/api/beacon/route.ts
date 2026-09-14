import { NextResponse } from 'next/server';
import { getSubmissions, saveSubmissions, BeaconSubmission, notifyWebhook } from '@/lib/storage';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);

    // Rate limiting: 10 submissions per minute
    const rateLimit = checkRateLimit(`beacon:${clientIp}`, 10, 60 * 1000);
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
    const { 
      category, 
      location, 
      landmark, 
      city, 
      coordinates, 
      urgency, 
      description, 
      estimatedCount, 
      reporterName, 
      reporterPhone, 
      honeypot 
    } = body;

    // Anti-spam honeypot
    if (honeypot) {
      return NextResponse.json({ success: true, message: 'Report received.' });
    }

    const cleanLocation = String(location || '').trim().slice(0, 200);
    const cleanCity = String(city || '').trim().slice(0, 100);
    const cleanPhone = String(reporterPhone || '').trim().slice(0, 50);
    const cleanName = String(reporterName || '').trim().slice(0, 100);
    const cleanDesc = String(description || '').trim().slice(0, 1000);
    const cleanLandmark = String(landmark || '').trim().slice(0, 150);
    const cleanCategory = ['stray_food', 'injured_animal', 'water_bowl', 'hungry_community'].includes(category)
      ? category
      : 'stray_food';
    const cleanUrgency = ['immediate', 'within_24h', 'general'].includes(urgency)
      ? urgency
      : 'general';

    if (!cleanLocation || !cleanPhone) {
      return NextResponse.json(
        { error: 'Please provide the location and your WhatsApp/Phone number so our rescue team can coordinate.' },
        { status: 400 }
      );
    }

    const submissions = getSubmissions();
    submissions.beacons = submissions.beacons || [];

    const newBeacon: BeaconSubmission = {
      id: `beacon-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      category: cleanCategory,
      location: cleanLocation,
      landmark: cleanLandmark,
      city: cleanCity || 'Local Area',
      coordinates: coordinates ? String(coordinates).slice(0, 100) : undefined,
      urgency: cleanUrgency,
      description: cleanDesc,
      estimatedCount: Number(estimatedCount) || 1,
      reporterName: cleanName || 'Kind Citizen',
      reporterPhone: cleanPhone,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    submissions.beacons.unshift(newBeacon);
    saveSubmissions(submissions);

    // Notify team via webhook
    notifyWebhook('Citizen SOS Beacon Triggered 🚨', {
      Category: cleanCategory,
      Urgency: cleanUrgency.toUpperCase(),
      Location: cleanLocation,
      City: cleanCity || 'Unspecified',
      'Reporter Contact': `${cleanName || 'Citizen'} (${cleanPhone})`,
      Description: cleanDesc || 'No additional notes',
    });

    return NextResponse.json({
      success: true,
      message: 'SOS Beacon registered! Our team has received the alert and will coordinate relief.',
      beacon: newBeacon,
    });
  } catch (error) {
    console.error('Beacon submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error while recording SOS alert.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const submissions = getSubmissions();
    const beacons = submissions.beacons || [];
    // Return sanitized public metrics
    return NextResponse.json({
      total: beacons.length,
      resolved: beacons.filter(b => b.status === 'resolved').length,
      pending: beacons.filter(b => b.status === 'pending').length,
    });
  } catch (error) {
    console.error('Error fetching beacon metrics:', error);
    return NextResponse.json({ total: 0, resolved: 0, pending: 0 });
  }
}
