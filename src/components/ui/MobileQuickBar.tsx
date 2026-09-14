'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Heart, MessageCircle, X, AlertCircle } from 'lucide-react';
import { siteConfig } from '@/lib/siteConfig';
import { openSosBeacon } from '@/components/features/SosBeaconButton';
import { useLanguage } from '@/context/LanguageContext';

export function MobileQuickBar() {
  const pathname = usePathname();
  const { t, locale } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Show only after scrolling down 350px
          const shouldShow = window.scrollY > 350;
          setVisible((prev) => (prev !== shouldShow ? shouldShow : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Do not render on admin pages, or if dismissed, or if not scrolled
  if (pathname?.startsWith('/admin') || dismissed || !visible) {
    return null;
  }

  const whatsappNumber = siteConfig.contact?.whatsapp ? siteConfig.contact.whatsapp.replace(/\D/g, '') : '';

  return (
    <div className="fixed bottom-4 left-4 right-4 z-40 md:hidden animate-fade-in pb-[env(safe-area-inset-bottom,0px)]">
      <div className="bg-[#0A0A09]/95 text-ivory backdrop-blur-md rounded-2xl p-2.5 pl-3.5 pr-2 shadow-2xl border border-white/15 flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-400/20 text-amber-300 shrink-0">
            <Heart size={14} className="fill-amber-300/40" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-ivory truncate">{t('quick_bar_meal')}</p>
            <p className="text-[10px] text-ivory/60 truncate">{locale === 'hi' ? 'सीधी ज़मीनी राहत' : 'Direct Grassroots Relief'}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={openSosBeacon}
            className="w-9 h-9 rounded-xl bg-red-600/20 text-red-400 hover:bg-red-600/30 flex items-center justify-center transition-colors active:scale-95 border border-red-500/30"
            title="Report hungry community or injured animal (SOS)"
            aria-label="Report emergency or stray need"
          >
            <AlertCircle size={17} />
          </button>

          {whatsappNumber && (
            <a
              href={`https://wa.me/${whatsappNumber}?text=Hello%20PetBhar%20team`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-[#25D366]/20 text-[#25D366] hover:bg-[#25D366]/30 flex items-center justify-center transition-colors active:scale-95"
              aria-label="Chat on WhatsApp"
            >
              <MessageCircle size={17} />
            </a>
          )}
          <Link
            href="/get-involved"
            className="px-3.5 py-2 rounded-xl bg-ivory text-charcoal text-xs font-semibold tracking-wider uppercase hover:bg-white active:scale-95 transition-all shadow-sm"
          >
            {t('quick_bar_cta')} &rarr;
          </Link>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="w-7 h-7 rounded-lg text-ivory/50 hover:text-ivory flex items-center justify-center active:scale-90 transition-colors"
            aria-label="Dismiss quick bar"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default MobileQuickBar;
