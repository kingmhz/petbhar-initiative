'use client';

import Link from 'next/link';
import Image from 'next/image';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import config from '@/lib/siteConfig';

import { useLanguage } from '@/context/LanguageContext';

export default function About() {
  const { t, locale } = useLanguage();

  return (
    <section id="about" className="bg-ivory py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-6">
        {/* Top: Section Narrative */}
        <div className="max-w-3xl">
          <ScrollReveal>
            <SectionLabel>{t('about_label')}</SectionLabel>
            <SectionHeading className="mt-4">
              {t('about_title_line1')}<br />
              {t('about_title_line2')}
            </SectionHeading>
            <p className="mt-4 text-base sm:text-lg text-charcoal/80 font-normal leading-relaxed">
              {t('about_mission')}
            </p>
            <p className="mt-3 text-xs sm:text-sm text-warm-grey leading-relaxed">
              {locale === 'hi' 
                ? 'हमने कुछ स्वयंसेवकों के साथ शुरुआत की, जो भूखे सोते बेजुबानों और पड़ोसियों को अनदेखा नहीं कर सके। आज हम अतिरिक्त और आवश्यकता के बीच का सेतु बन चुके हैं।'
                : "We started as a handful of volunteers who couldn't look away when neighbours and community animals went to sleep on empty stomachs. Today, through transparent bookkeeping and community partnerships, we bridge the gap between excess and acute need."}
            </p>
            <div className="mt-6">
              <Button variant="outline" href="/about">
                {t('about_story_btn')}
              </Button>
            </div>
          </ScrollReveal>
        </div>

        {/* Bottom: 3 Compact Visual Pillars */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1: Meals */}
          <ScrollReveal delay={0.1}>
            <div className="overflow-hidden rounded-2xl border border-charcoal/5 bg-white shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
              <div className="relative h-36 sm:h-40 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80"
                  alt="Nutritious prepared meal"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  quality={80}
                  className="object-cover"
                />
              </div>
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl text-charcoal">{t('about_meals_title')}</h3>
                  <p className="mt-2 text-xs sm:text-sm text-warm-grey leading-relaxed">
                    {t('about_meals_desc')}
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2: Grocery Kits */}
          <ScrollReveal delay={0.2}>
            <div className="overflow-hidden rounded-2xl border border-charcoal/5 bg-white shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
              <div className="relative h-36 sm:h-40 overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1609520778163-a16fb3862581?w=800&q=80"
                  alt="Grains and grocery ration package"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  quality={80}
                  className="object-cover"
                />
              </div>
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-xl text-charcoal">{t('about_groceries_title')}</h3>
                  <p className="mt-2 text-xs sm:text-sm text-warm-grey leading-relaxed">
                    {t('about_groceries_desc')}
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 3: Support Card */}
          <ScrollReveal delay={0.3} className="sm:col-span-2 lg:col-span-1">
            <div className="rounded-2xl bg-charcoal p-5 sm:p-6 text-ivory h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl text-ivory">Direct Support</h3>
                  <span className="text-[9px] uppercase tracking-widest text-ivory/60 bg-white/10 px-2.5 py-0.5 rounded-full">Community</span>
                </div>
                <p className="mt-2.5 text-xs sm:text-sm text-ivory/75 leading-relaxed">
                  Every contribution goes directly toward sourcing raw ration kits and preparing wholesome meals.
                </p>
              </div>
              
              {config.upi.qrImage ? (
                <div className="mt-4 p-4 rounded-2xl bg-white/10 border border-white/15 flex flex-col items-center sm:flex-row sm:items-center gap-4">
                  <div className="w-36 h-36 sm:w-44 sm:h-44 bg-white rounded-2xl p-2.5 shrink-0 shadow-lg border border-amber-300/30 flex items-center justify-center">
                    <Image
                      src={config.upi.qrImage}
                      alt="UPI QR Code"
                      width={176}
                      height={176}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-center sm:text-left flex-1">
                    <span className="inline-block text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 font-bold mb-1">Instant UPI Scan</span>
                    <p className="text-base font-semibold text-ivory">Scan with any UPI app</p>
                    <p className="text-xs text-ivory/70 mt-1">Google Pay &bull; PhonePe &bull; Paytm</p>
                    <Link href="/get-involved" className="text-xs text-amber-300 hover:text-amber-200 font-medium underline mt-2.5 inline-block">
                      All payment options &rarr;
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                  <p className="text-xs font-medium text-ivory">Join our movement</p>
                  <p className="text-[11px] text-ivory/60 mt-0.5">Volunteer, partner, or donate.</p>
                  <Link
                    href="/get-involved"
                    className="mt-3 inline-block bg-ivory text-charcoal px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-semibold hover:bg-white transition-colors"
                  >
                    Ways to Help &rarr;
                  </Link>
                </div>
              )}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
