'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Heart, Shield, Droplets, Utensils, Bone, HandHeart, Info, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { openSosBeacon } from '@/components/features/SosBeaconButton';

export default function PawsPage() {
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
