'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LuxuryLoadingScreenProps {
  /** Force the loader to show even if user visited during this session */
  alwaysShow?: boolean;
  /** Curtain style: 'split' (theatrical left/right parting) or 'lift' (upward silk wipe) */
  curtainStyle?: 'split' | 'lift';
  /** Optional callback fired when curtain finishes opening */
  onComplete?: () => void;
}

const WORD_MAIN = 'PETBHAR';
const WORD_SUB = 'INITIATIVE';

export default function LuxuryLoadingScreen({
  alwaysShow = false,
  curtainStyle = 'split',
  onComplete,
}: LuxuryLoadingScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    // Check if visitor has already seen the intro in this browser session
    if (!alwaysShow) {
      try {
        if (sessionStorage.getItem('petbhar_intro_seen') === 'true') {
          setIsVisible(false);
          if (onComplete) onComplete();
          return;
        }
      } catch {}
    }

    // Lock body scrolling while loader is active
    document.body.style.overflow = 'hidden';

    // Choreography sequence:
    // 0.0s - 0.5s: PETBHAR letters drop one by one
    // 0.5s - 0.9s: INITIATIVE letters drop one by one
    // 1.0s: Hairline & values fade in
    // 1.55s: Theatrical curtain opening starts
    // 2.35s: Component unmounts and body scroll is restored

    const openTimer = setTimeout(() => {
      setIsOpening(true);
    }, 1550);

    const finishTimer = setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = '';
      try {
        sessionStorage.setItem('petbhar_intro_seen', 'true');
      } catch {}
      if (onComplete) onComplete();
    }, 2350);

    return () => {
      clearTimeout(openTimer);
      clearTimeout(finishTimer);
      document.body.style.overflow = '';
    };
  }, [alwaysShow, onComplete]);

  const handleSkip = () => {
    setIsOpening(true);
    setTimeout(() => {
      setIsVisible(false);
      document.body.style.overflow = '';
      try {
        sessionStorage.setItem('petbhar_intro_seen', 'true');
      } catch {}
      if (onComplete) onComplete();
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] pointer-events-none select-none overflow-hidden"
      role="status"
      aria-live="polite"
      aria-label="Loading PetBhar Initiative"
    >
      {/* ===================================================
          THEATRICAL CURTAIN PANELS (Alabaster Silk #FAF8F4)
          =================================================== */}
      {curtainStyle === 'split' ? (
        <>
          {/* Left Curtain Panel: Slides left (-100%) */}
          <motion.div
            initial={{ x: '0%' }}
            animate={{ x: isOpening ? '-100%' : '0%' }}
            transition={{
              duration: 0.85,
              ease: [0.77, 0, 0.175, 1],
            }}
            className="absolute top-0 bottom-0 left-0 w-1/2 bg-[#FAF8F4] border-r border-[#8C6239]/15 shadow-2xl pointer-events-auto"
          />

          {/* Right Curtain Panel: Slides right (+100%) */}
          <motion.div
            initial={{ x: '0%' }}
            animate={{ x: isOpening ? '100%' : '0%' }}
            transition={{
              duration: 0.85,
              ease: [0.77, 0, 0.175, 1],
            }}
            className="absolute top-0 bottom-0 right-0 w-1/2 bg-[#FAF8F4] border-l border-[#8C6239]/15 shadow-2xl pointer-events-auto"
          />
        </>
      ) : (
        /* Single Upward Silk Lift Panel */
        <motion.div
          initial={{ y: '0%' }}
          animate={{ y: isOpening ? '-100%' : '0%' }}
          transition={{
            duration: 0.8,
            ease: [0.76, 0, 0.24, 1],
          }}
          className="absolute inset-0 bg-[#FAF8F4] border-b-2 border-[#8C6239]/25 shadow-2xl pointer-events-auto"
        />
      )}

      {/* ===================================================
          FLOATING BRAND MARK (Fades out softly as curtain parts)
          =================================================== */}
      <motion.div
        animate={{
          opacity: isOpening ? 0 : 1,
          scale: isOpening ? 0.96 : 1,
        }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-6 pointer-events-none"
      >
        {/* Subtle Watermark in Canvas */}
        <div className="absolute font-serif text-[clamp(60px,12vw,120px)] font-bold text-black/[0.025] tracking-[0.25em] select-none pointer-events-none">
          PETBHAR
        </div>

        {/* Minimalist Skip Button */}
        <button
          type="button"
          onClick={handleSkip}
          className="absolute top-6 right-6 text-[10px] uppercase tracking-[0.25em] text-[#737373] hover:text-[#171717] px-3.5 py-1.5 rounded-full border border-black/10 hover:border-black/25 transition-all cursor-pointer pointer-events-auto"
        >
          Skip &rarr;
        </button>

        {/* Floating Bronze Diamond Node */}
        <motion.div
          initial={{ opacity: 0, scale: 0.4, rotate: 45 }}
          animate={{ opacity: 1, scale: 1, rotate: 45 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="w-3 h-3 bg-[#8C6239] shadow-[0_0_14px_rgba(140,98,57,0.35)] mb-5 rounded-xs"
        />

        {/* 1. Primary Word: PETBHAR (Letters drop one by one) */}
        <div className="flex items-center justify-center mb-1 overflow-hidden">
          {WORD_MAIN.split('').map((letter, idx) => (
            <motion.span
              key={`main-${idx}`}
              initial={{ opacity: 0, y: -50, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                duration: 0.42,
                delay: 0.12 + idx * 0.045, // 45ms stagger per letter
                ease: [0.215, 0.61, 0.355, 1], // Organic fluid settling
              }}
              className="font-serif text-[clamp(30px,4.5vw,44px)] font-normal text-[#171717] mx-[0.06em] tracking-normal"
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* 2. Sub-Word: INITIATIVE (Letters drop one by one) */}
        <div className="flex items-center justify-center mb-5 overflow-hidden">
          {WORD_SUB.split('').map((letter, idx) => (
            <motion.span
              key={`sub-${idx}`}
              initial={{ opacity: 0, y: -24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.38,
                delay: 0.48 + idx * 0.035, // 35ms stagger
                ease: [0.215, 0.61, 0.355, 1],
              }}
              className="font-sans text-[11px] font-medium uppercase tracking-[0.38em] text-[#8C6239] ml-[0.38em]"
            >
              {letter}
            </motion.span>
          ))}
        </div>

        {/* 3. Hairline Symmetrical Bronze Accent Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.55, delay: 0.95, ease: [0.16, 1, 0.3, 1] }}
          className="w-36 h-[1px] bg-[#8C6239]/30 relative mb-3.5 origin-center"
        >
          <div className="absolute left-1/2 -top-[2px] -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#8C6239]" />
        </motion.div>

        {/* 4. Core Brand Ethos (No city mention) */}
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
          className="text-[10px] uppercase tracking-[0.32em] text-[#737373] font-medium"
        >
          Food &bull; Dignity &bull; Animal Care
        </motion.p>
      </motion.div>
    </div>
  );
}
