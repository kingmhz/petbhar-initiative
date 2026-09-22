'use client';

import { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

interface ImpactCounterProps {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
}

export function ImpactCounter({
  value,
  label,
  prefix = '',
  suffix = '',
}: ImpactCounterProps) {
  // Initialize with real value so SSR and static HTML never flash or stick to 0
  const [count, setCount] = useState<number>(value);
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px' });

  useEffect(() => {
    // Only animate on client mount once when entering view
    if (!isInView || hasAnimated || value <= 0) return;

    setHasAnimated(true);
    setCount(0);

    const duration = 1200;
    const startTime = performance.now();
    let frameId: number;

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.floor(easeProgress * value));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        setCount(value);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, [isInView, value, hasAnimated]);

  const formattedDisplay = (num: number) => {
    return num.toLocaleString('en-IN');
  };

  // Only append "+" if value is large enough (>= 100), otherwise exact count is much more honest and grounded
  const activeSuffix = (suffix === '+' && value < 100) ? '' : suffix;

  return (
    <div ref={ref} className="flex flex-col items-center justify-center p-2">
      <span className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-2 font-light text-ivory tracking-tight">
        {prefix}{formattedDisplay(count)}{activeSuffix}
      </span>
      <span className="text-xs sm:text-sm uppercase tracking-wider text-ivory/70 text-center font-medium">
        {label}
      </span>
    </div>
  );
}

export default ImpactCounter;
