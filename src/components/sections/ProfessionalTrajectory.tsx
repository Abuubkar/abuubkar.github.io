import { BriefcaseBusiness, GraduationCap } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/config/site";

const { trajectory } = siteConfig;

function Tags({ tags }: { tags: readonly string[] }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li
          key={tag}
          className="text-code-sm rounded border border-outline-variant bg-surface-container-low px-2.5 py-1 text-on-surface-variant"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}

function Node({
  current,
  icon: Icon,
}: {
  current?: boolean;
  icon: typeof BriefcaseBusiness;
}) {
  return (
    <span
      className={`absolute left-[-18px] grid size-9 place-items-center rounded-full border ${
        current
          ? "border-primary bg-primary text-on-primary"
          : "border-outline bg-surface-container-lowest text-on-surface-variant"
      }`}
      aria-hidden
    >
      <Icon className="size-4" />
    </span>
  );
}

export function ProfessionalTrajectory() {
  return (
    <section className="min-h-[50dvh] scroll-mt-24 py-20">
      <SectionHeading
        id="trajectory"
        num={trajectory.num}
        slug={trajectory.slug}
        title={trajectory.title}
        subtitle={trajectory.label}
      />

      <ol className="relative ml-[18px] max-w-(--reading-max) border-l border-outline-variant pl-10">
        {trajectory.experience.map((role, i) => (
          <li key={role.title + role.company} className="mb-10">
            <Node current={role.current} icon={BriefcaseBusiness} />
            <Reveal delay={i * 0.08}>
              <div className="rounded-lg border border-outline-variant bg-surface-container p-6 transition-colors hover:border-outline">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="text-headline-md text-on-surface">
                    {role.title}{" "}
                    <span className="text-primary">@ {role.company}</span>
                  </h3>
                  <span className="text-label-caps text-on-surface-variant">
                    {role.period}
                  </span>
                </div>
                <p className="text-body-md text-on-surface-variant mt-3">
                  {role.summary}
                </p>
                <ul className="mt-4 space-y-2">
                  {role.highlights.map((h) => (
                    <li
                      key={h}
                      className="text-body-md text-on-surface-variant relative pl-5 before:absolute before:left-0 before:top-2.5 before:size-1.5 before:rounded-full before:bg-primary"
                    >
                      {h}
                    </li>
                  ))}
                </ul>
                <Tags tags={role.tags} />
              </div>
            </Reveal>
          </li>
        ))}

        {trajectory.education.map((edu, i) => (
          <li key={edu.degree} className="mb-10 last:mb-0">
            <Node icon={GraduationCap} />
            <Reveal delay={(trajectory.experience.length + i) * 0.08}>
              <div className="rounded-lg border border-outline-variant bg-surface-container p-6 transition-colors hover:border-outline">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="text-headline-md text-on-surface">
                    {edu.degree}{" "}
                    <span className="text-primary">@ {edu.school}</span>
                  </h3>
                </div>
                <p className="text-body-md text-on-surface-variant mt-3">
                  {edu.detail}
                </p>
                <Tags tags={edu.tags} />
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
