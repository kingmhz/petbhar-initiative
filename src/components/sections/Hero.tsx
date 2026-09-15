'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronDown, 
  Utensils, 
  Heart, 
  QrCode, 
  Sparkles, 
  ShieldCheck, 
  X, 
  Copy, 
  Check, 
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import config from '@/lib/siteConfig';
import { useLanguage } from '@/context/LanguageContext';
import DedicateDriveModal from '@/components/features/DedicateDriveModal';
import ImpactCardGeneratorModal from '@/components/features/ImpactCardGeneratorModal';
import ReceiptGeneratorModal from '@/components/features/ReceiptGeneratorModal';

export default function Hero() {
  const { t, locale } = useLanguage();
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number>(60);
  const [showQrOnMobile, setShowQrOnMobile] = useState<boolean>(true);
  const [isDedicateOpen, setIsDedicateOpen] = useState(false);
  const [isImpactCardOpen, setIsImpactCardOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  // Lock body scrolling when QR modal is active
  useEffect(() => {
    if (isQrModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isQrModalOpen]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsQrModalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCopyUpi = () => {
    const upiId = config.upi?.id || 'petbhar@upi';
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const upiId = config.upi?.id || 'petbhar@upi';
  const payeeName = config.upi?.payeeName || 'PETBHAR INITIATIVE';
  const upiIntentUrl = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${selectedAmount}&cu=INR`;

  return (
    <section className="relative flex min-h-[62vh] md:min-h-[70vh] items-center justify-center pt-22 pb-10 overflow-hidden">
      {/* Option 7: Ambient Slow Cinematic Motion (Ken Burns Effect) */}
      <div className="absolute inset-0 overflow-hidden select-none pointer-events-none">
        <motion.div
          className="relative w-full h-full transform-gpu will-change-transform"
          initial={{ scale: 1 }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Image
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1920&q=80"
            alt="Children and families receiving humanitarian food support"
            fill
            priority
            sizes="100vw"
            quality={80}
            className="object-cover"
          />
        </motion.div>
        {/* Layered cinematic gradients: high legibility on text, natural photographic tones */}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/70 to-charcoal/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-transparent to-charcoal/40" />
      </div>
      
      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 text-ivory text-center md:text-left">
        
        {/* Option 1: Dual-Mission Pill Badge (Humanity + PetBhar Paws) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="inline-flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2 p-1 sm:p-1.5 px-2.5 sm:px-3.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-ivory text-[11px] sm:text-xs font-medium shadow-sm hover:bg-white/15 transition-all"
        >
          <Link href="/work" className="inline-flex items-center gap-1.5 hover:text-amber-200 transition-colors py-0.5">
            <Utensils size={13} className="text-amber-300 shrink-0" />
            <span>Community Food Relief</span>
          </Link>
          <span className="w-1 h-1 rounded-full bg-white/40 hidden sm:inline-block" />
          <Link href="/paws" className="inline-flex items-center gap-1.5 hover:text-rose-200 transition-colors py-0.5">
            <Heart size={13} className="text-rose-300 shrink-0" />
            <span>PetBhar Paws Animal Care</span>
          </Link>
        </motion.div>
        
        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-4 sm:mt-5 font-serif text-[32px] sm:text-5xl md:text-6xl font-light leading-[1.12] tracking-tight break-words"
        >
          {t('hero_title_line1')}<br className="hidden sm:inline" /> {t('hero_title_line2')}
        </motion.h1>
        
        {/* Mission Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base md:text-lg text-ivory/85 leading-relaxed font-light mx-auto md:mx-0"
        >
          {t('hero_subtitle')}
        </motion.p>
        
        {/* CTA Buttons with Instant Quick UPI & Dedication Trigger */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-6 sm:mt-7 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3 w-full sm:w-auto"
        >
          <Button 
            variant="secondary" 
            href="/get-involved"
            className="w-full sm:w-auto min-h-[48px] justify-center bg-ivory text-charcoal hover:bg-white border-0 shadow-lg font-semibold"
          >
            {t('hero_cta_support')} &rarr;
          </Button>

          {/* Dedicate a Drive Button */}
          <button
            type="button"
            onClick={() => setIsDedicateOpen(true)}
            className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-full text-sm font-semibold tracking-wide bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white shadow-lg transition-all duration-300 inline-flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <span>{t('hero_cta_dedicate')}</span>
          </button>

          {/* Instant Quick UPI Scan Button */}
          <button
            type="button"
            onClick={() => setIsQrModalOpen(true)}
            className="w-full sm:w-auto min-h-[48px] px-6 py-3 rounded-full text-sm font-medium tracking-wide bg-white/15 hover:bg-white/25 text-ivory border border-white/25 backdrop-blur-md transition-all duration-300 inline-flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] shadow-sm hover:shadow-md"
          >
            <QrCode size={16} className="text-amber-300 shrink-0" />
            <span>{locale === 'hi' ? 'तुरंत UPI स्कैन' : 'Quick UPI Scan'}</span>
          </button>
        </motion.div>
        
        {/* Tangible Micro-Impact Callout ("₹50 = 1 Meal") */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85 }}
          className="mt-5 sm:mt-6 inline-flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-3 px-3.5 sm:px-4 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-[11px] sm:text-xs text-ivory/90 shadow-sm"
        >
          <span className="flex items-center gap-1.5 font-semibold text-amber-200">
            <Sparkles size={13} className="shrink-0" />
            <span>{t('hero_verified_cost')}</span>
          </span>
          <span className="w-1 h-1 rounded-full bg-white/40 hidden sm:inline-block" />
          <span className="text-ivory/85 flex items-center gap-1">
            <ShieldCheck size={13} className="text-emerald-300 shrink-0" />
            <span>{locale === 'hi' ? '100% प्रत्यक्ष ज़मीनी राहत' : '100% Direct Grassroots Relief'}</span>
          </span>
          <span className="w-1 h-1 rounded-full bg-white/40 hidden sm:inline-block" />
          <span className="text-ivory/70">{locale === 'hi' ? 'बिना बिचौलियों के' : 'Zero Middlemen'}</span>
        </motion.div>

        {/* Foundation Values */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-7 sm:mt-8 text-[10px] uppercase tracking-[0.35em] text-ivory/60"
        >
          FOOD &bull; DIGNITY &bull; HOPE
        </motion.div>
      </div>

      {/* Interactive Scroll Down Indicator */}
      <motion.button
        type="button"
        onClick={scrollToAbout}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 p-3 text-ivory/70 hover:text-ivory transition-colors z-20 cursor-pointer"
        aria-label="Scroll to About section"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-6 w-6" />
        </motion.div>
      </motion.button>

      {/* Option 5: Instant 1-Click UPI QR Modal */}
      <AnimatePresence>
        {isQrModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsQrModalOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-sm rounded-3xl bg-[#FDFBF7] text-[#0E0D0C] p-5 sm:p-7 shadow-2xl border border-charcoal/10 z-10 my-auto max-h-[88dvh] overflow-y-auto overscroll-contain"
              role="dialog"
              aria-modal="true"
            >
              {/* Close Button with generous touch target */}
              <button
                type="button"
                onClick={() => setIsQrModalOpen(false)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full text-warm-grey hover:text-charcoal hover:bg-black/5 active:scale-95 transition-all cursor-pointer z-10"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              {/* Header */}
              <div className="text-center mb-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-charcoal/5 text-[11px] font-semibold tracking-wider uppercase text-warm-grey mb-2">
                  <ShieldCheck size={13} className="text-emerald-600" /> Direct Grassroots Relief
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-semibold text-charcoal">Quick UPI Contribution</h3>
                <p className="text-xs text-warm-grey mt-0.5">100% directly powers wholesome meals & animal care</p>
              </div>

              {/* Amount Selection Presets (1-Tap on mobile) */}
              <div className="mb-3.5">
                <label className="text-[10px] uppercase font-semibold tracking-wider text-warm-grey block mb-1.5 text-center">
                  Select Contribution
                </label>
                <div className="grid grid-cols-4 gap-1.5 text-center">
                  {[
                    { amount: 60, label: '1 Meal' },
                    { amount: 300, label: '5 Meals' },
                    { amount: 600, label: '10 Meals' },
                    { amount: 1800, label: 'Family Kit' },
                  ].map((preset) => {
                    const isSelected = selectedAmount === preset.amount;
                    return (
                      <button
                        key={preset.amount}
                        type="button"
                        onClick={() => setSelectedAmount(preset.amount)}
                        className={`p-2 rounded-xl border transition-all cursor-pointer flex flex-col items-center justify-center min-h-[44px] ${
                          isSelected
                            ? 'bg-charcoal text-ivory border-charcoal shadow-xs scale-[1.02]'
                            : 'bg-white text-charcoal border-charcoal/10 hover:border-charcoal/30'
                        }`}
                      >
                        <span className="font-bold text-xs">₹{preset.amount}</span>
                        <span className={`text-[9px] ${isSelected ? 'text-ivory/80' : 'text-warm-grey'}`}>
                          {preset.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Direct Pay Trigger Button */}
              {upiId && (
                <div className="mb-3.5">
                  <a
                    href={upiIntentUrl}
                    className="w-full py-3.5 px-4 rounded-2xl bg-charcoal text-ivory text-xs sm:text-sm font-semibold text-center flex items-center justify-center gap-2 shadow-md hover:bg-black active:scale-[0.98] transition-all min-h-[48px]"
                  >
                    <span>Pay ₹{selectedAmount} via UPI (GPay / PhonePe / Paytm)</span>
                    <ExternalLink size={14} className="shrink-0" />
                  </a>
                </div>
              )}

              {/* UPI ID Copy Box */}
              {upiId && (
                <div className="mb-3.5">
                  <div className="flex items-center justify-between gap-2 p-2.5 px-3 bg-white rounded-xl border border-charcoal/15 text-xs">
                    <div className="truncate">
                      <span className="text-warm-grey text-[10px] uppercase block tracking-wider">UPI ID / VPA</span>
                      <span className="font-mono font-semibold text-charcoal text-xs">{upiId}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyUpi}
                      className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-charcoal/10 hover:bg-charcoal text-charcoal hover:text-ivory text-xs font-medium transition-colors cursor-pointer min-h-[36px]"
                    >
                      {copied ? (
                        <>
                          <Check size={13} className="text-emerald-600" />
                          <span>Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* QR Code Section (Visible directly on both mobile & desktop) */}
              <div className="border-t border-charcoal/10 pt-3">
                <div className="flex flex-col items-center">
                  <div className="w-44 h-44 sm:w-52 sm:h-52 bg-white rounded-2xl p-3 shadow-inner border border-charcoal/10 flex items-center justify-center relative">
                    <Image
                      src={config.upi?.qrImage || '/images/petbhar-upi-qr.png'}
                      alt="PetBhar UPI QR Code"
                      width={208}
                      height={208}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-[11px] text-warm-grey mt-2 font-medium">
                    Scan with any UPI app &bull; GPay, PhonePe, Paytm
                  </p>
                </div>
              </div>

              {/* Footer Links & Extra Tools */}
              <div className="text-center pt-3 mt-2 border-t border-charcoal/5 space-y-2">
                <div className="flex items-center justify-center gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setIsQrModalOpen(false);
                      setIsImpactCardOpen(true);
                    }}
                    className="text-amber-800 hover:text-amber-950 font-medium underline underline-offset-2 flex items-center gap-1"
                  >
                    <span>📸 {locale === 'hi' ? 'इम्पैक्ट कार्ड बनाएं' : 'Create Impact Card'}</span>
                  </button>
                  <span className="text-charcoal/20">•</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsQrModalOpen(false);
                      setIsReceiptOpen(true);
                    }}
                    className="text-emerald-800 hover:text-emerald-950 font-medium underline underline-offset-2 flex items-center gap-1"
                  >
                    <span>📄 {locale === 'hi' ? 'रसीद प्राप्त करें' : 'Get Receipt'}</span>
                  </button>
                </div>

                <div>
                  <Link
                    href="/get-involved"
                    onClick={() => setIsQrModalOpen(false)}
                    className="text-xs text-warm-grey hover:text-charcoal inline-flex items-center gap-1 font-medium transition-colors min-h-[32px]"
                  >
                    <span>Need Bank Account (NEFT/IMPS) details?</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Feature Modals */}
      <DedicateDriveModal isOpen={isDedicateOpen} onClose={() => setIsDedicateOpen(false)} />
      <ImpactCardGeneratorModal isOpen={isImpactCardOpen} onClose={() => setIsImpactCardOpen(false)} defaultMeals={selectedAmount / 50 || 5} />
      <ReceiptGeneratorModal isOpen={isReceiptOpen} onClose={() => setIsReceiptOpen(false)} defaultAmount={selectedAmount} />
    </section>
  );
}
