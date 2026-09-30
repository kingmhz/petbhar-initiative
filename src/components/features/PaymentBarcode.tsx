'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Copy, Check, ArrowUpRight, ShieldCheck, QrCode } from 'lucide-react';
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
    <div className={`w-full max-w-md mx-auto rounded-3xl border border-charcoal/10 bg-white p-6 sm:p-8 shadow-xs flex flex-col items-center text-center ${className}`}>
      {/* Top Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[11px] font-semibold tracking-wider uppercase text-emerald-700 mb-3 border border-emerald-100">
        <QrCode size={13} />
        <span>{locale === 'hi' ? 'सीधा यूपीआई भुगतान' : 'Instant UPI Payment'}</span>
      </div>

      <h3 className="font-serif text-2xl font-semibold text-charcoal">
        {locale === 'hi' ? 'पेमेंट बारकोड स्कैन करें' : 'Scan Payment Barcode'}
      </h3>

      <p className="text-xs text-warm-grey mt-1 max-w-xs">
        {locale === 'hi'
          ? 'किसी भी यूपीआई ऐप से सीधे स्कैन करके तुरंत सहयोग करें'
          : 'Contribute instantly using any camera or UPI app on your phone'}
      </p>

      {/* Barcode / QR Code Container */}
      <div className="relative my-5 aspect-square w-full max-w-[220px] rounded-2xl border border-charcoal/10 bg-white p-3 shadow-inner flex items-center justify-center">
        <Image
          src={qrImage}
          alt="PetBhar UPI Barcode"
          width={220}
          height={220}
          className="w-full h-full object-contain"
          priority
        />
      </div>

      {/* Supported Apps List */}
      <div className="text-center">
        <p className="text-[11px] font-medium text-charcoal/80">
          {locale === 'hi' ? 'सभी यूपीआई ऐप्स समर्थित हैं' : 'Scan with any UPI App'}
        </p>
        <p className="text-[10px] text-warm-grey mt-0.5 tracking-wide">
          Google Pay &bull; PhonePe &bull; Paytm &bull; BHIM &bull; CRED
        </p>
      </div>

      {/* Copy UPI ID Button (if available) */}
      {upiId && (
        <div className="mt-4 w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-warm-ivory/20 border border-charcoal/10 text-xs">
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
      <div className="mt-5 w-full space-y-2 md:hidden">
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
      <div className="mt-5 pt-4 border-t border-charcoal/5 flex items-center justify-center gap-1.5 text-[11px] text-warm-grey">
        <ShieldCheck size={13} className="text-emerald-600" />
        <span>100% of funds go straight to ground ration & animal feed</span>
      </div>
    </div>
  );
}
