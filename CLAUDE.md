@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical: Next.js Version

This project runs **Next.js 16.2.3** with **React 19** and **Tailwind v4**. APIs differ from older versions you may have memorized:

- Route handler `params` and `searchParams` are `Promise`s and must be `await`ed (see `src/app/[slug]/page.tsx`, `src/app/page.tsx`).
- `export const dynamic = "force-dynamic"` is used on every page because content is fetched at request time.
- ESLint uses flat config (`eslint.config.mjs`), not `.eslintrc`.
- Tailwind v4 uses `@tailwindcss/postcss`; the CSS pipeline lives in `src/app/globals.css`.

Before writing non-trivial framework code, read the relevant guide under `node_modules/next/dist/docs/`.

## Commands

```bash
npm run dev          # Local dev (uses NEXT_PUBLIC_BLOG_DATA_MODE from .env.local; defaults to 'auto')
npm run build        # Production build
npm run lint         # ESLint flat config
npx tsc --noEmit     # Typecheck (CI runs this; no npm script alias)

npm run test         # Unit + e2e
npm run test:unit    # Vitest only
npm run test:e2e     # Builds in mock mode, then runs Playwright with @live tests excluded
npm run test:e2e:live  # Live Hashnode e2e (requires real publication env vars)

# Run a single unit test
npx vitest run tests/unit/posts.test.tsx
npx vitest tests/unit/posts.test.tsx     # watch mode

# Run a single Playwright test (must build first if not already built)
npx playwright test tests/e2e/offline-blog.spec.ts
```

The Playwright config starts its own server on `http://127.0.0.1:3400` via `npm run start` — do not run `npm run dev` alongside it. `npm run test:e2e` rebuilds every invocation.

## Content Mode Architecture

The blog has three content modes selected by `NEXT_PUBLIC_BLOG_DATA_MODE`:

- `mock` — always serve `src/lib/mock-blog-data.ts`. Used by default Playwright runs and design work.
- `live` — require Hashnode env vars; throw if missing.
- `auto` (default) — try Hashnode, fall back to mock silently on any failure.

All branching lives in `src/lib/requests.ts` (`requestBlogData`). Components never know which mode is active; they call the same `getPosts` / `getPostBySlug` / `getBlogName` functions. When adding new blog data fetches, follow the same pattern: GraphQL query → `requestBlogData<T>` → mock fallback returned when response is `null`.

Newsletter signup (`subscribeToNewsletter`) is the exception — it has no mock fallback and throws when Hashnode is not configured. `NewsletterCard` is gated by `newsletterEnabled` in `src/app/layout.tsx`.

Env vars are validated through `@t3-oss/env-nextjs` + Zod in `src/lib/env.ts`. Don't read `process.env` directly for blog config — import from there.

## Data Flow

Server components prefetch into a TanStack Query `QueryClient`, then dehydrate into a `HydrationBoundary` for the client. See `src/app/page.tsx` (infinite query for posts list, paginated by Hashnode cursors, 9 per page) and `src/app/[slug]/page.tsx` (single post). Client components in `src/components/` (`posts.tsx`, `post.tsx`) consume the hydrated cache via `useInfiniteQuery` / `useQuery`.

Tag filtering is driven by the `?tag=<slug>` search param on `/`; the home page derives `tagSlug` from `searchParams` and threads it through both the prefetch and the `Posts` component (which uses a separate query key per tag).

## UI Conventions

- Components use **shadcn/ui** (`new-york` style, `slate` base) — `components.json` config; primitives in `src/components/ui/`.
- Path alias `@/*` → `src/*`.
- Dark mode via `next-themes` (`ThemeProvider` in `src/components/providers.tsx`, toggler in `theme-toggler.tsx`).
- Fonts: local woff2 (Manrope display, Inter body) in `src/app/fonts/`, loaded via `next/font/local`.
- Toasts: `sonner` (`<Toaster />` in `providers.tsx`).

## Testing Notes

- Unit tests run under `jsdom` (see `vitest.config.ts`); setup in `tests/setup.ts`.
- Playwright runs serially (`workers: 1`, `fullyParallel: false`) — tests share the built server.
- E2E tests tagged `@live` only run via `test:e2e:live`. The default `test:e2e` uses `--grep-invert @live` and forces mock mode.
- `tests/e2e/design-safety.spec.ts` includes accessibility checks via `@axe-core/playwright`.

## CI

`.github/workflows/ci.yml` runs lint → typecheck → unit tests → build → e2e on every PR and push to `main`. There's also a PR title check workflow.
