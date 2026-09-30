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
    initial: { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
  };

  return (
    <section className="relative py-16 sm:py-20 md:py-24 bg-gradient-to-b from-[#FAF8F5] via-[#FDFBF7] to-[#FAF8F5] border-y border-charcoal/6" id="calculator">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <motion.div {...fadeIn} className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wider uppercase text-terracotta bg-terracotta/8 px-3.5 py-1.5 rounded-full border border-terracotta/15">
            <Sparkles size={12} />
            <span>{locale === 'hi' ? 'सीधा ज़मीनी प्रभाव' : 'Community Impact & Support'}</span>
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-charcoal mt-3.5 leading-tight">
            {locale === 'hi' ? 'प्रभाव कैलकुलेट करें और दान करें' : 'Calculate Impact & Contribute'}
          </h2>
          <p className="text-xs sm:text-base text-charcoal/70 mt-2.5 max-w-xl mx-auto leading-relaxed">
            {locale === 'hi'
              ? 'स्लाइडर को एडजस्ट करके देखें कि आपका सहयोग कितने पौष्टिक भोजन और बेजुबान पशुओं के कटोरे तैयार करता है, फिर बारकोड स्कैन करके तुरंत भुगतान करें।'
              : 'Move the slider to see how many hot meals and animal feeding bowls your contribution provides, then scan our verified barcode to donate instantly.'}
          </p>
        </motion.div>

        {/* Symmetrical Equal-Height Dual Grid */}
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
