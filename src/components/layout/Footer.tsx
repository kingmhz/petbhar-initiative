'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { InstagramIcon, YoutubeIcon, GmailIcon } from '@/components/ui/SocialIcons';
import { EmailModal } from '@/components/ui/EmailModal';
import { siteConfig } from '@/lib/siteConfig';
import { useLanguage } from '@/context/LanguageContext';
import { navTranslationKey } from '@/lib/translations';

export default function Footer() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const [emailModalOpen, setEmailModalOpen] = useState(false);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="bg-charcoal text-ivory pt-12 pb-20 sm:pb-8 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 sm:gap-10 mb-10">
          {/* Col 1 */}
          <div className="flex flex-col items-start sm:col-span-2 md:col-span-1">
            <div className="mb-6">
              <span className="font-serif font-semibold text-2xl sm:text-3xl tracking-[0.14em] block text-ivory">PETBHAR</span>
              <span className="text-[9.5px] sm:text-[10.5px] uppercase tracking-[0.32em] font-sans font-semibold text-ivory/80 block mt-1">INITIATIVE</span>
            </div>
            <p className="text-ivory/80 mb-8 max-w-sm text-sm">{t('footer_tagline_lead')}</p>
            <div className="flex gap-3">
              {siteConfig.socials.instagram && (
                <a 
                  href={siteConfig.socials.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="ig-btn group relative flex items-center justify-center w-11 h-11 rounded-full border border-ivory/15 bg-white/5 hover:border-transparent hover:bg-transparent text-ivory transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-[0_0_24px_rgba(255,0,105,0.7),0_0_10px_rgba(255,122,0,0.5)]" 
                  aria-label="Instagram"
                >
                  <InstagramIcon size={26} />
                </a>
              )}
              {siteConfig.socials.youtube && (
                <a 
                  href={siteConfig.socials.youtube} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group relative flex items-center justify-center w-11 h-11 rounded-full border border-ivory/15 bg-white/5 hover:border-red-500 hover:bg-red-500/10 text-ivory/80 hover:text-red-500 transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-[0_0_20px_rgba(239,68,68,0.5)]" 
                  aria-label="Youtube"
                >
                  <YoutubeIcon size={22} />
                </a>
              )}
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-white/50 mb-5 font-semibold">{t('footer_navigation')}</h3>
            <ul className="space-y-3">
              {siteConfig.navigation.map((item) => {
                const navKey = navTranslationKey[item.href];
                const label = navKey ? t(navKey) : item.name;
                return (
                  <li key={item.name}>
                    <Link href={item.href} className="inline-block py-1 text-sm text-ivory/80 hover:text-white hover:underline underline-offset-4 decoration-white/30 transition-all">
                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h3 className="text-xs uppercase tracking-widest text-white/50 mb-5 font-semibold">{t('footer_get_in_touch')}</h3>
            <ul className="space-y-3">
              <li>
                <div className="flex flex-wrap items-center gap-2">
                  <button 
                    type="button"
                    onClick={() => setEmailModalOpen(true)}
                    className="inline-flex items-center gap-2.5 py-1 text-sm sm:text-[15px] text-ivory/80 hover:text-white transition-colors cursor-pointer text-left"
                    title="Click for email options (Gmail, default mail app, copy address)"
                  >
                    <GmailIcon size={18} />
                    <span>{siteConfig.contact.email}</span>
                  </button>
                  <a
                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(siteConfig.contact.email)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[11px] text-ivory/80 hover:text-white transition-all"
                    title="Compose directly in Gmail"
                  >
                    Gmail ↗
                  </a>
                </div>
              </li>
              <li>
                <a 
                  href={siteConfig.socials.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="ig-btn group inline-flex items-center gap-2.5 py-1.5 text-base sm:text-[17px] text-ivory/90 hover:text-white transition-colors font-medium"
                >
                  <InstagramIcon size={22} />
                  <span className="transition-all group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#FF7A00] group-hover:via-[#FF0069] group-hover:to-[#D300C5]">{t('footer_follow_journey')}</span>
                  <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#FF0069]" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-white/50 uppercase tracking-wider">
          <p>&copy; 2026 {t('footer_rights')}</p>
          <p className="mt-4 md:mt-0 font-serif lowercase italic text-sm text-ivory">{t('footer_tagline')}</p>
        </div>
      </div>

      <EmailModal
        isOpen={emailModalOpen}
        onClose={() => setEmailModalOpen(false)}
        email={siteConfig.contact.email}
      />
    </footer>
  );
}
