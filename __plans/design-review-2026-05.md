# Design Review — Premium / Modern Pass

> Reviewed: 2026-05-16 (initial); travel addendum appended same day.
> Scope: home (`/`), tag-filtered home (`/?tag=…`), post detail (`/[slug]`), and the travel atlas (`/travel`, `/travel?country=…`) at desktop 1440 + mobile 390, light and dark themes.
> Mode: served via `NEXT_PUBLIC_BLOG_DATA_MODE=mock` against the local dev server.

The site already has a clean foundation — Manrope + Inter, a calm slate-and-blue palette, a section-shell card pattern, page-reveal animations, and a thoughtful dark mode. The bones are good. The gap between "competent personal blog" and "premium, modern" is mostly about **density of intent**: a louder hero, a stronger editorial hierarchy in the article grid, richer post pages, and a unifying visual language that doesn't shift metaphors between sections.

---

## 1. What's working

- **Typography pairing.** Manrope display + Inter body is a strong, modern combo. Headlines have good tracking (`tracking-[-0.04em]`).
- **Section-shell pattern.** Rounded 2rem cards with a hairline top gradient and corner glow gives surfaces a premium "lifted" feel.
- **Subtle motion.** `page-reveal` and `motion-safe-float` are restrained and tasteful. Reduced-motion is handled.
- **Dark mode.** The layered radial gradients in `globals.css` make dark mode feel intentional, not an afterthought.
- **Selection color.** `::selection` uses `hsl(var(--primary) / 0.22)` — a small premium detail most sites skip.
- **Code blocks.** The toolbar with language chip + copy button is genuinely nice; better than most blogs.
- **Brand link variants** (`underline | lift | shine`) — over-engineered for one logo, but the `shine` variant is a great signature.

---

## 2. Bug / oversight I noticed first

`src/components/home-hero.tsx:30-31` renders an **empty `<p>` eyebrow tag**:

```tsx
<p className="font-display text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">
</p>
```

There's whitespace but no text. The element still takes layout space. Either populate it (e.g., `"Backend & AI Systems Engineer — London"`) or remove it. This is the first thing visible above the headline and currently a hole in the design.

---

## 3. Per-page findings & recommendations

### 3.1 Hero (`src/components/home-hero.tsx`)

**What I see:** Big headline on the left, small portrait (max 20rem) on the right, two pill CTAs. Total hero height ~600px on desktop. Reads as a confident résumé header, but doesn't yet feel like a "statement."

**Premium pass:**

1. **Restore the eyebrow.** Use it as identity ("Backend Engineer · London" or "Currently — Staff Engineer @ X"). This is the single highest-ROI fix.
2. **Add an availability / status pill.** A small dot + label ("● Available for consulting", "● Writing weekly") next to or below the eyebrow signals presence and is a modern personal-site signature (cf. brittanychiang.com, leerob.io, rauchg.com).
3. **Bigger portrait, treated as a feature.** Bump portrait max to ~24–28rem and add a layered treatment: 1) keep the float, 2) add a soft accent-coloured halo behind it, 3) a thin gradient ring (`border-image` or a stacked pseudo-element). Replace the current heavy `from-black/35` shadow under the portrait — in light mode it reads as a dark smudge.
4. **Headline typography.** Currently one solid `text-primary` block. Try a two-tone treatment: render the noun phrase ("reliable software systems") in a gradient (primary → accent) and the rest in `foreground`. Gives a focal point without changing the words. Add `text-balance` (`text-wrap: balance`) so it sits well at every breakpoint.
5. **Sub-headline shortening.** The current summary runs ~270 chars and reads like a meta description. Cut to ~140 chars; let it land in one breath.
6. **CTAs need a hierarchy beat.** Primary "Articles" → rename to a verb ("Read the journal" or "Browse essays"). Secondary "GitHub" is fine but consider a third lightweight inline link ("or subscribe ↓") that connects the hero to the newsletter.
7. **Replace the corner blobs with a fixed *signature* shape.** The two big blurred radial gradients (`absolute -left-16 top-6` etc.) look generic and read as "AI startup landing page." A more premium move: a single faint grid pattern (1px lines, `bg-[radial-gradient]` mask), a subtle noise/grain overlay (`<svg>` feTurbulence), or one carefully placed gradient orb instead of two competing ones.
8. **Mobile portrait.** At 390px the portrait is only `w-44` (176px) and stacks above the text. Either go full-bleed circular at `w-32` with the headline overlapping its top edge, or push it to `w-56` so it feels like a cover image rather than an apologetic thumbnail.

### 3.2 Articles section (`src/app/page.tsx` + `posts.tsx` + `blog-card.tsx`)

**What I see:** A `JOURNAL` eyebrow, "Articles" h2, supporting copy, a Lottie pen scribble in the top-right (`WritingMark`), tag filter row, then a 3-column grid of identical cards. Each card has an image, two tags, title, a decorative `</>` chip on a line, and a 4-line preview.

**Premium pass:**

1. **The `WritingMark` Lottie reads as random clip-art.** It's not anchored to any other ink/handwriting metaphor on the site. Either commit to it (use the same line as a divider under the section title and the same ink in the post page) or remove it.
2. **Introduce editorial hierarchy.** Premium publications never show 9 identical tiles. Promote the first post to a **hero card** spanning 2 columns with a larger image, prominent date, reading time, and the full excerpt. Then 6 standard cards in a 3-col grid below.
3. **Card metadata is too thin.** Each card should show: **date** (e.g., "May 14, 2026"), **reading time** ("6 min read"), and a **post number** ("01 / 23") or **category**. Right now the only metadata is tags.
4. **Drop the `</>` chip.** It conflicts with the typography focus and adds clutter. The card already says "writing about software." Replace with a thin gradient separator (which you already have) and the date.
5. **Title hover state.** Currently hover adds underline + colour change. Add a subtle right-arrow `→` that translates in (`transition: transform`); it's a quietly modern move (cf. vercel.com).
6. **Tag chips are tiny.** `text-[0.66rem]` + uppercase tracking is bordering on illegible. Bump to `0.72rem`, give them more breathing room, and consider making them **non-bordered pills** in the cards (border only on the filter row) so the card visual is calmer.
7. **Filter row needs a label.** "Filter by topic" small caps to the left, then chips. Right now the "All Articles" pill carries that responsibility implicitly.
8. **Empty state for tag filter.** Currently shows "No articles yet for X." and a button. Add a small illustration or icon, and surface a "popular tags" suggestion row.
9. **"Load more" button copy.** "That's all for today!" reads cute on a first visit but becomes patronising on the third. Use "You've reached the end · 9 essays" or hide the button entirely when there's nothing more.

### 3.3 Post detail (`src/components/post.tsx` + `post-content.tsx`)

**What I see:** Back-to-home pill, tags, big title, subtitle, a small author row, a 16:9 hero image, then the article body in a section-shell card. Plain `<div className="py-16 text-center">Loading post...</div>` while data loads.

**Premium pass:**

1. **Reading progress bar.** A 2px fixed-top bar that fills as the user scrolls. Tiny implementation (`useEffect` + `transform: scaleX`), big perceived-quality win.
2. **Sticky in-article TOC on `lg:`.** Most posts are long-form. Generate `<h2>` anchors during the `useEffect` in `post-content.tsx` (you're already walking the DOM) and render a sticky right-rail TOC. Mark the currently-visible section with an indicator.
3. **Reading-time + published date in the meta row.** Right now you have a 56px avatar, name, and "Published on…" stacked. Add a third item: `· 6 min read · Backend, Testing`.
4. **Hero image treatment.** A 16:9 photo with a `from-primary/10 via-transparent to-white/5` overlay. In light mode the overlay is invisible; in dark mode it slightly tints. Either commit to a stronger duotone treatment or remove the overlay. Also: consider rounding to match section-shell radius (`2rem`) instead of the bespoke `1.8rem`.
5. **Drop-cap on the first paragraph.** Classic editorial move, well-supported by CSS (`:first-letter` + `initial-letter` or `float`). Pair with a single-character font tweak.
6. **Pull-quote component.** Markdown blockquotes currently just get a left border + italic. Render the first `<blockquote>` larger with quotation marks and a gradient left border for a premium magazine feel.
7. **Inline-CTA mid-article.** A subtle "Subscribe to the digest →" pill after the third heading.
8. **End-of-article footer.** Add: (a) avatar + 2-line author bio + social links, (b) "Up next / related" by shared tag (3 cards max), (c) share-to-Twitter/X + copy-link icon buttons.
9. **`Loading post…` is bare.** Render a skeleton that mirrors the article shape (title bar, meta row, hero image rectangle, three paragraph bars). It loads on the same TanStack hydration boundary, but for cold/slow navigations it feels much more deliberate.
10. **Tag chip on detail page** uses `bg-[hsl(var(--surface)/0.88)]` which makes them blend almost invisibly into the page background in light mode. Bump to full surface or keep them at the same opacity as on the cards.

### 3.4 Navbar (`src/components/navbar.tsx`)

**What I see:** Logo on the left in heavy uppercase tracking, theme toggler + GitHub button on the right.

**Premium pass:**

1. **More nav items.** Even a personal site benefits from `Writing | About | Work | Contact`. Right now the only navigation is the logo and an external GitHub link, which makes the site feel like a one-page brochure rather than a body of work.
2. **The logo's `tracking-[0.28em]` reads "law firm" rather than "engineer."** Try `tracking-[0.18em]` and `font-bold` instead of `font-extrabold` — closer to a wordmark.
3. **Active state on nav items.** When on a tag filter, the nav should reflect it (e.g., "Writing · Backend").
4. **On scroll, condense the nav.** Add a `useScrollPosition` hook → reduce vertical padding and bump backdrop blur for a denser, modern feel.
5. **Mobile nav.** Currently the same nav shows on mobile (no menu, no condensation). If you add more nav items, add a hamburger → bottom sheet on mobile.

### 3.5 Footer (`src/components/footer.tsx`)

**What I see:** A repeated newsletter card (same copy as the popup), then a thin row of `LinkedIn | GitHub` + copyright.

**Premium pass:**

1. **Stop repeating the newsletter pitch.** It appears in (a) the corner popup, (b) the footer, and (c) potentially mid-article. Each is the same copy. Make the footer one a calm "Stay in touch — short list of essays, never spam" with just an email input and an arrow button.
2. **Multi-column footer.** Three columns: *Read* (latest posts, archive, tags), *About* (about, work, contact, /now), *Elsewhere* (LinkedIn, GitHub, X, RSS, sitemap). This signals depth even if some pages are placeholders.
3. **RSS link is missing.** Premium tech blogs always have it. Add `/rss.xml` and link it in the footer with the small RSS icon.
4. **"Designed for the web" is filler.** Replace with one quietly clever line that's actually you — e.g., "Built with Next.js 16. Words my own. ©2026".
5. **Add a colophon link** (typography, stack) at the bottom — niche but signals craft.

### 3.6 Newsletter popup (`src/components/newsletter-card.tsx`)

**What I see:** A bottom-right card that appears after 20s or 60% scroll, on `lg` only, dismissible for 30 days.

**Premium pass:**

1. **The pattern itself is dated.** Pop-ups are an SEO/blog-era convention. A premium site signals confidence by *not* nagging. Consider replacing with:
   - An inline newsletter card placed once in the article flow (after the first or last `<h2>`).
   - A "subscribe" link in the nav that opens a focused dialog only on click.
2. **If you keep it**, soften the timing: 45s minimum, only on the second visit (track via cookie), never on mobile (already true). Reduce shadow strength so it feels less alert-y.
3. **The dismiss `X` button** is fine but could be `Esc`-dismissable.
4. **Copy:** "New essays, no noise" is decent. Stronger: "One essay every Sunday. Unsubscribe in one click."

### 3.7 Travel atlas (`/travel` — `src/app/travel/page.tsx` + `src/components/travel/*`)

> Added in commit `7cb3408` after the original review. This is the first pass at uplifting it to match the rest of the site.

**What I see:** A four-block page — a small "Travel" eyebrow + intro paragraph alongside a 2×2 stats grid (countries, continents, cities, memories); an interactive 3D globe with a flag-marked country pin and a "Country Spotlight" panel beside it (cities, highlights, italic memory quote, "View Gallery" button); a 3-up photo gallery with a lightbox; and a vertical "Visited Countries" rail at the bottom. Two countries today (Nigeria, UK), illustrated rather than photographic.

**What's working:** the interactive globe is the right anchor for this page, the URL syncs on country change (`?country=…`), the lightbox is keyboard-friendly with prev/next arrows, the loading skeleton mirrors the layout, and the page already has accessible landmarks and `aria-pressed` on the rail buttons. Good baseline.

**What hurts the premium feel:**

1. **No visible H1.** The page leads with a small `TRAVEL` chip + body paragraph, but the only `<h1>` is `sr-only` ("Travel Atlas"). Everywhere else on the site, the H1 is the primary visual anchor. The travel page should follow the same hero formula — eyebrow, big balanced H1, supporting sentence — before any stats or globe.
2. **The brand drift in dark mode is the biggest problem.** This page is full of `dark:bg-cyan-300/10`, `dark:border-cyan-200/20`, `dark:text-cyan-200`, `dark:hover:bg-cyan-200/35`, plus `cyan-300` button fills. The rest of the site just shipped a warm amber `--accent` in Phase 3. Side-by-side, the travel page reads as a different product. The cyan needs to go entirely and route through `--primary`/`--accent` like the rest of the codebase.
3. **The hero stats are squashed.** On desktop the 2×2 stat grid sits to the right of the intro paragraph in a `16rem` column, which crops every chip and makes "Countries / 2", "Continents / 2", "Cities / 6", "Memories / 6" feel like dashboard widgets, not editorial moments. Either:
   - Move the stats to a horizontal row *below* the H1 (gallery-style: `28 countries · 14 cities · 312 memories · last visit Lisbon, 2026`), or
   - Show one large hero number ("Six countries, four continents.") and tuck the rest into the country spotlight when relevant.
4. **The globe-spotlight pairing has two competing visual centers.** Light mode places the globe inside a heavy `radial-gradient(ellipse_at_50%_46%, hsl(var(--primary)/0.18), transparent_58%)` halo that fights the globe's own atmosphere; the spotlight card to the right is then a hard rectangle in a different visual register. Soften it: drop the ellipse halo, give the globe room to breathe, and let the spotlight card use the same `section-shell` material as the post body. The shared material will make the two halves feel like one composition.
5. **"Country Spotlight" reads like a CMS field, not the voice of the site.** "Country Spotlight:" + name + visit label + "Cities:" / "Highlights:" / a quoted memory + "View Gallery" button. It's correct but generic. A premium move: lead with the country name as a wordmark-sized treatment (`text-4xl` font-display), then a single editorial line ("Two trips. Three cities. The first place I went back to."), then the cities as inline body text, then a single highlight pill row, then the memory quote rendered as a real `<blockquote>` with a gradient left rule (the pull-quote style we proposed for posts in §3.3 — share it here).
6. **Per-country accent under-used.** Each country already carries a `themeColor` in `travel-data.ts`. Right now it only tints a 2px dot in the rail and the highlight chips. Use it more deliberately: when a country is selected, let `--accent` fall back to that country's themeColor for the duration of the page (one CSS var override on the page root). The globe ring, the spotlight CTA, the gallery hover state, and the rail's selected indicator all warm to the country's identity. Costs almost nothing; reads as bespoke.
7. **"Visited Countries" rail wastes desktop space.** At `>md` the rail is a single-column stacked list of buttons — which means with 2 countries it's two ~36px rows and a lot of whitespace, and with 25 countries it's a tall scrolling column. Switch to a responsive grid: `grid-cols-2 md:grid-cols-3 lg:grid-cols-4` chips with the country flag mark + name (a `min-h-12` button), grouped by continent in `lg:` with a small `Africa · 1 · Europe · 1` row of section labels above. This scales from 2 to 50 countries without redesign.
8. **The "View Gallery" button** is a primary blue/cyan pill that visually dominates the spotlight card. It's a *jump-link*, not an action — the gallery is on the same page. Demote it to a subtle text link with an arrow ("View gallery ↓") and let the photos themselves invite the scroll. Free up the pill for something stronger if you add a "Plan a return" or "Continue reading the Lisbon essay →" link in future.
9. **Photo gallery treatment is uniform.** Three equally-sized 16:10 tiles per country. Premium photo essays vary the grid — one full-bleed cover row, then two smaller tiles, or a 2-1-2 zigzag. With 3 photos per country this is overkill; with 8-12 it becomes the strongest visual on the page. Bonus: the captions ("Lagos lagoon light", "Edinburgh close") have voice — push them harder by typesetting them in display font over the photo, not in muted body text under a black gradient.
10. **Lightbox metadata column is mostly empty.** The right-rail of the lightbox shows country flag + name, caption, and `location / takenOn`. Lots of room for: the matching memory quote, a "from the journal" link to a related essay, and prev/next thumbnail strip at the bottom. Right now there are only two pieces of info in a 20rem column.
11. **Mobile globe + spotlight ordering.** On 390px the order is: stats, globe (shrunken to ~280px), spotlight card. The globe is the page's hook — it should follow the H1, not sit below a dense stats block. Reorder on mobile so users meet the globe first, then the spotlight, then the stats as a quieter row.
12. **No "last visit" or chronology.** There's a `visitLabel` field already ("Two visits, 2023 & 2024") but no timeline view. A toggle between *Atlas* (the current globe) and *Timeline* (a vertical list by year with one card per trip) would give returning visitors something new to look at and would scale gracefully as the dataset grows.
13. **Page title in the navbar context.** The site nav now reads `BLOG | TRAVEL` (since the Travel atlas commit). On the travel page itself, the navbar should indicate the active section — a subtle underline or accent dot under "Travel" — same treatment the rest of the nav will need when we add Writing/About/Work in §3.4.
14. **Globe accessibility.** `TravelGlobeShell` does the right thing for non-JS / `prefers-reduced-motion` (it falls back). But the globe canvas itself is unlabeled to assistive tech; add `role="img" aria-label="Interactive globe of visited countries"` on the wrapper, and surface keyboard navigation (Left/Right arrows to cycle countries when the globe has focus) so the country rail isn't the only path.
15. **Loading skeleton is from a previous design system.** `travel/loading.tsx` uses `dark:bg-slate-800/70` and `dark:border-cyan-200/20`. Re-skin to use the same shapes as the new `PostSkeleton` (`bg-[hsl(var(--surface-strong))]`, no hardcoded slate/cyan).

---

## 4. Cross-cutting themes

### 4.1 Color & material

- **Primary blue (HSL 219, 51%, 37%) is competent but characterless.** It's the same blue every B2B SaaS uses. Consider:
  - A slightly **richer ink** (e.g., 222, 47%, 24%) for headings, with the current blue reserved for links and accents.
  - **One signature colour** beyond blue — a muted gold/ochre (`hsl(33, 70%, 55%)`) or a warm coral (`hsl(12, 80%, 60%)`) as an *accent only*, used on hover states and brand moments. Sticking to grayscale + one primary feels safe; a personal site is where you can have one bold colour choice.
- **Surfaces:** the section-shell pattern is good but **used on every section**. The hero, the articles grid, the post body, and the newsletter footer all use it. Consider varying: hero stays as is, articles use a *negative-space* layout (no card, just generous padding and a thin top border), post body keeps the shell. This creates visual rhythm and stops the page reading as "card, card, card."
- **Travel-page colour drift.** The travel atlas (added later in `7cb3408`) is the only page still hard-coding `cyan-200/300` and `slate-800/900` in its dark mode. Now that the rest of the site has shipped a warm-amber `--accent` (Phase 3), the travel page is the single biggest source of brand inconsistency. Treat removing those hardcoded utilities as a **prerequisite** before any other travel-page polish — see §3.7.2.
- **Light-mode shadows are very subtle** (`rgba(15, 23, 42, 0.22)` at -34px). On modern displays they barely register. Either commit harder (e.g., `0 24px 60px -28px rgba(15, 23, 42, 0.32)`) or remove them and rely on hairline borders only — a more "Vercel/Stripe" treatment.
- **Background gradient mesh.** The radial gradients on `body` are nice but compete with the hero's blobs. Pick one source of gradient and stop layering. Consider a single fixed background gradient + grain noise instead.

### 4.2 Typography

- **Headline scale is reasonable but flat.** Hero is `lg:text-7xl`, article h2 is `lg:text-4xl`, post h1 is `lg:text-6xl`. Try widening the gap: hero → 8xl/9xl (`clamp(3.5rem, 9vw, 7rem)`), section eyebrows → `0.7rem` uppercase, card titles → bump to `text-2xl` so they feel less like body copy.
- **Tracking-tight on display** (`tracking-[-0.04em]`) is great. Apply it more uniformly to all `h1/h2`.
- **Body line-height** in articles is `leading-9` (2.25rem) on `text-lg` — that's very generous, almost airy. For a tighter editorial feel try `leading-8` (2rem). Or keep airy but reduce the column width slightly (`max-w-3xl` → `max-w-prose`) so eye travel is shorter.
- **Use `text-balance` / `text-pretty`** on all headings and long paragraphs. One-line CSS, big win at narrow breakpoints.

### 4.3 Motion & micro-interactions

- **You already have:** page-reveal, hover-lift on cards, brand-link shine. Good baseline.
- **Missing:**
  - **Magnetic / spring CTAs** — primary button bumps toward the cursor when within 80px.
  - **Scroll-linked parallax** on the hero portrait (subtle, ≤15px translate).
  - **View Transitions API** between home → post (Next.js 16 + React 19 support this directly). A `view-transition-name` on the card image + post hero image gives you a free morph animation.
  - **Cursor variants** — not needed, often gimmicky.
  - **Skeleton loaders** on all client-fetched components.

### 4.4 Information architecture / new pages

A premium personal site usually has:

| Page | Purpose | Priority |
|---|---|---|
| `/about` | Bio, photo, principles, experience timeline | **High** |
| `/work` (or `/projects`) | Selected work, case studies | **High** |
| `/now` | What you're currently focused on | Medium |
| `/uses` | Hardware/software stack | Low (but loved by devs) |
| `/talks` | Conference talks, podcasts | Medium |
| `/rss.xml` | Feed | **High** |
| `/sitemap.xml` | SEO | **High** |

The current site only has `/` and `/[slug]`. Adding even three of these (about, work, now) immediately signals depth.

### 4.5 Accessibility & polish

- The Lottie `WritingMark` has `aria-hidden="true"` — good.
- The empty `<p>` in the hero is read by screen readers as an empty paragraph. Fix.
- `Loading post...` is announced but doesn't have `role="status"` / `aria-live`. Add it.
- Toaster (`sonner`) is already wired — make sure it's `aria-live="polite"` (default is correct).
- Tag chip hit area is small (`px-3 py-1` at `0.66rem` font) — bump to meet 44×44 touch target on mobile.

---

## 5. Suggested phasing

If you want to ship this in passes rather than one big PR:

### Phase 1 — Bugfix + signature wins (1 PR, ~half a day)
- Fix the empty hero eyebrow.
- Drop the `</>` chip from the card.
- Replace the `WritingMark` with a thin gradient divider (or commit to ink theme everywhere).
- Add `text-balance` to headings.
- Add date + reading time to cards and post meta.
- Rename "Articles" CTA → "Read the journal."
- Soft-launch a third nav item ("About") even if it links to `/about` as a stub.

### Phase 2 — Editorial pass (1 PR, ~1–2 days)
- Featured / hero card in the articles grid (1×2-col + 6 regulars).
- Reading progress bar on post page.
- Sticky TOC on `lg:` for post pages.
- End-of-article author bio + "Up next" related posts.
- Skeleton loader for post page (replace `Loading post...`).
- Footer overhaul (multi-column, RSS, less repeat).

### Phase 3 — Brand & material (1 PR, ~1 day)
- Pick a signature accent colour. Apply to hover states, brand link, primary CTA glow.
- Vary surface treatments — hero keeps shell, articles section goes to negative-space, post keeps shell.
- Replace dual blobs in hero with one signature gradient + subtle noise overlay.
- Implement View Transitions for card → post navigation.
- Add `/about`, `/now`, `/rss.xml`.

### Phase 4 — Newsletter & polish (1 PR, ~half a day)
- Replace newsletter popup with inline-in-article card.
- Magnetic CTA on primary button.
- Accessibility sweep (touch targets, aria-live on async states).
- Colophon footer line.

### Phase 5 — Travel atlas uplift (1–2 PRs, ~1–2 days)

Split along risk lines: PR-A is a re-skin (low risk, no behaviour change), PR-B is the editorial pass (introduces new components and IA).

**PR-A — Re-skin & consistency (~half a day)**
- Strip every hardcoded `cyan-*` and `slate-*` utility from `travel-atlas-client.tsx`, `travel-globe-shell.tsx`, and `travel/loading.tsx`; route through `--primary`, `--accent`, `--surface`, `--surface-strong`, `--muted-foreground`. (§3.7.2)
- Add a real visible H1 + eyebrow + supporting sentence at the top of the page. (§3.7.1)
- Move stats below the hero copy as a horizontal row. (§3.7.3)
- Drop the radial-ellipse halo behind the globe; rebuild the globe + spotlight pairing on a shared `section-shell` background. (§3.7.4)
- Wire the per-country `themeColor` to override `--accent` for the duration of the page so the globe ring, CTA, and rail indicator pick up the selected country's hue. (§3.7.6)
- Re-skin `travel/loading.tsx` to match `PostSkeleton`. (§3.7.15)

**PR-B — Editorial pass (~1 day)**
- Refactor "Country Spotlight" into editorial style: large country wordmark, single editorial line, inline cities, highlight pill row, pull-quote memory using the §3.3 blockquote treatment. (§3.7.5)
- Re-flow the Visited Countries rail into a responsive grid grouped by continent. (§3.7.7)
- Demote "View Gallery" to a text link with arrow; promote the gallery photos as the scroll affordance. (§3.7.8)
- Vary the photo grid (zigzag or 2-1-2) and typeset captions in display font over the image. (§3.7.9)
- Flesh out the lightbox right-rail with memory quote + related-essay link + thumbnail strip. (§3.7.10)
- Add Atlas / Timeline toggle as a non-blocking enhancement. (§3.7.12)
- Globe a11y: label the wrapper, add keyboard arrow-key cycling. (§3.7.14)
- Active-section indicator in navbar when on `/travel`. (§3.7.13)
- Reorder mobile so the globe follows the H1, not the stats. (§3.7.11)

---

## 6. Inspiration / reference points

When implementing, these are the personal sites I'd anchor against — each does one thing on this list exceptionally well:

- **leerob.io** — editorial hierarchy, restraint, signature blue.
- **brittanychiang.com** — sticky TOC + reading progress, ink/handwriting consistency.
- **rauchg.com** — typography, the discipline of "less."
- **paco.me** — surface variation between sections.
- **emilkowal.ski** — micro-interaction craft, View Transitions used well.
- **shud.in / shu.codes** — premium dark mode treatment.

Reference visually, not copy-paste — your existing palette and tone are already distinctive enough to keep.

---

## 7. Files this plan would touch

- `src/components/home-hero.tsx` — eyebrow fix, headline gradient, status pill, portrait treatment.
- `src/components/posts.tsx` — featured card layout, metadata additions, empty state.
- `src/components/blog-card.tsx` — remove `</>` chip, add date + read time, hover arrow.
- `src/components/post.tsx` — reading progress, TOC, meta-row enrichment, skeleton, end-of-article footer.
- `src/components/post-content.tsx` — drop cap, pull-quote, anchor IDs on `<h2>`.
- `src/components/navbar.tsx` — nav items, scroll-condense, logo tracking tweak.
- `src/components/footer.tsx` — multi-column, RSS, deduped newsletter copy.
- `src/components/newsletter-card.tsx` — either retire or soften.
- `src/components/writing-mark.tsx` — commit to ink theme or delete.
- `src/app/globals.css` — surface variants, signature accent, drop-cap, pull-quote styles, reading-progress bar.
- `src/lib/site-profile.ts` — add `availabilityStatus`, `roleEyebrow`, expanded `socialLinks` and nav items.
- New: `src/app/about/page.tsx`, `src/app/now/page.tsx`, `src/app/rss.xml/route.ts`.
- `src/components/travel/travel-atlas-client.tsx` — H1/eyebrow, restructured spotlight, responsive country grid, demoted CTA, themed `--accent` per country (Phase 5).
- `src/components/travel/travel-globe-shell.tsx` — strip cyan/slate utilities, add wrapper `role="img"` + keyboard handling.
- `src/app/travel/loading.tsx` — re-skin to match `PostSkeleton`.
- New (optional Phase 5 B): `src/components/travel/travel-timeline.tsx` if we add the Atlas/Timeline toggle.

---

## 8. Open questions before implementing

1. **Signature accent colour** — do you have a preference (warm gold / coral / muted teal), or want me to propose one based on the portrait's tones?
2. **Newsletter popup** — keep, soften, or retire?
3. **Editorial vs minimal** — do you want the post page to lean editorial (drop caps, pull quotes, TOC) or remain minimal? Editorial is more "premium magazine"; minimal is more "Rauchg/Vercel."
4. **Scope of new pages** — start with just `/about` + `/rss.xml`, or also `/work` and `/now`?
5. **Travel illustrations vs photographs** — current covers under `/public/travel/*.png` are stylised illustrations. The premium options in §3.7.9 (display-font caption over image, varied editorial grid) read very differently against real photography vs illustration. Are illustrations the long-term direction, or placeholders until you swap in your own photos?
6. **Per-country accent override** — comfortable letting `--accent` change per selected country (§3.7.6), or do you want the amber accent constant everywhere for brand discipline?

Once those six are answered I can scope concrete Phase 1 and Phase 5-A PRs.
