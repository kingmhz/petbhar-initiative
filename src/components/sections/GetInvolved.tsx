'use client';

import Image from 'next/image';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { useLanguage } from '@/context/LanguageContext';

export default function GetInvolved() {
  const { t } = useLanguage();

  return (
    <section className="bg-ivory py-10 md:py-12 border-t border-charcoal/5">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <SectionLabel>{t('get_involved_label')}</SectionLabel>
          <SectionHeading className="mt-4">
            {t('get_involved_title_line1')}<br />{t('get_involved_title_line2')}
          </SectionHeading>
        </ScrollReveal>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {/* Card 1: Give */}
          <ScrollReveal delay={0.1}>
            <div className="group overflow-hidden rounded-2xl border border-charcoal/5 bg-white shadow-sm transition-all hover:shadow-md flex flex-col justify-between h-full">
              <div>
                <div className="relative h-36 sm:h-40 overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&q=80"
                    alt="Volunteers packing food ration parcels"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    quality={80}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="font-serif text-xl text-charcoal">{t('get_involved_give_title')}</h3>
                  <p className="mt-2 text-xs sm:text-sm text-warm-grey leading-relaxed">
                    {t('get_involved_give_desc')}
                  </p>
                </div>
              </div>
              <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                <Button variant="ghost" href="/get-involved" className="font-semibold text-xs sm:text-sm">
                  {t('nav_support_us')} &rarr;
                </Button>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 2: Volunteer */}
          <ScrollReveal delay={0.2}>
            <div className="group overflow-hidden rounded-2xl border border-charcoal/5 bg-white shadow-sm transition-all hover:shadow-md flex flex-col justify-between h-full">
              <div>
                <div className="relative h-36 sm:h-40 overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&q=80"
                    alt="Community volunteers distributing food"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    quality={80}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="font-serif text-xl text-charcoal">{t('get_involved_volunteer_title')}</h3>
                  <p className="mt-2 text-xs sm:text-sm text-warm-grey leading-relaxed">
                    {t('get_involved_volunteer_desc')}
                  </p>
                </div>
              </div>
              <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                <Button variant="ghost" href="/get-involved#volunteer" className="font-semibold text-xs sm:text-sm">
                  {t('get_involved_volunteer_title')} &rarr;
                </Button>
              </div>
            </div>
          </ScrollReveal>

          {/* Card 3: Partner */}
          <ScrollReveal delay={0.3}>
            <div className="group overflow-hidden rounded-2xl border border-charcoal/5 bg-white shadow-sm transition-all hover:shadow-md flex flex-col justify-between h-full">
              <div>
                <div className="relative h-36 sm:h-40 overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80"
                    alt="Partnership meeting hands together"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    quality={80}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="font-serif text-xl text-charcoal">{t('get_involved_partner_title')}</h3>
                  <p className="mt-2 text-xs sm:text-sm text-warm-grey leading-relaxed">
                    {t('get_involved_partner_desc')}
                  </p>
                </div>
              </div>
              <div className="px-5 pb-5 sm:px-6 sm:pb-6">
                <Button variant="ghost" href="/get-involved#partner" className="font-semibold text-xs sm:text-sm">
                  {t('get_involved_partner_title')} &rarr;
                </Button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
