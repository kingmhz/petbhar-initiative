'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Copy, Check, ArrowUpRight, ShieldCheck, QrCode, Sparkles } from 'lucide-react';
import { GooglePayIcon } from '@/components/ui/SocialIcons';
import { getUpiPaymentUrls } from '@/lib/upi';
import { siteConfig } from '@/lib/siteConfig';
import { useLanguage } from '@/context/LanguageContext';

interface PaymentBarcodeProps {
  className?: string;
  amount?: number;
}

export default function PaymentBarcode({ className = '', amount }: PaymentBarcodeProps) {
  const { locale } = useLanguage();
  const [copied, setCopied] = useState(false);

  const upiId = siteConfig.upi?.id || '';
  const payeeName = siteConfig.upi?.payeeName || 'PETBHAR INITIATIVE';
  const qrImage = siteConfig.upi?.qrImage || '/images/petbhar-upi-qr.png';

  const { gpayUrl, genericUpiUrl } = getUpiPaymentUrls({
    upiId: upiId || 'petbhar@upi',
    payeeName,
    amount,
    note: 'PetBhar Initiative Support',
  });

  const handleCopy = () => {
    if (!upiId) return;
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-[32px] p-6 sm:p-8 md:p-9 bg-white/70 backdrop-blur-2xl border border-white/80 shadow-[0_20px_50px_rgba(20,20,30,0.06),_inset_0_1px_2px_rgba(255,255,255,0.9)] hover:shadow-[0_25px_60px_rgba(20,20,30,0.09)] transition-all duration-500 flex flex-col justify-between text-center ${className}`}
    >
      {/* Liquid Glass Top Refraction Line */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white to-transparent pointer-events-none" />

      {/* Top Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-[11px] font-semibold tracking-wider uppercase text-emerald-700 mb-3 border border-emerald-500/20">
          <QrCode size={13} />
          <span>{locale === 'hi' ? 'सीधा यूपीआई भुगतान' : 'Instant UPI Payment'}</span>
        </div>

        <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal">
          {amount && amount > 0
            ? (locale === 'hi' ? `₹${amount.toLocaleString('en-IN')} सहयोग करें` : `Scan to Sponsor ₹${amount.toLocaleString('en-IN')}`)
            : (locale === 'hi' ? 'पेमेंट बारकोड स्कैन करें' : 'Scan Payment Barcode')}
        </h3>

        <p className="text-xs text-warm-grey mt-1.5 max-w-xs mx-auto">
          {locale === 'hi'
            ? 'किसी भी कैमरा या यूपीआई ऐप से सीधे स्कैन करके तुरंत सहयोग करें'
            : 'Contribute instantly using Google Pay, PhonePe, Paytm, or any phone camera'}
        </p>
      </div>

      {/* Centered QR Barcode with Floating Glass Pedestal */}
      <div className="my-auto py-5 flex flex-col items-center justify-center">
        <div className="relative aspect-square w-full max-w-[240px] sm:max-w-[260px] rounded-3xl p-4 bg-white/95 backdrop-blur-md border border-white shadow-[0_16px_40px_rgba(0,0,0,0.07),_inset_0_1px_1px_rgba(255,255,255,1)] flex items-center justify-center group">
          <Image
            src={qrImage}
            alt="PetBhar UPI Payment Barcode"
            width={240}
            height={240}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
            priority
          />
        </div>

        {/* Supported Apps List */}
        <div className="mt-4 text-center">
          <p className="text-[11px] font-semibold text-charcoal/80">
            {locale === 'hi' ? 'सभी यूपीआई ऐप्स समर्थित हैं' : 'Scan with any UPI App'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-1 text-[10px] text-warm-grey font-medium">
            <span className="bg-white/70 px-2 py-0.5 rounded-full border border-charcoal/5">Google Pay</span>
            <span className="bg-white/70 px-2 py-0.5 rounded-full border border-charcoal/5">PhonePe</span>
            <span className="bg-white/70 px-2 py-0.5 rounded-full border border-charcoal/5">Paytm</span>
            <span className="bg-white/70 px-2 py-0.5 rounded-full border border-charcoal/5">BHIM</span>
            <span className="bg-white/70 px-2 py-0.5 rounded-full border border-charcoal/5">CRED</span>
          </div>
        </div>
      </div>

      {/* Bottom Area: UPI ID Copy + Mobile Links + Trust Badge */}
      <div className="mt-auto pt-2 space-y-3">
        {/* Copy UPI ID Button (if available) */}
        {upiId && (
          <div className="w-full flex items-center justify-between gap-2 px-3.5 py-2 rounded-2xl bg-white/70 backdrop-blur-md border border-white/90 text-xs shadow-2xs">
            <span className="font-mono text-charcoal truncate">{upiId}</span>
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-charcoal hover:text-black transition-colors cursor-pointer px-2 py-1 rounded-lg hover:bg-black/5"
            >
              {copied ? (
                <>
                  <Check size={13} className="text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Copy ID</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Mobile Quick Pay Intent Links */}
        <div className="space-y-2 md:hidden">
          <a
            href={gpayUrl}
            className="w-full py-3.5 px-4 rounded-2xl bg-charcoal text-ivory text-xs font-semibold hover:bg-black transition-colors flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(0,0,0,0.15)] active:scale-98"
          >
            <GooglePayIcon size={16} />
            <span>Pay with Google Pay</span>
            <ArrowUpRight size={13} />
          </a>
          <a
            href={genericUpiUrl}
            className="block text-[11px] text-warm-grey hover:text-charcoal underline underline-offset-4"
          >
            Pay with PhonePe / Paytm / Other Apps &rarr;
          </a>
        </div>

        {/* Trust Guarantee */}
        <div className="pt-3 border-t border-charcoal/5 flex items-center justify-center gap-1.5 text-[11px] text-warm-grey">
          <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
          <span>100% of funds go straight to food relief & animal bowls</span>
        </div>
      </div>
    </div>
  );
}
