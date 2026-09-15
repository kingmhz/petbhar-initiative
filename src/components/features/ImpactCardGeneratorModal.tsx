'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ImpactCardGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMeals?: number;
}

export default function ImpactCardGeneratorModal({
  isOpen,
  onClose,
  defaultMeals = 5,
}: ImpactCardGeneratorModalProps) {
  const { t, locale } = useLanguage();
  const [supporterName, setSupporterName] = useState('');
  const [mealsCount, setMealsCount] = useState(defaultMeals);
  const [impactType, setImpactType] = useState<'humanity' | 'paws'>('humanity');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string>('');

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High resolution 1080 x 1920 (9:16 vertical Instagram Story / WhatsApp Status)
    const W = 1080;
    const H = 1920;
    canvas.width = W;
    canvas.height = H;

    // 1. Background Luxury Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#0D0D0B');
    bgGrad.addColorStop(0.5, '#171714');
    bgGrad.addColorStop(1, '#080807');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // 2. Radial warm glow in center
    const glow = ctx.createRadialGradient(W / 2, H * 0.45, 50, W / 2, H * 0.45, 600);
    glow.addColorStop(0, 'rgba(217, 119, 6, 0.15)');
    glow.addColorStop(0.5, 'rgba(217, 119, 6, 0.04)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    // 3. Elegant Outer & Inner Border Frame
    ctx.strokeStyle = 'rgba(244, 241, 233, 0.15)';
    ctx.lineWidth = 3;
    ctx.strokeRect(50, 50, W - 100, H - 100);

    ctx.strokeStyle = 'rgba(217, 119, 6, 0.3)';
    ctx.lineWidth = 1;
    ctx.strokeRect(65, 65, W - 130, H - 130);

    // Corner Accents
    const cornerSize = 25;
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 3;
    // Top-left
    ctx.beginPath();
    ctx.moveTo(40, 40 + cornerSize);
    ctx.lineTo(40, 40);
    ctx.lineTo(40 + cornerSize, 40);
    ctx.stroke();
    // Top-right
    ctx.beginPath();
    ctx.moveTo(W - 40 - cornerSize, 40);
    ctx.lineTo(W - 40, 40);
    ctx.lineTo(W - 40, 40 + cornerSize);
    ctx.stroke();
    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(40, H - 40 - cornerSize);
    ctx.lineTo(40, H - 40);
    ctx.lineTo(40 + cornerSize, H - 40);
    ctx.stroke();
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(W - 40 - cornerSize, H - 40);
    ctx.lineTo(W - 40, H - 40);
    ctx.lineTo(W - 40, H - 40 - cornerSize);
    ctx.stroke();

    // 4. Header Branding
    ctx.textAlign = 'center';
    ctx.fillStyle = '#F4F1E9';
    ctx.font = 'bold 54px "Playfair Display", serif, Georgia';
    ctx.fillText('PETBHAR', W / 2, 220);

    ctx.fillStyle = 'rgba(244, 241, 233, 0.6)';
    ctx.font = '500 22px Inter, sans-serif';
    try {
      (ctx as unknown as { letterSpacing?: string }).letterSpacing = '12px';
    } catch {}
    ctx.fillText('I N I T I A T I V E', W / 2, 265);

    // Gold separator line
    ctx.strokeStyle = 'rgba(217, 119, 6, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 80, 310);
    ctx.lineTo(W / 2 + 80, 310);
    ctx.stroke();

    // 5. Impact Category Badge
    const badgeText = impactType === 'humanity' 
      ? (locale === 'hi' ? 'मानवता भोजन सेवा' : 'HUMANITY MEALS DRIVE')
      : (locale === 'hi' ? 'पेटभर पॉज़ बेजुबान पशु सेवा' : 'PETBHAR PAWS ANIMAL CARE');
    ctx.fillStyle = '#D97706';
    ctx.font = '600 20px Inter, sans-serif';
    ctx.fillText(badgeText, W / 2, 420);

    // 6. Lead Statement
    ctx.fillStyle = 'rgba(244, 241, 233, 0.85)';
    ctx.font = '300 42px "Playfair Display", serif';
    ctx.fillText(locale === 'hi' ? 'आज मैंने सहयोग दिया' : 'Today I supported', W / 2, 530);

    // 7. Focal Number & Metric Box
    const countText = String(mealsCount || 1);
    const unitText = impactType === 'humanity' 
      ? (locale === 'hi' ? 'ताज़ा भोजन थालियां' : 'FRESH MEALS') 
      : (locale === 'hi' ? 'श्वान आहार कटोरे' : 'STRAY DOG MEALS');

    // Box background
    ctx.fillStyle = 'rgba(244, 241, 233, 0.04)';
    ctx.strokeStyle = 'rgba(217, 119, 6, 0.35)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(160, 600, W - 320, 420, [30]);
    ctx.fill();
    ctx.stroke();

    // Big Number
    ctx.fillStyle = '#F4F1E9';
    ctx.font = '700 160px "Playfair Display", serif';
    ctx.fillText(countText, W / 2, 790);

    // Unit description
    ctx.fillStyle = '#D97706';
    ctx.font = '600 32px Inter, sans-serif';
    ctx.fillText(unitText, W / 2, 880);

    ctx.fillStyle = 'rgba(244, 241, 233, 0.5)';
    ctx.font = 'italic 26px "Playfair Display", serif';
    ctx.fillText(locale === 'hi' ? 'ज़रूरतमंदों के पेट भरने हेतु' : 'No one should sleep hungry', W / 2, 940);

    // 8. Supporter Name
    const displayName = supporterName.trim() || (locale === 'hi' ? 'एक सजग सहयोगी' : 'A Kind Heart');
    ctx.fillStyle = 'rgba(244, 241, 233, 0.6)';
    ctx.font = '500 24px Inter, sans-serif';
    ctx.fillText(locale === 'hi' ? 'सेवा सहयोगी' : 'SUPPORTED BY', W / 2, 1150);

    ctx.fillStyle = '#F4F1E9';
    ctx.font = '600 58px "Playfair Display", serif';
    ctx.fillText(displayName, W / 2, 1230);

    // 9. Verified Seal & Date
    const today = new Date().toLocaleDateString(locale === 'hi' ? 'hi-IN' : 'en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    ctx.fillStyle = 'rgba(244, 241, 233, 0.5)';
    ctx.font = '400 24px Inter, sans-serif';
    ctx.fillText(`Verified Impact • ${today}`, W / 2, 1310);

    // 10. Call to action footer
    ctx.strokeStyle = 'rgba(244, 241, 233, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(200, 1420);
    ctx.lineTo(W - 200, 1420);
    ctx.stroke();

    ctx.fillStyle = '#F4F1E9';
    ctx.font = '400 30px "Playfair Display", serif';
    ctx.fillText(locale === 'hi' ? 'आप भी इस सेवा का हिस्सा बनें' : 'Join the movement to end hunger', W / 2, 1500);

    ctx.fillStyle = '#D97706';
    ctx.font = '600 28px Inter, sans-serif';
    ctx.fillText('@petbharinitiative', W / 2, 1560);

    ctx.fillStyle = 'rgba(244, 241, 233, 0.4)';
    ctx.font = '400 22px Inter, sans-serif';
    ctx.fillText('www.petbhar.org', W / 2, 1610);

    // Footer Motto
    ctx.fillStyle = 'rgba(244, 241, 233, 0.7)';
    ctx.font = 'italic 28px "Playfair Display", serif';
    ctx.fillText('Food. Dignity. Hope.', W / 2, 1780);

    // Update download URL
    try {
      setDownloadUrl(canvas.toDataURL('image/png'));
    } catch {
      // ignore
    }
  }, [supporterName, mealsCount, impactType, locale]);

  useEffect(() => {
    if (isOpen) {
      if (typeof document !== 'undefined' && document.fonts) {
        document.fonts.ready.then(() => {
          renderCanvas();
        });
      } else {
        setTimeout(renderCanvas, 50);
      }
    }
  }, [isOpen, renderCanvas]);

  if (!isOpen) return null;

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `I just supported ${mealsCount} ${impactType === 'humanity' ? 'fresh meals' : 'stray animal meals'} with PetBhar Initiative! Check out their work and join the movement: https://petbhar.org`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-charcoal/85 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative bg-ivory rounded-3xl shadow-2xl border border-charcoal/10 max-w-2xl w-full p-6 sm:p-8 z-10 my-auto max-h-[92vh] overflow-y-auto overscroll-contain"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 w-10 h-10 flex items-center justify-center rounded-full bg-charcoal/5 hover:bg-charcoal/10 text-charcoal transition-colors z-20"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          {/* Title */}
          <div className="text-center mb-6 pr-8">
            <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-amber-700 bg-amber-50 border border-amber-200/60 px-3 py-1 rounded-full font-semibold mb-2">
              <Sparkles size={12} /> {locale === 'hi' ? 'सोशल शेयर कार्ड' : 'Instagram Story & WhatsApp Card'}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-charcoal font-medium">
              {t('card_title')}
            </h2>
            <p className="text-xs sm:text-sm text-charcoal/70 mt-1 max-w-md mx-auto">
              {t('card_subtitle')}
            </p>
          </div>

          {/* Controls & Canvas Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left Column: Form Controls */}
            <div className="space-y-4 text-left">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-charcoal mb-1.5">
                  {t('card_name_label')}
                </label>
                <input
                  type="text"
                  maxLength={40}
                  value={supporterName}
                  onChange={(e) => setSupporterName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full bg-white border border-charcoal/15 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-charcoal focus:border-charcoal outline-none min-h-[44px]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-charcoal mb-1.5">
                  {locale === 'hi' ? 'सेवा का प्रकार' : 'Impact Focus'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setImpactType('humanity')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      impactType === 'humanity'
                        ? 'bg-charcoal text-ivory border-charcoal shadow-xs'
                        : 'bg-white text-charcoal border-charcoal/15 hover:border-charcoal/30'
                    }`}
                  >
                    {t('card_type_humanity')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setImpactType('paws')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      impactType === 'paws'
                        ? 'bg-charcoal text-ivory border-charcoal shadow-xs'
                        : 'bg-white text-charcoal border-charcoal/15 hover:border-charcoal/30'
                    }`}
                  >
                    {t('card_type_paws')}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-charcoal mb-1.5">
                  {t('card_meals_label')}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 5, 10, 25].map((cnt) => (
                    <button
                      type="button"
                      key={cnt}
                      onClick={() => setMealsCount(cnt)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                        mealsCount === cnt
                          ? 'bg-charcoal text-ivory border-charcoal'
                          : 'bg-white text-charcoal border-charcoal/15 hover:border-charcoal/30'
                      }`}
                    >
                      {cnt}
                    </button>
                  ))}
                </div>
                <div className="mt-2">
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={mealsCount}
                    onChange={(e) => setMealsCount(parseInt(e.target.value) || 1)}
                    placeholder="Custom count"
                    className="w-full bg-white border border-charcoal/15 rounded-xl px-3.5 py-2 text-base sm:text-sm text-charcoal focus:border-charcoal outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 space-y-2">
                {downloadUrl && (
                  <a
                    href={downloadUrl}
                    download={`petbhar-impact-${supporterName ? supporterName.toLowerCase().replace(/\s+/g, '-') : 'story'}.png`}
                    className="w-full bg-charcoal text-ivory py-3 px-4 rounded-xl text-xs uppercase tracking-wider font-semibold hover:bg-black transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 min-h-[46px]"
                  >
                    <Download size={15} />
                    <span>{t('card_download')}</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="w-full bg-[#25D366] hover:bg-[#1EBE5D] text-white py-3 px-4 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 min-h-[46px]"
                >
                  <Share2 size={15} />
                  <span>{t('card_share')}</span>
                </button>

                <p className="text-[11px] text-warm-grey text-center pt-1">
                  {locale === 'hi' 
                    ? '📱 1080×1920 वर्टिकल फॉर्मेट – इंस्टाग्राम स्टोरीज़ और व्हाट्सएप स्टेटस के लिए बिल्कुल उपयुक्त।'
                    : '📱 Optimized 1080×1920 vertical format for Instagram Stories and WhatsApp Status.'}
                </p>
              </div>
            </div>

            {/* Right Column: Live Canvas Preview */}
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-semibold text-warm-grey uppercase tracking-wider mb-2">
                {locale === 'hi' ? 'लाइव प्रीव्यू' : 'Live Story Preview'}
              </span>
              <div className="relative w-[210px] sm:w-[230px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl border-2 border-charcoal/20 bg-black">
                <canvas
                  ref={canvasRef}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
