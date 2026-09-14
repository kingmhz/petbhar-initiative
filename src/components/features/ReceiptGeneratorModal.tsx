'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, ShieldCheck, FileCheck, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ReceiptGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAmount?: number;
}

// Convert amount to Indian words representation
function numberToWords(num: number): string {
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  if (num === 0) return 'Zero';

  function inWords(n: number): string {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' and ' + inWords(n % 100) : '');
    if (n < 100000) return inWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + inWords(n % 1000) : '');
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + inWords(n % 100000) : '');
    return inWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + inWords(n % 10000000) : '');
  }

  return inWords(num) + ' Rupees Only';
}

export default function ReceiptGeneratorModal({
  isOpen,
  onClose,
  defaultAmount = 500,
}: ReceiptGeneratorModalProps) {
  const { t, locale } = useLanguage();
  const [donorName, setDonorName] = useState('');
  const [amount, setAmount] = useState(defaultAmount);
  const [utrNumber, setUtrNumber] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [purpose, setPurpose] = useState('Community Food Distribution');
  const [generated, setGenerated] = useState(false);
  const [certificateId, setCertificateId] = useState('');
  const certificateRef = useRef<HTMLDivElement | null>(null);

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

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim()) return;

    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const id = `PB-${new Date().getFullYear()}-${randomSuffix}`;
    setCertificateId(id);
    setGenerated(true);
  };

  const handlePrint = () => {
    window.print();
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
          className="fixed inset-0 bg-charcoal/85 backdrop-blur-sm print:hidden"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative bg-ivory rounded-3xl shadow-2xl border border-charcoal/10 max-w-2xl w-full p-6 sm:p-8 z-10 my-auto max-h-[92vh] overflow-y-auto overscroll-contain print:max-w-none print:w-full print:p-0 print:border-0 print:shadow-none print:bg-white"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 w-10 h-10 flex items-center justify-center rounded-full bg-charcoal/5 hover:bg-charcoal/10 text-charcoal transition-colors z-20 print:hidden"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          {!generated ? (
            /* Input Form Screen */
            <div>
              <div className="text-center mb-6 pr-8">
                <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-full font-semibold mb-2">
                  <ShieldCheck size={12} /> {locale === 'hi' ? 'आधिकारिक रसीद' : 'Official Acknowledgment'}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-charcoal font-medium">
                  {t('receipt_title')}
                </h2>
                <p className="text-xs sm:text-sm text-charcoal/70 mt-1 max-w-md mx-auto">
                  {t('receipt_subtitle')}
                </p>
              </div>

              <form onSubmit={handleGenerate} className="space-y-4 text-left">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-charcoal mb-1.5">
                    {t('receipt_donor_name')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    placeholder="Full Name (as per bank / PAN if needed)"
                    className="w-full bg-white border border-charcoal/15 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-charcoal focus:border-charcoal outline-none min-h-[44px]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-charcoal mb-1.5">
                      {t('receipt_amount')} *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={amount}
                      onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                      placeholder="e.g. 500"
                      className="w-full bg-white border border-charcoal/15 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-charcoal focus:border-charcoal outline-none min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-charcoal mb-1.5">
                      {t('receipt_date')}
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-white border border-charcoal/15 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-charcoal focus:border-charcoal outline-none min-h-[44px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-charcoal mb-1.5">
                      {t('receipt_utr')}
                    </label>
                    <input
                      type="text"
                      value={utrNumber}
                      onChange={(e) => setUtrNumber(e.target.value)}
                      placeholder="e.g. 328492019382"
                      className="w-full bg-white border border-charcoal/15 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-charcoal focus:border-charcoal outline-none min-h-[44px] font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-semibold text-charcoal mb-1.5">
                      {locale === 'hi' ? 'सहयोग का उद्देश्य' : 'Contribution Purpose'}
                    </label>
                    <select
                      value={purpose}
                      onChange={(e) => setPurpose(e.target.value)}
                      className="w-full bg-white border border-charcoal/15 rounded-xl px-3.5 py-2.5 text-base sm:text-sm text-charcoal focus:border-charcoal outline-none min-h-[44px]"
                    >
                      <option value="Community Food Distribution">Fresh Meals for Families (Humanity)</option>
                      <option value="Street Animal Feeding & Welfare">Stray Animal Feeding (Paws)</option>
                      <option value="Emergency Feeding Drive">Weekend Hunger Relief Drive</option>
                      <option value="General Hunger Relief">General Organization Support</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full bg-charcoal text-ivory py-3.5 rounded-xl font-medium text-xs sm:text-sm uppercase tracking-wider hover:bg-black transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                  >
                    <FileCheck size={16} />
                    <span>{t('receipt_generate')}</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            /* Certificate Display & Printable Output */
            <div>
              {/* Action Toolbar (hidden when printing) */}
              <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-charcoal/10 print:hidden">
                <button
                  type="button"
                  onClick={() => setGenerated(false)}
                  className="text-xs text-warm-grey hover:text-charcoal underline"
                >
                  &larr; {locale === 'hi' ? 'विवरण बदलें' : 'Edit Details'}
                </button>

                <button
                  type="button"
                  onClick={handlePrint}
                  className="bg-charcoal text-ivory px-5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider hover:bg-black transition-all shadow-sm flex items-center gap-2"
                >
                  <Printer size={14} />
                  <span>{t('receipt_print')}</span>
                </button>
              </div>

              {/* The Certificate Frame */}
              <div
                ref={certificateRef}
                className="bg-white p-8 sm:p-12 rounded-2xl border-2 border-charcoal/20 shadow-md relative overflow-hidden text-charcoal print:border print:p-8"
              >
                {/* Background Watermark Seal */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
                  <span className="font-serif font-bold text-[140px] tracking-widest text-charcoal">PETBHAR</span>
                </div>

                {/* Inner Border */}
                <div className="border border-charcoal/10 p-6 sm:p-8 rounded-xl relative">
                  {/* Certificate Header */}
                  <div className="text-center border-b border-charcoal/10 pb-6 mb-6">
                    <span className="font-serif font-bold text-2xl tracking-wide block text-charcoal">
                      PETBHAR INITIATIVE
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-warm-grey block mt-0.5">
                      GRASSROOTS HUNGER RELIEF & ANIMAL WELFARE
                    </span>
                    <div className="mt-3 inline-block bg-amber-50 border border-amber-200/80 px-4 py-1 rounded-full text-[11px] font-semibold tracking-wider uppercase text-amber-900">
                      Certificate of Contribution
                    </div>
                  </div>

                  {/* Metadata Bar */}
                  <div className="flex flex-wrap justify-between items-center text-xs text-warm-grey mb-6 pb-4 border-b border-charcoal/5 gap-2">
                    <div>
                      <span>Certificate No: </span>
                      <strong className="text-charcoal font-mono">{certificateId}</strong>
                    </div>
                    <div>
                      <span>Date of Issue: </span>
                      <strong className="text-charcoal">{new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>
                    </div>
                  </div>

                  {/* Body Paragraph */}
                  <div className="text-sm leading-relaxed space-y-4 text-charcoal/90 mb-8">
                    <p>
                      This certificate is gratefully presented to:
                    </p>
                    <p className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal italic border-b border-charcoal/20 pb-2">
                      {donorName}
                    </p>
                    <p>
                      In recognition of your generous contribution of{' '}
                      <strong className="font-mono text-base text-charcoal font-semibold">₹{amount.toLocaleString('en-IN')}</strong>{' '}
                      ({numberToWords(amount)}), received toward{' '}
                      <strong>{purpose}</strong>.
                    </p>
                    {utrNumber && (
                      <p className="text-xs text-warm-grey font-mono">
                        UPI Transaction / UTR Ref: <strong>{utrNumber}</strong>
                      </p>
                    )}
                  </div>

                  {/* Signatures & Seal */}
                  <div className="pt-6 border-t border-charcoal/10 flex items-end justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-emerald-700 text-xs font-semibold">
                        <CheckCircle2 size={16} />
                        <span>Verified Acknowledgment</span>
                      </div>
                      <p className="text-[10px] text-warm-grey mt-0.5">PetBhar Grassroots Council</p>
                      <p className="text-[10px] text-warm-grey/80">www.petbhar.org • No one should sleep hungry.</p>
                    </div>

                    <div className="text-right">
                      <div className="font-serif italic text-lg text-charcoal font-medium">Hasan & Trustees</div>
                      <div className="w-28 h-px bg-charcoal/30 my-1 ml-auto" />
                      <p className="text-[10px] uppercase tracking-wider text-warm-grey">Authorized Signatory</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
