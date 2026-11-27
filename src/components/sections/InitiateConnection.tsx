import {
  Mail,
  Phone,
  Code2,
  Briefcase,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { SocialMark, hasSocialMark } from "@/components/ui/BrandIcons";
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

/**
 * Email is the one action worth making large, so it reads as the address
 * itself rather than a row with an icon button beside it. Phone trails it as
 * a second option; everything else is a profile you open elsewhere, which is
 * what the chips are. All three come out of `contact.details`, so adding a
 * profile to the config adds a chip.
 */
const email = contact.details.find((d) => d.href.startsWith("mailto:"));
const phone = contact.details.find((d) => d.href.startsWith("tel:"));
const profiles = contact.details.filter((d) => d !== email && d !== phone);

export function InitiateConnection() {
  return (
    <section className="min-h-[50dvh] scroll-mt-24 py-20">
      {/* One run of text for the whole section: the heading's subtitle says
          what I'm open to and how to reach me, and nothing repeats it below. */}
      <SectionHeading
        id="contact"
        title={contact.title}
        subtitle={contact.label}
      />

      <Reveal>
        <div className="flex max-w-(--reading-max) flex-col gap-10">
          {email && (
            <div className="flex flex-col gap-3">
              <span className="text-label-caps text-on-surface-variant">
                Email me
              </span>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
                {/* Goes through MailtoButton for its dead-click fallback: a
                    visitor with no mail handler gets Gmail/Outlook/copy. */}
                <MailtoButton
                  email={email.value}
                  title="Send email"
                  className="text-headline-lg break-all text-on-surface underline decoration-primary/40 decoration-2 underline-offset-8 transition-colors hover:text-primary hover:decoration-primary"
                >
                  {email.value}
                </MailtoButton>
                <CopyButton value={email.value} label={email.label} withLabel />
              </div>

              {phone && (
                <a
                  href={phone.href}
                  title="Call"
                  data-umami-event="contact-open-phone"
                  className="text-body-md inline-flex w-fit items-center gap-2 text-on-surface-variant underline-offset-4 transition-colors hover:text-primary hover:underline"
                >
                  <Phone className="size-4" /> or call {phone.value}
                </a>
              )}
            </div>
          )}

          {profiles.length > 0 && (
            <div className="flex flex-col gap-3">
              <span className="text-label-caps text-on-surface-variant">
                Elsewhere
              </span>
              <ul className="flex flex-wrap gap-3">
                {profiles.map((d) => {
                  const Icon = iconMap[d.icon] ?? Mail;
                  return (
                    <li key={d.label}>
                      <a
                        href={d.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={`Open ${d.label}`}
                        data-umami-event={`contact-open-${d.label.toLowerCase()}`}
                        className="group text-body-md inline-flex h-12 items-center gap-2.5 rounded-full border border-outline-variant bg-surface-container pl-4 pr-5 text-on-surface transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
                      >
                        {hasSocialMark(d.brand) ? (
                          <SocialMark name={d.brand} className="size-5" />
                        ) : (
                          <Icon className="size-5" />
                        )}
                        {d.label}
                        <ArrowUpRight
                          className="size-4 text-on-surface-variant transition-colors group-hover:text-primary"
                          aria-hidden
                        />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </Reveal>
    </section>
  );
}
