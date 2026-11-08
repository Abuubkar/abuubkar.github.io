import { ArrowLeft, ChevronRight } from "lucide-react";
import { siteConfig } from "@/config/site";

const { profile, labs } = siteConfig;

/** Slim chrome for the lab: the site's wordmark and a way back. The home
 *  page's full nav is all hash links, which would be dead ends here. */
export function LabsHeader() {
  return (
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
  );
}
