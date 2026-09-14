'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Heart, Sparkles, ChevronLeft, ChevronRight, Calendar, MapPin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface CaseStory {
  id: string;
  name: string;
  species: string;
  duration: string;
  location: string;
  summary: string;
  beforeImg: string;
  afterImg: string;
  beforeCaption: string;
  afterCaption: string;
}

const CASES: CaseStory[] = [
  {
    id: 'case-sheru',
    name: 'Sheru',
    species: 'Street Dog',
    duration: '6 Weeks of Daily Nutrition & Care',
    location: 'Jaipur Highway Sector',
    summary: 'Found collapsed and severely emaciated due to acute hunger. Our team initiated twice-daily boiled egg broths, fresh rice, and antibiotic wound dressing.',
    beforeImg: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=1000&q=80',
    afterImg: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=1000&q=80',
    beforeCaption: 'Weak, dehydrated & malnourished',
    afterCaption: 'Playful, vibrant & nourished',
  },
  {
    id: 'case-moti',
    name: 'Moti & Siblings',
    species: 'Litter of 4 Pups',
    duration: '1 Month of High-Protein Meals',
    location: 'Old City Chowk',
    summary: 'Mother dog had passed away. The 4 pups were rescued by PetBhar volunteers and fed puppy-safe warm porridge and vitamin-rich nourishment daily.',
    beforeImg: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=1000&q=80',
    afterImg: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=1000&q=80',
    beforeCaption: 'Hungry orphan litter on street corner',
    afterCaption: 'Healthy, active and adopted locally',
  },
];

export default function BeforeAfterSlider() {
  const { t } = useLanguage();
  const [activeCaseIndex, setActiveCaseIndex] = useState(0);
  const [sliderPos, setSliderPos] = useState(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentCase = CASES[activeCaseIndex];

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    handleMove(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setSliderPos((prev) => Math.max(0, prev - 5));
    } else if (e.key === 'ArrowRight') {
      setSliderPos((prev) => Math.min(100, prev + 5));
    }
  };

  return (
    <div className="w-full bg-linear-to-br from-warm-ivory/30 to-cream/20 rounded-3xl border border-charcoal/10 p-6 sm:p-8 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold uppercase tracking-wider mb-2">
            <Heart size={13} className="text-amber-800" /> {t('ba_title')}
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal">
            {t('ba_title')}
          </h3>
          <p className="text-xs sm:text-sm text-warm-grey mt-1">
            {t('ba_subtitle')}
          </p>
        </div>

        {/* Case Switcher Tabs */}
        <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-charcoal/10 shrink-0">
          {CASES.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setActiveCaseIndex(i);
                setSliderPos(50);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                activeCaseIndex === i
                  ? 'bg-charcoal text-ivory shadow-xs'
                  : 'text-warm-grey hover:text-charcoal'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Case Details Badge Strip */}
      <div className="flex flex-wrap items-center gap-2.5 mb-4 text-xs">
        <span className="font-serif font-bold text-charcoal text-sm">{currentCase.name}</span>
        <span className="text-[11px] bg-charcoal/5 text-warm-grey px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1">
          <Calendar size={11} /> {currentCase.duration}
        </span>
        <span className="text-[11px] bg-charcoal/5 text-warm-grey px-2.5 py-0.5 rounded-full font-medium flex items-center gap-1">
          <MapPin size={11} /> {currentCase.location}
        </span>
      </div>

      {/* Interactive Split Slider Box */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="slider"
        aria-valuenow={Math.round(sliderPos)}
        aria-label="Before and after transformation comparison slider"
        className="relative w-full aspect-16/10 sm:aspect-16/9 rounded-2xl overflow-hidden cursor-ew-resize select-none border border-charcoal/15 shadow-md touch-none focus:outline-hidden focus:ring-2 focus:ring-charcoal/20"
      >
        {/* Right Image (AFTER) — Base Layer */}
        <div className="absolute inset-0">
          <Image
            src={currentCase.afterImg}
            alt={`${currentCase.name} - ${t('ba_after')}`}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover"
            priority
          />
          {/* Label Right */}
          <div className="absolute top-4 right-4 bg-emerald-900/80 backdrop-blur-xs text-white text-[10px] sm:text-xs font-semibold px-3 py-1.5 rounded-full shadow-md pointer-events-none flex items-center gap-1.5">
            <Sparkles size={12} className="text-emerald-300" />
            <span>{t('ba_after')}</span>
          </div>
          {/* Caption Right */}
          <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-xs text-white text-[10px] sm:text-xs px-3 py-1.5 rounded-xl shadow-md pointer-events-none max-w-xs text-right hidden sm:block">
            {currentCase.afterCaption}
          </div>
        </div>

        {/* Left Image (BEFORE) — Clipped Overlay Layer */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
        >
          <Image
            src={currentCase.beforeImg}
            alt={`${currentCase.name} - ${t('ba_before')}`}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover grayscale-25"
            priority
          />
          {/* Label Left */}
          <div className="absolute top-4 left-4 bg-charcoal/80 backdrop-blur-xs text-white text-[10px] sm:text-xs font-semibold px-3 py-1.5 rounded-full shadow-md pointer-events-none">
            <span>{t('ba_before')}</span>
          </div>
          {/* Caption Left */}
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-xs text-white text-[10px] sm:text-xs px-3 py-1.5 rounded-xl shadow-md pointer-events-none max-w-xs hidden sm:block">
            {currentCase.beforeCaption}
          </div>
        </div>

        {/* Divider Handle */}
        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl pointer-events-none"
          style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-xl border border-charcoal/10 flex items-center justify-center text-charcoal">
            <div className="flex items-center gap-0.5 text-xs text-charcoal font-bold">
              <ChevronLeft size={13} />
              <ChevronRight size={13} />
            </div>
          </div>
        </div>
      </div>

      {/* Case Story Summary */}
      <p className="text-xs text-warm-grey mt-4 leading-relaxed bg-white p-3.5 rounded-xl border border-charcoal/5">
        <span className="font-semibold text-charcoal">Rescue Note:</span> {currentCase.summary}
      </p>
    </div>
  );
}
