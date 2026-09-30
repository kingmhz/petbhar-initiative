'use client';
import Image from 'next/image';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import config from '@/lib/siteConfig';

export default function PetBharPaws() {
  const animalsFed = config.impact?.animalsFed ?? 3;

  return (
    <section className="bg-ivory py-10 md:py-12 border-t border-charcoal/5">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid items-center gap-10 md:grid-cols-2 lg:gap-14">
          <div>
            <ScrollReveal>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <SectionLabel>PETBHAR PAWS</SectionLabel>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-xs font-semibold">
                  <span>🐾</span> {animalsFed} Stray Animals Fed
                </span>
              </div>
              <h2 className="mt-2 font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-charcoal leading-tight">
                Because they<br />matter too.
              </h2>
              <p className="mt-3 text-base sm:text-lg text-charcoal/80 font-medium">
                Food. Water. Rescue. Care.
              </p>
              <p className="mt-3 text-xs sm:text-sm text-warm-grey leading-relaxed max-w-lg">
                Our dedicated initiative for street animals. We organize daily community feeding drives, maintain clean water bowls, coordinate first-aid treatments, and build toward long-term vaccination and foster networks.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Button variant="outline" href="/paws" className="border-charcoal/20 text-charcoal hover:bg-charcoal/5">
                  Explore PetBhar Paws
                </Button>
                <span className="text-xs text-warm-grey font-medium">
                  {animalsFed} animals documented on ground
                </span>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.2}>
            <div className="relative w-full overflow-hidden rounded-2xl shadow-md border border-charcoal/10 bg-beige aspect-[16/10]">
              <Image
                src="/images/petbhar_paws_feeding.jpg"
                alt="Dogs and cats eating from PetBhar Paws feeding bowls"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={85}
                className="object-cover"
              />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
