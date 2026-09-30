'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight, Heart, Shield, Utensils } from 'lucide-react';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { useLanguage } from '@/context/LanguageContext';

export default function HomePillars() {
  const { locale } = useLanguage();

  const pillars = [
    {
      title: locale === 'hi' ? 'भोजन वितरण अभियान' : 'Community Food Drives',
      badge: locale === 'hi' ? 'मानवीय सहायता' : 'Humanity First',
      description: locale === 'hi'
        ? 'दैनिक वेतनभोगियों और जरूरतमंद परिवारों तक ताजा, पौष्टिक और सम्मानजनक भोजन सीधे पहुंचाना।'
        : 'Fresh, dignified hot meals and dry ration kits delivered directly to daily-wage workers and underserved settlements on the ground.',
      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200',
      link: '/work',
      linkText: locale === 'hi' ? 'हमारा कार्य देखें' : 'Explore Our Work',
      icon: <Utensils size={18} className="text-amber-600" />
    },
    {
      title: 'PetBhar Paws',
      badge: locale === 'hi' ? 'पशु कल्याण' : 'Street Animal Relief',
      description: locale === 'hi'
        ? 'सड़क पर रहने वाले बेजुबान कुत्तों और बिल्लियों के लिए ताजा आहार, पानी के कटोरे और प्राथमिक उपचार।'
        : 'Daily grassroots feeding drives, high-protein broth bowls, clean terracotta water points, and medical relief for voiceless community friends.',
      image: '/images/petbhar_paws_feeding.jpg',
      link: '/paws',
      linkText: locale === 'hi' ? 'पेटभर पॉज़ देखें' : 'Explore PetBhar Paws',
      icon: <Heart size={18} className="text-emerald-600" />
    },
    {
      title: locale === 'hi' ? '100% खुली पारदर्शिता' : '100% Open Transparency',
      badge: locale === 'hi' ? 'खुला बहीखाता' : 'Public Ledger',
      description: locale === 'hi'
        ? 'प्राप्त हर एक रुपये और मंडी खर्च का पूरा हिसाब। कोई छिपा हुआ खर्च नहीं, हर रसीद सार्वजनिक।'
        : 'Every single rupee received, mandi procurement bill, and distribution receipt is tracked and published in our real-time public ledger.',
      image: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?q=80&w=1200',
      link: '/transparency',
      linkText: locale === 'hi' ? 'वित्तीय विवरण देखें' : 'View Financial Ledger',
      icon: <Shield size={18} className="text-blue-600" />
    }
  ];

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
  };

  return (
    <section className="bg-ivory py-16 sm:py-20 md:py-24 px-6 border-b border-charcoal/5">
      <div className="max-w-7xl mx-auto">
        <motion.div {...fadeIn} className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <SectionLabel>
            {locale === 'hi' ? 'हमारे मुख्य कार्यक्षेत्र' : 'WHAT WE DO'}
          </SectionLabel>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-charcoal mt-4 leading-tight">
            {locale === 'hi' 
              ? 'जमीन पर सचमुच का बदलाव' 
              : 'Dedicated Initiatives Across Our Community'}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-charcoal/70 leading-relaxed max-w-xl mx-auto">
            {locale === 'hi'
              ? 'भूख मिटाने से लेकर बेजुबान पशुओं की सेवा और पारदर्शी रिकॉर्ड तक — जानिए हम कैसे काम करते हैं।'
              : 'From hunger relief to street animal welfare and verified open-book finances — explore our core focus areas.'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {pillars.map((pillar, idx) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.12, duration: 0.5 }}
            >
              <Link
                href={pillar.link}
                className="group flex flex-col h-full rounded-3xl overflow-hidden bg-white border border-charcoal/8 shadow-xs hover:shadow-xl hover:border-charcoal/20 transition-all duration-300"
              >
                {/* Visual Cover */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-beige">
                  <Image
                    src={pillar.image}
                    alt={pillar.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    quality={80}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide text-charcoal flex items-center gap-1.5 shadow-xs">
                    {pillar.icon}
                    <span>{pillar.badge}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-2xl font-semibold text-charcoal group-hover:text-charcoal/80 transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="mt-2.5 text-xs sm:text-sm text-charcoal/70 leading-relaxed">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-charcoal/5 flex items-center justify-between text-xs font-semibold text-charcoal group-hover:text-amber-700 transition-colors">
                    <span>{pillar.linkText}</span>
                    <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
