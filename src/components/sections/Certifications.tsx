import { Award } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/config/site";

const { certifications } = siteConfig;

export function Certifications() {
  return (
    <section className="min-h-[50dvh] scroll-mt-24 py-20">
      <SectionHeading
        id="certifications"
        num={certifications.num}
        slug={certifications.slug}
        title={certifications.title}
        subtitle={certifications.label}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {certifications.items.map((cert, i) => (
          <Reveal key={cert.name} delay={i * 0.08}>
            <div className="group flex items-start gap-4 rounded-lg border border-outline-variant bg-surface-container p-5 transition-all duration-200 hover:border-primary/60 hover:bg-surface-container-high">
              <span className="grid size-12 shrink-0 place-items-center rounded-md border border-outline-variant transition-colors group-hover:border-primary group-hover:bg-primary/5">
                <Award className="size-5 text-on-surface-variant transition-colors group-hover:text-primary" />
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-body-lg font-medium text-on-surface">
                  {cert.name}
                </span>
                <span className="text-body-sm text-on-surface-variant">
                  {cert.issuer} · {cert.date}
                </span>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
