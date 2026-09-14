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
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!isInView || value === 0) return;

    const duration = 1800;
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
  }, [isInView, value]);

  const formattedDisplay = (num: number) => {
    return num.toLocaleString('en-IN');
  };

  if (value === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-2">
        <span className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-2 font-light text-ivory tracking-tight">
          0+
        </span>
        <span className="text-xs sm:text-sm uppercase tracking-wider text-ivory/70 text-center font-medium">
          {label}
        </span>
      </div>
    );
  }

  return (
    <div ref={ref} className="flex flex-col items-center justify-center p-2">
      <span className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-2 font-light text-ivory tracking-tight">
        {prefix}{formattedDisplay(count)}{suffix}
      </span>
      <span className="text-xs sm:text-sm uppercase tracking-wider text-ivory/70 text-center font-medium">
        {label}
      </span>
    </div>
  );
}

export default ImpactCounter;
