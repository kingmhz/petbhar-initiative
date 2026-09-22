'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Copy, Check, ExternalLink } from 'lucide-react';
import { GmailIcon } from '@/components/ui/SocialIcons';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export function EmailModal({ isOpen, onClose, email }: EmailModalProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const gmailWebUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`;
  const mailtoUrl = `mailto:${email}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-charcoal/10 z-10 text-charcoal"
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b border-charcoal/10">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-white shadow-xs border border-charcoal/10">
                  <GmailIcon size={20} />
                </span>
                <div>
                  <h3 className="font-serif text-lg font-semibold text-charcoal">
                    Send an Email
                  </h3>
                  <p className="text-xs text-warm-grey font-mono mt-0.5">
                    {email}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-warm-grey hover:text-charcoal hover:bg-charcoal/5 rounded-full transition-colors"
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            {/* Options */}
            <div className="mt-5 space-y-3">
              {/* Option 1: Direct Gmail Compose */}
              <a
                href={gmailWebUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className="w-full p-4 rounded-2xl border border-charcoal/10 hover:border-[#EA4335]/50 bg-white hover:bg-red-50/30 flex items-center justify-between gap-3 transition-all group shadow-xs hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-charcoal/10 group-hover:border-[#EA4335]/30 shadow-xs shrink-0">
                    <GmailIcon size={20} />
                  </span>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-charcoal group-hover:text-[#EA4335] transition-colors">
                      Compose in Gmail
                    </p>
                    <p className="text-xs text-warm-grey">
                      Opens Gmail in browser or official app
                    </p>
                  </div>
                </div>
                <ExternalLink size={16} className="text-warm-grey group-hover:text-[#EA4335] transition-colors shrink-0" />
              </a>

              {/* Option 2: Default System Mail Client */}
              <a
                href={mailtoUrl}
                onClick={onClose}
                className="w-full p-4 rounded-2xl border border-charcoal/10 hover:border-charcoal/30 bg-white hover:bg-charcoal/5 flex items-center justify-between gap-3 transition-all group shadow-xs hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-charcoal/5 border border-charcoal/10 shrink-0">
                    <Mail size={18} className="text-charcoal" />
                  </span>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-charcoal">
                      Default Mail App
                    </p>
                    <p className="text-xs text-warm-grey">
                      Launch Apple Mail, Outlook, or system client
                    </p>
                  </div>
                </div>
                <ExternalLink size={16} className="text-warm-grey group-hover:text-charcoal transition-colors shrink-0" />
              </a>

              {/* Option 3: Copy Address */}
              <button
                type="button"
                onClick={handleCopy}
                className="w-full p-4 rounded-2xl border border-charcoal/10 hover:border-charcoal/30 bg-white hover:bg-charcoal/5 flex items-center justify-between gap-3 transition-all group shadow-xs hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-charcoal/5 border border-charcoal/10 shrink-0">
                    {copied ? (
                      <Check size={18} className="text-emerald-600" />
                    ) : (
                      <Copy size={18} className="text-charcoal" />
                    )}
                  </span>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-charcoal">
                      {copied ? 'Copied to Clipboard!' : 'Copy Email Address'}
                    </p>
                    <p className="text-xs text-warm-grey font-mono">
                      {email}
                    </p>
                  </div>
                </div>
                {copied && (
                  <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                    Copied
                  </span>
                )}
              </button>
            </div>

            {/* Footer Notice */}
            <div className="mt-5 pt-3 border-t border-charcoal/5 text-center">
              <p className="text-[11px] text-warm-grey">
                We typically respond within 24 hours. For urgent requests, reach out via WhatsApp.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
