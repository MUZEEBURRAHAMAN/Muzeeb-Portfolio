<div align="center">

# Muzeeb Urrahaman — Portfolio

**Product Designer & Builder for AI & SaaS**
_I design the system, then ship it in code._

[![Live](https://img.shields.io/badge/Live-muzeeb--urrahaman.vercel.app-000?style=for-the-badge&logo=vercel&logoColor=white)](https://muzeeb-urrahaman.vercel.app)
&nbsp;
[![LinkedIn](https://img.shields.io/badge/LinkedIn-muzeeburrahaman-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/muzeeburrahaman)

</div>

---

## Overview

Personal portfolio site — a dark, motion-forward single-page experience presenting my
product-design work, case studies, and current focus on AI & SaaS. Built as a static,
dependency-light site so it loads fast and deploys anywhere.

**Live:** https://muzeeb-urrahaman.vercel.app

## Highlights

- **Motion-first hero** — GSAP `ScrambleText` headline + `Typed.js` tool ticker.
- **Smooth scrolling** — [Lenis](https://github.com/darkroomengineering/lenis) for inertial scroll.
- **"Coming Soon" project cards** — animated shimmer badge for in-progress work (Omnis AI), no dead detail pages.
- **Case studies** — LetmeGrab Design System, Zebralearn redesign, 30 Days Daily UI.
- **Responsive** — custom Tailwind breakpoints down to 375px, `loading="lazy"` on media.
- **Testimonials carousel** — Slick slider with initials avatars.

## Tech Stack

| Layer | Tools |
|---|---|
| Markup | Semantic HTML5 |
| Styling | [Tailwind CSS](https://tailwindcss.com) 3.x (CLI build) + custom CSS |
| Interactions | jQuery, GSAP (ScrambleText), Lenis, Slick, Typed.js, lightGallery |
| Hosting | [Vercel](https://vercel.com) (auto-deploy on push) |

## Project Structure

Static site — every page HTML lives at the repo root (the filename *is* the URL,
e.g. `about.html` → `/about.html`). Media is grouped under `assets/`.

```
.
├── index.html                     # Home (hero, works marquee, projects, Creative Hub, testimonials)
├── about.html                     # About + GSAP 3D ring carousel
├── best-work.html                 # Draggable/zoomable WebGL "best work" canvas
├── playground.html                # Experiments (dark-only)
├── blog.html                      # Writing index
├── coming-soon.html               # Pre-launch gate page (see Deployment)
│
├── *-case-study.html              # Case studies  → see "Pages map" below
├── *-blog.html                    # Blog posts    → see "Pages map" below
│
├── assets/
│   ├── css/
│   │   ├── tailwind.css            # Tailwind source (@tailwind directives)
│   │   ├── output.css              # Generated — do NOT hand-edit
│   │   └── style.css               # Custom styles (nav, chat, ring, carousel, themes…)
│   ├── js/
│   │   ├── site.js                 # Theme toggle, mobile drawer, AI chat, custom cursor
│   │   └── *.min.js                # Vendored libs (gsap, jquery, lenis, three…)
│   ├── images/                     # Site imagery (logo, hero, project shots)
│   ├── media/                      # Case-study screenshots, grouped by project
│   │   ├── audit/                  #   Omnis UX Audit Assistant
│   │   ├── edge-state/             #   Edge-State Fixer
│   │   ├── fontlens/               #   FontLens
│   │   └── catchly/                #   Catchly
│   └── font/
│
├── api/chat.mjs                   # Serverless endpoint for the AI chat widget
├── archive/                       # Retired drafts (not linked / not served)
├── vercel.json                    # Hosting config + the coming-soon gate
├── tailwind.config.js
├── robots.txt · sitemap.xml
└── package.json
```

## Pages map

**Core:** `index.html` · `about.html` · `best-work.html` · `playground.html` · `blog.html` · `coming-soon.html`

**Current case studies:** `audit-engine-case-study.html` · `edge-state-fixer-case-study.html` · `catchly-case-study.html` · `fontlens-case-study.html` · `forge-case-study.html`

**Earlier work / project pages:** `lmg-design-system.html` · `zebralearn-case-study.html` · `30-days.html` · `swipe-case-study.html` · `cashnex-website.html` · `ecommerce-checkout.html` · `ecommerce-vr-app.html` · `split-wise.html` · `product-vision.html` · `ux-review-presentations.html` · `uxd-for-product-managers.html`

**Blog posts:** `prototyping-blog.html`* · `communication-collaboration-blog.html` · `kano-framework-blog.html` · `moscow-framework-blog.html` · `rice-framework-blog.html` · `product-strategy-blog.html`

<sub>*file is `Prototyping-blog.html`.</sub>

## Local Development

**Prerequisites:** Node.js 18+, Python 3 (for the static server).

```bash
# 1. install build deps
npm install

# 2. watch + rebuild Tailwind on change
npm run dev

# 3. in a second terminal, serve the site
npm run serve          # → http://localhost:8777
```

Production CSS build (minified):

```bash
npm run build
```

> `assets/css/output.css` is generated from `tailwind.css`. Edit the source and Tailwind
> classes in the HTML — never hand-edit `output.css`.

## Deployment

Hosted on **Vercel**, served as static files from the repo root (no framework preset).
Deploy production from the CLI:

```bash
npm run deploy          # -> production (the live domain)
npm run deploy:preview  # -> throwaway preview URL
```

> **Deploy only via this script.** The live domain is served by the CLI-linked
> Vercel project (`.vercel/project.json`). A second, GitHub-connected Vercel
> project auto-builds on every `git push` and **fails** — those red ❌ in the
> repo's Deployments tab are that duplicate, not the live site. Ignore them, or
> disconnect that project's Git integration in the Vercel dashboard.

### 🔒 Pre-launch gate

The site is currently **gated to the coming-soon page**. `vercel.json` redirects every
path (incl. `/`) to `/coming-soon.html`, except the soon page itself and `/assets/*`:

```json
"redirects": [
  { "source": "/((?!coming-soon\\.html$|assets/).*)", "destination": "/coming-soon.html", "permanent": false }
]
```

- The gate is **Vercel-only** — a local server (`npm run serve`) shows the full site.
- **To launch:** delete the `redirects` block from `vercel.json` and redeploy.

## Roadmap

- [ ] Omnis AI case study (currently a "Coming Soon" card)
- [ ] Self-hosted showcase recordings (replace legacy GIFs)
- [ ] Refreshed testimonials from recent product work
- [ ] Migrate to a component-based rebuild (v3)

## Contact

- **Portfolio** — https://muzeeb-urrahaman.vercel.app
- **LinkedIn** — https://www.linkedin.com/in/muzeeburrahaman
- **Email** — rahamanmuzeeb1108@gmail.com

## License

© 2026 Muzeeb Urrahaman. All rights reserved. Code and design are proprietary and provided
for portfolio/review purposes only — not licensed for reuse.
