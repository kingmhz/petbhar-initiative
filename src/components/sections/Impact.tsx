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
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden bg-charcoal py-10 text-ivory md:py-12">
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

        <ScrollReveal delay={0.2}>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            <ImpactCounter value={config.impact.peopleFed} label={t('impact_people_fed')} suffix="+" />
            <ImpactCounter value={config.impact.familiesSupported} label={t('impact_families_supported')} suffix="+" />
            <ImpactCounter value={config.impact.mealsDistributed} label={t('impact_meals_distributed')} suffix="+" />
            <ImpactCounter value={config.impact.communitiesReached} label={t('impact_communities_reached')} suffix="+" />
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <Button variant="outline" href="/get-involved" className="mt-6">
            {t('impact_cta')}
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
}
