'use client';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import config from '@/lib/siteConfig';

export default function Transparency() {
  return (
    <section className="bg-beige/50 py-10 md:py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-14 items-center">
          <div>
            <ScrollReveal>
              <SectionLabel>TRANSPARENCY</SectionLabel>
              <SectionHeading className="mt-4">
                You deserve to know<br />where the help goes.
              </SectionHeading>
              <p className="mt-3 text-sm sm:text-base text-warm-grey leading-relaxed">
                PetBhar believes trust is built through transparency. We document our initiatives, contributions and spending openly as we grow.
              </p>
              <Button variant="ghost" href="/transparency" className="mt-6">
                View Reports &rarr;
              </Button>
            </ScrollReveal>
          </div>

          <div>
            <ScrollReveal delay={0.2}>
              <div className="grid grid-cols-2 gap-3.5">
                <div className="rounded-xl border border-charcoal/5 bg-white p-4 sm:p-5">
                  <div className="text-xs uppercase tracking-wider text-warm-grey">Contributions Received</div>
                  <div className="mt-1 font-serif text-xl sm:text-2xl">₹{(config.transparency.contributionsReceived || 0).toLocaleString('en-IN')}</div>
                </div>
                <div className="rounded-xl border border-charcoal/5 bg-white p-4 sm:p-5">
                  <div className="text-xs uppercase tracking-wider text-warm-grey">Food Purchased</div>
                  <div className="mt-1 font-serif text-xl sm:text-2xl">₹{(config.transparency.foodPurchased || 0).toLocaleString('en-IN')}</div>
                </div>
                <div className="rounded-xl border border-charcoal/5 bg-white p-4 sm:p-5">
                  <div className="text-xs uppercase tracking-wider text-warm-grey">Meals Distributed</div>
                  <div className="mt-1 font-serif text-xl sm:text-2xl">{(config.transparency.mealsDistributed || 0).toLocaleString('en-IN')}</div>
                </div>
                <div className="rounded-xl border border-charcoal/5 bg-white p-4 sm:p-5">
                  <div className="text-xs uppercase tracking-wider text-warm-grey">Grocery Kits</div>
                  <div className="mt-1 font-serif text-xl sm:text-2xl">{(config.transparency.groceryKitsDistributed || 0).toLocaleString('en-IN')}</div>
                </div>
                <div className="col-span-full rounded-xl border border-charcoal/5 bg-white p-4 sm:p-5">
                  <div className="text-xs uppercase tracking-wider text-warm-grey">Families Supported</div>
                  <div className="mt-1 font-serif text-xl sm:text-2xl">{(config.transparency.familiesSupported || 0).toLocaleString('en-IN')}</div>
                </div>
              </div>

              <div className="mt-5 text-right">
                <Button variant="ghost" href="/transparency" className="text-xs">
                  View Full Public Audit Ledger &rarr;
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
