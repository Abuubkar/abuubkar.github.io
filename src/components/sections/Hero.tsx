import { ArrowRight, Mail, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GithubMark, LinkedinMark } from "@/components/ui/BrandIcons";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/config/site";

const { profile } = siteConfig;

export function Hero() {
  return (
    <section
      id="home"
      className="flex min-h-[60dvh] scroll-mt-24 flex-col gap-12 py-20 lg:flex-row lg:items-center lg:justify-between lg:gap-24"
    >
      {/* Text column */}
      <div className="order-2 flex-1 lg:order-1">
        <Reveal>
          {/* Greeting + name */}
          <p className="text-headline-md mb-1 font-normal text-on-surface-variant">
            {profile.greeting}
          </p>
          <h1 className="text-display-lg text-on-surface">{profile.name}</h1>

          {/* Role */}
          <p className="text-code-sm mt-4 text-on-surface-variant">
            {profile.role} · {profile.experience}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="text-body-md mt-6 max-w-xl text-on-surface-variant">
            {profile.pitch}{" "}
            <span className="font-medium text-primary">
              {profile.pitchHighlight}
            </span>
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button
              href="#featured"
              data-umami-event="hero-cta-view-projects"
            >
              View Projects <ArrowRight className="size-4" />
            </Button>
            <Button
              href="#contact"
              variant="secondary"
              data-umami-event="hero-cta-get-in-touch"
            >
              <Mail className="size-4" /> Get in Touch
            </Button>
            <Button
              href={profile.resumeUrl}
              variant="ghost"
              target="_blank"
              rel="noopener noreferrer"
              data-umami-event="cv-download"
            >
              <Download className="size-4" /> {profile.resumeLabel}
            </Button>
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          {/* Profile links under the CTAs: bare brand marks, no container, so
              they read as a quiet second row rather than a fourth button. The
              negative margin pulls the first one back into line with the
              buttons above, since the padding is only there for the tap
              target. */}
          <div className="-ml-2 mt-4 flex items-center gap-1">
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub profile"
              title="GitHub"
              className="grid size-10 place-items-center rounded-md opacity-85 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              data-umami-event="hero-social-github"
            >
              <GithubMark className="size-6" />
            </a>
            <a
              href={profile.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn profile"
              title="LinkedIn"
              className="grid size-10 place-items-center rounded-md opacity-85 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              data-umami-event="hero-social-linkedin"
            >
              <LinkedinMark className="size-6" />
            </a>
          </div>
        </Reveal>
      </div>

      {/* Portrait column — squared, bracket-cornered frame */}
      <Reveal delay={0.15} slideOnly className="order-1 lg:order-2">
        <div className="bracket-corners relative mx-auto aspect-4/5 w-56 shrink-0 overflow-hidden rounded-xl border border-outline/60 shadow-xl sm:w-64 lg:w-80">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.avatar}
            alt={`${profile.name}, ${profile.role}`}
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </Reveal>
    </section>
  );
}
