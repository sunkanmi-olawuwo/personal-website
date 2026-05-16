# Repo audit — tech debt, security, a11y, polish

## Context

After the design uplift, the codebase has accumulated some technical debt and a few real-but-not-urgent security and a11y gaps. The user explicitly wants npm → pnpm as the first move, then a roadmap for the rest. This plan covers the findings from three exploration passes and proposes 5 independently shippable phases.

Two decisions already taken (see clarifying answers):
- **Trust model**: Hashnode is treated as a trusted CMS. We keep `dangerouslySetInnerHTML` and add a permissive-but-real CSP (`'self'` + CDN allowlist + `'unsafe-inline'` for styles).
- **Scope**: all four areas phased into separate PRs.

## Findings excluded from the plan

The security agent could not run `npm audit` and flagged some version "issues" that are not real:
- `zod ^4.3.6` — current major; v5 does not exist as stable.
- `typescript ^6.0.2` — current; not prerelease.
- `graphql-request ^7.4.0` — current major.

These are noted so they don't get reopened later. Run `npm outdated` and `npm audit` for ground truth before any dep bumps.

Also out of scope (content, not code):
- `// TODO(user)` placeholders in `src/lib/about-data.ts`, `src/lib/site-profile.ts`, and the `[Company]` literal in `src/components/about/about-page-client.tsx`. These need real content from the user, not engineering work.

---

## Phase 1 — npm → pnpm migration

**Goal**: switch the package manager. Zero behavioural change.

**Files to update**
- `package.json` — add `"packageManager": "pnpm@9.x.x"` (pick a recent stable). Rewrite scripts: `npm run X` → `pnpm X`. Notably `test`, `test:e2e`, `test:e2e:live` chain `npm run build` internally — replace with `pnpm build`.
- `.github/workflows/ci.yml` — `npm ci` → `pnpm install --frozen-lockfile`; add `pnpm/action-setup@v4` step before Node setup. `npm run X` → `pnpm X`.
- `playwright.config.ts:22` — `webServer.command: "npm run start"` → `"pnpm start"`.
- `README.md` — update commands (lines 14, 30, 32).
- `CLAUDE.md` — update the Commands block (lines ~21-39): `npm run X` → `pnpm X`, `npx X` → `pnpm X`.
- Delete `package-lock.json`; commit the generated `pnpm-lock.yaml`.

**Verification**
- `corepack enable && pnpm install` succeeds.
- `pnpm lint && pnpm tsc --noEmit && pnpm test:unit && pnpm test:e2e` all green.
- Push branch and watch CI run end-to-end with pnpm cache.

**Risk**: low. Single-package repo, no workspaces, no hoisting-sensitive deps.

---

## Phase 2 — Critical security

**Goal**: ship a basic CSP and stop storing the raw email in localStorage.

**Changes**
1. **CSP headers in `next.config.js`** — add `async headers()` returning a `Content-Security-Policy` for all routes:
   - `default-src 'self'`
   - `img-src 'self' https://cdn.hashnode.com https://images.unsplash.com data: blob:`
   - `style-src 'self' 'unsafe-inline'` (Next.js inlines critical CSS)
   - `script-src 'self' 'unsafe-inline'` (Next.js still requires this without nonce setup)
   - `font-src 'self' data:`
   - `connect-src 'self' https://gql.hashnode.com`
   - `frame-ancestors 'none'`, `base-uri 'self'`, `form-action 'self'`
   - Also add: `Referrer-Policy: strict-origin-when-cross-origin`, `X-Content-Type-Options: nosniff`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`.
2. **Newsletter localStorage** (`src/components/newsletter-card.tsx`, `src/components/newsletter-signup-form.tsx`):
   - Stop writing the raw email. Replace with a boolean flag: `localStorage.setItem("newsletterSubscribed", "1")`. The popup gate already only reads truthiness — the email value is never re-read for anything functional.
   - Update `tests/e2e/*` `beforeEach` hooks that set `localStorage.setItem("newsletter", "playwright@example.com")` to set the new flag.
3. **Email validation in `subscribeToNewsletter`** (`src/lib/requests.ts:145+` and `src/components/newsletter-signup-form.tsx`):
   - Add a `z.string().email()` check before the GraphQL mutation; surface a `sonner` toast on parse failure rather than letting Hashnode return a 400.
4. **Tighten image remotePatterns** (`next.config.js`):
   - Add a `pathname` constraint for Unsplash (`/photo-*` or similar) since we only render their hot-linked photos. Leave Hashnode as-is (their CDN paths are unpredictable).

**Verification**
- Open `/` and `/some-slug` in dev, check Network → response headers include `Content-Security-Policy`.
- DevTools Console clean of CSP violations on home, post, about, archive, travel.
- New localStorage flag is `"1"` (boolean), not an email.
- Invalid email in the form shows a toast and never hits the network.

**Out of scope (and why)**:
- DOMPurify on Hashnode HTML — trust model decision above.
- Newsletter rate limiting — would require a route handler / middleware; Hashnode already rate-limits server-side. Park for later.

---

## Phase 3 — Accessibility polish

**Goal**: close the focus-visible gaps and add a skip link.

**Changes**
1. **Skip link** — new component `src/components/skip-link.tsx`. Rendered at the top of `src/app/layout.tsx`. Class: `sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 …` with the existing `interactive-surface` pill treatment. Each page's `<main>` already exists (verified by audit) — assign `id="main"` in `src/app/layout.tsx` or wrap children in a `<main id="main">` shell.
2. **`nav-pill` focus-visible** (`src/app/globals.css`) — add `.nav-pill:focus-visible { outline: 2px solid hsl(var(--ring)); outline-offset: 2px; }`. Currently only has `data-active` styling.
3. **Dialog close + dropdown items** — `src/components/ui/dialog.tsx:47` and `src/components/ui/dropdown-menu.tsx` use `focus:` (always-on outline including mouse). Swap to `focus-visible:` so the outline only shows for keyboard users, matching the rest of the site.
4. **Travel rail keyboard nav (optional)** — `src/components/travel/travel-atlas-client.tsx` already supports arrow-key country cycling when the globe frame has focus (`cycleCountry` at ~line 129). The visited-countries rail buttons could mirror this for keyboard parity. Low priority.

**Verification**
- Tab from the address bar → first tab focuses Skip link → Enter jumps to `<main>`.
- Tab through navbar → each nav pill shows a visible focus ring.
- Open dialog via keyboard → close button shows focus ring on Tab (not just on mouse focus).
- Re-run `tests/e2e/design-safety.spec.ts` (axe checks) — should stay green.

---

## Phase 4 — Tech debt cleanup

**Goal**: kill the low-cost annoyances. No behavioural changes.

**Changes**
1. **Eyebrow utility class** — `src/app/globals.css`: add `.section-eyebrow { @apply font-display text-[0.7rem] font-semibold uppercase tracking-[0.32em]; }` and a `.section-eyebrow--micro` variant for the `[0.62rem]` / `[0.66rem]` cases. Replace ~10 inline copies across `navbar.tsx`, `footer.tsx`, `blog-card.tsx`, `post-footer.tsx`, `about-page-client.tsx`, `archive-table.tsx`, `certifications-grid.tsx`, `travel-atlas-client.tsx`.
2. **View-transition CSS prop dedup** — `src/components/blog-card.tsx:48` and `src/components/post.tsx:110` both inline `style={{ viewTransitionName: \`post-cover-${slug}\` } as React.CSSProperties}`. Extract `src/lib/view-transition.ts` exporting `postCoverStyle(slug)` returning the typed style — drops two `as` casts.
3. **Error UI on TanStack queries**:
   - `src/components/post.tsx:22` — add `isError` branch that renders `<PostSkeleton />` fallback then `notFound()` — or a small "Something went wrong reading this post" surface with a retry button.
   - `src/components/post-footer.tsx:23` — related posts query has no `isError` UI. Either hide the section quietly (current behaviour) or surface a small "Related posts unavailable" line. Pick quiet hide and document with a one-line comment.
4. **Drop `document.execCommand` fallback** — `src/components/post-content.tsx:88-104`. `navigator.clipboard.writeText` is supported in every browser the site targets; the textarea-based fallback is dead code with a deprecation warning. Replace with a graceful catch + toast.
5. **Resolve the eslint-disable in `travel-globe.tsx:180`** — add an explanatory comment for the intentional `paletteVersion` dependency (it's a tick counter that forces re-build when `MutationObserver` fires) so it's not a code smell.
6. **Re-enable `react-hooks/set-state-in-effect`** — Phase 1 (pnpm) disabled this rule in `eslint.config.mjs` to keep the migration zero-behaviour. 5 violations need addressing:
   - `src/components/post-toc.tsx:41` — `setHeadings(extractHeadings(html))` → `useMemo`.
   - `src/components/theme-toggler.tsx:12` — hydration `setMounted(true)` pattern (canonical; consider `useSyncExternalStore` or accept with documented disable).
   - `src/components/travel/travel-atlas-client.tsx:102` — hydration `setIsHydrated(true)` (same pattern).
   - `src/components/travel/travel-atlas-client.tsx:106` — `setSelectedSlug` from `countryParam` → derive via `useMemo`.
   - `src/components/travel/travel-atlas-client.tsx:110` — `setLightboxIndex(null)` reset on dep change → derive or `key` pattern.

**Verification**
- `pnpm lint && pnpm tsc --noEmit` clean.
- `pnpm test:unit` + `pnpm test:e2e` green.
- Clipboard works in Chrome/Safari/Firefox dev tools.
- Eyebrow text looks identical to before in all locations.

---

## Phase 5 — Component splits

**Goal**: bring oversized client components under 400 lines so they're easier to read and test.

**Changes**
1. **`src/components/travel/travel-atlas-client.tsx` (810 lines)** — extract:
   - `src/components/travel/use-travel-country.ts` — `useTravelCountry(initialSlug)` hook owning the selected-country state + URL search-param sync + `cycleCountry` callback.
   - `src/components/travel/use-travel-lightbox.ts` — lightbox open/active-photo state.
   - `src/components/travel/atlas-shell.tsx` — the `<section>` wrapping globe + spotlight + keyboard handler (currently inline at ~280-400).
   - `src/components/travel/visited-countries-grid.tsx` — continent-grouped grid (currently inline at ~660-770).
   - Target: `travel-atlas-client.tsx` ≤ 200 lines, purely orchestration.
2. **`src/components/travel/travel-globe.tsx` (418 lines)** — extract:
   - `src/components/travel/use-globe-palette.ts` — palette token reading + `MutationObserver` theme tracking + `safeBuildPalette`.
   - `src/components/travel/use-globe-size.ts` — `ResizeObserver` width/height hook.
   - Target: `travel-globe.tsx` ≤ 250 lines focused on the Globe render.

**Verification**
- Existing unit + e2e suites still pass without changes (refactor only).
- Add one unit test per extracted hook covering its happy path.

---

## Phasing & PR sequence

| Phase | Effort | Risk | PR |
|---|---|---|---|
| 1 — pnpm | ~1 hour | Low | `chore/migrate-to-pnpm` |
| 2 — security | ~3 hours | Medium (CSP can break things in prod) | `feat/csp-and-newsletter-hardening` |
| 3 — a11y | ~2 hours | Low | `feat/a11y-skip-link-and-focus` |
| 4 — tech debt | ~3 hours | Low | `chore/eyebrow-util-and-cleanup` |
| 5 — component splits | ~4 hours | Medium (large diff, refactor-only) | `refactor/travel-component-split` |

Total: ~13 hours over 5 PRs. Each phase is independently revertable. Phase 1 should land first since later phases will write commands in pnpm style.

## Verification checklist (cross-phase)

After each phase merges to `feature/<branch>`:

```
pnpm lint
pnpm tsc --noEmit
pnpm test:unit
pnpm test:e2e
```

Run a Lighthouse pass on `/`, `/<slug>`, `/about`, `/archive`, `/travel` after Phases 2 and 3 — Accessibility score should be ≥ 95 (currently ~92-95 per axe spec, exact number unverified).
