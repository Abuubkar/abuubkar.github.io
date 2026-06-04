import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { KeyboardNav } from "@/components/interactions/KeyboardNav";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { Hero } from "@/components/sections/Hero";
import { TechnicalArsenal } from "@/components/sections/TechnicalArsenal";
import { ProfessionalTrajectory } from "@/components/sections/ProfessionalTrajectory";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { PersonalProjects } from "@/components/sections/PersonalProjects";
import { InitiateConnection } from "@/components/sections/InitiateConnection";

export default function Home() {
  return (
    <>
      <TopNav />
      <KeyboardNav />
      <main className="mx-auto w-full max-w-[var(--container-max)] px-5 pt-[var(--spacing-nav-height)] sm:px-6">
        <Hero />
        <TechnicalArsenal />
        <ProfessionalTrajectory />
        <FeaturedProjects />
        <PersonalProjects />
        <InitiateConnection />
        <Footer />
      </main>
      <ScrollToTop />
    </>
  );
}
