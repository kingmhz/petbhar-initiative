'use client';

import Image from 'next/image';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { ImpactCounter } from '@/components/ui/ImpactCounter';
import config from '@/lib/siteConfig';
import { useLanguage } from '@/context/LanguageContext';

export default function Impact() {
  const { t, locale } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-charcoal py-14 sm:py-16 md:py-20 text-ivory">
      <Image
        src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=1920&q=60"
        alt="Impact background"
        fill
        sizes="100vw"
        quality={60}
        className="object-cover opacity-10"
      />
      <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
        <ScrollReveal>
          <SectionLabel dark>{t('impact_label')}</SectionLabel>
          <SectionHeading className="mt-4 text-ivory">
            {t('impact_title_line1')}<br />{t('impact_title_line2')}
          </SectionHeading>
          <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-ivory/60">
            {t('impact_desc')}
          </p>
        </ScrollReveal>

        {/* Live Counters */}
        <ScrollReveal delay={0.2}>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-5">
            <ImpactCounter value={config.impact.mealsDistributed} label={t('impact_meals_distributed')} />
            <ImpactCounter value={config.impact.familiesSupported} label={t('impact_families_supported')} />
            <ImpactCounter value={config.impact.peopleFed} label={t('impact_people_fed')} />
            <ImpactCounter value={config.impact.communitiesReached} label={locale === 'hi' ? 'वितरण अभियान संपन्न' : 'Community Drives'} />
            <ImpactCounter value={config.impact.animalsFed ?? 3} label={locale === 'hi' ? 'पशुओं को भोजन' : 'Stray Animals Fed'} />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button variant="outline" href="/transparency" className="border-ivory/25 text-ivory hover:bg-white/10">
              {locale === 'hi' ? 'पारदर्शिता बहीखाता देखें →' : 'View Verified Transparency Records →'}
            </Button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
