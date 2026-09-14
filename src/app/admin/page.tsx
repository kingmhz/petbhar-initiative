'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { 
  LogOut, 
  ExternalLink, 
  Save, 
  Plus, 
  Trash2, 
  Mail, 
  Users, 
  Building, 
  MessageSquare, 
  Download, 
  Search, 
  Check, 
  AlertCircle, 
  Phone, 
  Heart, 
  Shield, 
  Film, 
  ImageIcon, 
  LayoutDashboard, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ArrowUpRight,
  Clock,
  MapPin
} from 'lucide-react';
import { SiteConfig, Project, Report, MediaItem } from '@/lib/siteConfig';

interface ContactSubmission {
  id: string;
  name: string;
  contact: string;
  purpose: string;
  message: string;
  createdAt: string;
}

interface VolunteerSubmission {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
  activity: string;
  availability: string;
  skills?: string;
  createdAt: string;
}

interface PartnerSubmission {
  id: string;
  orgName: string;
  contactPerson: string;
  email: string;
  phone?: string;
  type: string;
  message: string;
  createdAt: string;
}

interface DedicationSubmission {
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

interface BeaconSubmission {
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

interface WallPost {
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

interface RawSiteData {
  org?: Partial<SiteConfig['org']>;
  contact?: Partial<SiteConfig['contact']> & { social?: { whatsapp?: string; instagram?: string; youtube?: string } };
  upi?: Partial<SiteConfig['upi']>;
  bankAccount?: Partial<SiteConfig['bankAccount']>;
  bankDetails?: { enabled?: boolean; accountName?: string; accountNumber?: string; ifsc?: string; bankName?: string; branch?: string };
  impact?: Partial<SiteConfig['impact']> & { stats?: Partial<SiteConfig['impact']> };
  transparency?: Partial<SiteConfig['transparency']> & { overview?: Partial<SiteConfig['transparency']>; reports?: Report[] };
  projects?: Project[];
  reports?: Report[];
  media?: {
    images?: MediaItem[];
    videos?: MediaItem[];
  };
}

const normalizeSiteData = (data: unknown): SiteConfig | null => {
  if (!data || typeof data !== 'object') return null;
  const raw = data as RawSiteData;
  return {
    org: {
      name: raw.org?.name || 'PetBhar',
      fullName: raw.org?.fullName || 'PetBhar Initiative',
      tagline: raw.org?.tagline || 'No one should sleep hungry.',
      mission: raw.org?.mission || '',
      description: raw.org?.description || '',
      philosophy: raw.org?.philosophy || '',
      values: raw.org?.values || ['Food', 'Dignity', 'Hope']
    },
    contact: {
      email: raw.contact?.email || '',
      phone: raw.contact?.phone || '',
      whatsapp: raw.contact?.whatsapp || raw.contact?.social?.whatsapp || '',
      instagram: raw.contact?.instagram || raw.contact?.social?.instagram || '',
      youtube: raw.contact?.youtube || raw.contact?.social?.youtube || ''
    },
    upi: {
      id: raw.upi?.id || '',
      qrImage: raw.upi?.qrImage || '/images/petbhar-upi-qr.svg',
      payeeName: raw.upi?.payeeName || 'PETBHAR INITIATIVE'
    },
    bankAccount: {
      enabled: raw.bankAccount?.enabled ?? raw.bankDetails?.enabled ?? false,
      accountHolderName: raw.bankAccount?.accountHolderName || raw.bankDetails?.accountName || '',
      accountNumber: raw.bankAccount?.accountNumber || raw.bankDetails?.accountNumber || '',
      ifscCode: raw.bankAccount?.ifscCode || raw.bankDetails?.ifsc || '',
      bankName: raw.bankAccount?.bankName || raw.bankDetails?.bankName || '',
      branch: raw.bankAccount?.branch || raw.bankDetails?.branch || ''
    },
    impact: {
      peopleFed: raw.impact?.peopleFed ?? raw.impact?.stats?.peopleFed ?? 0,
      familiesSupported: raw.impact?.familiesSupported ?? raw.impact?.stats?.familiesSupported ?? 0,
      mealsDistributed: raw.impact?.mealsDistributed ?? raw.impact?.stats?.mealsDistributed ?? 0,
      communitiesReached: raw.impact?.communitiesReached ?? raw.impact?.stats?.communitiesReached ?? 0
    },
    transparency: {
      contributionsReceived: raw.transparency?.contributionsReceived ?? raw.transparency?.overview?.contributionsReceived ?? 0,
      foodPurchased: raw.transparency?.foodPurchased ?? raw.transparency?.overview?.foodPurchased ?? 0,
      mealsDistributed: raw.transparency?.mealsDistributed ?? raw.transparency?.overview?.mealsDistributed ?? 0,
      groceryKitsDistributed: raw.transparency?.groceryKitsDistributed ?? raw.transparency?.overview?.groceryKitsDistributed ?? 0,
      familiesSupported: raw.transparency?.familiesSupported ?? raw.transparency?.overview?.familiesSupported ?? 0
    },
    projects: (raw.projects || []) as Project[],
    reports: (raw.reports || raw.transparency?.reports || []) as Report[],
    media: {
      images: (raw.media?.images || []) as MediaItem[],
      videos: (raw.media?.videos || []) as MediaItem[]
    }
  };
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [siteData, setSiteData] = useState<SiteConfig | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [submissions, setSubmissions] = useState<{ 
    contacts: ContactSubmission[]; 
    volunteers: VolunteerSubmission[]; 
    partners: PartnerSubmission[];
    dedications: DedicationSubmission[];
    beacons: BeaconSubmission[];
    wallPosts: WallPost[];
  }>({
    contacts: [],
    volunteers: [],
    partners: [],
    dedications: [],
    beacons: [],
    wallPosts: []
  });
  const [inquiryCategory, setInquiryCategory] = useState<'contacts' | 'volunteers' | 'partners' | 'dedications' | 'beacons' | 'wallPosts'>('contacts');
  const [inquirySearch, setInquirySearch] = useState('');
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loginError, setLoginError] = useState('');
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/submissions');
      if (res.ok) {
        const data = await res.json();
        setSubmissions({
          contacts: data.contacts || [],
          volunteers: data.volunteers || [],
          partners: data.partners || [],
          dedications: data.dedications || [],
          beacons: data.beacons || [],
          wallPosts: data.wallPosts || []
        });
      }
    } catch {
      console.error('Failed to fetch submissions');
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/data');
      if (res.ok) {
        const data = await res.json();
        setSiteData(normalizeSiteData(data));
        setIsAuthenticated(true);
      }
    } catch {
      console.error('Failed to fetch data');
    }
  }, []);

  const handleSave = useCallback(async () => {
    if (!siteData) return;
    setSaving(true);
    setMessage({ text: '', type: '' });
    try {
      const res = await fetch('/api/admin/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteData),
      });
      if (res.ok) {
        setHasUnsavedChanges(false);
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLastSavedTime(timeStr);
        setMessage({ text: `Changes saved successfully at ${timeStr}!`, type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 3500);
      } else {
        const data = await res.json();
        setMessage({ text: data.error || 'Failed to save data', type: 'error' });
      }
    } catch {
      setMessage({ text: 'Server error while saving', type: 'error' });
    }
    setSaving(false);
  }, [siteData]);

  const handleUpdateSubmission = async (type: string, id: string, updates: Record<string, unknown>) => {
    try {
      const res = await fetch('/api/admin/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id, updates }),
      });
      if (res.ok) {
        fetchSubmissions();
        setMessage({ text: 'Status updated successfully!', type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 2000);
      }
    } catch {
      console.error('Failed to update submission');
    }
  };

  const handleDeleteSubmission = async (type: 'contacts' | 'volunteers' | 'partners' | 'dedications' | 'beacons' | 'wallPosts', id: string) => {
    if (!confirm(`Are you sure you want to delete this ${type} item?`)) return;
    try {
      const res = await fetch(`/api/admin/submissions?type=${type}&id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchSubmissions();
        setMessage({ text: 'Submission removed.', type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 2500);
      }
    } catch {
      console.error('Failed to delete submission');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setIsAuthenticated(true);
        fetchData();
        fetchSubmissions();
      } else {
        const data = await res.json();
        setLoginError(data.error || 'Invalid admin credentials');
      }
    } catch {
      setLoginError('Server connection error');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      setIsAuthenticated(false);
      setSiteData(null);
      setPassword('');
    } catch {
      console.error('Failed to logout');
    }
  };

  useEffect(() => {
    let ignore = false;
    async function loadInitialData() {
      try {
        const [dataRes, subRes] = await Promise.all([
          fetch('/api/admin/data'),
          fetch('/api/admin/submissions')
        ]);
        if (!ignore && dataRes.ok) {
          const data = await dataRes.json();
          setSiteData(normalizeSiteData(data));
          setIsAuthenticated(true);
        }
        if (!ignore && subRes.ok) {
          const subs = await subRes.json();
          setSubmissions(subs);
        }
      } catch {
        console.error('Failed to load initial admin data');
      }
    }
    loadInitialData();
    return () => {
      ignore = true;
    };
  }, []);

  // Keyboard shortcut: Ctrl+S or Cmd+S to save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (isAuthenticated && siteData) {
          handleSave();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthenticated, siteData, handleSave]);

  const totalInquiries = useMemo(() => {
    return (submissions.contacts?.length || 0) + 
           (submissions.volunteers?.length || 0) + 
           (submissions.partners?.length || 0) + 
           (submissions.dedications?.length || 0) +
           (submissions.beacons?.length || 0) +
           (submissions.wallPosts?.length || 0);
  }, [submissions.contacts?.length, submissions.volunteers?.length, submissions.partners?.length, submissions.dedications?.length, submissions.beacons?.length, submissions.wallPosts?.length]);

  const tabs = useMemo(() => [
    { id: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'Inquiries', label: 'Inquiries', icon: MessageSquare, badge: totalInquiries },
    { id: 'Impact', label: 'Impact Stats', icon: Sparkles },
    { id: 'Donation', label: 'Donation & UPI', icon: Heart },
    { id: 'Projects', label: 'Projects', icon: Users },
    { id: 'Media', label: 'Media & Gallery', icon: Film },
    { id: 'Transparency', label: 'Transparency', icon: Shield },
    { id: 'Contact', label: 'Contact & Social', icon: Phone },
    { id: 'General', label: 'General Info', icon: Building },
  ], [totalInquiries]);

  // Memoized inquiries filter across all relevant fields
  const searchLower = inquirySearch.trim().toLowerCase();

  const filteredContacts = useMemo(() => {
    if (!searchLower) return submissions.contacts || [];
    return (submissions.contacts || []).filter((c: ContactSubmission) => 
      c.name?.toLowerCase().includes(searchLower) ||
      c.contact?.toLowerCase().includes(searchLower) ||
      c.purpose?.toLowerCase().includes(searchLower) ||
      c.message?.toLowerCase().includes(searchLower)
    );
  }, [submissions.contacts, searchLower]);

  const filteredVolunteers = useMemo(() => {
    if (!searchLower) return submissions.volunteers || [];
    return (submissions.volunteers || []).filter((v: VolunteerSubmission) => 
      v.name?.toLowerCase().includes(searchLower) ||
      v.phone?.toLowerCase().includes(searchLower) ||
      v.email?.toLowerCase().includes(searchLower) ||
      v.city?.toLowerCase().includes(searchLower) ||
      v.activity?.toLowerCase().includes(searchLower) ||
      v.availability?.toLowerCase().includes(searchLower) ||
      v.skills?.toLowerCase().includes(searchLower)
    );
  }, [submissions.volunteers, searchLower]);

  const filteredPartners = useMemo(() => {
    if (!searchLower) return submissions.partners || [];
    return (submissions.partners || []).filter((p: PartnerSubmission) => 
      p.orgName?.toLowerCase().includes(searchLower) ||
      p.contactPerson?.toLowerCase().includes(searchLower) ||
      p.email?.toLowerCase().includes(searchLower) ||
      p.phone?.toLowerCase().includes(searchLower) ||
      p.type?.toLowerCase().includes(searchLower) ||
      p.message?.toLowerCase().includes(searchLower)
    );
  }, [submissions.partners, searchLower]);

  const filteredDedications = useMemo(() => {
    if (!searchLower) return submissions.dedications || [];
    return (submissions.dedications || []).filter((d: DedicationSubmission) => 
      d.honoreeName?.toLowerCase().includes(searchLower) ||
      d.donorName?.toLowerCase().includes(searchLower) ||
      d.occasion?.toLowerCase().includes(searchLower) ||
      d.phone?.toLowerCase().includes(searchLower) ||
      d.email?.toLowerCase().includes(searchLower) ||
      d.tier?.toLowerCase().includes(searchLower) ||
      d.message?.toLowerCase().includes(searchLower)
    );
  }, [submissions.dedications, searchLower]);

  const filteredBeacons = useMemo(() => {
    if (!searchLower) return submissions.beacons || [];
    return (submissions.beacons || []).filter((b: BeaconSubmission) =>
      b.location?.toLowerCase().includes(searchLower) ||
      b.city?.toLowerCase().includes(searchLower) ||
      b.category?.toLowerCase().includes(searchLower) ||
      b.landmark?.toLowerCase().includes(searchLower) ||
      b.description?.toLowerCase().includes(searchLower) ||
      b.reporterName?.toLowerCase().includes(searchLower) ||
      b.reporterPhone?.toLowerCase().includes(searchLower)
    );
  }, [submissions.beacons, searchLower]);

  const filteredWallPosts = useMemo(() => {
    if (!searchLower) return submissions.wallPosts || [];
    return (submissions.wallPosts || []).filter((w: WallPost) =>
      w.donorName?.toLowerCase().includes(searchLower) ||
      w.message?.toLowerCase().includes(searchLower) ||
      w.city?.toLowerCase().includes(searchLower) ||
      w.occasion?.toLowerCase().includes(searchLower) ||
      w.impactDescription?.toLowerCase().includes(searchLower)
    );
  }, [submissions.wallPosts, searchLower]);

  const updateNestedState = (path: string[], value: unknown) => {
    setHasUnsavedChanges(true);
    setSiteData((prev) => {
      if (!prev) return prev;
      // Deep clone to guarantee reference isolation and prevent state mutation bugs
      const clone = (obj: unknown): unknown => {
        if (Array.isArray(obj)) return obj.map(clone);
        if (obj && typeof obj === 'object') {
          const res: Record<string, unknown> = {};
          for (const k of Object.keys(obj as Record<string, unknown>)) {
            res[k] = clone((obj as Record<string, unknown>)[k]);
          }
          return res;
        }
        return obj;
      };
      const root = clone(prev) as Record<string, unknown>;
      let cur = root;
      for (let i = 0; i < path.length - 1; i++) {
        const seg = path[i];
        if (!cur[seg] || typeof cur[seg] !== 'object') {
          cur[seg] = {};
        }
        cur = cur[seg] as Record<string, unknown>;
      }
      cur[path[path.length - 1]] = value;
      return root as unknown as SiteConfig;
    });
  };

  // Safe immutable array helpers for projects, media, and reports
  const updateProjectItem = (index: number, field: keyof Project, value: unknown) => {
    setHasUnsavedChanges(true);
    setSiteData((prev) => {
      if (!prev) return prev;
      const projects = (prev.projects || []).map((p, i) => 
        i === index ? { ...p, [field]: value } : p
      );
      return { ...prev, projects };
    });
  };

  const removeProjectItem = (index: number) => {
    setHasUnsavedChanges(true);
    setSiteData((prev) => {
      if (!prev) return prev;
      const projects = (prev.projects || []).filter((_, i) => i !== index);
      return { ...prev, projects };
    });
  };

  const addProjectItem = () => {
    setHasUnsavedChanges(true);
    setSiteData((prev) => {
      if (!prev) return prev;
      const newProj: Project = {
        id: `project-${Date.now()}`,
        title: 'New Community Initiative',
        description: 'Detail the initiative goals and impact...',
        image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80',
        date: new Date().toISOString().split('T')[0],
        location: '',
        beneficiaries: 50,
        status: 'planned',
        expenses: 0,
        category: 'humanity'
      };
      return { ...prev, projects: [...(prev.projects || []), newProj] };
    });
  };

  const updateMediaImageItem = (index: number, field: keyof MediaItem, value: unknown) => {
    setHasUnsavedChanges(true);
    setSiteData((prev) => {
      if (!prev) return prev;
      const images = (prev.media?.images || []).map((img, i) => 
        i === index ? { ...img, [field]: value } : img
      );
      return { ...prev, media: { ...(prev.media || { images: [], videos: [] }), images } };
    });
  };

  const removeMediaImageItem = (index: number) => {
    setHasUnsavedChanges(true);
    setSiteData((prev) => {
      if (!prev) return prev;
      const images = (prev.media?.images || []).filter((_, i) => i !== index);
      return { ...prev, media: { ...(prev.media || { images: [], videos: [] }), images } };
    });
  };

  const addMediaImageItem = () => {
    setHasUnsavedChanges(true);
    setSiteData((prev) => {
      if (!prev) return prev;
      const newImg: MediaItem = {
        id: `img-${Date.now()}`,
        type: 'image',
        url: '',
        caption: 'Field drive photograph',
        date: new Date().toISOString().split('T')[0],
        category: 'humanity'
      };
      return { ...prev, media: { ...(prev.media || { images: [], videos: [] }), images: [...(prev.media?.images || []), newImg] } };
    });
  };

  const updateMediaVideoItem = (index: number, field: keyof MediaItem, value: unknown) => {
    setHasUnsavedChanges(true);
    setSiteData((prev) => {
      if (!prev) return prev;
      const videos = (prev.media?.videos || []).map((vid, i) => 
        i === index ? { ...vid, [field]: value } : vid
      );
      return { ...prev, media: { ...(prev.media || { images: [], videos: [] }), videos } };
    });
  };

  const removeMediaVideoItem = (index: number) => {
    setHasUnsavedChanges(true);
    setSiteData((prev) => {
      if (!prev) return prev;
      const videos = (prev.media?.videos || []).filter((_, i) => i !== index);
      return { ...prev, media: { ...(prev.media || { images: [], videos: [] }), videos } };
    });
  };

  const addMediaVideoItem = () => {
    setHasUnsavedChanges(true);
    setSiteData((prev) => {
      if (!prev) return prev;
      const newVid: MediaItem = {
        id: `vid-${Date.now()}`,
        type: 'video',
        url: '',
        caption: 'Field drive documentary video',
        date: new Date().toISOString().split('T')[0],
        category: 'humanity'
      };
      return { ...prev, media: { ...(prev.media || { images: [], videos: [] }), videos: [...(prev.media?.videos || []), newVid] } };
    });
  };

  const updateReportItem = (index: number, field: keyof Report, value: unknown) => {
    setHasUnsavedChanges(true);
    setSiteData((prev) => {
      if (!prev) return prev;
      const reports = (prev.reports || []).map((rep, i) => 
        i === index ? { ...rep, [field]: value } : rep
      );
      return { ...prev, reports };
    });
  };

  const removeReportItem = (index: number) => {
    setHasUnsavedChanges(true);
    setSiteData((prev) => {
      if (!prev) return prev;
      const reports = (prev.reports || []).filter((_, i) => i !== index);
      return { ...prev, reports };
    });
  };

  const addReportItem = () => {
    setHasUnsavedChanges(true);
    setSiteData((prev) => {
      if (!prev) return prev;
      const newRep: Report = {
        id: `rep-${Date.now()}`,
        title: 'Monthly Distribution Report',
        date: new Date().toISOString().split('T')[0],
        description: 'Detailed statement of meals distributed and operational summary.',
        type: 'monthly',
        link: ''
      };
      return { ...prev, reports: [...(prev.reports || []), newRep] };
    });
  };

  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;
    const match = url.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/);
    return match && match[2].length === 11 ? `https://www.youtube.com/embed/${match[2]}` : null;
  };

  const exportToCSV = (type: 'contacts' | 'volunteers' | 'partners' | 'dedications' | 'beacons' | 'wallPosts') => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];
    
    if (type === 'contacts') {
      const items = submissions.contacts || [];
      if (items.length === 0) {
        alert('No contacts submissions available to export.');
        return;
      }
      headers = ['ID', 'Date', 'Name', 'Contact', 'Purpose', 'Message'];
      rows = items.map((c: ContactSubmission) => [
        c.id,
        new Date(c.createdAt).toLocaleString(),
        `"${(c.name || '').replace(/"/g, '""')}"`,
        `"${(c.contact || '').replace(/"/g, '""')}"`,
        `"${(c.purpose || '').replace(/"/g, '""')}"`,
        `"${(c.message || '').replace(/"/g, '""')}"`,
      ]);
    } else if (type === 'volunteers') {
      const items = submissions.volunteers || [];
      if (items.length === 0) {
        alert('No volunteers submissions available to export.');
        return;
      }
      headers = ['ID', 'Date', 'Name', 'Phone', 'Email', 'City', 'Activity', 'Availability', 'Skills'];
      rows = items.map((v: VolunteerSubmission) => [
        v.id,
        new Date(v.createdAt).toLocaleString(),
        `"${(v.name || '').replace(/"/g, '""')}"`,
        `"${(v.phone || '').replace(/"/g, '""')}"`,
        `"${(v.email || '').replace(/"/g, '""')}"`,
        `"${(v.city || '').replace(/"/g, '""')}"`,
        `"${(v.activity || '').replace(/"/g, '""')}"`,
        `"${(v.availability || '').replace(/"/g, '""')}"`,
        `"${(v.skills || '').replace(/"/g, '""')}"`,
      ]);
    } else if (type === 'partners') {
      const items = submissions.partners || [];
      if (items.length === 0) {
        alert('No partners submissions available to export.');
        return;
      }
      headers = ['ID', 'Date', 'Organization', 'Contact Person', 'Email', 'Phone', 'Type', 'Message'];
      rows = items.map((p: PartnerSubmission) => [
        p.id,
        new Date(p.createdAt).toLocaleString(),
        `"${(p.orgName || '').replace(/"/g, '""')}"`,
        `"${(p.contactPerson || '').replace(/"/g, '""')}"`,
        `"${(p.email || '').replace(/"/g, '""')}"`,
        `"${(p.phone || '').replace(/"/g, '""')}"`,
        `"${(p.type || '').replace(/"/g, '""')}"`,
        `"${(p.message || '').replace(/"/g, '""')}"`,
      ]);
    } else if (type === 'dedications') {
      const items = submissions.dedications || [];
      if (items.length === 0) {
        alert('No dedications submissions available to export.');
        return;
      }
      headers = ['ID', 'Date', 'Occasion', 'Honoree Name', 'Donor Name', 'Phone', 'Email', 'Tier', 'Amount', 'Show On Wall', 'Status', 'Message'];
      rows = items.map((d: DedicationSubmission) => [
        d.id,
        new Date(d.createdAt).toLocaleString(),
        `"${(d.occasion || '').replace(/"/g, '""')}"`,
        `"${(d.honoreeName || '').replace(/"/g, '""')}"`,
        `"${(d.donorName || '').replace(/"/g, '""')}"`,
        `"${(d.phone || '').replace(/"/g, '""')}"`,
        `"${(d.email || '').replace(/"/g, '""')}"`,
        `"${(d.tier || '').replace(/"/g, '""')}"`,
        d.amount || 0,
        d.showOnWall ? 'Yes' : 'No',
        d.status || 'pending',
        `"${(d.message || '').replace(/"/g, '""')}"`,
      ]);
    } else if (type === 'beacons') {
      const items = submissions.beacons || [];
      if (items.length === 0) {
        alert('No SOS Beacons available to export.');
        return;
      }
      headers = ['ID', 'Date', 'Category', 'Urgency', 'City', 'Location', 'Landmark', 'Coordinates', 'Reporter Name', 'Reporter Phone', 'Status', 'Description'];
      rows = items.map((b: BeaconSubmission) => [
        b.id,
        new Date(b.createdAt).toLocaleString(),
        `"${b.category}"`,
        `"${b.urgency}"`,
        `"${(b.city || '').replace(/"/g, '""')}"`,
        `"${(b.location || '').replace(/"/g, '""')}"`,
        `"${(b.landmark || '').replace(/"/g, '""')}"`,
        `"${(b.coordinates || '').replace(/"/g, '""')}"`,
        `"${(b.reporterName || '').replace(/"/g, '""')}"`,
        `"${(b.reporterPhone || '').replace(/"/g, '""')}"`,
        `"${b.status || 'pending'}"`,
        `"${(b.description || '').replace(/"/g, '""')}"`,
      ]);
    } else if (type === 'wallPosts') {
      const items = submissions.wallPosts || [];
      if (items.length === 0) {
        alert('No Wall of Kindness notes available to export.');
        return;
      }
      headers = ['ID', 'Date', 'Donor Name', 'City', 'Occasion', 'Amount', 'Impact Description', 'Approved', 'Message'];
      rows = items.map((w: WallPost) => [
        w.id,
        new Date(w.createdAt).toLocaleString(),
        `"${(w.donorName || '').replace(/"/g, '""')}"`,
        `"${(w.city || '').replace(/"/g, '""')}"`,
        `"${(w.occasion || '').replace(/"/g, '""')}"`,
        w.amount || 0,
        `"${(w.impactDescription || '').replace(/"/g, '""')}"`,
        w.approved ? 'Yes' : 'No',
        `"${(w.message || '').replace(/"/g, '""')}"`,
      ]);
    }
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `petbhar-${type}-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7] p-4 text-[#0E0D0C]">
        <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-black/5 border border-charcoal/10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-charcoal text-ivory mb-4 shadow-md font-serif text-xl font-bold">
              PB
            </div>
            <h1 className="text-2xl font-serif text-charcoal font-semibold">PetBhar Admin</h1>
            <p className="text-warm-grey text-sm mt-1">Management Portal & Mission Control</p>
            <p className="text-xs text-warm-grey/60 mt-0.5 tracking-wider uppercase">“No one should sleep hungry.”</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-warm-grey uppercase tracking-wider block mb-1.5">Master Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full border border-charcoal/15 rounded-xl px-4 py-3 text-sm focus:border-charcoal focus:ring-1 focus:ring-charcoal outline-none pr-11 bg-warm-ivory/30"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-grey hover:text-charcoal p-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
                <AlertCircle size={14} className="shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-charcoal text-ivory rounded-xl py-3 text-sm font-medium hover:bg-black transition-all shadow-md active:scale-[0.99]"
            >
              Sign In to Dashboard &rarr;
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-charcoal/5 text-center">
            <a href="/" target="_blank" rel="noopener noreferrer" className="text-xs text-warm-grey hover:text-charcoal inline-flex items-center gap-1.5 transition-colors">
              Return to Public Website <ArrowUpRight size={12} />
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!siteData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-charcoal border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-warm-grey">Loading PetBhar Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#0E0D0C] pb-24">
      {/* Sticky Header Bar */}
      <header className="bg-white/95 backdrop-blur-md border-b border-charcoal/10 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-charcoal text-ivory flex items-center justify-center font-serif font-bold text-sm shadow-xs">
              PB
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-semibold text-charcoal text-base">PetBhar Initiative</span>
                <span className="text-[10px] uppercase tracking-wider bg-charcoal/5 px-2 py-0.5 rounded-full font-sans font-medium text-warm-grey">Portal</span>
              </div>
              <p className="text-[11px] text-warm-grey hidden sm:block">Mission Control & Content Management</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {hasUnsavedChanges && (
              <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-full animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600" /> Unsaved changes (Ctrl+S)
              </span>
            )}

            {lastSavedTime && !hasUnsavedChanges && (
              <span className="hidden lg:inline-flex items-center gap-1 text-[11px] text-warm-grey/70">
                <Clock size={12} /> Saved at {lastSavedTime}
              </span>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-xl transition-all shadow-xs active:scale-95 ${
                hasUnsavedChanges 
                  ? 'bg-charcoal text-ivory hover:bg-black' 
                  : 'bg-charcoal/10 text-charcoal hover:bg-charcoal/15'
              }`}
              title="Shortcut: Ctrl+S"
            >
              <Save size={14} className={saving ? 'animate-spin' : ''} />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>

            <div className="w-px h-5 bg-charcoal/10" />

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-warm-grey hover:text-charcoal transition-colors px-2 py-1.5 rounded-lg hover:bg-charcoal/5"
              title="Open public website in a new tab"
            >
              <span className="hidden sm:inline">Preview</span> <ExternalLink size={13} />
            </a>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 transition-colors px-2 py-1.5 rounded-lg hover:bg-red-50"
              title="Sign out of portal"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Floating Save Notification Toast */}
      {message.text && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className={`px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-sm font-medium border ${
            message.type === 'success' 
              ? 'bg-charcoal text-ivory border-charcoal/20 shadow-black/20' 
              : 'bg-red-600 text-white border-red-700 shadow-red-900/20'
          }`}>
            {message.type === 'success' ? <Check size={16} className="text-emerald-400" /> : <AlertCircle size={16} />}
            <span>{message.text}</span>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        {/* Navigation Tabs Bar */}
        <div className="relative mb-6">
          <div className="bg-white rounded-2xl p-1.5 shadow-xs border border-charcoal/10 overflow-x-auto flex gap-1.5 scrollbar-hide overscroll-x-contain -mx-2 px-3 sm:mx-0 sm:px-1.5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap shrink-0 px-3.5 py-2.5 sm:py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 min-h-[42px] ${
                    isActive
                      ? 'bg-charcoal text-ivory shadow-xs'
                      : 'text-warm-grey hover:text-charcoal hover:bg-charcoal/5'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-charcoal text-ivory'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {/* Subtle scroll cue indicator on mobile */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/90 to-transparent sm:hidden rounded-r-2xl" />
        </div>

        {/* Tab Content Canvas */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-charcoal/10">

          {/* ======================================================== */}
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {/* ======================================================== */}
          {activeTab === 'Dashboard' && (
            <div className="space-y-8">
              {/* Welcome Banner */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-charcoal via-[#1C1B19] to-charcoal p-6 sm:p-8 text-ivory shadow-md">
                <div className="relative z-10 max-w-2xl">
                  <span className="text-[11px] uppercase tracking-widest text-white/60 font-medium">PetBhar Grassroots Mission</span>
                  <h2 className="text-2xl sm:text-3xl font-serif mt-1 font-normal">Welcome to Mission Control</h2>
                  <p className="text-sm text-ivory/80 mt-2 leading-relaxed">
                    Manage grassroots field operations, update live community impact numbers, oversee transparency disclosures, and respond directly to volunteer and partner inquiries.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-5">
                    <button
                      onClick={() => setActiveTab('Inquiries')}
                      className="bg-ivory text-charcoal hover:bg-white text-xs font-medium px-4 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                    >
                      <MessageSquare size={13} /> View Recent Inquiries ({totalInquiries})
                    </button>
                    <button
                      onClick={() => setActiveTab('Impact')}
                      className="bg-white/10 hover:bg-white/15 text-ivory text-xs font-medium px-4 py-2 rounded-xl transition-all border border-white/10 flex items-center gap-1.5"
                    >
                      <Sparkles size={13} /> Update Impact Counters
                    </button>
                  </div>
                </div>
                <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-64 h-64 rounded-full bg-white/5 blur-3xl pointer-events-none" />
              </div>

              {/* 4 KPI Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* KPI 1: Inquiries */}
                <div 
                  onClick={() => setActiveTab('Inquiries')}
                  className="p-5 rounded-2xl border border-charcoal/10 bg-warm-ivory/20 hover:border-charcoal/30 cursor-pointer transition-all hover:shadow-xs group"
                >
                  <div className="flex items-center justify-between text-warm-grey mb-3">
                    <span className="text-xs font-medium uppercase tracking-wider">Submissions</span>
                    <span className="w-8 h-8 rounded-xl bg-charcoal/5 flex items-center justify-center text-charcoal group-hover:bg-charcoal group-hover:text-ivory transition-all">
                      <MessageSquare size={15} />
                    </span>
                  </div>
                  <div className="text-3xl font-serif font-bold text-charcoal">{totalInquiries}</div>
                  <p className="text-xs text-warm-grey mt-1">
                    {submissions.contacts?.length || 0} messages • {submissions.volunteers?.length || 0} volunteers • {submissions.partners?.length || 0} partners
                  </p>
                </div>

                {/* KPI 2: Impact */}
                <div 
                  onClick={() => setActiveTab('Impact')}
                  className="p-5 rounded-2xl border border-charcoal/10 bg-warm-ivory/20 hover:border-charcoal/30 cursor-pointer transition-all hover:shadow-xs group"
                >
                  <div className="flex items-center justify-between text-warm-grey mb-3">
                    <span className="text-xs font-medium uppercase tracking-wider">People Fed</span>
                    <span className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition-all">
                      <Sparkles size={15} />
                    </span>
                  </div>
                  <div className="text-3xl font-serif font-bold text-charcoal">{siteData.impact?.peopleFed || 0}</div>
                  <p className="text-xs text-warm-grey mt-1">
                    {siteData.impact?.mealsDistributed || 0} meals distributed in {siteData.impact?.communitiesReached || 0} areas
                  </p>
                </div>

                {/* KPI 3: Transparency */}
                <div 
                  onClick={() => setActiveTab('Transparency')}
                  className="p-5 rounded-2xl border border-charcoal/10 bg-warm-ivory/20 hover:border-charcoal/30 cursor-pointer transition-all hover:shadow-xs group"
                >
                  <div className="flex items-center justify-between text-warm-grey mb-3">
                    <span className="text-xs font-medium uppercase tracking-wider">Contributions</span>
                    <span className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center group-hover:bg-amber-700 group-hover:text-white transition-all">
                      <Shield size={15} />
                    </span>
                  </div>
                  <div className="text-3xl font-serif font-bold text-charcoal">₹{(siteData.transparency?.contributionsReceived || 0).toLocaleString('en-IN')}</div>
                  <p className="text-xs text-warm-grey mt-1">
                    ₹{(siteData.transparency?.foodPurchased || 0).toLocaleString('en-IN')} allocated directly to food purchases
                  </p>
                </div>

                {/* KPI 4: Projects & Media */}
                <div 
                  onClick={() => setActiveTab('Projects')}
                  className="p-5 rounded-2xl border border-charcoal/10 bg-warm-ivory/20 hover:border-charcoal/30 cursor-pointer transition-all hover:shadow-xs group"
                >
                  <div className="flex items-center justify-between text-warm-grey mb-3">
                    <span className="text-xs font-medium uppercase tracking-wider">Field Initiatives</span>
                    <span className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-700 flex items-center justify-center group-hover:bg-blue-700 group-hover:text-white transition-all">
                      <Users size={15} />
                    </span>
                  </div>
                  <div className="text-3xl font-serif font-bold text-charcoal">{siteData.projects?.length || 0}</div>
                  <p className="text-xs text-warm-grey mt-1">
                    {siteData.media?.images?.length || 0} photos & {siteData.media?.videos?.length || 0} videos documented
                  </p>
                </div>
              </div>

              {/* Quick Jump Grid */}
              <div>
                <h3 className="text-sm font-semibold text-charcoal uppercase tracking-wider mb-4">Quick Management Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    onClick={() => setActiveTab('Donation')}
                    className="p-4 rounded-2xl border border-charcoal/10 text-left hover:border-charcoal transition-all bg-white hover:bg-warm-ivory/10 group flex items-start gap-3.5"
                  >
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Heart size={18} />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-charcoal block">Donations & UPI</span>
                      <span className="text-xs text-warm-grey">Update UPI ID, Payee name, QR code, or direct bank transfer.</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('Media')}
                    className="p-4 rounded-2xl border border-charcoal/10 text-left hover:border-charcoal transition-all bg-white hover:bg-warm-ivory/10 group flex items-start gap-3.5"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Film size={18} />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-charcoal block">Media Documentation</span>
                      <span className="text-xs text-warm-grey">Add photos and YouTube video embeds of your field drives.</span>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab('Contact')}
                    className="p-4 rounded-2xl border border-charcoal/10 text-left hover:border-charcoal transition-all bg-white hover:bg-warm-ivory/10 group flex items-start gap-3.5"
                  >
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Phone size={18} />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-charcoal block">Contact & Socials</span>
                      <span className="text-xs text-warm-grey">Update official email, WhatsApp number, and @petbharinitiative links.</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Recent Inquiries Snippet */}
              <div className="border-t border-charcoal/10 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-semibold text-charcoal uppercase tracking-wider">Recent Activity & Submissions</h3>
                    <p className="text-xs text-warm-grey">Latest messages received from your public website forms.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('Inquiries')}
                    className="text-xs font-medium text-charcoal hover:underline flex items-center gap-1"
                  >
                    View all ({totalInquiries}) &rarr;
                  </button>
                </div>

                {totalInquiries === 0 ? (
                  <div className="text-center py-10 bg-warm-ivory/20 rounded-2xl border border-charcoal/5">
                    <MessageSquare size={24} className="mx-auto text-warm-grey/40 mb-2" />
                    <p className="text-sm text-warm-grey">No inquiries or applications received yet.</p>
                    <p className="text-xs text-warm-grey/60 mt-0.5">When visitors reach out on the Contact or Get Involved page, submissions appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {([
                      ...(submissions.contacts || []).map((c: ContactSubmission) => ({ ...c, _cat: 'Contact Message' })),
                      ...(submissions.volunteers || []).map((v: VolunteerSubmission) => ({ ...v, _cat: 'Volunteer Application' })),
                      ...(submissions.partners || []).map((p: PartnerSubmission) => ({ ...p, _cat: 'Partner Proposal' })),
                      ...(submissions.dedications || []).map((d: DedicationSubmission) => ({ ...d, name: `${d.donorName || 'Supporter'} (for ${d.honoreeName})`, contact: d.phone, _cat: 'Drive Dedication' })),
                      ...(submissions.beacons || []).map((b: BeaconSubmission) => ({ ...b, name: `${b.category.toUpperCase().replace('_', ' ')} (${b.city || 'SOS'})`, contact: b.reporterPhone || b.location, _cat: 'SOS Beacon' })),
                      ...(submissions.wallPosts || []).map((w: WallPost) => ({ ...w, name: `${w.donorName || 'Supporter'}`, contact: w.city || 'Wall Note', _cat: 'Wall Note' }))
                    ])
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .slice(0, 4)
                      .map((item) => (
                        <div 
                          key={item.id} 
                          onClick={() => {
                            setActiveTab('Inquiries');
                            if (item._cat === 'Contact Message') setInquiryCategory('contacts');
                            if (item._cat === 'Volunteer Application') setInquiryCategory('volunteers');
                            if (item._cat === 'Partner Proposal') setInquiryCategory('partners');
                            if (item._cat === 'Drive Dedication') setInquiryCategory('dedications');
                            if (item._cat === 'SOS Beacon') setInquiryCategory('beacons');
                            if (item._cat === 'Wall Note') setInquiryCategory('wallPosts');
                          }}
                          className="flex items-center justify-between p-3.5 rounded-xl border border-charcoal/5 hover:border-charcoal/20 bg-warm-ivory/10 hover:bg-warm-ivory/30 cursor-pointer transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                              item._cat === 'Contact Message' ? 'bg-amber-100 text-amber-800' :
                              item._cat === 'Volunteer Application' ? 'bg-blue-100 text-blue-800' : 
                              item._cat === 'Drive Dedication' ? 'bg-rose-100 text-rose-800' : 
                              item._cat === 'SOS Beacon' ? 'bg-red-100 text-red-800 font-bold' :
                              'bg-emerald-100 text-emerald-800'
                            }`}>
                              {item._cat}
                            </span>
                            <span className="text-sm font-semibold text-charcoal">{('name' in item && item.name) || ('orgName' in item && item.orgName) || ('honoreeName' in item && item.honoreeName)}</span>
                            <span className="text-xs text-warm-grey hidden sm:inline truncate max-w-xs">{('contact' in item && item.contact) || ('phone' in item && item.phone) || ('email' in item && item.email)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-warm-grey">
                            <span>{new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            <ArrowUpRight size={13} />
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: INQUIRIES & APPLICATIONS */}
          {/* ======================================================== */}
          {activeTab === 'Inquiries' && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-charcoal/10">
                <div>
                  <h2 className="text-xl font-serif font-semibold text-charcoal">Inquiries & Community Alerts</h2>
                  <p className="text-xs text-warm-grey mt-0.5">Live submissions from visitors, volunteers, citizen SOS beacons, and Wall of Kindness notes.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Category Filter Pills */}
                  <div className="flex flex-wrap bg-charcoal/5 p-1 rounded-xl gap-1">
                    <button
                      onClick={() => setInquiryCategory('contacts')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        inquiryCategory === 'contacts' ? 'bg-white text-charcoal shadow-xs' : 'text-warm-grey hover:text-charcoal'
                      }`}
                    >
                      Messages ({submissions.contacts?.length || 0})
                    </button>
                    <button
                      onClick={() => setInquiryCategory('volunteers')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        inquiryCategory === 'volunteers' ? 'bg-white text-charcoal shadow-xs' : 'text-warm-grey hover:text-charcoal'
                      }`}
                    >
                      Volunteers ({submissions.volunteers?.length || 0})
                    </button>
                    <button
                      onClick={() => setInquiryCategory('partners')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        inquiryCategory === 'partners' ? 'bg-white text-charcoal shadow-xs' : 'text-warm-grey hover:text-charcoal'
                      }`}
                    >
                      Partners ({submissions.partners?.length || 0})
                    </button>
                    <button
                      onClick={() => setInquiryCategory('dedications')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        inquiryCategory === 'dedications' ? 'bg-white text-charcoal shadow-xs' : 'text-warm-grey hover:text-charcoal'
                      }`}
                    >
                      Dedications ({submissions.dedications?.length || 0})
                    </button>
                    <button
                      onClick={() => setInquiryCategory('beacons')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        inquiryCategory === 'beacons' ? 'bg-white text-charcoal shadow-xs' : 'text-warm-grey hover:text-charcoal'
                      }`}
                    >
                      SOS Beacons ({submissions.beacons?.length || 0})
                    </button>
                    <button
                      onClick={() => setInquiryCategory('wallPosts')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        inquiryCategory === 'wallPosts' ? 'bg-white text-charcoal shadow-xs' : 'text-warm-grey hover:text-charcoal'
                      }`}
                    >
                      Wall of Kindness ({submissions.wallPosts?.length || 0})
                    </button>
                  </div>

                  {/* Export CSV Button */}
                  <button
                    onClick={() => exportToCSV(inquiryCategory)}
                    className="flex items-center gap-1.5 bg-white border border-charcoal/15 hover:border-charcoal text-charcoal px-3 py-1.5 rounded-xl text-xs font-medium transition-all shadow-xs"
                    title={`Export ${inquiryCategory} to CSV format`}
                  >
                    <Download size={13} /> Export CSV
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-grey" />
                <input
                  type="text"
                  value={inquirySearch}
                  onChange={(e) => setInquirySearch(e.target.value)}
                  placeholder={`Search ${inquiryCategory} by name, phone, email, or keywords...`}
                  className="w-full bg-warm-ivory/20 border border-charcoal/10 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:border-charcoal focus:ring-1 focus:ring-charcoal outline-none transition-all"
                />
                {inquirySearch && (
                  <button
                    onClick={() => setInquirySearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-warm-grey hover:text-charcoal"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* 1. CONTACT MESSAGES LIST */}
              {inquiryCategory === 'contacts' && (
                <div className="space-y-3.5">
                  {filteredContacts.length === 0 ? (
                    <div className="text-center py-12 bg-warm-ivory/20 rounded-2xl border border-charcoal/5">
                      <Mail size={24} className="mx-auto text-warm-grey/40 mb-2" />
                      <p className="text-sm text-warm-grey">
                        {inquirySearch ? 'No messages match your search filter.' : 'No contact messages received yet.'}
                      </p>
                    </div>
                  ) : (
                    filteredContacts.map((c: ContactSubmission) => (
                      <div key={c.id} className="p-5 border border-charcoal/10 rounded-2xl bg-white hover:border-charcoal/25 transition-all shadow-xs">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-semibold text-charcoal text-sm">{c.name}</span>
                              <span className="text-[11px] bg-charcoal/5 text-warm-grey px-2.5 py-0.5 rounded-full font-medium">{c.purpose}</span>
                            </div>
                            <p className="text-xs text-warm-grey mt-1">
                              Contact: <span className="text-charcoal font-mono font-medium">{c.contact}</span> • {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} at {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {c.contact && c.contact.includes('@') && (
                              <a
                                href={`mailto:${c.contact}?subject=Regarding your message to PetBhar Initiative`}
                                className="w-9 h-9 flex items-center justify-center text-warm-grey hover:text-charcoal hover:bg-charcoal/5 rounded-xl transition-colors active:scale-95"
                                title="Reply via Email"
                              >
                                <Mail size={16} />
                              </a>
                            )}
                            {c.contact && !c.contact.includes('@') && (
                              <a
                                href={`https://wa.me/${c.contact.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 flex items-center justify-center text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors active:scale-95"
                                title="Contact on WhatsApp"
                              >
                                <Phone size={16} />
                              </a>
                            )}
                            <button
                              onClick={() => handleDeleteSubmission('contacts', c.id)}
                              className="w-9 h-9 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors active:scale-95"
                              title="Delete submission"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="text-xs text-charcoal mt-3.5 whitespace-pre-wrap bg-warm-ivory/30 p-3.5 rounded-xl border border-charcoal/5 leading-relaxed">
                          {c.message}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* 2. VOLUNTEER APPLICATIONS LIST */}
              {inquiryCategory === 'volunteers' && (
                <div className="space-y-3.5">
                  {filteredVolunteers.length === 0 ? (
                    <div className="text-center py-12 bg-warm-ivory/20 rounded-2xl border border-charcoal/5">
                      <Users size={24} className="mx-auto text-warm-grey/40 mb-2" />
                      <p className="text-sm text-warm-grey">
                        {inquirySearch ? 'No volunteer applications match your search filter.' : 'No volunteer applications received yet.'}
                      </p>
                    </div>
                  ) : (
                    filteredVolunteers.map((v: VolunteerSubmission) => (
                      <div key={v.id} className="p-5 border border-charcoal/10 rounded-2xl bg-white hover:border-charcoal/25 transition-all shadow-xs">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-semibold text-charcoal text-sm">{v.name}</span>
                              <span className="text-[11px] bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full font-medium">{v.activity}</span>
                              <span className="text-[11px] bg-charcoal/5 text-warm-grey px-2 py-0.5 rounded-full flex items-center gap-1">
                                <MapPin size={10} /> {v.city}
                              </span>
                            </div>
                            <p className="text-xs text-warm-grey mt-1">
                              Phone: <span className="text-charcoal font-mono font-medium">{v.phone}</span>
                              {v.email && <> • Email: <span className="text-charcoal font-mono">{v.email}</span></>}
                              • Availability: <span className="text-charcoal font-medium">{v.availability}</span>
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {v.phone && (
                              <a
                                href={`https://wa.me/${v.phone.replace(/\D/g, '')}?text=Hi ${encodeURIComponent(v.name)}, thank you for volunteering with PetBhar Initiative!`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 flex items-center justify-center text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors active:scale-95"
                                title="Contact via WhatsApp"
                              >
                                <Phone size={16} />
                              </a>
                            )}
                            {v.email && (
                              <a
                                href={`mailto:${v.email}?subject=Welcome to PetBhar Volunteer Team`}
                                className="w-9 h-9 flex items-center justify-center text-warm-grey hover:text-charcoal hover:bg-charcoal/5 rounded-xl transition-colors active:scale-95"
                                title="Send Email"
                              >
                                <Mail size={16} />
                              </a>
                            )}
                            <button
                              onClick={() => handleDeleteSubmission('volunteers', v.id)}
                              className="w-9 h-9 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors active:scale-95"
                              title="Delete submission"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        {v.skills && (
                          <div className="mt-3 text-xs text-charcoal bg-warm-ivory/30 p-3 rounded-xl border border-charcoal/5">
                            <span className="font-semibold text-warm-grey text-[10px] uppercase tracking-wider block mb-1">Skills & Notes</span>
                            {v.skills}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* 3. PARTNER PROPOSALS LIST */}
              {inquiryCategory === 'partners' && (
                <div className="space-y-3.5">
                  {filteredPartners.length === 0 ? (
                    <div className="text-center py-12 bg-warm-ivory/20 rounded-2xl border border-charcoal/5">
                      <Building size={24} className="mx-auto text-warm-grey/40 mb-2" />
                      <p className="text-sm text-warm-grey">
                        {inquirySearch ? 'No partnership proposals match your search filter.' : 'No partnership proposals received yet.'}
                      </p>
                    </div>
                  ) : (
                    filteredPartners.map((p: PartnerSubmission) => (
                      <div key={p.id} className="p-5 border border-charcoal/10 rounded-2xl bg-white hover:border-charcoal/25 transition-all shadow-xs">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-semibold text-charcoal text-sm">{p.orgName}</span>
                              <span className="text-[11px] bg-purple-50 text-purple-700 px-2.5 py-0.5 rounded-full font-medium">{p.type}</span>
                            </div>
                            <p className="text-xs text-warm-grey mt-1">
                              Contact: <span className="text-charcoal font-medium">{p.contactPerson}</span> • 
                              Email: <span className="text-charcoal font-mono">{p.email}</span>
                              {p.phone && <> • Phone: <span className="text-charcoal font-mono">{p.phone}</span></>}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {p.email && (
                              <a
                                href={`mailto:${p.email}?subject=PetBhar Initiative Partnership Proposal`}
                                className="w-9 h-9 flex items-center justify-center text-warm-grey hover:text-charcoal hover:bg-charcoal/5 rounded-xl transition-colors active:scale-95"
                                title="Reply via Email"
                              >
                                <Mail size={16} />
                              </a>
                            )}
                            {p.phone && (
                              <a
                                href={`https://wa.me/${p.phone.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 flex items-center justify-center text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors active:scale-95"
                                title="Contact via WhatsApp"
                              >
                                <Phone size={16} />
                              </a>
                            )}
                            <button
                              onClick={() => handleDeleteSubmission('partners', p.id)}
                              className="w-9 h-9 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors active:scale-95"
                              title="Delete submission"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        <div className="text-xs text-charcoal mt-3.5 whitespace-pre-wrap bg-warm-ivory/30 p-3.5 rounded-xl border border-charcoal/5 leading-relaxed">
                          {p.message}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* 4. DEDICATIONS LIST */}
              {inquiryCategory === 'dedications' && (
                <div className="space-y-3.5">
                  {filteredDedications.length === 0 ? (
                    <div className="text-center py-12 bg-warm-ivory/20 rounded-2xl border border-charcoal/5">
                      <Heart size={24} className="mx-auto text-warm-grey/40 mb-2" />
                      <p className="text-sm text-warm-grey">
                        {inquirySearch ? 'No dedications match your search filter.' : 'No drive dedications received yet.'}
                      </p>
                    </div>
                  ) : (
                    filteredDedications.map((d: DedicationSubmission) => (
                      <div key={d.id} className="p-5 border border-charcoal/10 rounded-2xl bg-white hover:border-charcoal/25 transition-all shadow-xs">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-semibold text-charcoal text-sm">{d.honoreeName}</span>
                              <span className="text-[11px] bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full font-medium">{d.occasion}</span>
                              <span className="text-[11px] bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">₹{(d.amount || 0).toLocaleString('en-IN')}</span>
                              <span className="text-[11px] bg-charcoal/5 text-warm-grey px-2 py-0.5 rounded-full font-medium">{d.tier}</span>
                            </div>
                            <p className="text-xs text-warm-grey mt-1">
                              Sponsored by: <span className="text-charcoal font-medium">{d.donorName || 'Anonymous'}</span> • 
                              WhatsApp: <span className="text-charcoal font-mono">{d.phone}</span>
                              {d.email && <> • Email: <span className="text-charcoal font-mono">{d.email}</span></>}
                              • {new Date(d.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => handleUpdateSubmission('dedications', d.id, { showOnWall: !d.showOnWall })}
                              className={`px-2.5 py-1 text-[11px] rounded-lg font-medium transition-all flex items-center gap-1 ${
                                d.showOnWall 
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100' 
                                  : 'bg-warm-ivory/50 text-warm-grey border border-charcoal/10 hover:text-charcoal'
                              }`}
                              title={d.showOnWall ? "Click to remove from public Wall of Kindness" : "Click to feature on public Wall of Kindness"}
                            >
                              <Heart size={12} className={d.showOnWall ? 'fill-rose-600 text-rose-600' : ''} />
                              <span>{d.showOnWall ? 'Featured on Wall' : 'Feature on Wall'}</span>
                            </button>
                            {d.phone && (
                              <a
                                href={`https://wa.me/${d.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${d.donorName || 'Supporter'}, thank you for sponsoring a PetBhar feeding drive in honor of ${d.honoreeName}! Here are the photos & video from the ground:`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 flex items-center justify-center text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors active:scale-95"
                                title="Send Drive Photos via WhatsApp"
                              >
                                <Phone size={16} />
                              </a>
                            )}
                            {d.email && (
                              <a
                                href={`mailto:${d.email}?subject=PetBhar Drive Photos for ${encodeURIComponent(d.honoreeName)}`}
                                className="w-9 h-9 flex items-center justify-center text-warm-grey hover:text-charcoal hover:bg-charcoal/5 rounded-xl transition-colors active:scale-95"
                                title="Send Email"
                              >
                                <Mail size={16} />
                              </a>
                            )}
                            <button
                              onClick={() => handleDeleteSubmission('dedications', d.id)}
                              className="w-9 h-9 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors active:scale-95"
                              title="Delete submission"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        {d.message && (
                          <div className="mt-3 text-xs text-charcoal bg-amber-50/50 p-3 rounded-xl border border-amber-200/50 leading-relaxed">
                            <span className="font-semibold text-amber-900 text-[10px] uppercase tracking-wider block mb-0.5">Banner Message</span>
                            &ldquo;{d.message}&rdquo;
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* 5. SOS BEACONS LIST */}
              {inquiryCategory === 'beacons' && (
                <div className="space-y-3.5">
                  {filteredBeacons.length === 0 ? (
                    <div className="text-center py-12 bg-warm-ivory/20 rounded-2xl border border-charcoal/5">
                      <AlertCircle size={24} className="mx-auto text-warm-grey/40 mb-2" />
                      <p className="text-sm text-warm-grey">
                        {inquirySearch ? 'No SOS beacons match your search filter.' : 'No emergency beacons reported yet.'}
                      </p>
                    </div>
                  ) : (
                    filteredBeacons.map((b: BeaconSubmission) => (
                      <div key={b.id} className="p-5 border border-charcoal/10 rounded-2xl bg-white hover:border-charcoal/25 transition-all shadow-xs">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="space-y-1.5 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                                b.urgency === 'immediate' ? 'bg-red-100 text-red-800 border border-red-200' :
                                b.urgency === 'within_24h' ? 'bg-amber-100 text-amber-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {b.urgency === 'immediate' ? '🚨 Immediate Action' : b.urgency === 'within_24h' ? '⏳ Within 24 Hours' : 'ℹ️ General Need'}
                              </span>

                              <span className="text-[11px] bg-charcoal/5 text-charcoal font-medium px-2.5 py-0.5 rounded-full">
                                {b.category === 'stray_food' ? '🐕 Stray Food Need' :
                                 b.category === 'injured_animal' ? '🩺 Injured Animal' :
                                 b.category === 'water_bowl' ? '💧 Water Shortage' : '🍲 Hungry Community'}
                              </span>

                              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                                b.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                                b.status === 'dispatched' ? 'bg-blue-100 text-blue-800' :
                                'bg-amber-100 text-amber-800'
                              }`}>
                                Status: {b.status?.toUpperCase() || 'PENDING'}
                              </span>
                            </div>

                            <div className="text-sm font-semibold text-charcoal flex items-center gap-1.5 pt-1">
                              <MapPin size={15} className="text-red-600 shrink-0" />
                              <span>{b.location}</span>
                              {b.city && <span className="text-xs font-normal text-warm-grey">({b.city})</span>}
                            </div>

                            {b.landmark && (
                              <p className="text-xs text-warm-grey">
                                Landmark: <span className="text-charcoal font-medium">{b.landmark}</span>
                              </p>
                            )}

                            <p className="text-xs text-warm-grey">
                              Reported by: <span className="text-charcoal font-medium">{b.reporterName || 'Anonymous Citizen'}</span>
                              {b.reporterPhone && <> • Phone: <span className="text-charcoal font-mono">{b.reporterPhone}</span></>}
                              • {new Date(b.createdAt).toLocaleString()}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 shrink-0">
                            {/* Status quick select */}
                            <select
                              value={b.status || 'pending'}
                              onChange={(e) => handleUpdateSubmission('beacons', b.id, { status: e.target.value })}
                              aria-label="Update dispatch status"
                              className="text-xs font-medium border border-charcoal/15 rounded-xl px-2.5 py-1.5 bg-warm-ivory/30 outline-none focus:border-charcoal"
                            >
                              <option value="pending">Pending</option>
                              <option value="dispatched">Dispatched</option>
                              <option value="resolved">Resolved</option>
                            </select>

                            {/* Google Maps link */}
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.coordinates || `${b.location}, ${b.city}`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-9 h-9 flex items-center justify-center text-blue-600 hover:bg-blue-50 rounded-xl transition-colors active:scale-95"
                              title="Navigate via Google Maps"
                            >
                              <MapPin size={16} />
                            </a>

                            {/* WhatsApp link */}
                            {b.reporterPhone && (
                              <a
                                href={`https://wa.me/${b.reporterPhone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hi ${b.reporterName || 'Volunteer'}, regarding your PetBhar SOS Beacon alert for ${b.location}:`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-9 h-9 flex items-center justify-center text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors active:scale-95"
                                title="Message Reporter on WhatsApp"
                              >
                                <Phone size={16} />
                              </a>
                            )}

                            {/* Delete button */}
                            <button
                              onClick={() => handleDeleteSubmission('beacons', b.id)}
                              className="w-9 h-9 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors active:scale-95"
                              title="Delete submission"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        {b.description && (
                          <div className="mt-3.5 text-xs text-charcoal bg-warm-ivory/30 p-3.5 rounded-xl border border-charcoal/5 leading-relaxed">
                            <span className="font-semibold text-warm-grey text-[10px] uppercase tracking-wider block mb-0.5">Details from field</span>
                            {b.description}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* 6. WALL OF KINDNESS LIST */}
              {inquiryCategory === 'wallPosts' && (
                <div className="space-y-3.5">
                  {filteredWallPosts.length === 0 ? (
                    <div className="text-center py-12 bg-warm-ivory/20 rounded-2xl border border-charcoal/5">
                      <Heart size={24} className="mx-auto text-warm-grey/40 mb-2" />
                      <p className="text-sm text-warm-grey">
                        {inquirySearch ? 'No notes match your search filter.' : 'No community notes submitted yet.'}
                      </p>
                    </div>
                  ) : (
                    filteredWallPosts.map((w: WallPost) => (
                      <div key={w.id} className="p-5 border border-charcoal/10 rounded-2xl bg-white hover:border-charcoal/25 transition-all shadow-xs">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div className="space-y-1 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-semibold text-charcoal text-sm">{w.donorName}</span>
                              {w.city && <span className="text-[11px] bg-charcoal/5 text-warm-grey px-2 py-0.5 rounded-full font-medium">{w.city}</span>}
                              {w.occasion && <span className="text-[11px] bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-full font-medium">{w.occasion}</span>}
                              {w.amount ? <span className="text-[11px] bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">₹{w.amount.toLocaleString('en-IN')}</span> : null}
                              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                w.approved ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {w.approved ? 'Approved & Public' : 'Pending Moderation'}
                              </span>
                            </div>

                            <p className="text-xs text-warm-grey pt-0.5">
                              Submitted on {new Date(w.createdAt).toLocaleString()}
                              {w.impactDescription && <> • <span className="text-charcoal font-medium">{w.impactDescription}</span></>}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {/* Toggle Approval button */}
                            <button
                              onClick={() => handleUpdateSubmission('wallPosts', w.id, { approved: !w.approved })}
                              className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all flex items-center gap-1.5 ${
                                w.approved 
                                  ? 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100' 
                                  : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                              }`}
                            >
                              <Check size={13} />
                              <span>{w.approved ? 'Hide from Wall' : 'Approve for Wall'}</span>
                            </button>

                            {/* Delete button */}
                            <button
                              onClick={() => handleDeleteSubmission('wallPosts', w.id)}
                              className="w-9 h-9 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors active:scale-95"
                              title="Delete note"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        <div className="mt-3 text-xs text-charcoal bg-warm-ivory/20 p-3 rounded-xl border border-charcoal/5 leading-relaxed italic">
                          &ldquo;{w.message}&rdquo;
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: IMPACT STATS */}
          {/* ======================================================== */}
          {activeTab === 'Impact' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-serif font-semibold text-charcoal">Impact Statistics & Disclosures</h2>
                <p className="text-xs text-warm-grey mt-0.5">These numbers display prominently on the Home page Impact banner.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 rounded-2xl border border-charcoal/10 bg-warm-ivory/10">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block mb-1">People Fed</label>
                  <p className="text-xs text-warm-grey mb-2">Total human beneficiaries reached with nutritious meals.</p>
                  <input
                    type="number"
                    value={siteData.impact?.peopleFed ?? 0}
                    onChange={(e) => updateNestedState(['impact', 'peopleFed'], parseInt(e.target.value) || 0)}
                    className="w-full bg-white border border-charcoal/15 rounded-xl px-4 py-2.5 text-sm font-semibold focus:border-charcoal outline-none"
                  />
                </div>

                <div className="p-4 rounded-2xl border border-charcoal/10 bg-warm-ivory/10">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block mb-1">Families Supported</label>
                  <p className="text-xs text-warm-grey mb-2">Households provided with ration and grocery kits.</p>
                  <input
                    type="number"
                    value={siteData.impact?.familiesSupported ?? 0}
                    onChange={(e) => updateNestedState(['impact', 'familiesSupported'], parseInt(e.target.value) || 0)}
                    className="w-full bg-white border border-charcoal/15 rounded-xl px-4 py-2.5 text-sm font-semibold focus:border-charcoal outline-none"
                  />
                </div>

                <div className="p-4 rounded-2xl border border-charcoal/10 bg-warm-ivory/10">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block mb-1">Meals Distributed</label>
                  <p className="text-xs text-warm-grey mb-2">Total hot meals prepared and served on the ground.</p>
                  <input
                    type="number"
                    value={siteData.impact?.mealsDistributed ?? 0}
                    onChange={(e) => updateNestedState(['impact', 'mealsDistributed'], parseInt(e.target.value) || 0)}
                    className="w-full bg-white border border-charcoal/15 rounded-xl px-4 py-2.5 text-sm font-semibold focus:border-charcoal outline-none"
                  />
                </div>

                <div className="p-4 rounded-2xl border border-charcoal/10 bg-warm-ivory/10">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block mb-1">Communities Reached</label>
                  <p className="text-xs text-warm-grey mb-2">Localities, settlements, and community pockets visited.</p>
                  <input
                    type="number"
                    value={siteData.impact?.communitiesReached ?? 0}
                    onChange={(e) => updateNestedState(['impact', 'communitiesReached'], parseInt(e.target.value) || 0)}
                    className="w-full bg-white border border-charcoal/15 rounded-xl px-4 py-2.5 text-sm font-semibold focus:border-charcoal outline-none"
                  />
                </div>
              </div>

              {/* Live Preview Bar */}
              <div className="mt-8 p-6 rounded-2xl bg-charcoal text-ivory">
                <span className="text-[10px] uppercase tracking-widest text-ivory/60 font-semibold block mb-3">Live Preview on Public Site</span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl sm:text-3xl font-serif font-bold text-ivory">{siteData.impact?.peopleFed || 0}+</div>
                    <div className="text-xs text-ivory/70 mt-0.5">People Fed</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-serif font-bold text-ivory">{siteData.impact?.familiesSupported || 0}+</div>
                    <div className="text-xs text-ivory/70 mt-0.5">Families Supported</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-serif font-bold text-ivory">{siteData.impact?.mealsDistributed || 0}+</div>
                    <div className="text-xs text-ivory/70 mt-0.5">Meals Distributed</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-serif font-bold text-ivory">{siteData.impact?.communitiesReached || 0}+</div>
                    <div className="text-xs text-ivory/70 mt-0.5">Communities Reached</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: DONATION & UPI */}
          {/* ======================================================== */}
          {activeTab === 'Donation' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-serif font-semibold text-charcoal">Donation & Contribution Methods</h2>
                <p className="text-xs text-warm-grey mt-0.5">Configure UPI ID, QR barcode, and optional bank transfer details for donors.</p>
              </div>

              {/* UPI Configuration */}
              <div className="p-6 rounded-2xl border border-charcoal/10 bg-warm-ivory/10 space-y-4">
                <h3 className="text-sm font-semibold text-charcoal uppercase tracking-wider">UPI / QR Code Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-warm-grey mb-1 block">UPI ID (VPA)</label>
                    <input
                      type="text"
                      value={siteData.upi?.id || ''}
                      onChange={(e) => updateNestedState(['upi', 'id'], e.target.value)}
                      placeholder="e.g. petbharinitiative@upi"
                      className="w-full bg-white border border-charcoal/15 rounded-xl px-4 py-2.5 text-xs font-mono focus:border-charcoal outline-none"
                    />
                    <p className="text-[11px] text-warm-grey mt-1">Leave empty until your official UPI ID is ready.</p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-warm-grey mb-1 block">Payee Legal Name</label>
                    <input
                      type="text"
                      value={siteData.upi?.payeeName || ''}
                      onChange={(e) => updateNestedState(['upi', 'payeeName'], e.target.value)}
                      placeholder="PETBHAR INITIATIVE"
                      className="w-full bg-white border border-charcoal/15 rounded-xl px-4 py-2.5 text-xs focus:border-charcoal outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-xs font-medium text-warm-grey mb-1 block">QR Barcode Image Path</label>
                    <input
                      type="text"
                      value={siteData.upi?.qrImage || ''}
                      onChange={(e) => updateNestedState(['upi', 'qrImage'], e.target.value)}
                      placeholder="/images/petbhar-upi-qr.svg"
                      className="w-full bg-white border border-charcoal/15 rounded-xl px-4 py-2.5 text-xs font-mono focus:border-charcoal outline-none"
                    />
                    <p className="text-[11px] text-warm-grey mt-1">Place your QR file inside public/images/ or enter an image URL.</p>
                  </div>
                </div>
              </div>

              {/* Bank Account Configuration */}
              <div className="p-6 rounded-2xl border border-charcoal/10 bg-warm-ivory/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-charcoal uppercase tracking-wider">Direct Bank Transfer</h3>
                    <p className="text-xs text-warm-grey">Optional NEFT / RTGS / IMPS details for donors.</p>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-charcoal/15 text-xs font-medium">
                    <input
                      type="checkbox"
                      checked={siteData.bankAccount?.enabled || false}
                      onChange={(e) => updateNestedState(['bankAccount', 'enabled'], e.target.checked)}
                      className="rounded border-charcoal/20 text-charcoal focus:ring-charcoal"
                    />
                    <span>{siteData.bankAccount?.enabled ? 'Enabled on Site' : 'Disabled (Hidden)'}</span>
                  </label>
                </div>

                {siteData.bankAccount?.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="text-xs font-medium text-warm-grey mb-1 block">Account Holder Name</label>
                      <input
                        type="text"
                        value={siteData.bankAccount?.accountHolderName || ''}
                        onChange={(e) => updateNestedState(['bankAccount', 'accountHolderName'], e.target.value)}
                        placeholder="PETBHAR INITIATIVE"
                        className="w-full bg-white border border-charcoal/15 rounded-xl px-4 py-2.5 text-xs focus:border-charcoal outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-warm-grey mb-1 block">Account Number</label>
                      <input
                        type="text"
                        value={siteData.bankAccount?.accountNumber || ''}
                        onChange={(e) => updateNestedState(['bankAccount', 'accountNumber'], e.target.value)}
                        placeholder="Account Number"
                        className="w-full bg-white border border-charcoal/15 rounded-xl px-4 py-2.5 text-xs font-mono focus:border-charcoal outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-warm-grey mb-1 block">IFSC Code</label>
                      <input
                        type="text"
                        value={siteData.bankAccount?.ifscCode || ''}
                        onChange={(e) => updateNestedState(['bankAccount', 'ifscCode'], e.target.value)}
                        placeholder="e.g. SBIN0001234"
                        className="w-full bg-white border border-charcoal/15 rounded-xl px-4 py-2.5 text-xs font-mono focus:border-charcoal outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-warm-grey mb-1 block">Bank Name</label>
                      <input
                        type="text"
                        value={siteData.bankAccount?.bankName || ''}
                        onChange={(e) => updateNestedState(['bankAccount', 'bankName'], e.target.value)}
                        placeholder="e.g. State Bank of India"
                        className="w-full bg-white border border-charcoal/15 rounded-xl px-4 py-2.5 text-xs focus:border-charcoal outline-none"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-medium text-warm-grey mb-1 block">Branch Name</label>
                      <input
                        type="text"
                        value={siteData.bankAccount?.branch || ''}
                        onChange={(e) => updateNestedState(['bankAccount', 'branch'], e.target.value)}
                        placeholder="e.g. Main Branch"
                        className="w-full bg-white border border-charcoal/15 rounded-xl px-4 py-2.5 text-xs focus:border-charcoal outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: PROJECTS & INITIATIVES */}
          {/* ======================================================== */}
          {activeTab === 'Projects' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-serif font-semibold text-charcoal">Projects & Drives</h2>
                  <p className="text-xs text-warm-grey mt-0.5">Showcase completed or ongoing food drives and PetBhar Paws animal relief initiatives.</p>
                </div>
                <button
                  onClick={addProjectItem}
                  className="flex items-center gap-1.5 bg-charcoal text-ivory px-3.5 py-2 rounded-xl text-xs font-medium hover:bg-black transition-all shadow-xs"
                >
                  <Plus size={14} /> Add Initiative
                </button>
              </div>

              <div className="space-y-4">
                {siteData.projects?.map((project: Project, index: number) => (
                  <div key={project.id || index} className="p-5 border border-charcoal/10 rounded-2xl bg-warm-ivory/10 relative hover:border-charcoal/25 transition-all">
                    <button
                      onClick={() => {
                        if (confirm(`Delete project "${project.title}"?`)) {
                          removeProjectItem(index);
                        }
                      }}
                      className="absolute top-4 right-4 p-2 text-red-500 hover:text-red-700 bg-white rounded-xl border border-charcoal/10 shadow-xs"
                      title="Delete initiative"
                    >
                      <Trash2 size={15} />
                    </button>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-12">
                      <div className="md:col-span-2">
                        <label className="text-xs font-semibold text-warm-grey uppercase tracking-wider mb-1 block">Title</label>
                        <input
                          type="text"
                          value={project.title || ''}
                          onChange={(e) => updateProjectItem(index, 'title', e.target.value)}
                          className="w-full bg-white border border-charcoal/15 rounded-xl px-4 py-2 text-sm font-semibold text-charcoal outline-none focus:border-charcoal"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-xs font-medium text-warm-grey mb-1 block">Description</label>
                        <textarea
                          value={project.description || ''}
                          onChange={(e) => updateProjectItem(index, 'description', e.target.value)}
                          rows={2}
                          className="w-full bg-white border border-charcoal/15 rounded-xl px-4 py-2 text-xs text-charcoal outline-none focus:border-charcoal"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-warm-grey mb-1 block">Image URL</label>
                        <input
                          type="text"
                          value={project.image || ''}
                          onChange={(e) => updateProjectItem(index, 'image', e.target.value)}
                          className="w-full bg-white border border-charcoal/15 rounded-xl px-4 py-2 text-xs font-mono outline-none focus:border-charcoal"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-warm-grey mb-1 block">Location</label>
                        <input
                          type="text"
                          value={project.location || ''}
                          onChange={(e) => updateProjectItem(index, 'location', e.target.value)}
                          placeholder="e.g. East Delhi slum pocket"
                          className="w-full bg-white border border-charcoal/15 rounded-xl px-4 py-2 text-xs outline-none focus:border-charcoal"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-warm-grey mb-1 block">Beneficiaries Reached</label>
                        <input
                          type="number"
                          value={project.beneficiaries || 0}
                          onChange={(e) => updateProjectItem(index, 'beneficiaries', parseInt(e.target.value) || 0)}
                          className="w-full bg-white border border-charcoal/15 rounded-xl px-4 py-2 text-xs outline-none focus:border-charcoal"
                        />
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="text-xs font-medium text-warm-grey mb-1 block">Category</label>
                          <select
                            value={project.category || 'humanity'}
                            onChange={(e) => updateProjectItem(index, 'category', e.target.value)}
                            className="w-full bg-white border border-charcoal/15 rounded-xl px-3 py-2 text-xs outline-none focus:border-charcoal"
                          >
                            <option value="humanity">Human Food Relief</option>
                            <option value="paws">PetBhar Paws Animal Welfare</option>
                          </select>
                        </div>
                        <div className="flex-1">
                          <label className="text-xs font-medium text-warm-grey mb-1 block">Status</label>
                          <select
                            value={project.status || 'planned'}
                            onChange={(e) => updateProjectItem(index, 'status', e.target.value)}
                            className="w-full bg-white border border-charcoal/15 rounded-xl px-3 py-2 text-xs outline-none focus:border-charcoal"
                          >
                            <option value="planned">Planned</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 6: MEDIA & VIDEO GALLERY */}
          {/* ======================================================== */}
          {activeTab === 'Media' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-serif font-semibold text-charcoal">Field Documentation & Video Gallery</h2>
                <p className="text-xs text-warm-grey mt-0.5">Manage photo documentation and YouTube video embeds displayed on the Our Work page.</p>
              </div>

              {/* Photos Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-charcoal uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon size={16} /> Photo Documentation ({siteData.media?.images?.length || 0})
                  </h3>
                  <button
                    onClick={addMediaImageItem}
                    className="flex items-center gap-1.5 bg-charcoal text-ivory px-3 py-1.5 rounded-xl text-xs font-medium hover:bg-black transition-all shadow-xs"
                  >
                    <Plus size={13} /> Add Photo
                  </button>
                </div>

                <div className="space-y-3">
                  {siteData.media?.images?.map((image: MediaItem, index: number) => (
                    <div key={image.id || index} className="p-4 border border-charcoal/10 rounded-2xl bg-warm-ivory/10 flex flex-col md:flex-row gap-4 items-start relative">
                      {/* Image Thumbnail Preview */}
                      <div className="w-24 h-24 rounded-xl bg-charcoal/5 border border-charcoal/10 overflow-hidden shrink-0 flex items-center justify-center relative">
                        {image.url ? (
                          <Image src={image.url} alt={image.caption || 'Thumbnail'} width={96} height={96} unoptimized className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon size={20} className="text-warm-grey/40" />
                        )}
                      </div>

                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 w-full pr-10">
                        <div className="md:col-span-2">
                          <label className="text-[11px] font-medium text-warm-grey mb-1 block">Image URL</label>
                          <input
                            type="text"
                            value={image.url || ''}
                            onChange={(e) => updateMediaImageItem(index, 'url', e.target.value)}
                            placeholder="https://... or /images/..."
                            className="w-full bg-white border border-charcoal/15 rounded-xl px-3.5 py-1.5 text-xs font-mono outline-none focus:border-charcoal"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-medium text-warm-grey mb-1 block">Caption</label>
                          <input
                            type="text"
                            value={image.caption || ''}
                            onChange={(e) => updateMediaImageItem(index, 'caption', e.target.value)}
                            className="w-full bg-white border border-charcoal/15 rounded-xl px-3.5 py-1.5 text-xs outline-none focus:border-charcoal"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-medium text-warm-grey mb-1 block">Date</label>
                          <input
                            type="text"
                            value={image.date || ''}
                            onChange={(e) => updateMediaImageItem(index, 'date', e.target.value)}
                            className="w-full bg-white border border-charcoal/15 rounded-xl px-3.5 py-1.5 text-xs outline-none focus:border-charcoal"
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => removeMediaImageItem(index)}
                        className="absolute top-4 right-4 p-2 text-red-500 hover:text-red-700 bg-white rounded-xl border border-charcoal/10 shadow-xs"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                  {(!siteData.media?.images || siteData.media.images.length === 0) && (
                    <p className="text-xs text-warm-grey italic py-4">No field photos added yet.</p>
                  )}
                </div>
              </div>

              {/* Videos Section */}
              <div className="space-y-4 pt-6 border-t border-charcoal/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-charcoal uppercase tracking-wider flex items-center gap-1.5">
                    <Film size={16} /> YouTube Videos ({siteData.media?.videos?.length || 0})
                  </h3>
                  <button
                    onClick={addMediaVideoItem}
                    className="flex items-center gap-1.5 bg-charcoal text-ivory px-3 py-1.5 rounded-xl text-xs font-medium hover:bg-black transition-all shadow-xs"
                  >
                    <Plus size={13} /> Add Video
                  </button>
                </div>

                <div className="space-y-4">
                  {siteData.media?.videos?.map((video: MediaItem, index: number) => {
                    const embedUrl = getYouTubeEmbedUrl(video.url);
                    return (
                      <div key={video.id || index} className="p-5 border border-charcoal/10 rounded-2xl bg-warm-ivory/10 space-y-3 relative">
                        <button
                          onClick={() => removeMediaVideoItem(index)}
                          className="absolute top-4 right-4 p-2 text-red-500 hover:text-red-700 bg-white rounded-xl border border-charcoal/10 shadow-xs"
                        >
                          <Trash2 size={14} />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-10">
                          <div className="md:col-span-2">
                            <label className="text-[11px] font-medium text-warm-grey mb-1 block">YouTube Video URL</label>
                            <input
                              type="text"
                              value={video.url || ''}
                              onChange={(e) => updateMediaVideoItem(index, 'url', e.target.value)}
                              placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/... or https://youtube.com/shorts/..."
                              className="w-full bg-white border border-charcoal/15 rounded-xl px-3.5 py-1.5 text-xs font-mono outline-none focus:border-charcoal"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-medium text-warm-grey mb-1 block">Title / Caption</label>
                            <input
                              type="text"
                              value={video.caption || ''}
                              onChange={(e) => updateMediaVideoItem(index, 'caption', e.target.value)}
                              className="w-full bg-white border border-charcoal/15 rounded-xl px-3.5 py-1.5 text-xs outline-none focus:border-charcoal"
                            />
                          </div>
                          <div>
                            <label className="text-[11px] font-medium text-warm-grey mb-1 block">Date</label>
                            <input
                              type="text"
                              value={video.date || ''}
                              onChange={(e) => updateMediaVideoItem(index, 'date', e.target.value)}
                              className="w-full bg-white border border-charcoal/15 rounded-xl px-3.5 py-1.5 text-xs outline-none focus:border-charcoal"
                            />
                          </div>
                        </div>

                        {/* Live YouTube Preview Player */}
                        {embedUrl && (
                          <div className="mt-3 rounded-xl overflow-hidden border border-charcoal/10 aspect-video max-w-sm bg-black">
                            <iframe
                              src={embedUrl}
                              title={video.caption}
                              className="w-full h-full"
                              loading="lazy"
                              allowFullScreen
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {(!siteData.media?.videos || siteData.media.videos.length === 0) && (
                    <p className="text-xs text-warm-grey italic py-4">No video documentation added yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 7: TRANSPARENCY & AUDITS */}
          {/* ======================================================== */}
          {activeTab === 'Transparency' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-serif font-semibold text-charcoal">Transparency & Financial Disclosures</h2>
                <p className="text-xs text-warm-grey mt-0.5">Real-time public financial ledger numbers displayed on the Transparency page.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-charcoal/10 bg-warm-ivory/10">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block mb-1">Contributions Received (₹)</label>
                  <input
                    type="number"
                    value={siteData.transparency?.contributionsReceived ?? 0}
                    onChange={(e) => updateNestedState(['transparency', 'contributionsReceived'], parseInt(e.target.value) || 0)}
                    className="w-full bg-white border border-charcoal/15 rounded-xl px-4 py-2.5 text-sm font-semibold focus:border-charcoal outline-none"
                  />
                </div>

                <div className="p-4 rounded-2xl border border-charcoal/10 bg-warm-ivory/10">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block mb-1">Food Purchases (₹)</label>
                  <input
                    type="number"
                    value={siteData.transparency?.foodPurchased ?? 0}
                    onChange={(e) => updateNestedState(['transparency', 'foodPurchased'], parseInt(e.target.value) || 0)}
                    className="w-full bg-white border border-charcoal/15 rounded-xl px-4 py-2.5 text-sm font-semibold focus:border-charcoal outline-none"
                  />
                </div>

                <div className="p-4 rounded-2xl border border-charcoal/10 bg-warm-ivory/10">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block mb-1">Meals Distributed</label>
                  <input
                    type="number"
                    value={siteData.transparency?.mealsDistributed ?? 0}
                    onChange={(e) => updateNestedState(['transparency', 'mealsDistributed'], parseInt(e.target.value) || 0)}
                    className="w-full bg-white border border-charcoal/15 rounded-xl px-4 py-2.5 text-sm font-semibold focus:border-charcoal outline-none"
                  />
                </div>

                <div className="p-4 rounded-2xl border border-charcoal/10 bg-warm-ivory/10">
                  <label className="text-xs font-semibold text-charcoal uppercase tracking-wider block mb-1">Grocery Kits Distributed</label>
                  <input
                    type="number"
                    value={siteData.transparency?.groceryKitsDistributed ?? 0}
                    onChange={(e) => updateNestedState(['transparency', 'groceryKitsDistributed'], parseInt(e.target.value) || 0)}
                    className="w-full bg-white border border-charcoal/15 rounded-xl px-4 py-2.5 text-sm font-semibold focus:border-charcoal outline-none"
                  />
                </div>
              </div>

              {/* Reports & Audit Records */}
              <div className="pt-6 border-t border-charcoal/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-charcoal uppercase tracking-wider">Reports & Statements</h3>
                    <p className="text-xs text-warm-grey">Monthly audit sheets and expense logs.</p>
                  </div>
                  <button
                    onClick={addReportItem}
                    className="flex items-center gap-1.5 bg-charcoal text-ivory px-3 py-1.5 rounded-xl text-xs font-medium hover:bg-black transition-all shadow-xs"
                  >
                    <Plus size={13} /> Add Report Record
                  </button>
                </div>

                <div className="space-y-3">
                  {siteData.reports?.map((report: Report, index: number) => (
                    <div key={report.id || index} className="p-4 border border-charcoal/10 rounded-2xl bg-warm-ivory/10 grid grid-cols-1 sm:grid-cols-2 gap-3 relative">
                      <button
                        onClick={() => removeReportItem(index)}
                        className="absolute top-4 right-4 p-1.5 text-red-500 hover:text-red-700 bg-white rounded-lg border border-charcoal/10"
                      >
                        <Trash2 size={14} />
                      </button>

                      <div className="sm:col-span-2 pr-10">
                        <label className="text-[11px] font-medium text-warm-grey mb-1 block">Report Title</label>
                        <input
                          type="text"
                          value={report.title || ''}
                          onChange={(e) => updateReportItem(index, 'title', e.target.value)}
                          className="w-full bg-white border border-charcoal/15 rounded-xl px-3.5 py-1.5 text-xs font-medium outline-none focus:border-charcoal"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-medium text-warm-grey mb-1 block">Date</label>
                        <input
                          type="text"
                          value={report.date || ''}
                          onChange={(e) => updateReportItem(index, 'date', e.target.value)}
                          className="w-full bg-white border border-charcoal/15 rounded-xl px-3.5 py-1.5 text-xs outline-none focus:border-charcoal"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-medium text-warm-grey mb-1 block">Report / Document Link</label>
                        <input
                          type="text"
                          value={report.link || ''}
                          onChange={(e) => updateReportItem(index, 'link', e.target.value)}
                          className="w-full bg-white border border-charcoal/15 rounded-xl px-3.5 py-1.5 text-xs font-mono outline-none focus:border-charcoal"
                        />
                      </div>
                    </div>
                  ))}
                  {(!siteData.reports || siteData.reports.length === 0) && (
                    <p className="text-xs text-warm-grey italic py-4">No audit reports uploaded yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 8: CONTACT & SOCIALS */}
          {/* ======================================================== */}
          {activeTab === 'Contact' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-serif font-semibold text-charcoal">Official Contact & Social Channels</h2>
                <p className="text-xs text-warm-grey mt-0.5">Contact channels used in the header, footer, contact form, and social buttons.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-warm-grey mb-1 block">Official Email Address</label>
                  <input
                    type="email"
                    value={siteData.contact?.email || ''}
                    onChange={(e) => updateNestedState(['contact', 'email'], e.target.value)}
                    className="w-full bg-white border border-charcoal/15 rounded-xl px-4 py-2.5 text-xs font-mono focus:border-charcoal outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-warm-grey mb-1 block">Official Phone Number</label>
                  <input
                    type="text"
                    value={siteData.contact?.phone || ''}
                    onChange={(e) => updateNestedState(['contact', 'phone'], e.target.value)}
                    placeholder="+91 ..."
                    className="w-full bg-white border border-charcoal/15 rounded-xl px-4 py-2.5 text-xs font-mono focus:border-charcoal outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-warm-grey mb-1 block">WhatsApp Helpline Number</label>
                  <input
                    type="text"
                    value={siteData.contact?.whatsapp || ''}
                    onChange={(e) => updateNestedState(['contact', 'whatsapp'], e.target.value)}
                    placeholder="+91 ..."
                    className="w-full bg-white border border-charcoal/15 rounded-xl px-4 py-2.5 text-xs font-mono focus:border-charcoal outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-warm-grey mb-1 block">Instagram Username</label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-warm-grey">@</span>
                    <input
                      type="text"
                      value={siteData.contact?.instagram || ''}
                      onChange={(e) => updateNestedState(['contact', 'instagram'], e.target.value.replace(/^@/, ''))}
                      placeholder="petbharinitiative"
                      className="w-full bg-white border border-charcoal/15 rounded-xl px-4 py-2.5 text-xs font-mono focus:border-charcoal outline-none"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-warm-grey mb-1 block">YouTube Channel Link</label>
                  <input
                    type="text"
                    value={siteData.contact?.youtube || ''}
                    onChange={(e) => updateNestedState(['contact', 'youtube'], e.target.value)}
                    placeholder="https://youtube.com/@..."
                    className="w-full bg-white border border-charcoal/15 rounded-xl px-4 py-2.5 text-xs font-mono focus:border-charcoal outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 9: GENERAL ORG INFO */}
          {/* ======================================================== */}
          {activeTab === 'General' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-serif font-semibold text-charcoal">General Organization Information</h2>
                <p className="text-xs text-warm-grey mt-0.5">Core brand identity, tagline, mission, and foundational philosophy.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-warm-grey mb-1 block">Short Name</label>
                  <input
                    type="text"
                    value={siteData.org?.name || ''}
                    onChange={(e) => updateNestedState(['org', 'name'], e.target.value)}
                    className="w-full bg-white border border-charcoal/15 rounded-xl px-4 py-2.5 text-xs focus:border-charcoal outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-warm-grey mb-1 block">Full Registered Name</label>
                  <input
                    type="text"
                    value={siteData.org?.fullName || ''}
                    onChange={(e) => updateNestedState(['org', 'fullName'], e.target.value)}
                    className="w-full bg-white border border-charcoal/15 rounded-xl px-4 py-2.5 text-xs focus:border-charcoal outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-warm-grey mb-1 block">Tagline</label>
                  <input
                    type="text"
                    value={siteData.org?.tagline || ''}
                    onChange={(e) => updateNestedState(['org', 'tagline'], e.target.value)}
                    className="w-full bg-white border border-charcoal/15 rounded-xl px-4 py-2.5 text-xs focus:border-charcoal outline-none font-serif"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-warm-grey mb-1 block">Mission Statement</label>
                  <textarea
                    value={siteData.org?.mission || ''}
                    onChange={(e) => updateNestedState(['org', 'mission'], e.target.value)}
                    rows={3}
                    className="w-full bg-white border border-charcoal/15 rounded-xl px-4 py-2 text-xs focus:border-charcoal outline-none leading-relaxed"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-warm-grey mb-1 block">Long Description</label>
                  <textarea
                    value={siteData.org?.description || ''}
                    onChange={(e) => updateNestedState(['org', 'description'], e.target.value)}
                    rows={4}
                    className="w-full bg-white border border-charcoal/15 rounded-xl px-4 py-2 text-xs focus:border-charcoal outline-none leading-relaxed"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-medium text-warm-grey mb-1 block">Grassroots Philosophy</label>
                  <input
                    type="text"
                    value={siteData.org?.philosophy || ''}
                    onChange={(e) => updateNestedState(['org', 'philosophy'], e.target.value)}
                    className="w-full bg-white border border-charcoal/15 rounded-xl px-4 py-2.5 text-xs focus:border-charcoal outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Bottom Action Footer (For non-inquiry tabs) */}
          {activeTab !== 'Inquiries' && activeTab !== 'Dashboard' && (
            <div className="mt-8 pt-6 border-t border-charcoal/10 flex items-center justify-between">
              <span className="text-xs text-warm-grey">
                {hasUnsavedChanges ? '⚠️ You have unsaved changes.' : '✓ All changes up to date.'}
              </span>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-charcoal text-ivory px-6 py-2.5 rounded-xl text-xs font-medium hover:bg-black transition-all shadow-xs disabled:opacity-50"
              >
                <Save size={14} className={saving ? 'animate-spin' : ''} />
                <span>{saving ? 'Saving...' : 'Save Changes (Ctrl+S)'}</span>
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
