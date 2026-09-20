"use client";

import { ArrowRight, FlaskConical } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/config/site";
import { prewarmIsolation } from "../lib/isolation";

const { labs } = siteConfig;

/**
 * Home-page card pointing at /labs/. Hovering (or focusing) the CTA registers
 * the cross-origin isolation worker, so the experiments are already
 * multi-threaded by the time the click lands — see src/features/labs/lib/isolation.ts.
 */
export function LabsTeaser() {
  return (
    <section className="scroll-mt-24 py-20">
      <SectionHeading
        id={labs.slug}
        num={labs.num}
        slug={labs.slug}
        title={labs.title}
        subtitle={labs.label}
      />

      <Reveal>
        <div className="bracket-corners flex flex-col gap-6 rounded-lg border border-outline bg-surface-container p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex max-w-(--reading-max) flex-col gap-4">
            <div className="flex items-center gap-3">
              <span
                className="grid size-10 place-items-center rounded-md border border-outline-variant text-primary"
                aria-hidden
              >
                <FlaskConical className="size-5" />
              </span>
              <span className="text-label-caps text-on-surface-variant">
                {labs.voice.num} · {labs.voice.title}
              </span>
            </div>
            <p className="text-body-lg text-on-surface-variant">
              {labs.teaser.blurb}
            </p>
            <ul className="flex flex-col gap-1.5">
              {labs.teaser.bullets.map((line) => (
                <li key={line} className="text-code-sm text-on-surface-variant">
                  <span className="text-primary">{"//"}</span> {line}
                </li>
              ))}
            </ul>
          </div>

          <Button
            variant="secondary"
            href={labs.href}
            onMouseEnter={prewarmIsolation}
            onFocus={prewarmIsolation}
            onTouchStart={prewarmIsolation}
            data-umami-event="labs-open"
            className="shrink-0"
          >
            {labs.teaser.cta}
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
