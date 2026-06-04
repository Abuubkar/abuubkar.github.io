import {
  Mail,
  Phone,
  Code2,
  Briefcase,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { CopyButton } from "@/components/ui/CopyButton";
import { MailtoButton } from "@/components/ui/MailtoButton";
import { siteConfig } from "@/config/site";

const { contact } = siteConfig;

const iconMap: Record<string, LucideIcon> = {
  Mail,
  Phone,
  Code2,
  Briefcase,
};

/** Derives the "open" action's tooltip + whether it leaves the site. */
function openMeta(href: string, label: string) {
  if (href.startsWith("mailto:")) return { title: "Send email", external: false };
  if (href.startsWith("tel:")) return { title: "Call", external: false };
  return { title: `Open ${label}`, external: true };
}

export function InitiateConnection() {
  return (
    <section className="min-h-[50dvh] scroll-mt-24 py-20">
      <SectionHeading
        id="contact"
        num={contact.num}
        slug={contact.slug}
        title={contact.title}
        subtitle={contact.label}
      />

      <Reveal>
        <div className="flex max-w-(--reading-max) flex-col gap-6">
          <p className="text-body-lg max-w-md text-on-surface-variant">
            {contact.blurb}
          </p>

          <ul className="flex flex-col gap-3">
            {contact.details.map((d) => {
              const Icon = iconMap[d.icon] ?? Mail;
              const { title, external } = openMeta(d.href, d.label);
              const copyText = external ? d.href : d.value;
              const isMailto = d.href.startsWith("mailto:");
              return (
                <li
                  key={d.label}
                  className="flex items-center gap-4 rounded-lg border border-outline-variant bg-surface-container p-4"
                >
                  {/* Info — display only, not interactive */}
                  <span
                    className="grid size-10 shrink-0 place-items-center text-on-surface-variant"
                    aria-hidden
                  >
                    <Icon className="size-5" />
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="text-label-caps text-on-surface-variant">
                      {d.label}
                    </span>
                    <span className="text-body-md truncate text-on-surface">
                      {d.value}
                    </span>
                  </div>

                  {/* Actions — two explicit, labeled buttons */}
                  <div className="flex shrink-0 items-center gap-2">
                    {isMailto ? (
                      <MailtoButton email={d.value} title={title} />
                    ) : (
                      <a
                        href={d.href}
                        {...(external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        title={title}
                        aria-label={title}
                        className="grid size-10 place-items-center rounded-md border border-outline-variant text-on-surface-variant transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
                      >
                        <ArrowUpRight className="size-4" />
                      </a>
                    )}
                    <CopyButton value={copyText} label={d.label} />
                  </div>
                </li>
              );
            })}
          </ul>

          <p className="text-code-sm text-on-surface-variant">
            <span className="text-primary">//</span> open{" "}
            <ArrowUpRight className="inline size-3.5 align-[-2px]" /> or copy any
            detail
          </p>
        </div>
      </Reveal>
    </section>
  );
}
