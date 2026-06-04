import { ExternalLink, Sparkles, Code2 } from "lucide-react";
import { ProjectImage } from "@/components/ui/ProjectImage";
import type { Project } from "@/config/site";

const MAX_TAGS = 8;

/** A single project card. Optional screenshot header (falls back to a faint
 *  initial), Featured/Live badges, and explicit right-aligned Visit/Source
 *  links. Static card — only the links are interactive. */
export function ProjectCard({ project }: { project: Project }) {
  const live = project.href.startsWith("http");
  const hasLinks = live || !!project.repo;

  const shownTags = project.tags.slice(0, MAX_TAGS);
  const hiddenTags = project.tags.slice(MAX_TAGS);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-md border border-outline-variant bg-surface-container-lowest">
      {/* Visual header — screenshot, or a faint initial fallback */}
      <div className="relative h-52 overflow-hidden border-b border-outline-variant bg-surface-container-high">
        {project.image ? (
          <ProjectImage
            src={project.image}
            alt={`${project.title} screenshot`}
            letter={project.title.charAt(0)}
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <span
              aria-hidden
              className="text-display-lg select-none font-bold text-on-surface/15"
            >
              {project.title.charAt(0)}
            </span>
          </div>
        )}
        <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
          {project.featured && (
            <span className="text-label-caps flex items-center gap-1.5 rounded-full border border-secondary/60 bg-secondary-container px-2.5 py-1 text-on-secondary-container">
              <Sparkles className="size-3" /> Featured
            </span>
          )}
          {project.live && (
            <span className="text-label-caps flex items-center gap-1.5 rounded-full bg-success px-2.5 py-1 text-on-success">
              <span className="inline-block size-1.5 animate-pulse rounded-full bg-white/90" />
              Live
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-headline-md text-on-surface">{project.title}</h3>
        <p className="text-code-sm mt-1 text-on-surface-variant">
          {project.meta}
        </p>
        <p className="text-body-md mt-3 flex-1 text-on-surface-variant">
          {project.blurb}
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {shownTags.map((tag) => (
            <li
              key={tag}
              className="text-code-sm rounded border border-outline-variant bg-surface-container-low px-2.5 py-1 text-on-surface-variant"
            >
              {tag}
            </li>
          ))}
          {hiddenTags.length > 0 && (
            <li
              title={hiddenTags.join(", ")}
              className="text-code-sm cursor-default rounded border border-outline-variant bg-surface-container-low px-2.5 py-1 text-on-surface-variant"
            >
              +{hiddenTags.length}
            </li>
          )}
        </ul>

        {/* Explicit action links — right-aligned, leading icons */}
        {hasLinks && (
          <div className="mt-5 flex items-center justify-end gap-5 border-t border-outline-variant pt-4">
            {live && (
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit ${project.title}`}
                className="text-label-caps inline-flex items-center gap-1.5 text-primary transition-opacity hover:opacity-70"
              >
                <ExternalLink className="size-3.5" /> Visit
              </a>
            )}
            {project.repo && (
              <a
                href={project.repo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.title} source on GitHub`}
                className="text-label-caps inline-flex items-center gap-1.5 text-on-surface-variant transition-colors hover:text-on-surface"
              >
                <Code2 className="size-3.5" /> Source
              </a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
