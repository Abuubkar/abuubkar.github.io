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
  Brain,
  Sparkles,
  Zap,
  Radio,
  Activity,
  Bot,
  Binary,
  Search,
  Link2,
  Plug,
  Wand2,
  Brackets,
  MessageSquare,
  Gauge,
  Cpu,
  Network,
  Waypoints,
  ScanSearch,
  Hexagon,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TechMark, hasTechMark } from "@/components/ui/TechIcons";
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
  Brain,
  Sparkles,
  Zap,
  Radio,
  Activity,
  Bot,
  Binary,
  Search,
  Link2,
  Plug,
  Wand2,
  Brackets,
  MessageSquare,
  Gauge,
  Cpu,
  Network,
  Waypoints,
  ScanSearch,
};

const { arsenal } = siteConfig;

export function TechnicalArsenal() {
  return (
    <section className="min-h-[50dvh] scroll-mt-24 py-20">
      <SectionHeading
        id="arsenal"
        title={arsenal.title}
        subtitle={arsenal.label}
      />
      <div className="flex flex-col gap-8">
        {arsenal.groups.map((group, g) => (
          <Reveal key={group.label} delay={g * 0.06}>
            {/* Named group: the chips inside run their own `group` hover for
                the lucide fallback icons, so the row needs its own handle. */}
            <div className="group/row flex flex-col gap-3 sm:flex-row sm:gap-6">
              {/* Fixed-width label column so the chip runs all start on the
                  same line, the way the section headings do. */}
              <h3 className="text-code-sm shrink-0 pt-1.5 text-on-surface-variant transition-colors group-hover/row:text-primary sm:w-52">
                {group.label}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((tech) => {
                  const Icon = iconMap[tech.icon] ?? Hexagon;
                  return (
                    <li
                      key={tech.name}
                      className="text-code-sm group flex items-center gap-2 rounded border border-outline-variant bg-surface-container-low px-2.5 py-1.5 text-on-surface transition-colors hover:border-primary hover:bg-surface-container-high"
                    >
                      {hasTechMark(tech.brand) ? (
                        <TechMark slug={tech.brand!} className="h-4 w-auto shrink-0" />
                      ) : (
                        <Icon className="size-4 shrink-0 text-on-surface-variant transition-colors group-hover:text-primary" />
                      )}
                      {tech.name}
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
