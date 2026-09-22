import siteData from '../../data/siteData.json';

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  location: string;
  beneficiaries: number;
  status: 'planned' | 'active' | 'completed';
  expenses: number;
  category: 'humanity' | 'paws';
}

export interface Report {
  id: string;
  title: string;
  date: string;
  description: string;
  type: 'monthly' | 'project' | 'receipt';
  link?: string;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  caption: string;
  date: string;
  category: string;
}

export interface SiteConfig {
  org: {
    name: string;
    fullName: string;
    tagline: string;
    mission: string;
    description: string;
    philosophy: string;
    values: string[];
  };
  contact: {
    email: string;
    phone: string;
    whatsapp: string;
    instagram: string;
    youtube: string;
  };
  upi: {
    id: string;
    qrImage: string;
    payeeName: string;
  };
  bankAccount: {
    enabled: boolean;
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    branch: string;
  };
  impact: {
    peopleFed: number;
    familiesSupported: number;
    mealsDistributed: number;
    communitiesReached: number;
  };
  transparency: {
    contributionsReceived: number;
    foodPurchased: number;
    mealsDistributed: number;
    groceryKitsDistributed: number;
    familiesSupported: number;
  };
  projects: Project[];
  reports: Report[];
  media: {
    images: MediaItem[];
    videos: MediaItem[];
  };
}

const navigationItems = [
  { name: 'Home', label: 'Home', href: '/' },
  { name: 'Our Work', label: 'Our Work', href: '/work' },
  { name: 'About', label: 'About', href: '/about' },
  { name: 'PetBhar Paws', label: 'PetBhar Paws', href: '/paws' },
  { name: 'Get Involved', label: 'Get Involved', href: '/get-involved' },
  { name: 'Transparency', label: 'Transparency', href: '/transparency' },
  { name: 'Contact', label: 'Contact', href: '/contact' },
];

const formatSocialUrl = (urlOrHandle: string, platformBase: string): string => {
  if (!urlOrHandle) return '';
  const trimmed = urlOrHandle.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  return `${platformBase}${trimmed.replace(/^@/, '')}`;
};

const socials = {
  instagram: formatSocialUrl(siteData.contact.instagram, 'https://instagram.com/'),
  youtube: formatSocialUrl(siteData.contact.youtube, 'https://youtube.com/'),
};

const config = {
  ...(siteData as SiteConfig),
  navigation: navigationItems,
  socials,
};

export { config as siteConfig };
export default config;
export const navigation = navigationItems;

