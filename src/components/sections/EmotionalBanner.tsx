'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, QrCode, Sparkles, Copy, Check, ArrowUpRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { GooglePayIcon } from '@/components/ui/SocialIcons';
import { siteConfig } from '@/lib/siteConfig';
import { getUpiPaymentUrls } from '@/lib/upi';
import { useLanguage } from '@/context/LanguageContext';

export default function EmotionalBanner() {
  const { locale } = useLanguage();
  const [isBarcodeOpen, setIsBarcodeOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Lock body scroll when barcode modal is open
  useEffect(() => {
    if (isBarcodeOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsBarcodeOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isBarcodeOpen]);

  const upiId = siteConfig.upi?.id || '';
  const payeeName = siteConfig.upi?.payeeName || 'PETBHAR INITIATIVE';
  const qrImage = siteConfig.upi?.qrImage || '/images/petbhar-upi-qr.png';

  const { gpayUrl, genericUpiUrl } = getUpiPaymentUrls({
    upiId: upiId || 'petbhar@upi',
    payeeName,
    note: 'PetBhar Initiative Support',
  });

  const handleCopy = () => {
    if (!upiId) return;
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section className="relative flex min-h-[500px] h-[70vh] items-center justify-center">
      <Image
        src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1920&q=80"
        alt="Emotional background"
        fill
        sizes="100vw"
        quality={80}
        className="object-cover"
      />
      <div className="absolute inset-0 bg-charcoal/50" />
      <div className="relative z-10 w-full max-w-3xl px-6 text-center text-ivory">
        <ScrollReveal>
          <h2 className="font-serif text-4xl font-light md:text-5xl lg:text-6xl">
            Together, we can end<br />hunger in our community.
          </h2>
          <div className="mt-8 flex justify-center">
            <Button
              variant="secondary"
              onClick={() => setIsBarcodeOpen(true)}
              className="cursor-pointer"
            >
              Support Us
            </Button>
          </div>
          <p className="mt-12 font-serif text-lg italic text-ivory/60">
            Small acts. Big impact.
          </p>
        </ScrollReveal>
      </div>

      {/* Basic Big Barcode Modal */}
      <AnimatePresence>
        {isBarcodeOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsBarcodeOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-sm rounded-3xl bg-ivory text-charcoal p-6 sm:p-8 shadow-2xl border border-charcoal/10 z-10 my-auto text-center"
              role="dialog"
              aria-modal="true"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsBarcodeOpen(false)}
                className="absolute top-4 right-4 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full text-warm-grey hover:text-charcoal hover:bg-black/5 active:scale-95 transition-all cursor-pointer"
                aria-label="Close barcode modal"
              >
                <X size={20} />
              </button>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[11px] font-semibold tracking-wider uppercase text-emerald-700 mb-2 border border-emerald-100">
                <Sparkles size={13} />
                <span>{locale === 'hi' ? 'सीधा यूपीआई सहयोग' : 'Direct UPI Contribution'}</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal">
                {locale === 'hi' ? 'पेमेंट बारकोड' : 'Payment Barcode'}
              </h3>

              <p className="text-xs text-warm-grey mt-1">
                {locale === 'hi'
                  ? 'किसी भी कैमरा या यूपीआई ऐप से सीधे स्कैन करें'
                  : 'Scan with any UPI app on your phone to contribute'}
              </p>

              {/* Big Barcode Card */}
              <div className="mx-auto my-4 w-60 h-60 sm:w-68 sm:h-68 bg-white rounded-2xl p-3 shadow-inner border border-charcoal/10 flex items-center justify-center relative">
                <Image
                  src={qrImage}
                  alt="PetBhar UPI Payment Barcode"
                  width={270}
                  height={270}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>

              {/* Supported UPI Apps */}
              <div className="space-y-1">
                <p className="text-xs font-semibold text-charcoal">
                  {locale === 'hi' ? 'सभी यूपीआई ऐप्स समर्थित हैं' : 'Scan with any UPI App'}
                </p>
                <p className="text-[11px] text-warm-grey">
                  Google Pay &bull; PhonePe &bull; Paytm &bull; BHIM &bull; CRED
                </p>
              </div>

              {/* Copy UPI ID */}
              {upiId && (
                <div className="mt-4 flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-white border border-charcoal/10 text-xs">
                  <span className="font-mono text-charcoal truncate">{upiId}</span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-charcoal hover:text-black transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check size={13} className="text-emerald-600" />
                        <span className="text-emerald-700">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Mobile Quick Pay Intent Links */}
              <div className="mt-4 space-y-2 md:hidden">
                <a
                  href={gpayUrl}
                  className="w-full py-3 px-4 rounded-xl bg-charcoal text-ivory text-xs font-semibold hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-xs active:scale-98"
                >
                  <GooglePayIcon size={16} />
                  <span>Pay via Google Pay</span>
                  <ArrowUpRight size={13} />
                </a>
                <a
                  href={genericUpiUrl}
                  className="block text-[11px] text-warm-grey hover:text-charcoal underline underline-offset-4"
                >
                  Pay via PhonePe / Paytm / Other Apps &rarr;
                </a>
              </div>

              {/* Trust Guarantee */}
              <div className="mt-4 pt-3 border-t border-charcoal/5 flex items-center justify-center gap-1 text-[11px] text-warm-grey">
                <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
                <span>100% volunteer run &bull; zero platform deductions</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
