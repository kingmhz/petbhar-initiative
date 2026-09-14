'use client';

import { SectionLabel } from '@/components/ui/SectionLabel';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { Heart, Package, Truck, Sparkles } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: Heart,
      title: 'YOU SUPPORT',
      description: 'Donate, volunteer or contribute essentials to power our grassroots ground initiatives.'
    },
    {
      number: '02',
      icon: Package,
      title: 'WE SOURCE & PREPARE',
      description: 'We source quality ingredients and prepare nutritious meals & grocery kits with care.'
    },
    {
      number: '03',
      icon: Truck,
      title: 'WE DISTRIBUTE',
      description: 'Our team and volunteers reach out directly to verified individuals and communities in need.'
    },
    {
      number: '04',
      icon: Sparkles,
      title: 'LIVES CHANGE',
      description: 'Together we replace acute hunger with nourishment, health, dignity, and real hope.'
    }
  ];

  return (
    <section className="bg-ivory py-10 md:py-12 border-t border-charcoal/5">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <ScrollReveal>
          <SectionLabel>HOW IT WORKS</SectionLabel>
          <SectionHeading className="mt-4">
            Simple. Transparent.<br />Impactful.
          </SectionHeading>
        </ScrollReveal>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-4 relative">
          {/* Connecting line on desktop */}
          <div className="absolute top-10 left-[12.5%] right-[12.5%] hidden border-t border-dashed border-charcoal/20 md:block" />
          
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <ScrollReveal key={step.number} delay={index * 0.12} className="relative z-10 flex flex-col items-center">
                <div className="text-4xl sm:text-5xl font-serif font-light text-charcoal/15 select-none">{step.number}</div>
                <div className="mt-3 rounded-full bg-white shadow-sm border border-charcoal/5 p-3.5 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-charcoal" strokeWidth={1.75} />
                </div>
                <h3 className="mt-4 text-xs sm:text-sm font-semibold uppercase tracking-widest text-charcoal">{step.title}</h3>
                <p className="mt-2 text-xs sm:text-sm text-warm-grey max-w-xs leading-relaxed">{step.description}</p>
              </ScrollReveal>
            );
          })}
        </div>

        <ScrollReveal delay={0.4}>
          <Button variant="ghost" href="/about" className="mt-8">
            Learn More About Our Methodology &rarr;
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
}
