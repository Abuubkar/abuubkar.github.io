import type { Metadata } from "next";
import { toptalUrl } from "@/config/site";

/**
 * /toptal — a short link to the Toptal profile, for places that strip URL
 * fragments (LinkedIn's Featured section drops everything after "#", which
 * loses the referral code in `toptalUrl`).
 *
 * The site is a static export on GitHub Pages, which cannot send an HTTP 302,
 * so the redirect happens in the browser: a zero-delay meta refresh, plus a
 * plain link in case it is blocked. Both carry the full URL, fragment
 * included. To retarget the link, change `toptalUrl`.
 *
 * Not `redirect()` from next/navigation: in a static export it compiles to
 * the same meta refresh, but with a 1-second delay for temporary redirects.
 *
 * Kept out of search: noindex here, and it is not listed in sitemap.ts.
 */

export const metadata: Metadata = {
  title: "Abubakar Khawaja on Toptal",
  robots: { index: false, follow: false },
  // The layout's canonical points at "/"; a redirect page should not claim it.
  alternates: { canonical: null },
};

export default function ToptalRedirect() {
  return (
    <>
      <meta httpEquiv="refresh" content={`0;url=${toptalUrl}`} />
      <main className="grid min-h-dvh place-items-center p-6">
        <p className="text-body-md text-on-surface-variant">
          Redirecting to{" "}
          <a href={toptalUrl} className="text-primary underline">
            my Toptal profile
          </a>
          …
        </p>
      </main>
    </>
  );
}
