import { ArrowRight, Mail, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
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
          {/* System kicker + stat line */}
          <p className="text-code-sm text-on-surface-variant">
            <span aria-hidden>//</span> hello world
          </p>
          {/* <p className="text-code-sm mt-1 mb-7 text-primary">{profile.stats}</p> */}

          {/* Greeting + name */}
          <p className="text-headline-md mb-1 mt-7 font-normal text-on-surface-variant">
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
            <Button href="#featured">
              View Projects <ArrowRight className="size-4" />
            </Button>
            <Button href="#contact" variant="secondary">
              <Mail className="size-4" /> Get in Touch
            </Button>
            <Button
              href={profile.resumeUrl}
              variant="ghost"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download className="size-4" /> {profile.resumeLabel}
            </Button>
          </div>
        </Reveal>
      </div>

      {/* Portrait column — squared, bracket-cornered frame */}
      <Reveal delay={0.15} className="order-1 lg:order-2">
        <div className="bracket-corners relative mx-auto aspect-4/5 w-56 shrink-0 overflow-hidden border border-outline sm:w-64 lg:w-80">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={profile.avatar}
            alt={`${profile.name}, ${profile.role}`}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </Reveal>
    </section>
  );
}
