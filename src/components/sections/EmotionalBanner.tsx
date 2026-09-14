'use client';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export default function EmotionalBanner() {
  return (
    <section className="relative flex min-h-[500px] h-[70vh] items-center justify-center">
      <Image
        src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=1920&q=80"
        alt="Emotional background"
        fill
        sizes="100vw"
        quality={80}
        className="object-cover"
      />
      <div className="absolute inset-0 bg-charcoal/50" />
      <div className="relative z-10 w-full max-w-3xl px-6 text-center text-ivory">
        <ScrollReveal>
          <h2 className="font-serif text-4xl font-light md:text-5xl lg:text-6xl">
            Together, we can end<br />hunger in our community.
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button variant="secondary" href="/get-involved">Support Us</Button>
            <Button variant="outline" href="/get-involved">Get Involved</Button>
          </div>
          <p className="mt-12 font-serif text-lg italic text-ivory/60">
            Small acts. Big impact.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
