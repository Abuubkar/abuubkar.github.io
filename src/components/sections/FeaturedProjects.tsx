import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { siteConfig } from "@/config/site";

const { projects } = siteConfig;

export function FeaturedProjects() {
  return (
    <section className="min-h-[50dvh] scroll-mt-24 py-20">
      <SectionHeading
        id="featured"
        num={projects.num}
        slug={projects.slug}
        title={projects.title}
        subtitle={projects.label}
      />

      <div className="grid gap-6 md:grid-cols-2">
        {projects.items.map((project, i) => (
          <Reveal key={project.title} delay={i * 0.08}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
