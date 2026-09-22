'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, MessageCircle, Languages, Gift, Sparkles, AlertCircle } from 'lucide-react';
import { siteConfig } from '@/lib/siteConfig';
import { useLanguage } from '@/context/LanguageContext';
import { navTranslationKey } from '@/lib/translations';
import DedicateDriveModal from '@/components/features/DedicateDriveModal';
import ImpactCardGeneratorModal from '@/components/features/ImpactCardGeneratorModal';
import { openSosBeacon } from '@/components/features/SosBeaconButton';
import { WhatsAppIcon } from '@/components/ui/SocialIcons';

export default function Navbar() {
  const pathname = usePathname();
  const { locale, toggleLocale, setLocale, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dedicateOpen, setDedicateOpen] = useState(false);
  const [impactCardOpen, setImpactCardOpen] = useState(false);

  // Handle scroll state with requestAnimationFrame throttling to eliminate scroll jank
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const nextScrolled = window.scrollY > 40;
          setIsScrolled((prev) => (prev !== nextScrolled ? nextScrolled : prev));
          ticking = false;
        });
        ticking = true;
      }
    };
    handleScroll(); // initial check
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    setMobileMenuOpen(false);
  }

  // Close mobile menu on ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Nav text color adapts based on scroll state
  const isLightText = !isScrolled && !mobileMenuOpen;

  // Do not render public navbar on admin pages
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isScrolled
          ? 'bg-ivory/90 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] border-b border-charcoal/[0.06] py-3.5 pt-[max(0.875rem,env(safe-area-inset-top))]'
          : 'bg-gradient-to-b from-charcoal/60 via-charcoal/25 to-transparent py-5 sm:py-6 pt-[max(1.25rem,env(safe-area-inset-top))]'
      }`}
    >
      <div className="container mx-auto px-5 sm:px-8 flex items-center justify-between">
        {/* Brand Logo */}
        <Link 
          href="/" 
          className="flex flex-col items-start z-50 group min-h-[44px] justify-center select-none py-0.5"
          aria-label="PetBhar Initiative Home"
        >
          <span 
            className={`font-serif font-semibold text-lg sm:text-xl md:text-[23px] leading-tight tracking-[0.14em] transition-colors duration-200 ${
              mobileMenuOpen ? 'text-charcoal' : isLightText ? 'text-ivory drop-shadow-sm' : 'text-charcoal'
            }`}
          >
            PETBHAR
          </span>
          <span 
            className={`font-sans text-[9px] sm:text-[10px] md:text-[10.5px] uppercase tracking-[0.32em] font-semibold leading-none transition-colors duration-200 mt-1 ${
              mobileMenuOpen ? 'text-charcoal/70' : isLightText ? 'text-ivory/90' : 'text-charcoal/65'
            }`}
          >
            INITIATIVE
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
          {siteConfig.navigation.map((item) => {
            const isActive = pathname === item.href;
            const navKey = navTranslationKey[item.href];
            const label = navKey ? t(navKey) : item.name;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`text-[11px] uppercase tracking-[0.16em] font-medium transition-all duration-200 relative py-1.5 ${
                  isLightText
                    ? isActive
                      ? 'text-ivory font-semibold'
                      : 'text-ivory/75 hover:text-ivory'
                    : isActive
                    ? 'text-charcoal font-semibold'
                    : 'text-warm-grey hover:text-charcoal'
                }`}
              >
                {label}
                {isActive && (
                  <span 
                    className={`absolute bottom-0 left-0 right-0 h-[1.5px] rounded-full transition-all ${
                      isLightText ? 'bg-ivory/90' : 'bg-charcoal/80'
                    }`} 
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Action Button & Social */}
        <div className="hidden lg:flex items-center gap-2.5 xl:gap-3">
          {/* Language Switcher */}
          <button
            onClick={toggleLocale}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium transition-all duration-200 border min-h-[36px] active:scale-95 ${
              isLightText
                ? 'text-ivory border-ivory/20 hover:bg-white/10'
                : 'text-charcoal border-charcoal/15 hover:bg-black/5'
            }`}
            title="Switch Language / भाषा बदलें"
          >
            <Languages size={13} />
            <span className="font-sans">{locale === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>

          {/* Quick SOS Beacon */}
          <button
            onClick={openSosBeacon}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold transition-all shadow-xs active:scale-95 cursor-pointer min-h-[36px]"
            title="Report hungry community or injured animal (SOS)"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
            <span>SOS 🚨</span>
          </button>


          <Link
            href="/get-involved"
            className={`px-4.5 py-2 min-h-[36px] flex items-center justify-center rounded-full text-[11px] uppercase tracking-wider font-semibold transition-all duration-300 shadow-xs ${
              isLightText
                ? 'bg-ivory text-charcoal hover:bg-white hover:shadow-sm'
                : 'bg-charcoal text-ivory hover:bg-charcoal/90 hover:shadow-sm'
            }`}
          >
            {t('nav_support_us')} &rarr;
          </Link>
        </div>

        {/* Mobile Header: SOS Beacon & Hamburger */}
        <div className="lg:hidden flex items-center gap-2 z-50">
          <button
            onClick={openSosBeacon}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
            aria-label="Report a need or stray SOS"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
            <span>SOS 🚨</span>
          </button>

          <button
            className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition-colors ${
              mobileMenuOpen 
                ? 'text-charcoal bg-beige/50 hover:bg-beige active:scale-95' 
                : isLightText 
                ? 'text-ivory hover:bg-white/10 active:scale-95' 
                : 'text-charcoal hover:bg-charcoal/5 active:scale-95'
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 bg-ivory z-40 lg:hidden transition-all duration-500 ease-in-out flex flex-col justify-between px-6 sm:px-8 pt-20 sm:pt-24 pb-[max(1.5rem,calc(1rem+env(safe-area-inset-bottom)))] overflow-y-auto overscroll-contain ${
          mobileMenuOpen ? 'opacity-100 pointer-events-auto translate-y-0' : 'opacity-0 pointer-events-none -translate-y-8'
        }`}
      >
        {/* Top: Language Switcher Pill */}
        <div className="flex items-center justify-center gap-1 bg-charcoal/5 p-1 rounded-full w-fit mx-auto mt-2 mb-4">
          <button
            onClick={() => setLocale('en')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              locale === 'en' ? 'bg-charcoal text-ivory shadow-xs' : 'text-warm-grey hover:text-charcoal'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLocale('hi')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              locale === 'hi' ? 'bg-charcoal text-ivory shadow-xs' : 'text-warm-grey hover:text-charcoal'
            }`}
          >
            हिन्दी
          </button>
        </div>

        <nav className="flex flex-col gap-1.5 text-left max-w-sm mx-auto w-full my-auto">
          {siteConfig.navigation.map((item, index) => {
            const isActive = pathname === item.href;
            const navKey = navTranslationKey[item.href];
            const label = navKey ? t(navKey) : item.name;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`text-xl sm:text-2xl font-serif tracking-wide py-2.5 px-2 rounded-xl border-b border-charcoal/5 transition-colors flex items-center justify-between active:bg-charcoal/5 ${
                  isActive ? 'text-charcoal font-semibold' : 'text-warm-grey hover:text-charcoal'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>{label}</span>
                <span className="text-[10px] uppercase font-sans text-warm-grey/50">0{index + 1}</span>
              </Link>
            );
          })}
        </nav>

        {/* Feature Action Chips on Mobile */}
        <div className="max-w-sm mx-auto w-full pt-4 space-y-2.5">
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <button
              onClick={() => { setMobileMenuOpen(false); setDedicateOpen(true); }}
              className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 border border-amber-200/80 px-3 py-1.5 rounded-full text-xs font-medium active:scale-95"
            >
              <Gift size={13} className="text-amber-600" />
              <span>{t('nav_dedicate')}</span>
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); setImpactCardOpen(true); }}
              className="inline-flex items-center gap-1.5 bg-purple-50 text-purple-900 border border-purple-200/80 px-3 py-1.5 rounded-full text-xs font-medium active:scale-95"
            >
              <Sparkles size={13} className="text-purple-600" />
              <span>{t('nav_impact_card')}</span>
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); openSosBeacon(); }}
              className="inline-flex items-center gap-1.5 bg-red-50 text-red-900 border border-red-200/80 px-3 py-1.5 rounded-full text-xs font-bold active:scale-95"
            >
              <AlertCircle size={13} className="text-red-600" />
              <span>SOS 🚨</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <Link
              href="/get-involved#donate"
              className="w-full text-center bg-charcoal text-ivory py-3 rounded-2xl text-xs uppercase tracking-wider font-semibold shadow-sm hover:bg-black active:scale-[0.98] transition-all min-h-[46px] flex items-center justify-center gap-1.5"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>{t('nav_support_us')} &rarr;</span>
            </Link>
            {siteConfig.contact.whatsapp && (
              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/\D/g, '')}?text=Hello%20PetBhar%20team`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full text-center bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] border border-[#25D366]/30 py-3 rounded-2xl text-xs uppercase tracking-wider font-semibold active:scale-[0.98] transition-all min-h-[46px] flex items-center justify-center gap-1.5"
                onClick={() => setMobileMenuOpen(false)}
              >
                <WhatsAppIcon size={16} />
                <span>WhatsApp</span>
              </a>
            )}
          </div>
          <div className="text-center pt-1">
            <p className="text-[10px] text-warm-grey/70 uppercase tracking-widest">{t('footer_tagline')}</p>
          </div>
        </div>
      </div>

      {/* Feature Modals */}
      <DedicateDriveModal isOpen={dedicateOpen} onClose={() => setDedicateOpen(false)} />
      <ImpactCardGeneratorModal isOpen={impactCardOpen} onClose={() => setImpactCardOpen(false)} />
    </header>
  );
}
