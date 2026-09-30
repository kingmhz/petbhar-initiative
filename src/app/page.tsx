import Hero from "@/components/sections/Hero";
import ImpactSimulator from "@/components/features/ImpactSimulator";
import PaymentBarcode from "@/components/features/PaymentBarcode";
import HomePillars from "@/components/sections/HomePillars";
import EmotionalBanner from "@/components/sections/EmotionalBanner";

export default function Home() {
  return (
    <main>
      <Hero />

      {/* Interactive Impact Calculator & Direct Payment Barcode */}
      <section className="py-14 sm:py-18 md:py-22 bg-warm-ivory/20 border-b border-charcoal/5" id="calculator">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
            <span className="text-[11px] font-semibold tracking-widest uppercase text-terracotta bg-terracotta/10 px-3.5 py-1.5 rounded-full inline-block">
              Community Impact &amp; Support
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-charcoal mt-3">
              Calculate Impact &amp; Contribute
            </h2>
            <p className="text-xs sm:text-sm text-charcoal/70 mt-2.5 max-w-xl mx-auto">
              Choose your contribution to see the exact cooked meals and animal feeding bowls it provides, then scan our verified payment barcode to donate instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 xl:col-span-8">
              <ImpactSimulator />
            </div>
            <div className="lg:col-span-5 xl:col-span-4 flex justify-center">
              <PaymentBarcode />
            </div>
          </div>
        </div>
      </section>

      <HomePillars />
      <EmotionalBanner />
    </main>
  );
}
