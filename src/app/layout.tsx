import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MobileQuickBar from '@/components/ui/MobileQuickBar';
import SosBeaconButton from '@/components/features/SosBeaconButton';
import LuxuryLoadingScreen from '@/components/ui/LuxuryLoadingScreen';
import { LanguageProvider } from '@/context/LanguageContext';
import { siteConfig } from '@/lib/siteConfig';

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0A0A09',
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: {
    default: 'PetBhar Initiative — No one should sleep hungry.',
    template: '%s | PetBhar Initiative',
  },
  description: siteConfig.org.description,
  keywords: [
    'PetBhar Initiative',
    'Food Security',
    'Hunger Relief',
    'Nonprofit India',
    'Stray Animal Welfare',
    'PetBhar Paws',
    'Charity',
    'Community Meals',
    'Ration Distribution',
  ],
  authors: [{ name: 'PetBhar Initiative' }],
  creator: 'PetBhar Initiative',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://petbhar.org',
    title: 'PetBhar Initiative — No one should sleep hungry.',
    description: siteConfig.org.description,
    siteName: 'PetBhar Initiative',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'PetBhar Initiative Humanitarian Food Drive',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PetBhar Initiative — No one should sleep hungry.',
    description: siteConfig.org.description,
    images: ['https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&q=80'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: siteConfig.org.fullName || 'PetBhar Initiative',
    alternateName: siteConfig.org.name || 'PetBhar',
    url: 'https://petbhar.org',
    logo: 'https://petbhar.org/images/petbhar_paws_feeding.jpg',
    description: siteConfig.org.description,
    slogan: siteConfig.org.tagline,
    email: siteConfig.contact.email,
    sameAs: [
      siteConfig.socials.instagram,
      siteConfig.socials.youtube,
    ].filter(Boolean),
  };

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased text-charcoal bg-ivory">
        <LanguageProvider>
          <LuxuryLoadingScreen curtainStyle="lift" />
          <Navbar />
          {children}
          <Footer />
          <MobileQuickBar />
          <SosBeaconButton />
        </LanguageProvider>
      </body>
    </html>
  );
}
