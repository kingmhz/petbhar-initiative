import fs from 'fs';
import path from 'path';
import defaultSiteData from '../../data/siteData.json';
import defaultSubmissionsData from '../../data/submissions.json';

export interface ContactSubmission {
  id: string;
  name: string;
  contact: string;
  purpose: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface VolunteerSubmission {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  skills: string;
  availability: string;
  activity: string;
  createdAt: string;
  status: 'pending' | 'contacted' | 'approved';
}

export interface PartnerSubmission {
  id: string;
  orgName: string;
  contactPerson: string;
  email: string;
  phone: string;
  type: string;
  message: string;
  createdAt: string;
  status: 'pending' | 'in_discussion' | 'partnered';
}

export interface DedicationSubmission {
  id: string;
  occasion: string;
  honoreeName: string;
  donorName: string;
  phone: string;
  email?: string;
  tier: string;
  amount: number;
  message?: string;
  createdAt: string;
  status: 'pending' | 'scheduled' | 'completed';
  showOnWall?: boolean;
}

export interface BeaconSubmission {
  id: string;
  category: 'stray_food' | 'injured_animal' | 'water_bowl' | 'hungry_community';
  location: string;
  landmark?: string;
  city: string;
  coordinates?: string;
  urgency: 'immediate' | 'within_24h' | 'general';
  description: string;
  estimatedCount?: number;
  reporterName: string;
  reporterPhone: string;
  createdAt: string;
  status: 'pending' | 'dispatched' | 'resolved';
}

export interface WallPost {
  id: string;
  donorName: string;
  amount?: number;
  impactDescription: string;
  message?: string;
  occasion?: string;
  city?: string;
  createdAt: string;
  approved: boolean;
}

export interface SubmissionsData {
  contacts: ContactSubmission[];
  volunteers: VolunteerSubmission[];
  partners: PartnerSubmission[];
  dedications: DedicationSubmission[];
  beacons: BeaconSubmission[];
  wallPosts: WallPost[];
}

// Determine active writable data directory
function resolveDataDir(): string {
  // 1. Explicit override via environment variable (e.g. for mounted Docker volumes)
  if (process.env.DATA_DIR) {
    return process.env.DATA_DIR;
  }

  // 2. Serverless environment detection (Vercel, AWS Lambda, Netlify)
  const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NETLIFY;
  if (isServerless) {
    return path.join('/tmp', 'petbhar-data');
  }

  // 3. Local standard project directory
  return path.join(process.cwd(), 'data');
}

// In-memory fallback cache if filesystem write access is restricted
let inMemorySiteData: Record<string, unknown> | null = null;
let inMemorySubmissions: SubmissionsData = JSON.parse(JSON.stringify(defaultSubmissionsData));

// Safely perform an atomic write using temporary file and atomic rename
function atomicWriteJson(filePath: string, data: unknown): boolean {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const tempPath = `${filePath}.tmp.${Date.now()}.${Math.random().toString(36).substring(2, 7)}`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf8');
    try {
      fs.renameSync(tempPath, filePath);
    } catch {
      // Fallback for Windows file locks or cross-mount issues
      fs.copyFileSync(tempPath, filePath);
      try {
        fs.unlinkSync(tempPath);
      } catch {
        // ignore unlink error
      }
    }
    return true;
  } catch (error) {
    console.error(`Storage: Atomic write error for ${filePath}:`, error);
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      return true;
    } catch (fallbackErr) {
      console.error(`Storage: Direct write fallback also failed for ${filePath}:`, fallbackErr);
      return false;
    }
  }
}

// Ensure data directory and seed files exist
function ensureDataInitialized(dataDir: string): void {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    const siteDataPath = path.join(dataDir, 'siteData.json');
    if (!fs.existsSync(siteDataPath)) {
      atomicWriteJson(siteDataPath, defaultSiteData);
    }

    const submissionsPath = path.join(dataDir, 'submissions.json');
    if (!fs.existsSync(submissionsPath)) {
      atomicWriteJson(submissionsPath, defaultSubmissionsData);
    }
  } catch (err) {
    console.warn('Storage: filesystem init notice:', err);
  }
}

export function getSiteData(): Record<string, unknown> {
  if (inMemorySiteData) return inMemorySiteData;

  const dataDir = resolveDataDir();
  ensureDataInitialized(dataDir);
  const dataPath = path.join(dataDir, 'siteData.json');

  try {
    if (fs.existsSync(dataPath)) {
      const content = fs.readFileSync(dataPath, 'utf8');
      return JSON.parse(content) as Record<string, unknown>;
    }
  } catch (error) {
    console.error('Storage: Error reading siteData.json, using seed fallback:', error);
  }

  return defaultSiteData as unknown as Record<string, unknown>;
}

export function saveSiteData(data: Record<string, unknown>): { success: boolean; error?: string } {
  const dataDir = resolveDataDir();
  ensureDataInitialized(dataDir);
  const dataPath = path.join(dataDir, 'siteData.json');

  // Update in-memory cache first
  inMemorySiteData = data;
  atomicWriteJson(dataPath, data);
  return { success: true };
}

export function getSubmissions(): SubmissionsData {
  const dataDir = resolveDataDir();
  ensureDataInitialized(dataDir);
  const dataPath = path.join(dataDir, 'submissions.json');

  try {
    if (fs.existsSync(dataPath)) {
      const content = fs.readFileSync(dataPath, 'utf8');
      const parsed = JSON.parse(content) as SubmissionsData;
      parsed.contacts = parsed.contacts || [];
      parsed.volunteers = parsed.volunteers || [];
      parsed.partners = parsed.partners || [];
      parsed.dedications = parsed.dedications || [];
      parsed.beacons = parsed.beacons || [];
      parsed.wallPosts = parsed.wallPosts || [];
      
      inMemorySubmissions = parsed;
      return parsed;
    }
  } catch (error) {
    console.error('Storage: Error reading submissions.json:', error);
  }

  return inMemorySubmissions;
}

export function saveSubmissions(data: SubmissionsData): boolean {
  inMemorySubmissions = data;
  const dataDir = resolveDataDir();
  ensureDataInitialized(dataDir);
  const dataPath = path.join(dataDir, 'submissions.json');

  return atomicWriteJson(dataPath, data);
}

// Asynchronous webhook notification dispatcher for live form alerts
export async function notifyWebhook(title: string, details: Record<string, string>): Promise<void> {
  const webhookUrl = process.env.NOTIFICATION_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    const formattedFields = Object.entries(details).map(([key, val]) => `**${key}:** ${val}`).join('\n');
    const payload = {
      content: `🔔 **PetBhar Initiative Alert: ${title}**\n${formattedFields}`,
      embeds: [
        {
          title: `New Website Submission: ${title}`,
          color: 0x0A0A09,
          timestamp: new Date().toISOString(),
          fields: Object.entries(details).map(([key, val]) => ({
            name: key,
            value: String(val).slice(0, 1000) || 'N/A',
            inline: key.length < 15,
          })),
        },
      ],
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })
      .catch((err) => console.warn('Webhook notification dispatch warning:', err))
      .finally(() => clearTimeout(timeoutId));
  } catch (error) {
    console.warn('Webhook failed to send:', error);
  }
}
