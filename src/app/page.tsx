import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Impact from "@/components/sections/Impact";
import HowItWorks from "@/components/sections/HowItWorks";
import Projects from "@/components/sections/Projects";
import PetBharPaws from "@/components/sections/PetBharPaws";
import GetInvolved from "@/components/sections/GetInvolved";
import Transparency from "@/components/sections/Transparency";
import Contact from "@/components/sections/Contact";
import ImpactSimulator from "@/components/features/ImpactSimulator";
import WallOfKindness from "@/components/features/WallOfKindness";

export default function Home() {
  return (
    <main>
      <Hero />
      <section className="py-8 sm:py-10 bg-warm-ivory/20 border-b border-charcoal/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <ImpactSimulator />
        </div>
      </section>
      <About />
      <Impact />
      <HowItWorks />
      <Projects />
      <PetBharPaws />
      <GetInvolved />
      <Transparency />
      <WallOfKindness />
      <Contact />
    </main>
  );
}
