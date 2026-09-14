'use client';

import { motion } from 'framer-motion';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Contact as ContactSection } from '@/components/sections/Contact';

export default function ContactPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <main>
      {/* Page Header */}
      <section className="bg-charcoal text-ivory py-24 sm:py-32 md:py-40 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeIn}>
            <SectionLabel dark>CONTACT</SectionLabel>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light mt-6 sm:mt-8 leading-tight">
              Let&apos;s Connect
            </h1>
            <p className="text-ivory/70 text-lg sm:text-xl mt-4 sm:mt-6 max-w-2xl font-light">
              Have questions, suggestions, or want to collaborate? We&apos;d love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section Component */}
      <div className="bg-ivory pt-12 pb-24">
        <ContactSection />
      </div>
    </main>
  );
}
