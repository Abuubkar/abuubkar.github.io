import { Code2, Briefcase, AtSign, type LucideIcon } from "lucide-react";
import { siteConfig } from "@/config/site";

const { footer } = siteConfig;

const iconMap: Record<string, LucideIcon> = {
  Code2,
  Briefcase,
  AtSign,
};

export function Footer() {
  return (
    <footer className="mt-10 border-t border-outline-variant py-8">
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex flex-col items-center gap-1 sm:items-start">
          <p className="text-code-sm text-on-surface-variant">
            {footer.copyright}
          </p>
          <p className="text-code-sm text-on-surface-variant/70">
            press{" "}
            <kbd className="rounded border border-outline-variant bg-surface-container px-1.5 py-0.5 text-on-surface">
              ?
            </kbd>{" "}
            for shortcuts
          </p>
        </div>
        <ul className="flex items-center gap-2">
          {footer.socials.map(({ label, icon, href }) => {
            const Icon = iconMap[icon] ?? AtSign;
            return (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-md border border-outline-variant text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="size-4" />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </footer>
  );
}
