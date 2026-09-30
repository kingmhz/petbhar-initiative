'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import ImpactSimulator from '@/components/features/ImpactSimulator';
import PaymentBarcode from '@/components/features/PaymentBarcode';
import { useLanguage } from '@/context/LanguageContext';

export default function ImpactCalculatorSection() {
  const { locale } = useLanguage();
  const [amount, setAmount] = useState<number>(1800);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <section className="relative py-16 sm:py-20 md:py-24 bg-warm-ivory/30 border-b border-charcoal/5 overflow-hidden" id="calculator">
      {/* Liquid Glass Ambient Lighting Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-200/25 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-emerald-200/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-white/40 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div {...fadeIn} className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-widest uppercase text-terracotta bg-terracotta/10 px-3.5 py-1.5 rounded-full border border-terracotta/20">
            <Sparkles size={12} />
            <span>{locale === 'hi' ? 'सीधा ज़मीनी प्रभाव' : 'Community Impact & Support'}</span>
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-charcoal mt-3 leading-tight">
            {locale === 'hi' ? 'प्रभाव कैलकुलेट करें और दान करें' : 'Calculate Impact & Contribute'}
          </h2>
          <p className="text-xs sm:text-sm text-charcoal/70 mt-2.5 max-w-xl mx-auto leading-relaxed">
            {locale === 'hi'
              ? 'स्लाइडर को एडजस्ट करके देखें कि आपका सहयोग कितने पौष्टिक भोजन और बेजुबान पशुओं के कटोरे तैयार करता है, फिर बारकोड स्कैन करके तुरंत भुगतान करें।'
              : 'Move the slider to see how many hot meals and animal feeding bowls your contribution provides, then scan our verified barcode to donate instantly.'}
          </p>
        </motion.div>

        {/* Liquid Glass Equal-Height Dual Grid */}
        <motion.div {...fadeIn} className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-stretch">
          <div className="lg:col-span-7 xl:col-span-7 flex">
            <ImpactSimulator
              amount={amount}
              onAmountChange={setAmount}
              hideQrButton={true}
              className="w-full h-full"
            />
          </div>
          <div className="lg:col-span-5 xl:col-span-5 flex">
            <PaymentBarcode
              amount={amount}
              className="w-full h-full"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
