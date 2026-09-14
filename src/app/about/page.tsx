'use client';

import { motion } from 'framer-motion';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { siteConfig } from '@/lib/siteConfig';
import { Heart, Users, Wheat } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
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
            <SectionLabel dark>ABOUT US</SectionLabel>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light mt-6 sm:mt-8 leading-tight">
              Our Story
            </h1>
            <p className="text-ivory/70 text-lg sm:text-xl mt-4 sm:mt-6 max-w-2xl font-light">
              We believe in a world where food security is a basic human right, not a privilege.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-ivory py-16 sm:py-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16">
          <motion.div {...fadeIn}>
            <p className="font-serif text-xl sm:text-2xl md:text-3xl leading-relaxed font-light text-charcoal">
              PetBhar Initiative began with a simple belief — no one in our community should go to bed hungry. What started as a small act of sharing food has grown into a movement for food security, dignity and compassion.
            </p>
          </motion.div>
          <motion.div {...fadeIn} transition={{ delay: 0.2, duration: 0.6 }} className="space-y-4 sm:space-y-6 text-charcoal/80">
            <p className="text-base sm:text-lg">
              {siteConfig.org.mission}
            </p>
            <p className="text-base sm:text-lg">
              We approach our work with transparency and dedication, ensuring that every effort translates into real meals for those who need them most.
            </p>
            <p className="text-base sm:text-lg">
              Our volunteers are the heartbeat of PetBhar, working tirelessly to bridge the gap between abundance and need in our communities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-beige/50 py-16 sm:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeIn} className="text-center mb-12 sm:mb-16">
            <SectionLabel>OUR VALUES</SectionLabel>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-charcoal mt-4 sm:mt-6">
              What Drives Us
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <motion.div {...fadeIn} className="bg-ivory p-6 sm:p-10 rounded-2xl shadow-sm border border-charcoal/5">
              <Wheat className="w-9 h-9 sm:w-10 sm:h-10 text-charcoal mb-4 sm:mb-6" strokeWidth={1.5} />
              <h3 className="font-serif text-xl sm:text-2xl mb-3 sm:mb-4 text-charcoal">Food Security</h3>
              <p className="text-charcoal/70 text-sm sm:text-base">
                Ensuring reliable access to sufficient, safe, and nutritious food to meet dietary needs for an active and healthy life.
              </p>
            </motion.div>
            <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="bg-ivory p-6 sm:p-10 rounded-2xl shadow-sm border border-charcoal/5">
              <Users className="w-9 h-9 sm:w-10 sm:h-10 text-charcoal mb-4 sm:mb-6" strokeWidth={1.5} />
              <h3 className="font-serif text-xl sm:text-2xl mb-3 sm:mb-4 text-charcoal">Dignity</h3>
              <p className="text-charcoal/70 text-sm sm:text-base">
                Providing support in a manner that respects the inherent worth and self-esteem of every individual we serve.
              </p>
            </motion.div>
            <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="bg-ivory p-6 sm:p-10 rounded-2xl shadow-sm border border-charcoal/5 sm:col-span-2 lg:col-span-1">
              <Heart className="w-9 h-9 sm:w-10 sm:h-10 text-charcoal mb-4 sm:mb-6" strokeWidth={1.5} />
              <h3 className="font-serif text-xl sm:text-2xl mb-3 sm:mb-4 text-charcoal">Compassion</h3>
              <p className="text-charcoal/70 text-sm sm:text-base">
                Acting with deep empathy and understanding, recognizing our shared humanity in every interaction.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PetBhar Paws Connection */}
      <section className="bg-ivory py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeIn}>
            <SectionLabel>BEYOND HUMANITY</SectionLabel>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-charcoal mt-6 mb-8">
              Compassion Knows No Species
            </h2>
            <p className="text-lg text-charcoal/80 mb-10 leading-relaxed">
              True compassion extends to all living beings. While our primary focus is human food security, we recognize that the street animals sharing our communities are often equally vulnerable. Through PetBhar Paws, we extend our mission to ensure they aren&apos;t forgotten.
            </p>
            <Link 
              href="/paws"
              className="inline-block px-8 py-4 bg-charcoal text-ivory rounded-full hover:bg-charcoal/90 transition-colors uppercase tracking-widest text-sm"
            >
              Explore PetBhar Paws
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Philosophy Quote */}
      <section className="bg-charcoal text-ivory py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeIn}>
            <p className="font-serif text-3xl md:text-4xl italic font-light leading-relaxed">
              &ldquo;{siteConfig.org.philosophy}&rdquo;
            </p>
            <div className="mt-12 flex items-center justify-center space-x-4">
              <div className="h-px bg-ivory/20 w-12"></div>
              <p className="text-ivory/60 tracking-[0.2em] text-sm uppercase">Real work. Real records. Real impact.</p>
              <div className="h-px bg-ivory/20 w-12"></div>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
