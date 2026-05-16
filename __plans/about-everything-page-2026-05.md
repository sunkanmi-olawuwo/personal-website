# §4.4 Information architecture — /about as the single-page narrative

## Context

Today the personal site has `/`, `/<slug>`, `/about`, `/travel`, and `/rss.xml`. The journal-first home is the brand, but `/about` is a thin stub. The design review (`__plans/design-review-2026-05.md` §4.4) called for adding `/work`, `/uses`, `/talks` as separate pages.

The user prefers the brittanychiang.com pattern instead: a single scrollable page with a sticky in-page rail nav and inline tech-stack chips against each role. Decision (already taken via clarifying question): keep `/` journal-first; evolve `/about` into the everything-page. Skip `/uses` and `/talks` for now. Include "view full resume" and "view full project archive" off-ramps the way brittanychiang's site does.

Outcome: `/about` becomes a confident, editorial, single-page narrative that consolidates identity → about → experience → projects → writing-preview, with a sticky scroll-spy rail and per-section accents. Three top-level destinations remain: `Blog | About | Travel`.

## Approach

### Page composition (`/about`)

Anchored sections in order, each with `id="…"` for the rail and deep-linking:

1. **Identity (`#identity`)** — already-existing eyebrow + h1 + portrait block, with a small availability pill (`● Open to consulting` or similar). Existing About stub content becomes this section.
2. **About (`#about`)** — short bio paragraph + the three principles cards (move from `src/app/about/page.tsx:14-27`).
3. **Experience (`#experience`)** — vertical timeline. Each entry: year range eyebrow, role + company headline, 2-3 bullet accomplishments, inline tech-stack chip row. Ends with a `View full résumé →` outbound link (using `.inline-arrow-link` style).
4. **Projects (`#projects`)** — 3 selected project cards (image + title + description + tech chips + GitHub/live links), grid `lg:grid-cols-3`. Ends with `Browse the full archive →` link to the user's GitHub.
5. **Writing preview (`#writing`)** — three most-recent posts as `BlogCard variant="default"`, server-prefetched and hydrated like `src/app/page.tsx`. Ends with `Read the full journal →` link to `/#latest-writing`.

### Sticky rail navigation

- `lg:` and above: sticky left rail on `top-24`, vertical list of section labels. Active label gets the `border-primary text-foreground` treatment from `src/components/post-toc.tsx:97-113`. Reuses that file's IntersectionObserver scroll-spy logic verbatim (rootMargin `"-30% 0px -55% 0px"`).
- Mobile/tablet: rail collapses to a thin sticky horizontal pill strip directly under the navbar (same components, different layout). Avoids burying the rail under the page content on narrow screens.
- Both: clicking a rail item smooth-scrolls (`scroll-behavior: smooth` already global) and updates `location.hash` without a full navigation. Respects `prefers-reduced-motion` (the global rule in `src/app/globals.css:472-475` already disables smooth scroll there).

### Per-section accent (innovation beat)

Each section sets a `--section-accent` CSS variable inline on its root, the same pattern used in `src/components/travel/travel-atlas-client.tsx` for `--country-accent`. The rail's active indicator and the section's eyebrow color both pick up the local accent. Suggested values:

| Section | Accent |
|---|---|
| Identity | `hsl(var(--primary))` (default) |
| About | `hsl(var(--accent))` (amber) |
| Experience | `hsl(var(--primary))` (blue) |
| Projects | `hsl(var(--accent))` (amber) |
| Writing | `hsl(var(--primary))` (blue) |

This gives the rail visible chroma variation as the user scrolls — distinct from a flat brittanychiang clone, but cheap to implement.

### Data model

New file `src/lib/about-data.ts` (single source of truth, easy for the user to edit):

```ts
export type Experience = {
  period: string;              // "2023 — Present"
  role: string;                // "Staff Backend Engineer"
  company: string;             // "Acme"
  companyHref?: string;
  bullets: string[];           // 2-3 short accomplishments
  stack: string[];             // ["TypeScript", "Postgres", "GCP", ...]
};

export type Project = {
  title: string;
  description: string;
  coverImage?: string;         // local /projects/<slug>.jpg or null
  stack: string[];
  repoHref?: string;
  liveHref?: string;
};
```

I will seed 2 placeholder experience entries and 3 placeholder projects with realistic shape but generic copy, flagged with a clear TODO comment so the user knows to replace them. `siteProfile.socialLinks` already has the GitHub URL (`src/lib/site-profile.ts:53-58`) so `archiveHref` can default to that. `resumeHref` placeholder will be `siteProfile.socialLinks[0].href` (LinkedIn) until the user provides a hosted PDF.

Will extend `SiteProfile` with two optional fields:

```ts
availabilityStatus?: { label: string; tone?: "open" | "writing" | "heads-down" };
resumeHref?: string;
```

### Component layout

```
src/components/about/
  about-page-client.tsx       # client wrapper: scroll-spy state + section orchestration
  about-section-rail.tsx      # sticky rail (desktop) + horizontal strip (mobile)
  experience-timeline.tsx     # vertical timeline with year column + stack chips
  projects-grid.tsx           # 3-col card grid + archive off-ramp
  writing-preview.tsx         # server component, takes posts as props
  availability-pill.tsx       # small dot + label, used in identity section
```

`/about/page.tsx` becomes a server component shell that prefetches the 3 most-recent posts (TanStack `dehydrate` pattern from `src/app/page.tsx:27-35`) and renders `AboutPageClient` with the hydrated posts passed in.

### Nav update

`src/components/nav-primary-links.tsx`: add `/about` between Blog and Travel. The `nav-pill` active styling already handles `data-active="true"` (see `src/app/globals.css:771-791`).

### Tests

| File | Coverage |
|---|---|
| `tests/unit/about-section-rail.test.tsx` (new) | Renders all section labels; updates `data-active` when IntersectionObserver fires; clicking updates `location.hash`. |
| `tests/unit/experience-timeline.test.tsx` (new) | Renders each entry's period/role/company/bullets/stack; stack chips have the chip class. |
| `tests/unit/projects-grid.test.tsx` (new) | Renders project cards; archive link points to siteProfile GitHub. |
| `tests/unit/navbar.test.tsx` (edit) | Add assertion that `/about` link is active on `pathname === "/about"`. |
| `tests/e2e/about.spec.ts` (new) | `/about` shows all five section headings; rail link click scrolls + updates hash; deep-link `/about#projects` lands at Projects. |

### Verification checklist

1. `npm run dev` → visit `/about`, scroll top-to-bottom; rail highlights track the visible section.
2. Click each rail link → smooth scroll + hash updates.
3. Deep-link `http://localhost:3000/about#projects` → page loads scrolled to Projects.
4. Resize to mobile (< 1024px) → rail becomes a horizontal sticky pill strip.
5. Toggle dark mode → all accents remain readable; section eyebrows respect per-section accent.
6. Run: `npm run lint`, `npx tsc --noEmit`, `npm run test:unit`, `npm run test:e2e`.
7. `prefers-reduced-motion: reduce` → smooth scroll disabled (global rule already covers this).
8. Screen-reader spot-check: rail nav has `aria-label="On this page"`, active link has `aria-current="location"`.

## Files touched

**New**
- `src/lib/about-data.ts`
- `src/components/about/about-page-client.tsx`
- `src/components/about/about-section-rail.tsx`
- `src/components/about/experience-timeline.tsx`
- `src/components/about/projects-grid.tsx`
- `src/components/about/writing-preview.tsx`
- `src/components/about/availability-pill.tsx`
- `tests/unit/about-section-rail.test.tsx`
- `tests/unit/experience-timeline.test.tsx`
- `tests/unit/projects-grid.test.tsx`
- `tests/e2e/about.spec.ts`

**Edited**
- `src/app/about/page.tsx` (rewrite as server shell with prefetch)
- `src/lib/site-profile.ts` (add `availabilityStatus`, `resumeHref` optional fields)
- `src/components/nav-primary-links.tsx` (add /about entry)
- `src/app/sitemap.ts` (bump `/about` priority)
- `tests/unit/navbar.test.tsx` (add `/about` active-state assertion)

## Placeholders the user will need to replace

After implementation, these have realistic shape but generic copy and need to be filled with real content:

1. `src/lib/about-data.ts` → `experience[]` (2 placeholder roles)
2. `src/lib/about-data.ts` → `projects[]` (3 placeholder projects)
3. `src/lib/site-profile.ts` → `resumeHref` (hosted resume URL — falls back to LinkedIn)
4. `src/lib/site-profile.ts` → `availabilityStatus` (default `{ label: "Available for consulting", tone: "open" }`)
5. Optional `/public/projects/*.jpg` cover images — fall back to existing Unsplash placeholders if absent.

These will be marked with `// TODO(user): replace with real content` comments so they're easy to find.
