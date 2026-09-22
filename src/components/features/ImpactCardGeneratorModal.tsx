'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Share2, Sparkles, Palette } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ImpactCardGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMeals?: number;
}

// Utility to render text with precise, cross-browser letter-spacing on HTML5 Canvas
function drawLetterSpaced(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  spacing: number,
  align: 'center' | 'left' = 'center'
) {
  let totalWidth = 0;
  for (let i = 0; i < text.length; i++) {
    totalWidth += ctx.measureText(text[i]).width;
    if (i < text.length - 1) totalWidth += spacing;
  }
  let currentX = align === 'center' ? x - totalWidth / 2 : x;
  for (let i = 0; i < text.length; i++) {
    ctx.fillText(text[i], currentX, y);
    currentX += ctx.measureText(text[i]).width + spacing;
  }
}

export default function ImpactCardGeneratorModal({
  isOpen,
  onClose,
  defaultMeals = 5,
}: ImpactCardGeneratorModalProps) {
  const { t, locale } = useLanguage();
  const [supporterName, setSupporterName] = useState('');
  const [mealsCount, setMealsCount] = useState<number>(Math.max(1, Math.round(defaultMeals)));
  const [impactType, setImpactType] = useState<'humanity' | 'paws'>('humanity');
  const [cardTheme, setCardTheme] = useState<'alabaster' | 'obsidian'>('alabaster');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string>('');

  // Keep mealsCount in sync with defaultMeals if prop updates
  useEffect(() => {
    if (defaultMeals) {
      setMealsCount(Math.max(1, Math.round(defaultMeals)));
    }
  }, [defaultMeals]);

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

    const isAlabaster = cardTheme === 'alabaster';

    // Theme Palette Configurations
    const theme = isAlabaster
      ? {
          bgTop: '#FAF8F4',
          bgBottom: '#F2EDE4',
          watermark: 'rgba(140, 98, 57, 0.035)',
          outerBorder: 'rgba(140, 98, 57, 0.28)',
          innerBorder: 'rgba(140, 98, 57, 0.16)',
          cornerBrackets: '#8C6239',
          bronzeAccent: '#8C6239',
          bronzeLight: 'rgba(140, 98, 57, 0.12)',
          textPrimary: '#171717',
          textSecondary: '#6B6864',
          cardBg: 'rgba(255, 255, 255, 0.88)',
          cardBorder: 'rgba(140, 98, 57, 0.32)',
          shadowColor: 'rgba(140, 98, 57, 0.08)',
        }
      : {
          bgTop: '#0F0E0C',
          bgBottom: '#181614',
          watermark: 'rgba(255, 255, 255, 0.025)',
          outerBorder: 'rgba(197, 155, 109, 0.32)',
          innerBorder: 'rgba(197, 155, 109, 0.16)',
          cornerBrackets: '#C59B6D',
          bronzeAccent: '#C59B6D',
          bronzeLight: 'rgba(197, 155, 109, 0.15)',
          textPrimary: '#FAF8F4',
          textSecondary: '#A39E98',
          cardBg: 'rgba(255, 255, 255, 0.04)',
          cardBorder: 'rgba(197, 155, 109, 0.38)',
          shadowColor: 'rgba(0, 0, 0, 0.4)',
        };

    // 1. Luxury Gradient Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, theme.bgTop);
    bgGrad.addColorStop(1, theme.bgBottom);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // 2. Subtle Radial Warmth in Center
    const radialGlow = ctx.createRadialGradient(W / 2, H * 0.44, 40, W / 2, H * 0.44, 650);
    radialGlow.addColorStop(0, theme.bronzeLight);
    radialGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = radialGlow;
    ctx.fillRect(0, 0, W, H);

    // 3. Faint Brand Watermark
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = theme.watermark;
    ctx.font = '700 130px "Playfair Display", "Cinzel", "Georgia", serif';
    ctx.fillText('PETBHAR', W / 2, H * 0.48);
    ctx.restore();

    // 4. Double Hairline Architectural Framing
    // Outer Frame
    ctx.strokeStyle = theme.outerBorder;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(52, 52, W - 104, H - 104);

    // Inner Frame
    ctx.strokeStyle = theme.innerBorder;
    ctx.lineWidth = 1;
    ctx.strokeRect(68, 68, W - 136, H - 136);

    // Geometric Corner Brackets
    const bracketLen = 28;
    ctx.strokeStyle = theme.cornerBrackets;
    ctx.lineWidth = 2.5;

    // Top-Left
    ctx.beginPath();
    ctx.moveTo(42, 42 + bracketLen);
    ctx.lineTo(42, 42);
    ctx.lineTo(42 + bracketLen, 42);
    ctx.stroke();

    // Top-Right
    ctx.beginPath();
    ctx.moveTo(W - 42 - bracketLen, 42);
    ctx.lineTo(W - 42, 42);
    ctx.lineTo(W - 42, 42 + bracketLen);
    ctx.stroke();

    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(42, H - 42 - bracketLen);
    ctx.lineTo(42, H - 42);
    ctx.lineTo(42 + bracketLen, H - 42);
    ctx.stroke();

    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(W - 42 - bracketLen, H - 42);
    ctx.lineTo(W - 42, H - 42);
    ctx.lineTo(W - 42, H - 42 - bracketLen);
    ctx.stroke();

    // 5. Floating Bronze Diamond Node (from Loading Screen)
    ctx.save();
    ctx.translate(W / 2, 160);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = theme.bronzeAccent;
    ctx.fillRect(-8, -8, 16, 16);
    ctx.restore();

    // 6. Header: Primary Brand "PETBHAR"
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = theme.textPrimary;
    ctx.font = '600 52px "Playfair Display", "Cinzel", "Georgia", serif';
    drawLetterSpaced(ctx, 'PETBHAR', W / 2, 230, 8);

    // Sub-Word: "INITIATIVE"
    ctx.fillStyle = theme.bronzeAccent;
    ctx.font = '600 19px Inter, -apple-system, BlinkMacSystemFont, sans-serif';
    drawLetterSpaced(ctx, 'INITIATIVE', W / 2, 275, 14);

    // Symmetrical Hairline Accent Divider with Center Diamond
    const lineW = 180;
    ctx.strokeStyle = theme.outerBorder;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W / 2 - lineW, 315);
    ctx.lineTo(W / 2 - 14, 315);
    ctx.moveTo(W / 2 + 14, 315);
    ctx.lineTo(W / 2 + lineW, 315);
    ctx.stroke();

    // Center micro diamond
    ctx.save();
    ctx.translate(W / 2, 315);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = theme.bronzeAccent;
    ctx.fillRect(-3.5, -3.5, 7, 7);
    ctx.restore();

    // Core Brand Ethos (Food • Dignity • Animal Care)
    ctx.fillStyle = theme.textSecondary;
    ctx.font = '500 15px Inter, -apple-system, sans-serif';
    drawLetterSpaced(ctx, 'FOOD • DIGNITY • ANIMAL CARE', W / 2, 355, 6);
    ctx.restore();

    // 7. Impact Category Badge
    const badgeText = impactType === 'humanity'
      ? (locale === 'hi' ? 'मानवता भोजन सेवा' : 'HUMANITY MEALS DRIVE')
      : (locale === 'hi' ? 'पेटभर पॉज़ बेजुबान सेवा' : 'PETBHAR PAWS ANIMAL CARE');

    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = '600 17px Inter, -apple-system, sans-serif';
    const badgeWidth = ctx.measureText(badgeText).width + 70;
    
    // Badge pill container
    ctx.fillStyle = isAlabaster ? 'rgba(140, 98, 57, 0.08)' : 'rgba(197, 155, 109, 0.12)';
    ctx.strokeStyle = isAlabaster ? 'rgba(140, 98, 57, 0.3)' : 'rgba(197, 155, 109, 0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(W / 2 - badgeWidth / 2, 420, badgeWidth, 38, [19]);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = theme.bronzeAccent;
    drawLetterSpaced(ctx, badgeText, W / 2, 445, 3);
    ctx.restore();

    // 8. Lead Statement
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = theme.textPrimary;
    ctx.font = '400 38px "Playfair Display", "Cinzel", "Georgia", serif';
    ctx.fillText(locale === 'hi' ? 'आज मैंने सहयोग दिया' : 'Today I supported', W / 2, 535);
    ctx.restore();

    // 9. Central Elevated Focal Card
    const cardX = 140;
    const cardY = 590;
    const cardW = W - 280; // 800px wide
    const cardH = 430;

    // Card shadow
    ctx.save();
    ctx.shadowColor = theme.shadowColor;
    ctx.shadowBlur = 40;
    ctx.shadowOffsetY = 16;
    ctx.fillStyle = theme.cardBg;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, [28]);
    ctx.fill();
    ctx.restore();

    // Card border
    ctx.strokeStyle = theme.cardBorder;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, [28]);
    ctx.stroke();

    // Inside Central Card
    ctx.save();
    ctx.textAlign = 'center';

    // A. Big Elegant Integer Number
    const safeCount = Math.max(1, Math.round(mealsCount || 1));
    ctx.fillStyle = theme.textPrimary;
    ctx.font = '600 155px "Playfair Display", "Cinzel", "Georgia", serif';
    ctx.fillText(safeCount.toLocaleString('en-IN'), W / 2, cardY + 185);

    // B. Unit Description
    const unitText = impactType === 'humanity'
      ? (safeCount === 1 ? 'FRESH MEAL' : 'FRESH MEALS')
      : (safeCount === 1 ? 'STRAY ANIMAL MEAL' : 'STRAY ANIMAL MEALS');

    ctx.fillStyle = theme.bronzeAccent;
    ctx.font = '600 24px Inter, -apple-system, sans-serif';
    drawLetterSpaced(ctx, unitText, W / 2, cardY + 250, 7);

    // C. Micro divider inside card
    ctx.strokeStyle = isAlabaster ? 'rgba(140, 98, 57, 0.25)' : 'rgba(197, 155, 109, 0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 60, cardY + 295);
    ctx.lineTo(W / 2 + 60, cardY + 295);
    ctx.stroke();

    // D. Grounded Grassroots Motto
    ctx.fillStyle = theme.textSecondary;
    ctx.font = 'italic 23px "Playfair Display", "Cinzel", "Georgia", serif';
    ctx.fillText(
      impactType === 'humanity'
        ? (locale === 'hi' ? 'कोई भी भूखा न सोए' : 'No one should sleep hungry')
        : (locale === 'hi' ? 'बेजुबान पशुओं के लिए स्वच्छ आहार' : 'Daily nourishment for street animals'),
      W / 2,
      cardY + 355
    );
    ctx.restore();

    // 10. Supporter Section
    ctx.save();
    ctx.textAlign = 'center';

    // "SUPPORTED BY" Label
    ctx.fillStyle = theme.textSecondary;
    ctx.font = '500 17px Inter, -apple-system, sans-serif';
    drawLetterSpaced(ctx, locale === 'hi' ? 'सहयोगी' : 'SUPPORTED WITH KINDNESS BY', W / 2, 1145, 6);

    // Supporter Name
    const displayName = supporterName.trim() || (locale === 'hi' ? 'एक सजग सहयोगी' : 'A Kind Supporter');
    ctx.fillStyle = theme.textPrimary;
    ctx.font = '600 52px "Playfair Display", "Cinzel", "Georgia", serif';
    ctx.fillText(displayName, W / 2, 1225);

    // Date & Grassroots Tag
    const today = new Date().toLocaleDateString(locale === 'hi' ? 'hi-IN' : 'en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    ctx.fillStyle = theme.bronzeAccent;
    ctx.font = '500 19px Inter, -apple-system, sans-serif';
    ctx.fillText(`Community Feeding Drive • ${today}`, W / 2, 1285);
    ctx.restore();

    // 11. Footer Section
    // Divider line
    ctx.strokeStyle = theme.innerBorder;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(220, 1380);
    ctx.lineTo(W - 220, 1380);
    ctx.stroke();

    ctx.save();
    ctx.textAlign = 'center';

    // Movement invitation
    ctx.fillStyle = theme.textPrimary;
    ctx.font = '400 28px "Playfair Display", "Cinzel", "Georgia", serif';
    ctx.fillText(
      locale === 'hi' ? 'आप भी इस ज़मीनी सेवा का हिस्सा बनें' : 'Join the grassroots movement to end hunger',
      W / 2,
      1455
    );

    // Social handle & domain
    ctx.fillStyle = theme.bronzeAccent;
    ctx.font = '600 25px Inter, -apple-system, sans-serif';
    drawLetterSpaced(ctx, '@petbharinitiative', W / 2, 1515, 3);

    ctx.fillStyle = theme.textSecondary;
    ctx.font = '400 19px Inter, -apple-system, sans-serif';
    ctx.fillText('petbharinitiative.vercel.app', W / 2, 1560);

    // Bottom Decorative Hairline Accent & Floating Diamond
    ctx.save();
    ctx.translate(W / 2, 1680);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = theme.bronzeAccent;
    ctx.fillRect(-4.5, -4.5, 9, 9);
    ctx.restore();

    ctx.strokeStyle = theme.innerBorder;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 120, 1680);
    ctx.lineTo(W / 2 - 16, 1680);
    ctx.moveTo(W / 2 + 16, 1680);
    ctx.lineTo(W / 2 + 120, 1680);
    ctx.stroke();

    // Motto
    ctx.fillStyle = theme.textPrimary;
    ctx.font = 'italic 25px "Playfair Display", "Cinzel", "Georgia", serif';
    ctx.fillText('Food. Dignity. Hope.', W / 2, 1745);

    ctx.restore();

    // Generate Download Data URL
    try {
      setDownloadUrl(canvas.toDataURL('image/png'));
    } catch {
      // ignore
    }
  }, [supporterName, mealsCount, impactType, cardTheme, locale]);

  // Re-render canvas whenever dependencies change or fonts finish loading
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
    const safeCount = Math.max(1, Math.round(mealsCount || 1));
    const text = encodeURIComponent(
      `I just supported ${safeCount} ${impactType === 'humanity' ? 'fresh meals' : 'stray animal meals'} with PetBhar Initiative! See their ground work: https://petbharinitiative.vercel.app`
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
          className="relative bg-[#FAF8F4] rounded-3xl shadow-2xl border border-[#8C6239]/20 max-w-2xl w-full p-6 sm:p-8 z-10 my-auto max-h-[92vh] overflow-y-auto overscroll-contain"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 w-10 h-10 flex items-center justify-center rounded-full bg-charcoal/5 hover:bg-charcoal/10 text-charcoal transition-colors z-20"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          {/* Header Title */}
          <div className="text-center mb-6 pr-8">
            <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-[#8C6239] bg-[#8C6239]/10 border border-[#8C6239]/25 px-3 py-1 rounded-full font-semibold mb-2">
              <Sparkles size={12} /> {locale === 'hi' ? 'सोशल शेयर कार्ड' : 'Social Impact Story Card'}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-charcoal font-normal">
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
              {/* Theme Selector */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-charcoal mb-1.5 flex items-center gap-1.5">
                  <Palette size={12} className="text-[#8C6239]" /> Luxury Card Style
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setCardTheme('alabaster')}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all flex items-center justify-center gap-2 ${
                      cardTheme === 'alabaster'
                        ? 'bg-white text-charcoal border-[#8C6239] shadow-sm font-semibold'
                        : 'bg-white/50 text-warm-grey border-charcoal/10 hover:border-charcoal/25'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full bg-[#FAF8F4] border border-[#8C6239]/40" />
                    <span>Alabaster Silk</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCardTheme('obsidian')}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all flex items-center justify-center gap-2 ${
                      cardTheme === 'obsidian'
                        ? 'bg-[#181614] text-[#FAF8F4] border-[#C59B6D] shadow-sm font-semibold'
                        : 'bg-white/50 text-warm-grey border-charcoal/10 hover:border-charcoal/25'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full bg-[#11100E] border border-[#C59B6D]/40" />
                    <span>Obsidian Bronze</span>
                  </button>
                </div>
              </div>

              {/* Supporter Name */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-charcoal mb-1.5">
                  {t('card_name_label')}
                </label>
                <input
                  type="text"
                  maxLength={36}
                  value={supporterName}
                  onChange={(e) => setSupporterName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full bg-white border border-charcoal/15 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-charcoal focus:border-[#8C6239] outline-none min-h-[44px]"
                />
              </div>

              {/* Cause Type */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-charcoal mb-1.5">
                  {locale === 'hi' ? 'सेवा का प्रकार' : 'Impact Focus'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setImpactType('humanity')}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                      impactType === 'humanity'
                        ? 'bg-charcoal text-ivory border-charcoal shadow-xs font-semibold'
                        : 'bg-white text-charcoal border-charcoal/15 hover:border-charcoal/30'
                    }`}
                  >
                    {t('card_type_humanity')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setImpactType('paws')}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all ${
                      impactType === 'paws'
                        ? 'bg-charcoal text-ivory border-charcoal shadow-xs font-semibold'
                        : 'bg-white text-charcoal border-charcoal/15 hover:border-charcoal/30'
                    }`}
                  >
                    {t('card_type_paws')}
                  </button>
                </div>
              </div>

              {/* Meal Count Presets */}
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
                          ? 'bg-[#8C6239] text-white border-[#8C6239]'
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
                    step="1"
                    value={mealsCount}
                    onChange={(e) => setMealsCount(Math.max(1, Math.floor(parseInt(e.target.value, 10) || 1)))}
                    placeholder="Custom count"
                    className="w-full bg-white border border-charcoal/15 rounded-xl px-3.5 py-2 text-base sm:text-sm text-charcoal focus:border-[#8C6239] outline-none"
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
                    : '📱 Optimized 1080×1920 vertical format for Instagram Stories & WhatsApp Status.'}
                </p>
              </div>
            </div>

            {/* Right Column: Live Canvas Preview */}
            <div className="flex flex-col items-center">
              <span className="text-[11px] font-semibold text-warm-grey uppercase tracking-wider mb-2">
                {locale === 'hi' ? 'लाइव प्रीव्यू' : 'Live Story Preview'}
              </span>
              <div className="relative w-[210px] sm:w-[230px] aspect-[9/16] rounded-2xl overflow-hidden shadow-2xl border-2 border-[#8C6239]/30 bg-black">
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
