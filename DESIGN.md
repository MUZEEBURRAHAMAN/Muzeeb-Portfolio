# Muzeeb Urrahaman — Portfolio Design System

Source-of-truth for the portfolio's visual + interaction system. Read before adding
or restyling anything so new work stays consistent.

Live: https://muzeeb-urrahaman.vercel.app · Static multipage site, no build step on deploy.

---

## 1. Architecture / how styles work

- **Static multipage** HTML (23 pages in repo root). No SSR/framework.
- **Tailwind** via a **prebuilt** `assets/css/output.css` (Vercel does NOT build —
  `vercel.json` has `buildCommand:""`). Any **new arbitrary Tailwind class**
  (e.g. `max-w-[1320px]`) must be regenerated locally:
  ```
  npx tailwindcss@3.4.6 -i ./assets/css/tailwind.css -o ./assets/css/output.css --minify
  ```
  then commit `output.css`. Standard classes already present don't need a rebuild.
- **Custom CSS** in `assets/css/style.css` — all bespoke components are `.mz-*`
  (site-wide) or `.csd-*` (case-study detail). Loaded on every page.
- **Shared JS** `assets/js/site.js` — one IIFE on every page: preloader (home only),
  scroll-reveal, active-nav, custom cursor, AI chat widget, theme toggle.
- **Cache-busting:** CSS links carry `?v=N`. Bump N when shipping CSS that must
  propagate immediately.

---

## 2. Theme + color tokens

Theme is driven by `data-theme="dark|light"` on `<html>`. Tokens live in `:root`
(dark default) with a `[data-theme="light"]` override block. Default is **dark**;
first visit respects `prefers-color-scheme`; user choice persists in
`localStorage['mz-theme']`. A FOUC-guard inline script in each `<head>` sets the
attribute before first paint.

**Design rule:** the **hero image band** and the **footer** stay dark in BOTH themes
(they're photographic / accent sections). Light theme flips body, cards, nav, chat,
and section text only.

### Core tokens

| Token | Dark | Light | Use |
|---|---|---|---|
| `--bg` | `#0f0f0f` | `#faf9f7` | page background |
| `--surface` | `#1a1a1a` | `#ffffff` | cards, pills, panels |
| `--surface-2` | `#141414` | `#f1f0ec` | insets, media tints |
| `--surface-3` | `#161616` | `#f4f4f2` | alt card bg |
| `--text` | `#f4f2ed` | `#17170f` | primary text / headings |
| `--text-2` | `#cfcfcd` | `#3a3a38` | secondary body text |
| `--muted` | `#8a8a8a` | `#6a6a66` | captions, meta |
| `--border` | `#242424` | `#e6e4df` | card borders |
| `--border-2` | `#2a2a2a` | `#dcdad4` | strong borders |
| `--line` | `rgba(255,255,255,.09)` | `rgba(0,0,0,.10)` | hairlines / dividers |

Always-dark anchors (do not tokenize): `--dark-bg:#0f0f0f`, footer `#161616`,
hero scrim over image.

Legacy: `--primary: 0 0% 100%` (HSL white) — Tailwind `primary` accent; was gold,
now white. Motion accents (about tooltips) intentionally keep small color pops.

---

## 3. Typography

Two families, loaded via Google Fonts `@import` at top of `style.css`.

- **Primary — Inter** (`--font-sans`): body, UI, nav, paragraphs, labels.
- **Secondary — Geist** (`--font-display`): ALL headings `h1–h6`, hero title,
  big numerals (`.mz-bento__num`), footer wordmark. Applied globally via the
  `h1,h2,h3,h4,h5,h6 { font-family: var(--font-display) }` rule.
- Utility: `.font-geist` to force Geist on a non-heading element.

Weights loaded 300–900 for both. Headings: 500–600, letter-spacing ~ -0.02em.
Body: 400, line-height ~1.6–1.72. Italic `<em>` used for emphasis in display type.

---

## 4. Layout

- **Container max-width: 1320px** for every home section + blog + case-study wrap.
  Keep new sections at 1320 for grid consistency.
- Case-study internals: cards/gallery/results `1120`, intro grid `900`,
  reading prose `~700` (line length), hero title `940`.
- Section gutters: `px-6`/`px-10`; sections vertically spaced via container `gap`.
- **Full-bleed** helper `.mz-fullbleed` (and `margin-inline: calc(50% - 50vw)`)
  breaks an element to viewport edges regardless of padding — used for the
  case-study footer and the home hero.
- Responsive: mobile stacks at ≤860px (case-study grids) / component-specific.

---

## 5. Motion

Tokens in `:root`:
```
--t-fast:150ms; --t-base:250ms; --t-slow:400ms; --t-reveal:700ms;
--ease:cubic-bezier(0.16,1,0.3,1);
```
- One global easing override on all Tailwind transitions.
- **Scroll reveal:** opt-in `.mz-reveal` (+ `.in` when visible), guarded by
  `html.js`; IntersectionObserver in site.js.
- `@media (prefers-reduced-motion: reduce)` kills animation site-wide.
- Marquees/loops use `@keyframes` (testimonials, tool drop).

---

## 6. Components (`.mz-*`, `.csd-*`)

- **Nav** `.mz-nav` — sticky floating pill (logo + pill links + résumé + mail).
  `::before` top scrim prevents content bleeding behind it. Theme toggle injected
  by site.js.
- **Hero** `.mz-hero` — full-bleed dark image (`hero-04.webp`) + scrim, Geist title,
  eyebrow **pill** (blurred dark chip, readable over image). Dark in both themes.
- **Bento** `.mz-bento` — stats + matter.js physics **tool drop** (`.mz-drop`);
  tools render as icon+label badges (`assets/images/{figma,framer,...}`).
- **Testimonials** `.mz-tcards` — auto-scroll marquee; one **featured** light card
  `.mz-tcard.feat` (intentional accent).
- **Selected work** `.mz-projects` / sticky `.mz-pcard`.
- **What I bring** `.mz-wib` + magnetic capability pills.
- **Footer** `.mz-footer` — dark (`#161616`), round avatar `.mz-footer__pic`,
  wordmark, contact + socials. Dark in both themes.
- **Case study** `.csd` — hero, intro+meta, 3-up cards, gallery, results cards.
- **Chat** `.cw-*` — AI widget (launcher orb + panel), site-wide except playground.
- **Cursor** — custom spring cursor with label (`.mz-cursor-on`).

---

## 7. Brand assets

- **Avatar (unified):** line-art `assets/images/logo.png` everywhere — nav, favicon,
  hero eyebrow, footer. One consistent mark. (Color photo `muzeeb.jpg` still used in
  About carousel / playground contexts only.)
- **Hero image:** `assets/images/hero/hero-04.webp` (monochrome halftone mountains +
  silhouette). Converted from PNG → webp (~309KB). Keep hero art dark + on-theme.
- **Tool icons:** `figma.webp, framer.webp, adobeIllustrator.webp, adobePhotoshop.webp,
  adobeAfterEffects.webp, webflow.webp, cursor.png, claude.png`.
- **OG/social:** `assets/images/og.jpg` (1200×630).
- Images: prefer **webp**; cap large backgrounds ≤1920px wide.

---

## 8. Voice / content

- Positioning: **Product Designer & Builder for AI & SaaS**, 4.5+ yrs, currently
  Omnis AI. "I design the system, then ship it in code."
- Case studies: LetmeGrab Design System, Zebralearn redesign, 30 Days UI (Omnis =
  coming soon). Detail pages use the `.csd` Aria-style layout.
- Tone: confident, concrete, no fluff. Headings lead with the outcome.

---

## 9. Conventions / gotchas

- Custom classes are `.mz-*` / `.csd-*`. Match surrounding code style.
- Verify layout via **DOM measurement** (`getBoundingClientRect`, computed styles),
  NOT scrolled screenshots — Lenis smooth-scroll desyncs the in-app browser's
  screenshot from actual scroll position.
- After adding arbitrary Tailwind classes → rebuild `output.css` + commit.
- Deploy: commit → push → `vercel deploy --prod`. Working domain
  `muzeeb-urrahaman.vercel.app`.
- AI chat key lives ONLY in Vercel env (`GEMINI_API_KEY`), never in code.
