'use client';

import { motion } from 'framer-motion';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { siteConfig } from '@/lib/siteConfig';
import Link from 'next/link';
import WallOfKindness from '@/components/features/WallOfKindness';
import RupeeBreakdownChart from '@/components/features/RupeeBreakdownChart';
import FaqAccordion from '@/components/features/FaqAccordion';

export default function TransparencyPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  const { transparency } = siteConfig;

  const statItems = [
    {
      label: 'Contributions Received',
      value: `₹${transparency?.contributionsReceived?.toLocaleString('en-IN') || 0}`,
      description: 'Total verified public and community contributions received.'
    },
    {
      label: 'Food & Supplies Purchased',
      value: `₹${transparency?.foodPurchased?.toLocaleString('en-IN') || 0}`,
      description: 'Direct expenditures on wholesale grocery rations and cooking ingredients.'
    },
    {
      label: 'Meals Distributed',
      value: `${transparency?.mealsDistributed?.toLocaleString('en-IN') || 0}`,
      description: 'Hot, hygienic, nutritious plates distributed on the ground.'
    },
    {
      label: 'Grocery Kits Distributed',
      value: `${transparency?.groceryKitsDistributed?.toLocaleString('en-IN') || 0}`,
      description: 'Essential multi-week dry ration packs distributed to families.'
    },
    {
      label: 'Families Supported',
      value: `${transparency?.familiesSupported?.toLocaleString('en-IN') || 0}`,
      description: 'Households verified and supported through ongoing food security.'
    }
  ];

  return (
    <main>
      {/* Page Header */}
      <section className="bg-charcoal text-ivory py-24 sm:py-32 md:py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeIn}>
            <SectionLabel dark>TRANSPARENCY & AUDIT</SectionLabel>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light mt-6 sm:mt-8 leading-tight">
              Where Your Support Goes
            </h1>
            <p className="text-ivory/70 text-base sm:text-lg md:text-xl mt-4 sm:mt-6 max-w-2xl font-light leading-relaxed">
              We operate with an open book policy. Every rupee received is tracked, documented, and published.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Live Financial & Impact Dashboard */}
      <section className="bg-ivory py-16 sm:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeIn} className="mb-10 sm:mb-12">
            <SectionLabel>FINANCIAL & IMPACT SUMMARY</SectionLabel>
            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-light mt-4">
              Real-Time Ground Metrics
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {statItems.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white p-8 rounded-3xl shadow-sm border border-charcoal/5 flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-warm-grey mb-3">{stat.label}</div>
                  <div className="font-serif text-4xl sm:text-5xl text-charcoal tracking-tight font-light">{stat.value}</div>
                </div>
                <p className="text-warm-grey text-xs sm:text-sm mt-6 leading-relaxed border-t border-charcoal/5 pt-4">
                  {stat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Where Every Rupee Goes Breakdown */}
      <section className="py-16 sm:py-20 px-6 bg-warm-ivory/20 border-t border-charcoal/5">
        <div className="max-w-5xl mx-auto">
          <RupeeBreakdownChart />
        </div>
      </section>

      {/* Public Wall of Kindness Feed */}
      <WallOfKindness />

      {/* Frequently Asked Questions Accordion */}
      <section className="py-16 sm:py-20 px-6 bg-warm-ivory/20 border-t border-charcoal/5">
        <div className="max-w-4xl mx-auto">
          <FaqAccordion />
        </div>
      </section>

      {/* Trust Guarantee Statement */}
      <section className="bg-charcoal text-ivory py-24 px-6 text-center">
        <motion.div {...fadeIn} className="max-w-2xl mx-auto space-y-6">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light">
            Real work. Real records. Real impact.
          </h2>
          <p className="text-base sm:text-xl text-ivory/70 font-light leading-relaxed">
            Every contribution is accounted for. Every meal is documented. If you ever have a question about our books, we welcome your inquiry directly.
          </p>
          <div className="pt-4">
            <Link
              href="/contact"
              className="inline-block bg-ivory text-charcoal px-8 py-3.5 rounded-full text-xs uppercase tracking-widest font-semibold hover:bg-white transition-colors"
            >
              Contact Our Team &rarr;
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
