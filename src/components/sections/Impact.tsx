'use client';

import Image from 'next/image';
import { Utensils, Heart, Package, ShieldCheck, CheckCircle2 } from 'lucide-react';
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
    <section className="relative overflow-hidden bg-charcoal py-12 text-ivory md:py-16">
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
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            <ImpactCounter value={config.impact.mealsDistributed} label={t('impact_meals_distributed')} />
            <ImpactCounter value={config.impact.familiesSupported} label={t('impact_families_supported')} />
            <ImpactCounter value={config.transparency.foodPurchased} prefix="₹" label={locale === 'hi' ? 'राशन व सामग्री ख़रीदी' : 'Food & Groceries Purchased'} />
            <ImpactCounter value={config.impact.communitiesReached} label={locale === 'hi' ? 'वितरण अभियान संपन्न' : 'Community Drives'} />
          </div>
        </ScrollReveal>

        {/* Ground Economics & Sourcing */}
        <ScrollReveal delay={0.3}>
          <div className="mt-12 rounded-3xl bg-white/[0.04] border border-white/10 p-6 sm:p-8 md:p-10 backdrop-blur-md text-left">
            <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 text-amber-300 text-xs font-semibold tracking-wider uppercase mb-3">
                <ShieldCheck size={14} className="text-amber-300" />
                {locale === 'hi' ? 'अनुमानित लागत विवरण' : 'Estimated Cost Breakdown'}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-ivory">
                {t('impact_econ_title')}
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-ivory/70 leading-relaxed">
                {t('impact_econ_subtitle')}
              </p>
            </div>

            {/* 3 Relief Units Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Unit 1: Cooked Meal */}
              <div className="rounded-2xl bg-white/[0.05] border border-white/10 p-5 sm:p-6 flex flex-col justify-between hover:border-amber-400/40 transition-colors">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center shrink-0">
                      <Utensils size={20} />
                    </div>
                    <span className="text-lg font-mono font-bold text-amber-300 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20">
                      {t('impact_unit_meal_cost')}
                    </span>
                  </div>
                  <h4 className="font-serif text-lg font-semibold text-ivory">
                    {t('impact_unit_meal_title')}
                  </h4>
                  <p className="text-xs text-ivory/70 mt-1.5 leading-relaxed">
                    {t('impact_unit_meal_desc')}
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-white/10 space-y-2 text-[11px] text-ivory/80">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span>2 Chakki rotis + seasonal fresh sabzi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span>Turmeric tadka dal + steamed rice</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span>Compostable bagasse meal box</span>
                  </div>
                </div>
              </div>

              {/* Unit 2: Street Animal Bowl */}
              <div className="rounded-2xl bg-white/[0.05] border border-white/10 p-5 sm:p-6 flex flex-col justify-between hover:border-emerald-400/40 transition-colors">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                      <Heart size={20} />
                    </div>
                    <span className="text-lg font-mono font-bold text-emerald-300 px-3 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20">
                      {t('impact_unit_paws_cost')}
                    </span>
                  </div>
                  <h4 className="font-serif text-lg font-semibold text-ivory">
                    {t('impact_unit_paws_title')}
                  </h4>
                  <p className="text-xs text-ivory/70 mt-1.5 leading-relaxed">
                    {t('impact_unit_paws_desc')}
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-white/10 space-y-2 text-[11px] text-ivory/80">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span>Boiled turmeric rice mash with broth</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span>High-protein soya & egg nutrition</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span>Balanced kibble & clean water bowls</span>
                  </div>
                </div>
              </div>

              {/* Unit 3: Monthly Family Ration Kit */}
              <div className="rounded-2xl bg-white/[0.05] border border-white/10 p-5 sm:p-6 flex flex-col justify-between hover:border-blue-400/40 transition-colors">
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-400/20 text-blue-300 flex items-center justify-center shrink-0">
                      <Package size={20} />
                    </div>
                    <span className="text-lg font-mono font-bold text-blue-300 px-3 py-1 rounded-full bg-blue-400/10 border border-blue-400/20">
                      {t('impact_unit_kit_cost')}
                    </span>
                  </div>
                  <h4 className="font-serif text-lg font-semibold text-ivory">
                    {t('impact_unit_kit_title')}
                  </h4>
                  <p className="text-xs text-ivory/70 mt-1.5 leading-relaxed">
                    {t('impact_unit_kit_desc')}
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-white/10 space-y-2 text-[11px] text-ivory/80">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span>10 kg Chakki Atta + 5 kg Rice</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span>2 kg Protein Dal + 1 L Cooking Oil</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span>1 kg Salt, Haldi, Spices & Tea/Sugar</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Sourcing Guarantee Banner */}
            <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <span className="text-xs text-ivory/80 flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                <span>{t('impact_mandi_badge')}</span>
              </span>
              <span className="text-[11px] text-amber-300 font-medium">
                {locale === 'hi' ? 'पारदर्शी खर्च और खरीद' : 'Wholesale Mandi Procurement'}
              </span>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <Button variant="outline" href="/get-involved" className="mt-8">
            {t('impact_cta')}
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
}
