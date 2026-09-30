'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Heart, Shield, Droplets, Utensils, Bone, HandHeart, Info, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { openSosBeacon } from '@/components/features/SosBeaconButton';
import { siteConfig } from '@/lib/siteConfig';

export default function PawsPage() {
  const animalsFed = siteConfig.impact?.animalsFed ?? 3;

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <main>
      {/* Page Header */}
      <section className="bg-charcoal text-ivory pt-32 pb-12 md:pt-36 md:pb-14 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeIn}>
            <SectionLabel dark>PETBHAR PAWS</SectionLabel>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-light text-ivory mt-4 mb-4 leading-tight">
              Because they matter too.
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-ivory/80 font-light max-w-2xl mx-auto leading-relaxed">
              Our dedicated grassroots initiative for the welfare of street animals, providing food, clean water, and compassion to our voiceless friends.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Photo: 100% Full Natural Color, Zero Shading */}
      <section className="bg-ivory pt-8 pb-12 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            {...fadeIn}
            className="relative rounded-3xl overflow-hidden shadow-xl border border-charcoal/10 bg-beige aspect-[16/9] w-full"
          >
            <Image 
              src="/images/petbhar_paws_feeding.jpg" 
              alt="Dogs and cats eating from PetBhar Paws feeding bowls" 
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
              quality={85}
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Mission & Focus Areas */}
      <section className="bg-ivory py-16 md:py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <motion.div {...fadeIn}>
              <h2 className="font-serif text-4xl md:text-5xl text-charcoal mb-6">Our Mission</h2>
              <p className="text-lg text-charcoal/70 leading-relaxed">
                What PetBhar Paws does today includes daily feeding drives, providing clean water bowls, basic rescues, and on-site treatment. We envision a future where we can expand our goals to widespread vaccination, sterilisation, active foster care networks, and adoption programs.
              </p>
            </motion.div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <motion.div {...fadeIn} className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-charcoal/5">
              <Utensils className="w-10 h-10 text-charcoal mb-6" strokeWidth={1.5} />
              <h3 className="font-serif text-2xl text-charcoal mb-3">Daily Feeding</h3>
              <p className="text-charcoal/70">Nutritious meals provided systematically across designated zones in our city.</p>
            </motion.div>
            <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="bg-white p-8 rounded-2xl shadow-sm border border-charcoal/5">
              <Droplets className="w-10 h-10 text-charcoal mb-6" strokeWidth={1.5} />
              <h3 className="font-serif text-2xl text-charcoal mb-3">Clean Water</h3>
              <p className="text-charcoal/70">Placing and maintaining water bowls during harsh summers and throughout the year.</p>
            </motion.div>
            <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="bg-white p-8 rounded-2xl shadow-sm border border-charcoal/5">
              <Heart className="w-10 h-10 text-charcoal mb-6" strokeWidth={1.5} />
              <h3 className="font-serif text-2xl text-charcoal mb-3">Basic Treatment</h3>
              <p className="text-charcoal/70">On-the-spot first aid and coordination with vets for severe cases.</p>
            </motion.div>
            <motion.div {...fadeIn} transition={{ delay: 0.3 }} className="bg-white p-8 rounded-2xl shadow-sm border border-charcoal/5">
              <Shield className="w-10 h-10 text-charcoal mb-6" strokeWidth={1.5} />
              <h3 className="font-serif text-2xl text-charcoal mb-3">Future Goals</h3>
              <p className="text-charcoal/70">Vaccination drives, sterilisation programs, and building a rescue network.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Ground Feeding Record / Impact Counter Section */}
      <section className="bg-charcoal text-ivory py-16 sm:py-24 px-6 relative overflow-hidden">
        {/* Ambient emerald background glow */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div {...fadeIn} className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold tracking-wider uppercase border border-emerald-500/30 mb-4">
              <span>🐾</span> Ground Feeding Record
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-ivory leading-tight">
              Street Animals Fed &amp; Documented
            </h2>
            <p className="mt-4 text-ivory/70 text-sm sm:text-base leading-relaxed">
              Every day on the streets, our volunteers carry fresh warm meals, high-protein nutrition, and clean water bowls directly to community animals. Here is our live ground count.
            </p>
          </motion.div>

          <motion.div {...fadeIn} className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {/* Primary Hero Counter Card */}
            <div className="rounded-3xl bg-white/[0.08] border-2 border-emerald-500/30 p-8 sm:p-10 backdrop-blur-md relative overflow-hidden flex flex-col justify-between hover:border-emerald-400/50 transition-colors shadow-xl">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-emerald-300 font-bold block mb-2">
                  Total Stray Animals Fed
                </span>
                <div className="font-serif text-6xl sm:text-7xl font-bold text-white tracking-tight flex items-baseline gap-2">
                  <span>{animalsFed}</span>
                  <span className="text-emerald-400 text-3xl font-sans font-light">+</span>
                </div>
                <p className="text-xs text-ivory/70 mt-3 leading-relaxed">
                  Community dogs and cats provided with wholesome meals and registered under our ground feeding drives.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <Link 
                  href="/work#paws-feeding-001" 
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 hover:text-emerald-200 transition-colors"
                >
                  <span>View Drive Documentation</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>

            {/* Supporting Card 1: Wholesome Nutrition */}
            <div className="rounded-3xl bg-white/[0.05] border border-white/10 p-8 backdrop-blur-md flex flex-col justify-between hover:border-white/20 transition-colors">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-400/20 text-amber-300 flex items-center justify-center mb-5">
                  <Utensils size={24} />
                </div>
                <h3 className="font-serif text-xl font-semibold text-ivory mb-2">High-Protein Meals</h3>
                <p className="text-xs text-ivory/70 leading-relaxed">
                  Fresh boiled turmeric rice mash, bone broth, egg protein, and veterinary-approved kibble for digestive wellness and energy.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10 text-xs text-amber-300/90 font-medium flex items-center gap-1.5">
                <span>✓ Prepared with care</span>
              </div>
            </div>

            {/* Supporting Card 2: Clean Water & First Aid */}
            <div className="rounded-3xl bg-white/[0.05] border border-white/10 p-8 backdrop-blur-md flex flex-col justify-between hover:border-white/20 transition-colors">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center mb-5">
                  <Droplets size={24} />
                </div>
                <h3 className="font-serif text-xl font-semibold text-ivory mb-2">Water &amp; Relief</h3>
                <p className="text-xs text-ivory/70 leading-relaxed">
                  Deep terracotta water bowls maintained in neighborhood spots to protect animals from dehydration and heat stress.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={openSosBeacon}
                  className="text-xs text-red-300 hover:text-red-200 font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <span>Report Animal In Need</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How to Help */}
      <section className="bg-beige/50 py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeIn} className="text-center mb-16">
            <SectionLabel>GET INVOLVED</SectionLabel>
            <h2 className="font-serif text-4xl md:text-5xl font-light text-charcoal mt-6">
              How You Can Help
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-ivory p-8 rounded-2xl border border-charcoal/5 flex gap-6">
              <Bone className="w-8 h-8 text-charcoal shrink-0" strokeWidth={1.5} />
              <div>
                <h3 className="font-serif text-xl text-charcoal mb-2">Donate Food & Supplies</h3>
                <p className="text-charcoal/70">Contribute kibble, rice, medicine, or old blankets for our shelter partners.</p>
              </div>
            </div>
            <div className="bg-ivory p-8 rounded-2xl border border-charcoal/5 flex gap-6">
              <HandHeart className="w-8 h-8 text-charcoal shrink-0" strokeWidth={1.5} />
              <div>
                <h3 className="font-serif text-xl text-charcoal mb-2">Volunteer for Drives</h3>
                <p className="text-charcoal/70">Join our weekend feeding drives and help distribute food in your local area.</p>
              </div>
            </div>
            <div 
              onClick={openSosBeacon}
              className="bg-ivory p-8 rounded-2xl border border-charcoal/5 flex gap-6 cursor-pointer hover:border-red-500/30 hover:shadow-md transition-all group"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openSosBeacon(); }}
            >
              <AlertCircle className="w-8 h-8 text-red-600 shrink-0 group-hover:scale-110 transition-transform" strokeWidth={1.5} />
              <div>
                <h3 className="font-serif text-xl text-charcoal mb-2 flex items-center gap-2">
                  <span>Report an Animal in Need</span>
                  <span className="text-[10px] font-sans font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">SOS</span>
                </h3>
                <p className="text-charcoal/70">Be our eyes and ears. Trigger an instant ground alert if you spot an injured, sick, or starving street animal.</p>
                <span className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-red-700 group-hover:underline">
                  Report Stray Need Now &rarr;
                </span>
              </div>
            </div>
            <div className="bg-ivory p-8 rounded-2xl border border-charcoal/5 flex gap-6">
              <Heart className="w-8 h-8 text-charcoal shrink-0" strokeWidth={1.5} />
              <div>
                <h3 className="font-serif text-xl text-charcoal mb-2">Foster or Adopt</h3>
                <p className="text-charcoal/70">Open your home temporarily or permanently to an animal looking for love.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-charcoal text-ivory py-24 px-6 text-center">
        <motion.div {...fadeIn} className="max-w-2xl mx-auto">
          <h2 className="font-serif text-4xl mb-8">Ready to make a difference?</h2>
          <Link 
            href="/get-involved"
            className="inline-block px-10 py-4 bg-ivory text-charcoal rounded-full hover:bg-white transition-colors uppercase tracking-widest text-sm font-medium"
          >
            Get Involved Now
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
