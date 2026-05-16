import Link from "next/link";
import type { CSSProperties } from "react";

import type {
  Certification,
  CertificationIssuerKind,
} from "@/lib/about-data";
import { cn } from "@/lib/utils";

type Props = {
  certifications: readonly Certification[];
};

type IssuerStyle = CSSProperties & { "--issuer-accent"?: string };

const ISSUER_ACCENT: Record<CertificationIssuerKind, string> = {
  azure: "hsl(212 92% 56%)",
  internal: "hsl(var(--accent))",
  safe: "hsl(170 60% 45%)",
  generic: "hsl(var(--primary))",
};

const STATUS_LABEL: Record<NonNullable<Certification["status"]>, string> = {
  active: "Active",
  completed: "Completed",
  "in-progress": "In progress",
};

function VerifyIcon() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
    >
      <path d="M7 17L17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}

function CertificationCardBody({ certification }: { certification: Certification }) {
  const hasCode = Boolean(certification.code);

  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--issuer-accent)]/65 to-transparent"
      />

      <header className="flex items-start justify-between gap-3">
        <p className="inline-flex items-center gap-2 font-display text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
          <span
            aria-hidden
            className="h-1.5 w-1.5 rounded-full bg-[var(--issuer-accent)] shadow-[0_0_8px_var(--issuer-accent)]"
          />
          <span>{certification.issuer}</span>
        </p>
        {certification.year ? (
          <span className="font-display text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-muted-foreground">
            {certification.year}
          </span>
        ) : null}
      </header>

      <div className="flex flex-1 flex-col gap-2">
        {hasCode ? (
          <>
            <p className="font-display text-4xl font-extrabold tracking-[-0.04em] text-foreground transition-colors duration-200 group-hover/cert:text-[var(--issuer-accent)] sm:text-[2.5rem]">
              {certification.code}
            </p>
            <p className="text-sm leading-6 text-muted-foreground">
              {certification.name}
            </p>
          </>
        ) : (
          <p className="font-display text-2xl font-extrabold leading-tight tracking-[-0.03em] text-foreground transition-colors duration-200 group-hover/cert:text-[var(--issuer-accent)]">
            {certification.name}
          </p>
        )}
      </div>

      <footer className="mt-auto flex items-center justify-between gap-3 pt-2 text-[0.62rem]">
        {certification.status ? (
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-display font-semibold uppercase tracking-[0.18em]",
              "border-[color-mix(in_srgb,var(--issuer-accent)_35%,transparent)]",
              "bg-[color-mix(in_srgb,var(--issuer-accent)_12%,transparent)]",
              "text-foreground",
            )}
          >
            {STATUS_LABEL[certification.status]}
          </span>
        ) : (
          <span />
        )}
        <span className="inline-flex items-center gap-1.5 font-display font-semibold uppercase tracking-[0.18em] text-muted-foreground transition-colors group-hover/cert:text-[var(--issuer-accent)]">
          Verify
          <VerifyIcon />
        </span>
      </footer>
    </>
  );
}

function CertificationCard({ certification }: { certification: Certification }) {
  const accentStyle: IssuerStyle = {
    "--issuer-accent": ISSUER_ACCENT[certification.issuerKind],
  };
  const cardClasses =
    "group/cert relative flex h-full w-full flex-col gap-4 overflow-hidden rounded-2xl border border-border/70 bg-[hsl(var(--surface)/0.96)] p-5 shadow-[var(--shadow-soft)] transition-[transform,border-color,box-shadow] duration-200 hover:-translate-y-1 hover:border-[color-mix(in_srgb,var(--issuer-accent)_55%,transparent)] hover:shadow-[var(--shadow-medium)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--issuer-accent)] sm:p-6";

  if (certification.href) {
    return (
      <Link
        href={certification.href}
        target="_blank"
        rel="noreferrer"
        data-certification-card
        data-issuer={certification.issuerKind}
        aria-label={`Verify ${certification.code ?? certification.name} on the issuer's site`}
        style={accentStyle}
        className={cardClasses}
      >
        <CertificationCardBody certification={certification} />
      </Link>
    );
  }

  return (
    <article
      data-certification-card
      data-issuer={certification.issuerKind}
      style={accentStyle}
      className={cardClasses}
    >
      <CertificationCardBody certification={certification} />
    </article>
  );
}

export default function CertificationsGrid({ certifications }: Props) {
  return (
    <ul
      data-certifications-grid
      className="grid gap-4 sm:auto-rows-fr sm:grid-cols-2 lg:grid-cols-3"
    >
      {certifications.map((certification) => (
        <li
          key={`${certification.issuer}-${certification.code ?? certification.name}`}
          className="flex"
        >
          <CertificationCard certification={certification} />
        </li>
      ))}
    </ul>
  );
}
