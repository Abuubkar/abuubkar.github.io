import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/config/site";
import { VoiceLab } from "@/features/voice-lab";
import { IsolationGuard } from "./IsolationGuard";
import { LabsHeader } from "./LabsHeader";

const { labs } = siteConfig;

/**
 * The whole /labs/ surface: chrome, isolation, and the experiments.
 *
 * The route file owns only metadata, so adding EXP.02 is a change here and
 * nowhere else. Owning the isolation script matters too — it is a property
 * of this page, not of the route that happens to render it.
 */
export function LabsPage() {
  return (
    <>
      {/* Makes sure COOP/COEP reach this page so WASM can use threads. The
          home page usually registers the worker first, in which case this
          finds the page already isolated and does nothing. */}
      <IsolationGuard />

      <LabsHeader />

      <main className="mx-auto w-full max-w-[var(--container-max)] px-5 sm:px-6">
        <div className="flex flex-col gap-4 pb-4 pt-16">
          {/* No hex index or slug here: those number the sections of the home
              page. On its own route the page is just Labs. */}
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
