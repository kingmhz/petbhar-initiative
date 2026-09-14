'use client';
import Image from 'next/image';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/Button';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { ArrowUpRight } from 'lucide-react';
import config from '@/lib/siteConfig';
import Link from 'next/link';

export default function Projects() {
  return (
    <section className="bg-charcoal py-10 text-ivory md:py-12">
      <div className="mx-auto max-w-7xl px-6">
        <ScrollReveal>
          <SectionLabel dark>OUR PROJECTS</SectionLabel>
          <SectionHeading className="mt-4 text-ivory">
            Current Initiatives
          </SectionHeading>
          <p className="mt-3 text-sm sm:text-base text-ivory/60">
            Every project is a step closer to a hunger-free tomorrow.
          </p>
        </ScrollReveal>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {config.projects.map((project, index) => (
            <ScrollReveal key={project.id} delay={index * 0.2}>
              <Link href={`/work#${project.id}`} className="group block overflow-hidden rounded-2xl border border-ivory/10 bg-charcoal transition-all hover:border-ivory/20">
                <div className="relative h-40 sm:h-44 overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    quality={80}
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="relative p-5">
                  <h3 className="font-serif text-lg sm:text-xl">{project.title}</h3>
                  <p className="mt-1.5 text-xs sm:text-sm text-ivory/60">{project.description}</p>
                  <ArrowUpRight className="absolute bottom-5 right-5 h-4 w-4 text-ivory/40 transition-colors group-hover:text-ivory" />
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.4}>
          <Button variant="outline" href="/work" className="mt-6">
            View All Projects
          </Button>
        </ScrollReveal>
      </div>
    </section>
  );
}
