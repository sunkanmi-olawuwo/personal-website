# Travel Atlas Page Plan

## Vision

Create a first-class `/travel` page that feels like a premium editorial atlas: a cinematic 3D globe, a refined country story panel, and a photo-driven memory gallery. The experience should be clean, top-tier, and usable in both light and dark themes.

The page should not feel like a utility dashboard or scrapbook. It should feel like a world-class personal archive.

## Product Direction

- Route: `/travel`
- Placement: first-class header link labeled `Travel`
- Content source: local typed data file in the repo
- Style direction: immersive atlas
- Deep linking: `/travel?country=<slug>`

## Core Experience

The page should be structured in this order:

1. Editorial hero with a short framing statement and travel stats.
2. Atlas section with a 3D globe and a synced selected-country detail panel.
3. Memory gallery for the selected country.
4. Visited countries rail or grid for scanning, keyboard access, and fallback navigation.

## Globe Interaction

Use a client-only 3D globe as the centerpiece, but treat it as an enhancement rather than the only navigation surface.

Interaction model:

- All countries render in a muted base state.
- Visited countries are highlighted.
- Hover shows a subtle country preview.
- Clicking a visited country selects it.
- Selection updates the URL query string with `?country=<slug>`.
- Selection animates focus toward that country on the globe.
- Clicking non-visited countries should not hijack the experience.

## Design Principles

- Deep ocean sphere with soft atmosphere glow.
- Visited countries should feel illuminated, not noisy.
- No cluttered route lines or gimmicky effects in v1.
- Keep the visual language aligned with the site's existing premium gradients, typography, spacing, and glass-like surfaces.
- Mobile should stack cleanly and stay fully usable without requiring precise globe interaction.

## Content Model

Add a local typed content file, likely `src/lib/travel-data.ts`, backed by images in `public/travel/<country-slug>/...`.

Suggested types:

### `TravelCountry`

- `slug`
- `name`
- `isoNumeric`
- `continent`
- `flagEmoji`
- `focusLat`
- `focusLng`
- `summary`
- `memory`
- `visitLabel`
- `cities`
- `highlights`
- `coverPhoto`
- `photos`
- `themeColor`

### `TravelPhoto`

- `src`
- `alt`
- `caption`
- `location?`
- `takenOn?`
- `orientation?`

## Why `isoNumeric` Matters

Store the numeric ISO country code so visited entries can map directly to world geometry data from `world-atlas`. This keeps the globe wiring stable and avoids fuzzy name matching.

## Recommended Technical Direction

- `react-globe.gl` for the 3D globe
- `world-atlas` with `countries-110m.json` for country geometry
- `topojson-client` to convert topology into usable polygon features
- `next/dynamic` with `ssr: false` for the globe so the route remains stable in the App Router

## Selected Country Panel

When a country is selected, the detail panel should show:

- Country name and flag
- Visit label
- Cities visited
- Two to four highlight chips
- A short memory paragraph
- A CTA that scrolls to the gallery

## Gallery Experience

- Use `next/image`
- Build a responsive asymmetrical grid
- Open images in a fullscreen lightbox
- Reuse the existing dialog primitives for the lightbox
- Include captions and previous/next controls

V1 should stay as a single atlas page and should not introduce separate per-country routes yet.

## Accessibility and Fallbacks

- The globe must not be the only way to browse countries.
- Provide a synced visited-country rail or button list outside the globe.
- Ensure keyboard users can select countries and open the gallery.
- Provide a loading shell while the globe bundle loads.
- Default to a featured country if the `country` query param is missing or invalid.

## Launch Scope

V1 should include:

- The `/travel` route
- Header navigation entry
- Local typed travel dataset
- At least two seeded sample countries
- Local placeholder or real travel images
- 3D globe with visited-country selection
- Selected-country story panel
- Memory gallery with lightbox
- Visited-country rail or grid

V1 should not include:

- Separate country detail routes
- Wishlist countries
- Route arcs between countries
- CMS integration

## Testing Plan

### Unit tests

- Travel data validity
- Derived travel stats helpers
- Search param country resolution with invalid fallback
- Lightbox state transitions

### Component tests

- Selected-country panel updates from rail interaction
- Gallery opens with the correct image and caption

### E2E tests

- Header navigation reaches `/travel`
- Loading `/travel?country=<slug>` preselects the right country
- Country rail interaction updates both panel and URL
- Lightbox opens and closes correctly
- Mobile layout remains usable without relying on globe clicks

## Default Assumptions

- Travel content lives in the repo, not in a CMS
- The page is public
- The page is promoted from the main header
- The desired tone is immersive atlas, not scrapbook
- V1 favors polish and stability over feature sprawl
