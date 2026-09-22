'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Check, ArrowUpRight, Camera, Gift } from 'lucide-react';
import { siteConfig } from '@/lib/siteConfig';
import { useLanguage } from '@/context/LanguageContext';
import { GooglePayIcon } from '@/components/ui/SocialIcons';
import { getUpiPaymentUrls } from '@/lib/upi';

interface DedicateDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DedicateDriveModal({ isOpen, onClose }: DedicateDriveModalProps) {
  const { t, locale } = useLanguage();
  const [occasion, setOccasion] = useState('Birthday Celebration');
  const [honoreeName, setHonoreeName] = useState('');
  const [donorName, setDonorName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [tier, setTier] = useState('100 Meals + Banner');
  const [amount, setAmount] = useState(6000);
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [showQR, setShowQR] = useState(false);

  const tiers = [
    { id: '50 Meals', label: locale === 'hi' ? '50 भोजन थाली' : '50 Meals', price: 3000, highlight: false },
    { id: '100 Meals + Banner', label: locale === 'hi' ? '100 थाली + बैनर' : '100 Meals + Banner', price: 6000, highlight: true },
    { id: '250 Meals + Video', label: locale === 'hi' ? '250 थाली + वीडियो' : '250 Meals + Video', price: 15000, highlight: false },
    { id: 'Custom', label: locale === 'hi' ? 'अन्य राशि' : 'Custom Amount', price: 0, highlight: false },
  ];

  const handleTierSelect = (selectedTier: typeof tiers[0]) => {
    setTier(selectedTier.id);
    if (selectedTier.id === 'Custom') {
      const num = parseInt(customAmount) || 1000;
      setAmount(num);
    } else {
      setAmount(selectedTier.price);
    }
  };

  const finalAmount = tier === 'Custom' ? parseInt(customAmount) || 1000 : amount;
  const upiId = siteConfig.upi?.id || 'petbhar@upi';
  const { gpayUrl, genericUpiUrl } = getUpiPaymentUrls({
    upiId,
    payeeName: siteConfig.upi?.payeeName || 'PetBhar Initiative',
    amount: finalAmount,
    note: `Dedication by ${donorName || 'Supporter'} for ${honoreeName || 'Loved One'}`,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!honoreeName.trim() || !phone.trim()) {
      setError(locale === 'hi' ? 'कृपया जिनके नाम पर समर्पित है और व्हाट्सएप नंबर भरें।' : "Please provide honoree's name and WhatsApp number.");
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/dedicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          occasion,
          honoreeName,
          donorName,
          phone,
          email,
          tier,
          amount: finalAmount,
          message,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Failed to submit dedication.');
      }
    } catch {
      setError('Connection error. Please try again.');
    }
    setSubmitting(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-charcoal/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative bg-ivory rounded-3xl shadow-2xl border border-charcoal/10 max-w-xl w-full p-6 sm:p-8 z-10 my-auto max-h-[92vh] overflow-y-auto overscroll-contain"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 w-10 h-10 flex items-center justify-center rounded-full bg-charcoal/5 hover:bg-charcoal/10 text-charcoal transition-colors z-20"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          {!submitted ? (
            <div>
              {/* Header */}
              <div className="text-center mb-6 pr-8">
                <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200/60 px-3 py-1 rounded-full font-semibold mb-2">
                  <Gift size={12} /> {locale === 'hi' ? 'विशेष पहल' : 'Dedication Sponsorship'}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-charcoal font-medium">
                  {t('dedicate_title')}
                </h2>
                <p className="text-xs sm:text-sm text-charcoal/70 mt-1.5 max-w-md mx-auto">
                  {t('dedicate_subtitle')}
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                {/* Honeypot field */}
                <input type="text" name="honeypot" className="hidden" tabIndex={-1} autoComplete="off" />

                {/* Occasion Selection */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-charcoal mb-1.5">
                    {t('dedicate_occasion')}
                  </label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full bg-white border border-charcoal/15 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-charcoal focus:border-charcoal outline-none min-h-[44px]"
                  >
                    <option value="Birthday Celebration">{t('dedicate_birthday')}</option>
                    <option value="Wedding Anniversary">{t('dedicate_anniversary')}</option>
                    <option value="In Loving Memory">{t('dedicate_memorial')}</option>
                    <option value="Milestone / Blessing">{t('dedicate_milestone')}</option>
                    <option value="Other">{t('dedicate_other')}</option>
                  </select>
                </div>

                {/* Honoree & Donor Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-charcoal mb-1.5">
                      {t('dedicate_honoree')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={honoreeName}
                      onChange={(e) => setHonoreeName(e.target.value)}
                      placeholder={t('dedicate_honoree_placeholder')}
                      className="w-full bg-white border border-charcoal/15 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-charcoal focus:border-charcoal outline-none min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-charcoal mb-1.5">
                      {t('dedicate_donor_name')}
                    </label>
                    <input
                      type="text"
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder="Your name"
                      className="w-full bg-white border border-charcoal/15 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-charcoal focus:border-charcoal outline-none min-h-[44px]"
                    />
                  </div>
                </div>

                {/* WhatsApp & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-charcoal mb-1.5 flex items-center gap-1">
                      <Camera size={12} className="text-emerald-600" /> {t('dedicate_phone')} *
                    </label>
                    <input
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full bg-white border border-charcoal/15 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-charcoal focus:border-charcoal outline-none min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-charcoal mb-1.5">
                      Email (Optional)
                    </label>
                    <input
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-white border border-charcoal/15 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-charcoal focus:border-charcoal outline-none min-h-[44px]"
                    />
                  </div>
                </div>

                {/* Tier Selection */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-charcoal mb-2">
                    {locale === 'hi' ? 'ड्राइव का स्तर चुनें' : 'Select Dedication Tier'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {tiers.map((item) => (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() => handleTierSelect(item)}
                        className={`p-3 rounded-xl text-left border transition-all text-xs flex flex-col justify-between ${
                          tier === item.id
                            ? 'bg-charcoal text-ivory border-charcoal shadow-xs'
                            : 'bg-white text-charcoal border-charcoal/15 hover:border-charcoal/30'
                        }`}
                      >
                        <span className="font-semibold block">{item.label}</span>
                        <span className={`text-[11px] mt-1 ${tier === item.id ? 'text-ivory/80' : 'text-warm-grey'}`}>
                          {item.price > 0 ? `₹${item.price.toLocaleString('en-IN')}` : (locale === 'hi' ? 'आपकी इच्छानुसार' : 'Flexible')}
                        </span>
                      </button>
                    ))}
                  </div>

                  {tier === 'Custom' && (
                    <div className="mt-2.5">
                      <input
                        type="number"
                        min="500"
                        step="100"
                        value={customAmount}
                        onChange={(e) => {
                          setCustomAmount(e.target.value);
                          setAmount(parseInt(e.target.value) || 0);
                        }}
                        placeholder="Enter amount (min ₹500)"
                        className="w-full bg-white border border-charcoal/15 rounded-xl px-3.5 py-2 text-base sm:text-sm focus:border-charcoal outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* Banner Message */}
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-charcoal mb-1.5">
                    {t('dedicate_message')}
                  </label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t('dedicate_message_placeholder')}
                    className="w-full bg-white border border-charcoal/15 rounded-xl px-3.5 py-2 text-base sm:text-sm text-charcoal focus:border-charcoal outline-none resize-none"
                  />
                </div>

                {error && (
                  <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200">
                    {error}
                  </p>
                )}

                {/* Submit & Payment Actions */}
                <div className="pt-2 space-y-2.5">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-charcoal text-ivory py-3.5 rounded-xl font-medium text-xs sm:text-sm uppercase tracking-wider hover:bg-black transition-all shadow-md active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    <span>{submitting ? (locale === 'hi' ? 'दर्ज हो रहा है...' : 'Saving Dedication...') : t('dedicate_submit')}</span>
                    <Heart size={14} className="fill-current text-rose-400" />
                  </button>

                  <p className="text-[11px] text-warm-grey text-center">
                    {locale === 'hi'
                      ? '📸 वितरण के बाद आपको व्हाट्सएप पर बैनर और भोजन वितरण की तस्वीरें व वीडियो भेजे जाएंगे।'
                      : '📸 After confirmation, our ground team puts up the dedication banner and sends photos & video directly to your WhatsApp.'}
                  </p>
                </div>
              </form>
            </div>
          ) : (
            /* Post-Submission Payment & Confirmation Screen */
            <div className="text-center py-4 space-y-5">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <Check size={28} />
              </div>

              <div>
                <h3 className="font-serif text-2xl sm:text-3xl text-charcoal">
                  {locale === 'hi' ? 'ड्राइव विवरण दर्ज हो गया!' : 'Dedication Confirmed!'}
                </h3>
                <p className="text-xs sm:text-sm text-charcoal/70 mt-1.5 max-w-md mx-auto">
                  {locale === 'hi'
                    ? `प्रिय ${donorName || 'सहयोगी'}, ${honoreeName} के नाम पर ₹${finalAmount.toLocaleString('en-IN')} का प्रायोजन दर्ज कर लिया गया है। कृपया नीचे दिए गए UPI बटन से सहयोग पूरा करें:`
                    : `Thank you, ${donorName || 'Supporter'}. The dedication for ${honoreeName} has been booked for ₹${finalAmount.toLocaleString('en-IN')}. Complete the payment directly via UPI below:`}
                </p>
              </div>

              {/* Direct One-Tap Google Pay Action */}
              <div className="space-y-3 max-w-sm mx-auto">
                <a
                  href={gpayUrl}
                  className="w-full bg-charcoal hover:bg-black text-white py-3.5 px-6 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2.5 shadow-md transition-all active:scale-95 group"
                >
                  <GooglePayIcon size={18} />
                  <span>
                    {locale === 'hi' 
                      ? `Google Pay से ₹${finalAmount.toLocaleString('en-IN')} का भुगतान करें` 
                      : `Pay ₹${finalAmount.toLocaleString('en-IN')} via Google Pay`}
                  </span>
                  <ArrowUpRight size={16} className="text-white/70 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>

                <div className="text-center">
                  <a
                    href={genericUpiUrl}
                    className="text-xs text-warm-grey hover:text-charcoal underline underline-offset-4"
                  >
                    {locale === 'hi' ? 'अन्य UPI ऐप (PhonePe / Paytm) से भुगतान करें →' : 'Pay with PhonePe / Paytm / other UPI apps →'}
                  </a>
                </div>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={() => setShowQR(!showQR)}
                    className="text-xs text-warm-grey hover:text-charcoal underline underline-offset-4"
                  >
                    {showQR ? (locale === 'hi' ? 'QR कोड छुपाएं' : 'Hide QR Code') : (locale === 'hi' ? 'अन्य डिवाइस से स्कैन करने के लिए QR कोड देखें' : 'Show QR Code for companion device')}
                  </button>
                </div>

                {showQR && siteConfig.upi?.qrImage && (
                  <div className="bg-white p-4 rounded-2xl border border-charcoal/10 shadow-sm max-w-[200px] mx-auto">
                    <Image
                      src={siteConfig.upi.qrImage}
                      alt="UPI QR Code"
                      width={180}
                      height={180}
                      className="w-full h-auto rounded-lg"
                    />
                  </div>
                )}
              </div>

              <div className="bg-warm-ivory/30 p-4 rounded-2xl border border-charcoal/10 text-xs text-charcoal/80 text-left max-w-md mx-auto space-y-1">
                <p><strong>{locale === 'hi' ? 'व्हाट्सएप पुष्टि:' : 'WhatsApp Updates:'}</strong> {phone}</p>
                <p><strong>{locale === 'hi' ? 'अवसर:' : 'Occasion:'}</strong> {occasion} for {honoreeName}</p>
                {message && <p><strong>{locale === 'hi' ? 'बैनर संदेश:' : 'Banner Message:'}</strong> &ldquo;{message}&rdquo;</p>}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="text-xs uppercase tracking-widest text-charcoal font-semibold hover:underline pt-2"
              >
                {locale === 'hi' ? 'समाप्त करें' : 'Close Window'}
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
