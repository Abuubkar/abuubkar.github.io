import {
  Atom,
  Triangle,
  FileCode2,
  Braces,
  Code2,
  Server,
  Database,
  Workflow,
  Layers,
  Container,
  GitBranch,
  CreditCard,
  Hash,
  Loader,
  List,
  Cloud,
  BookOpen,
  Hexagon,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { siteConfig } from "@/config/site";

const iconMap: Record<string, LucideIcon> = {
  Atom,
  Triangle,
  FileCode2,
  Braces,
  Code2,
  Server,
  Database,
  Workflow,
  Layers,
  Container,
  GitBranch,
  CreditCard,
  Hash,
  Loader,
  List,
  Cloud,
  BookOpen,
};

const { arsenal } = siteConfig;

export function TechnicalArsenal() {
  return (
    <section className="min-h-[50dvh] scroll-mt-24 py-20">
      <SectionHeading
        id="arsenal"
        num={arsenal.num}
        slug={arsenal.slug}
        title={arsenal.title}
        subtitle={arsenal.label}
      />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {arsenal.items.map((tech, i) => {
          const Icon = iconMap[tech.icon] ?? Hexagon;
          return (
            <Reveal key={tech.name} delay={i * 0.04}>
              <div className="group flex items-center gap-4 rounded-lg border border-outline-variant bg-surface-container p-4 transition-all duration-200 hover:border-primary/60 hover:bg-surface-container-high">
                {/* 48px bordered icon container, 5% primary fill on hover */}
                <span className="grid size-12 shrink-0 place-items-center rounded-md border border-outline-variant transition-colors group-hover:border-primary group-hover:bg-primary/5">
                  <Icon className="size-5 text-on-surface-variant transition-colors group-hover:text-primary" />
                </span>
                <span className="text-body-md text-on-surface">{tech.name}</span>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
