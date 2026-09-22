'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Utensils, Heart, Package, ShoppingBag, ArrowRight, Check, QrCode, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { siteConfig } from '@/lib/siteConfig';
import DedicateDriveModal from '@/components/features/DedicateDriveModal';

interface ImpactSimulatorProps {
  onOpenDedication?: (amount: number) => void;
  onOpenQR?: (amount: number) => void;
}

const PRESET_AMOUNTS = [
  { amount: 300, label: '5 Meals' },
  { amount: 600, label: '10 Meals' },
  { amount: 1800, label: '1 Family Ration Kit' },
  { amount: 3000, label: '50 Meals (Drive)' },
  { amount: 6000, label: '100 Meals + Banner' },
  { amount: 15000, label: '250 Meals Mega Drive' },
];

export default function ImpactSimulator({ onOpenDedication, onOpenQR }: ImpactSimulatorProps) {
  const { t } = useLanguage();
  const [amount, setAmount] = useState<number>(1800);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [internalDedicateOpen, setInternalDedicateOpen] = useState<boolean>(false);

  // Lock body scrolling when QR modal is active
  useEffect(() => {
    if (showQrModal) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setShowQrModal(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [showQrModal]);

  const calculated = useMemo(() => {
    const meals = Math.max(1, Math.floor(amount / 60));
    const bowls = Math.max(2, Math.floor(amount / 35));
    const kits = Math.floor(amount / 1800);
    const attaKg = (amount * 0.0055).toFixed(1);
    const riceKg = (amount * 0.0028).toFixed(1);
    const dalKg = (amount * 0.0011).toFixed(1);
    const oilLitre = (amount * 0.00055).toFixed(1);

    return {
      meals,
      bowls,
      kits,
      groceries: `${attaKg} kg Atta • ${riceKg} kg Rice • ${dalKg} kg Dal • ${oilLitre} L Oil`
    };
  }, [amount]);

  const upiIntentUrl = useMemo(() => {
    const upiId = siteConfig.upi?.id || 'petbhar@upi';
    const payeeName = siteConfig.upi?.payeeName || 'PETBHAR INITIATIVE';
    return `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent('Food and Animal Care Sponsorship')}`;
  }, [amount]);

  return (
    <div className="w-full bg-linear-to-br from-cream/40 to-warm-ivory/20 rounded-3xl border border-charcoal/10 p-6 sm:p-8 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-terracotta/10 text-terracotta text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles size={13} /> {t('sim_title')}
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal">
            {t('sim_title')}
          </h3>
          <p className="text-xs sm:text-sm text-warm-grey mt-1">
            {t('sim_subtitle')}
          </p>
        </div>

        {/* Selected Amount Pill */}
        <div className="text-left sm:text-right bg-white p-3 sm:p-4 rounded-2xl border border-charcoal/10 shadow-xs shrink-0">
          <span className="text-[11px] font-semibold text-warm-grey uppercase tracking-wider block">
            {t('sim_custom_amount')}
          </span>
          <span className="font-serif text-2xl sm:text-3xl font-bold text-charcoal">
            ₹{amount.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Preset Amount Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mb-6">
        {PRESET_AMOUNTS.map((preset) => (
          <button
            key={preset.amount}
            type="button"
            onClick={() => setAmount(preset.amount)}
            className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all border text-left flex flex-col ${
              amount === preset.amount
                ? 'bg-charcoal text-ivory border-charcoal shadow-sm'
                : 'bg-white hover:bg-warm-ivory/20 text-charcoal border-charcoal/10'
            }`}
          >
            <span className="text-sm font-bold">₹{preset.amount.toLocaleString('en-IN')}</span>
            <span className={`text-[10px] truncate ${amount === preset.amount ? 'text-cream/80' : 'text-warm-grey'}`}>
              {preset.label}
            </span>
          </button>
        ))}
      </div>

      {/* Interactive Range Slider */}
      <div className="space-y-2 mb-8 bg-white p-4 sm:p-5 rounded-2xl border border-charcoal/10 shadow-xs">
        <div className="flex justify-between text-xs text-warm-grey font-medium">
          <span>₹120 (2 Meals)</span>
          <span className="font-semibold text-charcoal font-mono">₹{amount.toLocaleString('en-IN')}</span>
          <span>₹30,000 (Mega Drive)</span>
        </div>
        <input
          type="range"
          min={120}
          max={30000}
          step={60}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full h-2.5 bg-warm-ivory/60 rounded-lg appearance-none cursor-pointer accent-charcoal"
          aria-label="Donation impact amount slider"
        />
      </div>

      {/* Dynamic Impact Output Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6">
        {/* Card 1: Cooked Meals */}
        <div className="p-4 rounded-2xl bg-white border border-charcoal/10 flex items-start gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Utensils size={18} />
          </div>
          <div>
            <div className="font-serif text-2xl font-bold text-charcoal leading-none">
              {calculated.meals}
            </div>
            <span className="text-xs font-semibold text-charcoal block mt-1">
              {t('sim_fresh_meals')}
            </span>
            <span className="text-[11px] text-warm-grey">
              Piping hot cooked thalis (₹60/meal)
            </span>
          </div>
        </div>

        {/* Card 2: PetBhar Paws Bowls */}
        <div className="p-4 rounded-2xl bg-white border border-charcoal/10 flex items-start gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Heart size={18} />
          </div>
          <div>
            <div className="font-serif text-2xl font-bold text-charcoal leading-none">
              {calculated.bowls}
            </div>
            <span className="text-xs font-semibold text-charcoal block mt-1">
              {t('sim_paws_bowls')}
            </span>
            <span className="text-[11px] text-warm-grey">
              High-protein stray bowls (₹35/bowl)
            </span>
          </div>
        </div>

        {/* Card 3: Dry Ration Kits */}
        <div className="p-4 rounded-2xl bg-white border border-charcoal/10 flex items-start gap-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Package size={18} />
          </div>
          <div>
            <div className="font-serif text-2xl font-bold text-charcoal leading-none">
              {calculated.kits > 0 ? (
                <>
                  {calculated.kits}{' '}
                  <span className="text-sm font-sans font-medium text-warm-grey">
                    {calculated.kits === 1 ? 'Kit' : 'Kits'}
                  </span>
                </>
              ) : (
                <>
                  {Math.round((amount / 1800) * 100)}%{' '}
                  <span className="text-xs font-sans font-medium text-warm-grey">
                    of Kit
                  </span>
                </>
              )}
            </div>
            <span className="text-xs font-semibold text-charcoal block mt-1">
              {t('sim_ration_kits')}
            </span>
            <span className="text-[11px] text-warm-grey">
              Full month family ration (₹1,800)
            </span>
          </div>
        </div>
      </div>

      {/* Tangible Grocery Breakdown Callout with Wholesale Calibration */}
      <div className="p-4 rounded-2xl bg-warm-ivory/30 border border-charcoal/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-charcoal/5 text-charcoal flex items-center justify-center shrink-0">
            <ShoppingBag size={16} />
          </div>
          <div className="text-xs text-charcoal">
            <span className="font-semibold block">{t('sim_grocery_equiv')}:</span>
            <span className="text-warm-grey font-mono text-[11px]">{calculated.groceries}</span>
          </div>
        </div>
        <div className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60 self-start sm:self-auto shrink-0">
          <span>⚖️ Calibrated to wholesale mandi grain rates</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Main Sponsor Button -> Opens QR Code Modal on Screen */}
        <button
          type="button"
          onClick={() => {
            if (onOpenQR) onOpenQR(amount);
            setShowQrModal(true);
          }}
          className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-charcoal text-ivory text-xs font-semibold hover:bg-black transition-all text-center flex items-center justify-center gap-2 shadow-sm active:scale-98 cursor-pointer"
        >
          <QrCode size={15} />
          <span>{t('sim_sponsor_btn')} (₹{amount.toLocaleString('en-IN')})</span>
          <ArrowRight size={14} />
        </button>

        {/* Show QR Code Button */}
        <button
          type="button"
          onClick={() => {
            if (onOpenQR) onOpenQR(amount);
            setShowQrModal(true);
          }}
          className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-white text-charcoal border border-charcoal/15 text-xs font-semibold hover:bg-warm-ivory/20 transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
        >
          <QrCode size={15} />
          <span>Show QR Code</span>
        </button>

        {/* Dedicate Drive Button */}
        <button
          type="button"
          onClick={() => {
            if (onOpenDedication) {
              onOpenDedication(amount);
            } else {
              setInternalDedicateOpen(true);
            }
          }}
          className="w-full sm:w-auto py-3.5 px-5 rounded-2xl bg-warm-ivory/40 text-charcoal border border-charcoal/10 text-xs font-semibold hover:bg-warm-ivory/70 transition-all flex items-center justify-center gap-1.5 active:scale-98 cursor-pointer"
        >
          <span>Dedicate Drive 🎂</span>
        </button>
      </div>

      <p className="text-[11px] text-warm-grey/70 text-center mt-3 flex items-center justify-center gap-1">
        <Check size={12} className="text-emerald-600" />
        100% volunteer-run — your contribution goes straight to purchasing groceries and food supplies.
      </p>

      {/* Interactive QR Code Modal Displayed on Screen */}
      <AnimatePresence>
        {showQrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowQrModal(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 16 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-sm rounded-3xl bg-[#FDFBF7] text-[#0E0D0C] p-6 sm:p-7 shadow-2xl border border-charcoal/10 z-10 my-auto text-center"
              role="dialog"
              aria-modal="true"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="absolute top-3.5 right-3.5 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full text-warm-grey hover:text-charcoal hover:bg-black/5 active:scale-95 transition-all cursor-pointer"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              {/* Badge & Amount */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[11px] font-semibold tracking-wider uppercase text-emerald-700 mb-2">
                <Sparkles size={13} /> Direct Impact Sponsorship
              </div>
              
              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal">
                Sponsor ₹{amount.toLocaleString('en-IN')}
              </h3>
              
              <p className="text-xs text-warm-grey mt-1">
                Provides {calculated.meals} wholesome meals &bull; {calculated.bowls} animal feeding bowls
              </p>

              {/* Centered High-Resolution QR Card */}
              <div className="mx-auto my-4 w-48 h-48 sm:w-56 sm:h-56 bg-white rounded-2xl p-3 shadow-inner border border-charcoal/10 flex items-center justify-center relative">
                <Image
                  src={siteConfig.upi?.qrImage || '/images/petbhar-upi-qr.png'}
                  alt="PetBhar UPI Barcode"
                  width={220}
                  height={220}
                  className="w-full h-full object-contain"
                  priority
                />
              </div>

              {/* Scan Prompt */}
              <div className="space-y-1">
                <p className="text-xs font-semibold text-charcoal">
                  Scan to pay with any UPI app
                </p>
                <p className="text-[11px] text-warm-grey">
                  Google Pay &bull; PhonePe &bull; Paytm &bull; BHIM &bull; CRED
                </p>
              </div>

              {/* Direct UPI Intent Link if on supported mobile */}
              {siteConfig.upi?.id && (
                <div className="mt-4">
                  <a
                    href={upiIntentUrl}
                    className="w-full py-3 px-4 rounded-xl bg-charcoal text-ivory text-xs font-medium flex items-center justify-center gap-2 hover:bg-black transition-colors"
                  >
                    <span>Open in UPI App (Mobile)</span>
                    <ArrowRight size={13} />
                  </a>
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="mt-4 text-xs font-semibold text-warm-grey hover:text-charcoal uppercase tracking-wider transition-colors cursor-pointer"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Dedicate Drive Modal */}
      <DedicateDriveModal
        isOpen={internalDedicateOpen}
        onClose={() => setInternalDedicateOpen(false)}
      />
    </div>
  );
}
