import Link from "next/link";

import type { Project } from "@/lib/about-data";

type Props = {
  projects: readonly Project[];
};

function StackChip({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border/70 bg-[hsl(var(--surface-strong)/0.55)] px-2.5 py-0.5 font-display text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
      {label}
    </span>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M14 4h6v6" />
      <path d="M10 14L20 4" />
      <path d="M19 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h5" />
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-4 w-4"
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.51-1.47.11-3.07 0 0 .97-.31 3.19 1.18A11 11 0 0 1 12 6.8c.98 0 1.97.13 2.89.39 2.22-1.49 3.19-1.18 3.19-1.18.62 1.6.23 2.78.11 3.07.74.81 1.19 1.84 1.19 3.1 0 4.43-2.69 5.4-5.25 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

const COLUMN_TEMPLATE =
  "sm:grid-cols-[4.5rem_minmax(0,1.4fr)_8rem_minmax(0,2fr)_4rem]";

export default function ArchiveTable({ projects }: Props) {
  return (
    <div
      data-archive-table
      className="overflow-hidden rounded-2xl border border-border/60 bg-[hsl(var(--surface)/0.92)] shadow-[var(--shadow-soft)]"
    >
      <div
        role="row"
        aria-label="Column headers"
        className={
          "hidden border-b border-border/70 bg-[hsl(var(--surface-strong)/0.95)] px-6 py-3.5 font-display text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-muted-foreground sm:grid sm:items-center sm:gap-6 " +
          COLUMN_TEMPLATE
        }
      >
        <span>Year</span>
        <span>Project</span>
        <span>Made at</span>
        <span>Built with</span>
        <span className="text-right">Link</span>
      </div>

      <ol className="flex flex-col">
        {projects.map((project, index) => {
          const primaryHref = project.liveHref ?? project.repoHref;
          const isLast = index === projects.length - 1;

          return (
            <li
              key={`${project.year}-${project.title}`}
              data-archive-row
              className={
                "group/row relative grid grid-cols-1 gap-3 px-6 py-5 transition-colors hover:bg-[hsl(var(--surface-strong)/0.4)] sm:items-start sm:gap-6 " +
                COLUMN_TEMPLATE +
                (isLast ? "" : " border-b border-border/40")
              }
            >
              <span
                aria-hidden
                className="pointer-events-none absolute inset-y-2 left-0 w-0.5 origin-center scale-y-0 rounded-full bg-[var(--country-accent,hsl(var(--accent)))] transition-transform duration-200 group-hover/row:scale-y-100"
              />

              <span className="font-display text-[0.78rem] font-bold uppercase tracking-[0.24em] text-muted-foreground sm:pt-0.5 sm:text-[0.78rem]">
                {project.year}
              </span>

              <div className="flex flex-col gap-1">
                {primaryHref ? (
                  <Link
                    href={primaryHref}
                    target={primaryHref.startsWith("http") ? "_blank" : undefined}
                    rel={primaryHref.startsWith("http") ? "noreferrer" : undefined}
                    className="font-display text-base font-bold leading-tight tracking-[-0.02em] text-foreground transition-[color,transform] duration-200 hover:text-primary group-hover/row:translate-x-1 sm:text-[1.05rem]"
                  >
                    {project.title}
                  </Link>
                ) : (
                  <span className="font-display text-base font-bold leading-tight tracking-[-0.02em] text-foreground transition-transform duration-200 group-hover/row:translate-x-1 sm:text-[1.05rem]">
                    {project.title}
                  </span>
                )}
                <p className="text-sm leading-6 text-muted-foreground sm:hidden">
                  {project.description}
                </p>
              </div>

              <span className="font-display text-[0.78rem] uppercase tracking-[0.16em] text-muted-foreground sm:pt-0.5">
                {project.madeAtHref ? (
                  <Link
                    href={project.madeAtHref}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-foreground"
                  >
                    {project.madeAt}
                  </Link>
                ) : (
                  project.madeAt ?? "—"
                )}
              </span>

              <div className="flex flex-wrap gap-1.5">
                {project.stack.map((item) => (
                  <StackChip key={item} label={item} />
                ))}
              </div>

              <div className="flex items-center gap-3 sm:justify-end sm:pt-0.5">
                {project.liveHref ? (
                  <Link
                    href={project.liveHref}
                    target={project.liveHref.startsWith("http") ? "_blank" : undefined}
                    rel={project.liveHref.startsWith("http") ? "noreferrer" : undefined}
                    aria-label={`Open ${project.title} live`}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <ExternalLinkIcon />
                  </Link>
                ) : null}
                {project.repoHref ? (
                  <Link
                    href={project.repoHref}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${project.title} repository`}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <GithubIcon />
                  </Link>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
