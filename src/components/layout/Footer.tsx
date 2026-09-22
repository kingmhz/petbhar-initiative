'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import { InstagramIcon, YoutubeIcon, GmailIcon } from '@/components/ui/SocialIcons';
import { siteConfig } from '@/lib/siteConfig';
import { useLanguage } from '@/context/LanguageContext';
import { navTranslationKey } from '@/lib/translations';

export default function Footer() {
  const pathname = usePathname();
  const { t } = useLanguage();

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
              <span className="font-serif font-medium text-xl sm:text-2xl tracking-[0.15em] block text-ivory">PETBHAR</span>
              <span className="text-[8px] uppercase tracking-[0.32em] font-sans font-medium text-ivory/60 block mt-1">INITIATIVE</span>
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
                <a href={`mailto:${siteConfig.contact.email}`} className="inline-flex items-center gap-2 py-1 text-sm text-ivory/80 hover:text-white transition-colors">
                  <GmailIcon size={16} />
                  <span>{siteConfig.contact.email}</span>
                </a>
              </li>
              <li>
                <a href={siteConfig.socials.instagram} target="_blank" rel="noopener noreferrer" className="ig-btn group inline-flex items-center gap-2 py-1 text-sm text-ivory/80 hover:text-white transition-colors">
                  <InstagramIcon size={18} />
                  <span className="transition-all group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#FF7A00] group-hover:via-[#FF0069] group-hover:to-[#D300C5] font-medium">{t('footer_follow_journey')}</span>
                  <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#FF0069]" />
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
    </footer>
  );
}
