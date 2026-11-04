import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { siteConfig } from "@/config/site";

const { personal } = siteConfig;

export function PersonalProjects() {
  return (
    <section className="min-h-[50dvh] scroll-mt-24 py-20">
      <SectionHeading
        id="personal"
        num={personal.num}
        slug={personal.slug}
        title={personal.title}
        subtitle={personal.label}
      />

      <div className="grid gap-6 md:grid-cols-2">
        {personal.items.map((project, i) => (
          <Reveal key={project.title} delay={i * 0.08}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
