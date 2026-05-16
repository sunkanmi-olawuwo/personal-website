import Image from "next/image";
import Link from "next/link";

import type { Project } from "@/lib/about-data";

type Props = {
  projects: readonly Project[];
};

function ArchiveLink() {
  return (
    <Link href="/archive" className="inline-arrow-link">
      Browse the full archive
    </Link>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const usesRemoteCover = project.coverImage?.startsWith("http");

  return (
    <article
      data-project-card
      className="interactive-surface flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-border/70 bg-[hsl(var(--surface)/0.96)] shadow-[var(--shadow-soft)]"
    >
      {project.coverImage ? (
        <div className="interactive-media relative aspect-[16/9] w-full overflow-hidden bg-[hsl(var(--surface-strong))]">
          <Image
            fill
            src={project.coverImage}
            alt={project.title}
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover"
            unoptimized={usesRemoteCover}
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="font-display text-lg font-bold tracking-[-0.02em] text-foreground">
          {project.title}
        </h3>
        <p className="text-sm leading-7 text-muted-foreground">
          {project.description}
        </p>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {project.stack.map((item) => (
            <span
              key={item}
              className="inline-flex items-center rounded-full border border-border/70 bg-[hsl(var(--surface-strong)/0.55)] px-2.5 py-0.5 font-display text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground"
            >
              {item}
            </span>
          ))}
        </div>
        {project.repoHref || project.liveHref ? (
          <div className="mt-auto flex flex-wrap gap-3 pt-2 text-xs">
            {project.liveHref ? (
              <Link
                href={project.liveHref}
                target={project.liveHref.startsWith("http") ? "_blank" : undefined}
                rel={project.liveHref.startsWith("http") ? "noreferrer" : undefined}
                className="font-display font-semibold uppercase tracking-[0.18em] text-foreground hover:text-[var(--section-accent,hsl(var(--accent)))]"
              >
                Live →
              </Link>
            ) : null}
            {project.repoHref ? (
              <Link
                href={project.repoHref}
                target="_blank"
                rel="noreferrer"
                className="font-display font-semibold uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground"
              >
                Source →
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default function ProjectsGrid({ projects }: Props) {
  return (
    <div data-projects-grid className="flex flex-col gap-8">
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <li key={project.title} className="flex">
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
      <div>
        <ArchiveLink />
      </div>
    </div>
  );
}
