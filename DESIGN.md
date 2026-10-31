# Muzeeb Urrahaman · Portfolio Design System

Source of truth for the portfolio's visual and interaction system. Read it before
adding or restyling anything, so new work stays consistent.

Live: https://muzeeb-urrahaman.vercel.app · Static multipage site, no build step on deploy.

---

## 1. Where the site stands

Every page now shares one shell: the cs3 tokens, header, type and palette, in both themes.

| Pages | Body class | Content layer |
|---|---|---|
| 6 case studies | `cs3-page` | cs3 components (`cs-v3.css`) |
| Home, About, Resume, Playground, Best Work, 404, Coming soon | `cs3-site` | cs3 shell + their original layouts (`style.css`, `home-v3.css`, `output.css`); `.cs3-site` points the old `--dsv-*` (and Best Work `--bwg-*`) tokens at cs3 values |

**New work uses cs3 components.** Nothing new goes into `style.css`; unused rules
were purged from it (222 KB → 137 KB) and the rest goes as those pages are rebuilt.

- `assets/css/style.css` (legacy, ~137 KB): `.mz-*` site components, header,
  footer, and a global zero-radius reset.
- `assets/css/ds-v2.css`: shared layer on every page. Image ratio rule, page
  transitions, theme-switch motion, header and footer fixes.
- `assets/css/cs-v3.css`: the cs3 tokens and components below.
- `assets/js/cs-v3.js`: reveals, word-split headline, section tick rail, bottom
  dock, before/after slider, image lightbox.
- `assets/js/site.js`: on every page. Theme toggle, mobile nav, chat widget, cursor.
- **Cache busting:** every CSS/JS link carries `?v=N`. Bump N in every page when
  you ship a change that must reach visitors immediately.

---

## 2. Theme

`data-theme="dark|light"` on `<html>`, set before first paint by an inline
script; the choice persists in `localStorage['mz-theme']`. **Dark is the default.**
cs3 defines dark tokens on `.cs3-page` and overrides them under
`html[data-theme="light"] .cs3-page`.

Theme switch: a circular reveal from the toggle (View Transitions, 500 ms
ease-in-out), skipped under reduced motion.

---

## 3. cs3 tokens (`cs-v3.css`)

### Color (semantic, use these, not raw values)

| Token | Dark | Light | Use |
|---|---|---|---|
| `--color-bg` | `#0f0f0f` | `#fff` | page |
| `--color-surface` | `#1a1a1a` | `#f5f5f5` | cards |
| `--color-text` | `#f5f5f5` | `#03111c` | headings, primary text |
| `--color-text-secondary` | text @ 75% | text @ 75% | body copy |
| `--color-text-muted` | text @ 62% | text @ 62% | captions, eyebrows |
| `--color-border` / `-strong` | text @ 12% / 24% | text @ 10% / 20% | hairlines |
| `--color-accent` | `#3b8bff` | `#116ff8` | links, focus |
| `--color-good` / `-fill` | green | green | "after", wins |
| `--color-danger` / `-fill` | red | red | "before", friction |
| `--color-tag-blue`, `--color-tag-orange`, `--color-badge` | | | tags |

### Type

- **Display:** `--font-display`: Saans (licence pending), falling back to Inter Tight.
  Used for all headings and big numerals.
- **Body/UI:** `--font-sans`: Inter. **Code:** `--font-code`: JetBrains Mono.
- Fluid scale `--text-2xs` … `--text-5xl` (clamp). Headings 600, tracking
  `--tracking-tight`. Eyebrows: `--text-2xs`, uppercase, `.06em`, muted.

### Space, size, shape

- Space `--space-1` (4px) … `--space-24` (96px); `--space-section` and
  `--space-block` are fluid section and block gaps; `--space-gutter` is the page
  gutter.
- Container `--container-max: 1200px`; reading width `--container-narrow: 760px`.
- Radius: `--radius-xs: 2px`, `--radius-sm: 4px`, cards `0`, pills `999px`.
  The legacy zero-radius reset in `style.css` is beaten with
  `html:not(#r0a):not(#r0b):not(#r0c):not(#r0d) .cs3-page …`; remove that hack
  once `style.css` is retired.

### Motion

- `--ease-out: cubic-bezier(.22,1,.36,1)`, `--ease-in-out: cubic-bezier(.65,0,.35,1)`.
- `--duration-fast .15s`, `--duration-base .25s`, `--duration-slow .5s`.
- Reveal on scroll: `data-rv` (fade/rise) and `data-rv="unfold"` (media bands),
  enabled only when `html.js-cs3` is set, which the head script skips under reduced motion.
- Page-to-page navigation: a 140 ms fade out and a 260 ms fade-and-rise in
  (cross-document View Transitions, typed `mz-page`), off under reduced motion.
- Lenis smooth scroll (Home, About) and the preloader honour reduced motion.

---

## 4. cs3 page anatomy

```
.cs3-page > main > .cs3
  .cs3-hero            back link, tags, h1.cs3-hl, lead, dl.cs3-facts, cover band
  .cs3-results         3 headline numbers (top band)
  .cs3-glance          at-a-glance: The problem / What I did / Where it stands
  section.cs3-section  (repeat) .cs3-wrap.cs3-grid > .cs3-kicker + .cs3-body
  .cs3-dock            sticky bottom bar: product, Next case study, role
  .cs3-more            "More case studies" row
footer.mz-footer
```

Each case study needs: a results band, an at-a-glance block, a facts row
(role, timeline, team, status), and a Next case study link. Next links follow the Home order
OmnisProof → CaseNotes → Audit Engine → Matter Redesign → GoFully → LitBox → OmnisProof.

## 5. cs3 components

| Component | Markup | Use |
|---|---|---|
| Block | `.cs3-block` (`.cs3-wide` to span) | wraps a heading + prose |
| Title / sub | `h2.cs3-title`, `h3.cs3-h3`, `.mark` highlight | section and block heads |
| Prose | `.cs3-prose` | paragraphs and lists |
| Media band | `figure.cs3-band > .cs3-band__inner[data-rv=unfold] > .cs3-media__frame` (+ `--narrow`, `--tall`) | screenshots, video |
| Two-up media | `.cs3-duo` inside a band | paired screens |
| Cards | `.cs3-cards.cs3-cards--2/3 > .cs3-card` (`.ic`, `.eyebrow`, `h4`, `p`, `--win`) | findings, decisions, lessons |
| Results | `.cs3-results` (`--4` for four) | headline numbers |
| Before/after list | `.cs3-vs > .cs3-vs__row` (`.gap` / `.good`) | problem vs fix |
| Flow strip | `.cs3-flow.cs3-flow--old/--new` with `ol > li` (`.k`, `h5`, `p`, `.fx`), `.cs3-flow__fork`, `.cs3-flow__foot` | user flows |
| Table | `.cs3-table > table` | comparisons, roles, stack |
| Note | `.cs3-note` (`--warn`) | scope notes, honesty |
| Quote / statement | `blockquote.cs3-quote` | goal, stakeholder quote |
| Accordion | `.cs3-faq > details > summary + .plus + .a` | FAQs, long detail |
| Share bar | `.cs3-meter` + `.cs3-meter__legend` (`.is-blocker/major/minor/nit/praise`) | severity mixes |
| Before/after slider | `.cs3-ba` | redesign comparisons |
| Download card | `.cs3-skill` | downloadable assets |
| Button | `.cs3-btn` (`--primary`, `--ghost`) | actions |

Page-only helpers (LitBox): `.lb-wf-pair` (sketch next to shipped screen),
`.lb-pins` / `.lb-pin` + `.lb-legend` (numbered callouts), `.lb-xref` (section links).
Promote one to cs3 when a second page needs it.

---

## 6. Images

- WebP only. Case-study screenshots at 2400 px wide (`cwebp -q 84 -m 6 -resize 2400 0`);
  Best Work full-size at 2400 px, grid thumbnails `_thumb.webp` at 1200 px.
- Every `<img>` carries `width` and `height` (the real pixel size) so space is
  reserved while it loads; `:where(img[width][height]) { height: auto }` in
  ds-v2 keeps the ratio when CSS sets only the width.
- `loading="lazy"` below the first screen; the hero cover is `eager`.
- Social preview: `og:image` 1200 × 630 where possible (`assets/images/og.jpg`).

---

## 7. Voice

- Positioning: **Product Designer & Builder for AI & SaaS**, currently Omnis AI.
- Lead with the outcome. Say what shipped and what didn't; never invent metrics.
  Prototype numbers are labelled as prototype numbers.
- One idea per sentence, plain words, no filler.

---

## 8. Conventions / gotchas

- Verify layout with DOM measurement (`getBoundingClientRect`, computed styles).
  Screenshots taken while Lenis or smooth scroll is moving show the wrong position.
- The in-app browser pauses `requestAnimationFrame` when its pane is hidden; front
  the tab before testing the preloader or Best Work canvas.
- After adding new Tailwind classes, rebuild `output.css`
  (`npm run build:css`) and commit it.
- Deploy: push to `main`; Vercel deploys `main`.
- The AI chat key lives only in Vercel env (`GEMINI_API_KEY`), never in code.
