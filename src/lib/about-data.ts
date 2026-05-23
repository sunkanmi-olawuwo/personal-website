export type Experience = {
  period: string;
  role: string;
  company: string;
  companyHref?: string;
  bullets: string[];
  stack: string[];
};

export type Project = {
  title: string;
  description: string;
  coverImage?: string;
  stack: string[];
  repoHref?: string;
  liveHref?: string;
  year: string;
  madeAt?: string;
  madeAtHref?: string;
};

export type CertificationIssuerKind = "azure" | "internal" | "safe" | "generic";

export type Certification = {
  code?: string;
  name: string;
  issuer: string;
  issuerKind: CertificationIssuerKind;
  year?: string;
  href?: string;
  status?: "active" | "completed" | "in-progress";
};

// TODO(user): replace with real role history.
export const experience: Experience[] = [
  {
    period: "2024 — Present",
    role: "Staff Backend Engineer",
    company: "Confidential",
    bullets: [
      "Lead the platform team rebuilding the ingestion pipeline to handle 12× the original throughput with the same headcount.",
      "Set the testing strategy across services — moved from snapshot-heavy unit tests to contract + integration coverage.",
      "Mentor four engineers through promotion cycles and architecture reviews.",
    ],
    stack: [
      "TypeScript",
      "Go",
      "Postgres",
      "Kafka",
      "GCP",
      "Terraform",
    ],
  },
  {
    period: "2021 — 2024",
    role: "Senior Software Engineer",
    company: "Confidential",
    bullets: [
      "Owned the company's first production RAG application — retrieval quality, evaluation tooling, and the cost guardrails around it.",
      "Cut p95 API latency from 480ms to 95ms by rewriting the hottest two endpoints around a single-flight cache.",
    ],
    stack: ["Python", "TypeScript", "Postgres", "Redis", "AWS"],
  },
];

// TODO(user): replace with real selected projects.
// Sorted newest first; the first three appear on /about, all of them appear on /archive.
export const projects: Project[] = [
  {
    title: "Hashnode Headless Blog",
    description:
      "The codebase behind this site — a Next.js 16 personal blog wired to Hashnode's GraphQL API with offline mock mode for design work and Playwright e2e.",
    stack: ["Next.js 16", "React 19", "Tailwind v4", "TanStack Query", "Playwright"],
    repoHref: "https://github.com/atharvadeosthale/hashnode-headless-blog",
    liveHref: "/",
    year: "2026",
    madeAt: "Personal",
  },
  {
    title: "Travel atlas",
    description:
      "An interactive globe + editorial gallery for places I've been — built on react-globe.gl with per-country theming and keyboard navigation.",
    stack: ["React 19", "Three.js", "react-globe.gl", "Topojson"],
    liveHref: "/travel",
    year: "2026",
    madeAt: "Personal",
  },
  {
    title: "Evaluation harness",
    description:
      "A small framework I use to compare prompts and retrieval strategies side-by-side, with reproducible runs and human-in-the-loop scoring.",
    stack: ["Python", "Postgres", "FastAPI"],
    year: "2025",
    madeAt: "Healthtech platform",
  },
  {
    title: "Ingestion pipeline rewrite",
    description:
      "Replaced a brittle cron-driven ETL with an event-driven streaming pipeline; cut median freshness from 20 minutes to under 30 seconds.",
    stack: ["Go", "Kafka", "Postgres", "Terraform"],
    year: "2024",
    madeAt: "Fintech — Series B",
  },
  {
    title: "RAG cost guardrails",
    description:
      "Per-tenant token budgets, eval-driven rollouts, and a small inference cache that brought blended LLM spend down 38% with no quality regression.",
    stack: ["TypeScript", "Redis", "OpenAI", "Anthropic"],
    year: "2024",
    madeAt: "Healthtech platform",
  },
  {
    title: "Payments reconciliation service",
    description:
      "A boring-but-load-bearing reconciliation worker that survived 12× transaction growth without architectural changes — the cheapest reliability win of the year.",
    stack: ["TypeScript", "Postgres", "AWS"],
    year: "2023",
    madeAt: "Fintech — Series B",
  },
  {
    title: "Internal RAG prototype",
    description:
      "The first production RAG application at a previous company; shipped retrieval, evaluation, and a small admin tool for human-scored regressions.",
    stack: ["Python", "Postgres", "FastAPI", "OpenAI"],
    year: "2023",
    madeAt: "Healthtech platform",
  },
  {
    title: "Latency-budget audit tooling",
    description:
      "A small tracing helper that flagged the hottest endpoints exceeding their latency budget; led to the p95-from-480ms-to-95ms rewrite.",
    stack: ["TypeScript", "OpenTelemetry"],
    year: "2022",
    madeAt: "Enterprise SaaS",
  },
];

// TODO(user): replace placeholder years/hrefs with the real issue dates and
// credential verification URLs (e.g., Credly badge, Microsoft Learn transcript).
export const certifications: Certification[] = [
  {
    code: "AI-103",
    name: "Azure AI Apps and Agents Developer Associate",
    issuer: "Microsoft Azure",
    issuerKind: "azure",
    year: "2026",
    status: "active",
    href: "https://learn.microsoft.com/en-us/credentials/certifications/?terms=AI-103",
  },
  {
    code: "AI-200",
    name: "Azure AI Cloud Developer Associate",
    issuer: "Microsoft Azure",
    issuerKind: "azure",
    year: "2025",
    status: "active",
    href: "https://learn.microsoft.com/en-us/credentials/certifications/?terms=AI-200",
  },
  {
    code: "AI-901",
    name: "Azure AI Fundamentals",
    issuer: "Microsoft Azure",
    issuerKind: "azure",
    year: "2024",
    status: "active",
    href: "https://learn.microsoft.com/en-us/credentials/certifications/?terms=AI-900",
  },
  {
    code: "AB-730",
    name: "AI Business Professional",
    issuer: "Microsoft",
    issuerKind: "azure",
    year: "2026",
    status: "active",
    href: "https://learn.microsoft.com/en-us/credentials/certifications/?terms=AB-730",
  },
  {
    name: "RAG Accelerator Training",
    issuer: "Internal program",
    issuerKind: "internal",
    year: "2025",
    status: "completed",
    // TODO(user): swap for a real credential or training transcript URL.
    href: "https://www.linkedin.com/in/sunkanmi-olawuwo/",
  },
  {
    name: "SAFe Agile Project Manager",
    issuer: "Scaled Agile",
    issuerKind: "safe",
    year: "2024",
    status: "active",
    href: "https://www.scaledagile.com/certification/",
  },
];
