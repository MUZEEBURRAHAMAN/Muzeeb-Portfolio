(() => {
  // Home v3 motion layer: scroll reveals, split headings, card parallax,
  // cursor-follow pill, magnetic CTAs, hero grid spotlight, blog drag-scroll,
  // card spotlight borders and the exit curtain for internal links.
  const body = document.body;
  if (!body.classList.contains("mz-home")) return;

  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  if (!reduce && "IntersectionObserver" in window) body.classList.add("hv3-motion");

  /* ---------- split headings into masked words ---------- */
  function split(el) {
    let i = 0;
    (function walk(node) {
      Array.from(node.childNodes).forEach(child => {
        if (child.nodeType === 3) {
          const parts = child.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          parts.forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const w = document.createElement("span");
            w.className = "hv3-w";
            const inner = document.createElement("span");
            inner.style.setProperty("--i", i++);
            inner.textContent = part;
            w.appendChild(inner);
            frag.appendChild(w);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1 && !child.classList.contains("hv3-count")) {
          walk(child);
        }
      });
    })(el);
    el.classList.add("hv3-split");
  }
  if (body.classList.contains("hv3-motion")) {
    $$(".mz-projects__head h2, #writingTitle, .site-testimonials__title").forEach(split);
  }

  /* ---------- reveal on enter ---------- */
  const staggerGroups = [".blog-card", ".mz-customer-card"];
  staggerGroups.forEach(sel => $$(sel).forEach((el, i) => el.style.setProperty("--i", i % 3)));

  const revealTargets = $$(
    ".hv3-split, [data-hv3-reveal], .hatched-divider, .mz-work-card, .blog-card, .mz-customer-card"
  );
  if (body.classList.contains("hv3-motion")) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        el.classList.add("is-in");
        if (el.classList.contains("mz-work-card")) {
          // drop the clip-path after the unclip finishes so hover shadows aren't cut
          setTimeout(() => el.classList.add("is-settled"), 1150);
        }
        io.unobserve(el);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
    revealTargets.forEach(el => io.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add("is-in", "is-settled"));
  }

  /* ---------- work card image parallax ---------- */
  const parallaxImgs = $$(".mz-work-card__img-container > img");
  if (!reduce && parallaxImgs.length) {
    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      parallaxImgs.forEach(img => {
        const r = img.parentElement.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        // -1 (entering from bottom) .. 1 (leaving at top)
        const p = ((r.top + r.height / 2) - vh / 2) / (vh / 2 + r.height / 2);
        img.style.setProperty("--hv3-py", (p * -24).toFixed(1) + "px");
      });
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
  }

  if (fine && !reduce) {
    /* ---------- cursor-follow pill over work-card images ---------- */
    const pill = document.createElement("div");
    pill.className = "hv3-follow";
    pill.setAttribute("aria-hidden", "true");
    pill.innerHTML = '<span>View case study</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg>';
    body.appendChild(pill);
    let px = 0, py = 0, tx = 0, ty = 0, raf = 0;
    const loop = () => {
      px += (tx - px) * 0.2;
      py += (ty - py) * 0.2;
      pill.style.setProperty("--x", px.toFixed(1) + "px");
      pill.style.setProperty("--y", py.toFixed(1) + "px");
      raf = Math.abs(tx - px) + Math.abs(ty - py) > 0.3 ? requestAnimationFrame(loop) : 0;
    };
    $$(".mz-work-card__img-container:not(.mz-work-card__img-container--slider)").forEach(zone => {
      zone.addEventListener("pointerenter", e => {
        px = tx = e.clientX; py = ty = e.clientY;
        loop();
        pill.classList.add("is-on");
        body.classList.add("hv3-follow-on");
      });
      zone.addEventListener("pointermove", e => {
        tx = e.clientX; ty = e.clientY;
        if (!raf) raf = requestAnimationFrame(loop);
      });
      zone.addEventListener("pointerleave", () => {
        pill.classList.remove("is-on");
        body.classList.remove("hv3-follow-on");
      });
    });

    /* ---------- magnetic hero CTAs ---------- */
    $$(".mz-hero__cta").forEach(btn => {
      btn.addEventListener("pointermove", e => {
        const r = btn.getBoundingClientRect();
        btn.style.setProperty("--hv3-tx", ((e.clientX - r.left - r.width / 2) * 0.25).toFixed(1) + "px");
        btn.style.setProperty("--hv3-ty", ((e.clientY - r.top - r.height / 2) * 0.35).toFixed(1) + "px");
      });
      btn.addEventListener("pointerleave", () => {
        btn.style.setProperty("--hv3-tx", "0px");
        btn.style.setProperty("--hv3-ty", "0px");
      });
    });

    /* ---------- hero grid spotlight ---------- */
    const hero = document.querySelector(".mz-hero");
    const canvas = hero && hero.querySelector(".hv3-canvas");
    if (hero && canvas) {
      hero.addEventListener("pointermove", e => {
        const r = canvas.getBoundingClientRect();
        canvas.style.setProperty("--hv3-mx", (e.clientX - r.left) + "px");
        canvas.style.setProperty("--hv3-my", (e.clientY - r.top) + "px");
        canvas.style.setProperty("--hv3-spot", "1");
      });
      hero.addEventListener("pointerleave", () => canvas.style.setProperty("--hv3-spot", "0"));
    }

    /* ---------- spotlight borders on blog + testimonial cards ---------- */
    $$(".blog-card, .mz-customer-card").forEach(card => {
      card.addEventListener("pointermove", e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mouse-x", (e.clientX - r.left) + "px");
        card.style.setProperty("--mouse-y", (e.clientY - r.top) + "px");
        card.style.setProperty("--spotlight-opacity", "1");
      });
      card.addEventListener("pointerleave", () => card.style.setProperty("--spotlight-opacity", "0"));
    });

    /* ---------- drag to scroll the blog track ---------- */
    const track = document.getElementById("blogTrack");
    if (track) {
      let down = false, moved = false, startX = 0, startLeft = 0;
      track.addEventListener("pointerdown", e => {
        if (e.pointerType !== "mouse" || e.button !== 0) return;
        down = true; moved = false; startX = e.clientX; startLeft = track.scrollLeft;
      });
      window.addEventListener("pointermove", e => {
        if (!down) return;
        const dx = e.clientX - startX;
        if (!moved && Math.abs(dx) > 5) { moved = true; track.classList.add("is-dragging"); }
        if (moved) track.scrollLeft = startLeft - dx;
      });
      window.addEventListener("pointerup", () => {
        if (!down) return;
        down = false;
        if (moved) {
          // let the click that follows a drag die, then restore snapping
          setTimeout(() => track.classList.remove("is-dragging"), 0);
        }
      });
      track.addEventListener("dragstart", e => e.preventDefault());
    }
  }

  /* ---------- exit curtain for same-site page navigations ---------- */
  if (!reduce) {
    const curtain = document.createElement("div");
    curtain.className = "hv3-curtain";
    curtain.setAttribute("aria-hidden", "true");
    body.appendChild(curtain);
    document.addEventListener("click", e => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest("a[href]");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || !/\.html$|\/$/.test(url.pathname)) return;
      if (url.pathname === location.pathname && url.hash) return; // in-page anchor
      e.preventDefault();
      curtain.classList.add("is-on");
      setTimeout(() => { location.href = url.href; }, 560);
    });
    // Back/forward cache restores the page with the curtain down — lift it.
    window.addEventListener("pageshow", e => { if (e.persisted) curtain.classList.remove("is-on"); });
  }
})();
