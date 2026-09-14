'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import ReportNeedModal from './ReportNeedModal';
import { useLanguage } from '@/context/LanguageContext';

export function openSosBeacon() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-sos-beacon'));
  }
}

export default function SosBeaconButton() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-sos-beacon', handleOpen);
    return () => window.removeEventListener('open-sos-beacon', handleOpen);
  }, []);

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      {/* Floating Desktop Beacon Button */}
      <div className="fixed bottom-6 right-6 z-40 hidden sm:block">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-2 px-4 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-xl hover:shadow-2xl border border-white/20 transition-all duration-300 active:scale-95 animate-bounce-gentle cursor-pointer"
          title="Report hungry community or injured/stray animal"
          aria-label="Report a need or stray SOS"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
          </span>
          <AlertCircle size={15} className="shrink-0" />
          <span className="text-xs font-bold tracking-wide">
            {t('sos_btn')}
          </span>
        </button>
      </div>

      <ReportNeedModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
