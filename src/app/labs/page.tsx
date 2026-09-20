import type { Metadata } from "next";
import Script from "next/script";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { VoiceLab } from "@/components/sections/VoiceLab";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/config/site";

const { profile, labs } = siteConfig;

export const metadata: Metadata = {
  title: labs.page.title,
  description: labs.page.description,
  alternates: { canonical: labs.href },
  openGraph: {
    title: labs.page.title,
    description: labs.page.description,
    url: labs.href,
  },
};

export default function LabsPage() {
  return (
    <>
      {/* Adds COOP/COEP to /labs/ responses so WASM can use threads. Scoped to
          this directory; the home page usually registers it first, in which
          case this script finds the page already isolated and does nothing. */}
      <Script src="/labs/coi-serviceworker.js" strategy="afterInteractive" />

      <header className="sticky top-0 z-40 h-[var(--spacing-nav-height)] border-b border-outline-variant bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-[var(--container-max)] items-center justify-between gap-4 px-5 sm:px-6">
          {/* Plain anchors on purpose, as everywhere else on this site:
              next/link would prefetch the route, and a full page load is
              what we want when crossing the isolation boundary anyway. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/"
            className="flex items-center gap-2 text-on-surface"
            aria-label={profile.brand}
          >
            <span
              className="grid size-6 place-items-center rounded-sm bg-on-surface text-background"
              aria-hidden
            >
              <ChevronRight className="size-4" strokeWidth={2.5} />
            </span>
            <span className="text-code-sm font-semibold lowercase tracking-tight">
              {profile.brand}
            </span>
          </a>

          <a
            href={`/#${labs.slug}`}
            data-umami-event="labs-back"
            className="text-label-caps flex items-center gap-2 lowercase text-on-surface-variant transition-colors hover:text-on-surface"
          >
            <ArrowLeft className="size-4" aria-hidden />
            {labs.page.back}
          </a>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[var(--container-max)] px-5 sm:px-6">
        <div className="flex flex-col gap-4 pb-4 pt-16">
          <p className="text-code-sm text-on-surface-variant">
            <span className="text-primary">{labs.num}</span>{" "}
            <span aria-hidden>{"//"}</span> {labs.slug}
          </p>
          <h1 className="text-headline-lg text-on-surface">{labs.title}</h1>
          <p className="text-body-lg max-w-(--reading-max) text-on-surface-variant">
            {labs.page.intro}
          </p>
        </div>

        <VoiceLab />
        <Footer />
      </main>
    </>
  );
}
