import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { KeyboardNav } from "@/components/interactions/KeyboardNav";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { Hero } from "@/components/sections/Hero";
import { TechnicalArsenal } from "@/components/sections/TechnicalArsenal";
import { ProfessionalTrajectory } from "@/components/sections/ProfessionalTrajectory";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { PersonalProjects } from "@/components/sections/PersonalProjects";
import { Certifications } from "@/components/sections/Certifications";
import { InitiateConnection } from "@/components/sections/InitiateConnection";
import { siteConfig, siteUrl } from "@/config/site";

const { profile, arsenal, trajectory } = siteConfig;

/** Person schema so search engines connect the site, socials, and role. */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  description: profile.metaDescription,
  url: siteUrl,
  // The OG card is served at a stable path; the avatar's bundle URL is
  // content-hashed and would 404 in crawled copies after a redesign.
  image: `${siteUrl}/opengraph-image.png`,
  email: `mailto:${profile.email}`,
  sameAs: [profile.socials.github, profile.socials.linkedin],
  address: {
    "@type": "PostalAddress",
    addressLocality: profile.addressLocality,
    addressCountry: profile.addressCountry,
  },
  worksFor: {
    "@type": "Organization",
    name: (
      trajectory.experience.find((job) => job.current) ??
      trajectory.experience[0]
    ).company,
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: trajectory.education[0].school,
  },
  knowsAbout: arsenal.items.map((tech) => tech.name),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          // Escape "<" so config text can never close the script tag early.
          __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <TopNav />
      <KeyboardNav />
      <main className="mx-auto w-full max-w-[var(--container-max)] px-5 pt-[var(--spacing-nav-height)] sm:px-6">
        <Hero />
        <TechnicalArsenal />
        <ProfessionalTrajectory />
        <FeaturedProjects />
        <PersonalProjects />
        <Certifications />
        <InitiateConnection />
        <Footer />
      </main>
      <ScrollToTop />
    </>
  );
}
