(() => {
  // Case study v3: reveals, headline word stagger, cover parallax, reading
  // progress, before/after slider and a small image lightbox.
  const root = document.documentElement;
  const page = document.querySelector(".cs3");
  if (!page) return;
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

  /* ---------- headline: wrap words for hl-rise ---------- */
  $$(".cs3-hl", page).forEach(el => {
    let i = 0;
    (function walk(node) {
      Array.from(node.childNodes).forEach(child => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const w = document.createElement("span");
            w.className = "w";
            w.style.setProperty("--i", i++);
            w.textContent = part;
            frag.appendChild(w);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1) {
          walk(child);
        }
      });
    })(el);
  });

  /* ---------- reveals ---------- */
  const targets = $$("[data-rv], .cs3-section, .mark, .cs3-anno", page);
  if (root.classList.contains("js-cs3") && "IntersectionObserver" in window) {
    // An "unfold" element starts clipped to zero height, so the observer would
    // never see it: wrap it in an unclipped box and watch that instead.
    const proxy = new Map();
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        (proxy.get(e.target) || [e.target]).forEach(t => t.classList.add("is-in"));
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.06 });
    targets.forEach(t => {
      if (t.getAttribute("data-rv") === "unfold") {
        const box = document.createElement("div");
        box.style.minWidth = "0";
        t.replaceWith(box);
        box.appendChild(t);
        proxy.set(box, [t]);
        io.observe(box);
      } else {
        io.observe(t);
      }
    });
  } else {
    targets.forEach(t => t.classList.add("is-in"));
  }

  /* ---------- reading progress + cover settle ---------- */
  const bar = document.createElement("div");
  bar.className = "cs3-progress";
  bar.setAttribute("aria-hidden", "true");
  bar.innerHTML = "<span></span>";
  page.appendChild(bar);
  const cover = page.querySelector(".cs3-cover");
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.setProperty("--p", max > 0 ? Math.min(scrollY / max, 1).toFixed(4) : 0);
      if (cover && !reduce) {
        const r = cover.getBoundingClientRect();
        const t = Math.min(Math.max(1 - r.top / innerHeight, 0), 1);
        cover.style.setProperty("--cs3-cover-s", (1.06 - t * 0.06).toFixed(4));
      }
    });
  };
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  onScroll();

  /* ---------- section markers (left rail) + bottom bar ---------- */
  const sections = $$(".cs3-section[id]", page).filter(sec => sec.querySelector(".cs3-kicker__label"));
  const rail = document.createElement("nav");
  rail.className = "cs3-rail";
  rail.setAttribute("aria-label", "Sections");
  sections.forEach(sec => {
    const a = document.createElement("a");
    a.href = "#" + sec.id;
    const tip = document.createElement("span");
    tip.className = "cs3-rail__tip";
    tip.textContent = sec.querySelector(".cs3-kicker__label").textContent;
    a.setAttribute("aria-label", tip.textContent);
    a.appendChild(tip);
    rail.appendChild(a);
  });
  page.appendChild(rail);
  const railLinks = $$("a", rail);
  const hero = page.querySelector(".cs3-hero");
  const dock = document.querySelector(".cs3-dock");
  const footer = document.querySelector(".mz-footer");
  let railTick = false;
  const syncRail = () => {
    if (railTick) return;
    railTick = true;
    requestAnimationFrame(() => {
      railTick = false;
      const marker = innerHeight * 0.35;
      let active = -1;
      sections.forEach((sec, i) => { if (sec.getBoundingClientRect().top <= marker) active = i; });
      railLinks.forEach((a, i) => a.classList.toggle("is-active", i === active));
      const pastHero = hero ? hero.getBoundingClientRect().bottom < innerHeight * 0.5 : true;
      const atFooter = footer ? footer.getBoundingClientRect().top < innerHeight : false;
      rail.classList.toggle("is-on", pastHero && !atFooter);
      if (dock) dock.classList.toggle("is-on", pastHero && !atFooter);
    });
  };
  addEventListener("scroll", syncRail, { passive: true });
  addEventListener("resize", syncRail);
  syncRail();

  /* ---------- before / after slider ---------- */
  $$(".cs3-ba", page).forEach(ba => {
    const handle = ba.querySelector(".cs3-ba__handle");
    let pos = 50, dragging = false;
    const set = p => {
      pos = Math.min(Math.max(p, 0), 100);
      ba.style.setProperty("--pos", pos + "%");
      handle.setAttribute("aria-valuenow", Math.round(pos));
    };
    const fromEvent = e => {
      const r = ba.getBoundingClientRect();
      set(((e.clientX - r.left) / r.width) * 100);
    };
    ba.addEventListener("pointerdown", e => {
      dragging = true;
      ba.setPointerCapture(e.pointerId);
      fromEvent(e);
    });
    ba.addEventListener("pointermove", e => { if (dragging) fromEvent(e); });
    ba.addEventListener("pointerup", () => { dragging = false; });
    ba.addEventListener("pointercancel", () => { dragging = false; });
    handle.addEventListener("keydown", e => {
      const step = e.shiftKey ? 10 : 2;
      if (e.key === "ArrowLeft") { e.preventDefault(); set(pos - step); }
      if (e.key === "ArrowRight") { e.preventDefault(); set(pos + step); }
      if (e.key === "Home") { e.preventDefault(); set(0); }
      if (e.key === "End") { e.preventDefault(); set(100); }
    });
    set(50);
  });

  /* ---------- lightbox ---------- */
  const lb = document.createElement("div");
  lb.className = "cs3-lb";
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-modal", "true");
  lb.setAttribute("aria-label", "Image preview");
  lb.innerHTML = '<button type="button" aria-label="Close preview"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button><figure style="margin:0"><img alt=""><p></p></figure>';
  page.appendChild(lb);
  const lbImg = lb.querySelector("img"), lbCap = lb.querySelector("p"), lbClose = lb.querySelector("button");
  let opener = null;
  const close = () => { lb.classList.remove("is-open"); if (opener) opener.focus(); };
  $$(".cs3-media__frame", page).forEach(frame => {
    const img = frame.querySelector("img");
    if (!img) return;
    frame.tabIndex = 0;
    frame.setAttribute("role", "button");
    frame.setAttribute("aria-label", "Enlarge image: " + (img.alt || ""));
    const open = () => {
      opener = frame;
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt;
      const cap = frame.closest("figure") && frame.closest("figure").querySelector("figcaption");
      lbCap.textContent = cap ? cap.textContent : "";
      lb.classList.add("is-open");
      lbClose.focus();
    };
    frame.addEventListener("click", open);
    frame.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
  });
  lb.addEventListener("click", e => { if (e.target === lb || e.target.closest("button")) close(); });
  addEventListener("keydown", e => { if (e.key === "Escape" && lb.classList.contains("is-open")) close(); });
})();
