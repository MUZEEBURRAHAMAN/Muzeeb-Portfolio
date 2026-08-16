/* Muzeeb portfolio — shared site JS
   1. Auto-highlight active pill-nav link by current page
   2. Custom cursor (arrow + "Designer" label) — desktop pointer devices only
   Vanilla port of a motion/react cursor component. */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  /* ---------- Sound Effect Helper Utilities ---------- */
  function mzPlay(cue, opts) { if (window.mzSFX) window.mzSFX.play(cue, opts); }
  function mzStartLoop(cue, opts) { return window.mzSFX ? window.mzSFX.startLoop(cue, opts) : null; }
  function mzStopLoop(cue) { if (window.mzSFX) window.mzSFX.stopLoop(cue); }

  function initHoverSFX() {
    if (!window.matchMedia || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    var HOVER_SEL = "button, a[href], input, select, textarea, [role='button'], label[for], .mz-theme-btn, .mz-nav__mail, .mz-nav__resume, #cw-launcher, .pgtour-btn";
    document.addEventListener("pointerover", function (e) {
      var target = e.target.closest(HOVER_SEL);
      if (!target) return;
      var related = e.relatedTarget ? e.relatedTarget.closest(HOVER_SEL) : null;
      if (target !== related) {
        mzPlay("hover", { cooldownMs: 80 });
      }
    });
  }

  /* ---------- Global interaction SFX ----------
     Delegated listeners so every button/link/input on every page gets sound,
     without hand-wiring each one. Elements that already play a tailored cue
     via their own click handler (chat widget, drawer, theme toggle)
     are skipped here to avoid a double-fire. */
  var SFX_HANDLED_SEL = "#cw-widget, .mz-drawer, .mz-theme-btn, #cw-launcher";

  function initGlobalSFX() {
    document.addEventListener("click", function (e) {
      if (e.target.closest(SFX_HANDLED_SEL)) return;
      var el = e.target.closest("button, a[href], [role='button'], input[type='button'], input[type='submit']");
      if (!el || el.disabled) return;
      mzPlay("press", { cooldownMs: 60 });
    }, true);

    document.addEventListener("focusin", function (e) {
      if (e.target.id === "cw-input") return;
      var el = e.target.closest("input, textarea, select");
      if (!el || el.type === "checkbox" || el.type === "radio" || el.type === "range" || el.type === "color") return;
      mzPlay("focus", { cooldownMs: 80 });
    });

    document.addEventListener("input", function (e) {
      if (e.target.id === "cw-input") return;
      var el = e.target;
      if (el.tagName !== "INPUT" && el.tagName !== "TEXTAREA") return;
      if (el.type === "checkbox" || el.type === "radio") return;
      if (el.type === "range" || el.type === "color") {
        mzPlay("select", { cooldownMs: 100 });
        return;
      }
      mzPlay("typing", { cooldownMs: 120 });
    });

    document.addEventListener("change", function (e) {
      var el = e.target;
      if (el.tagName === "SELECT") { mzPlay("select"); return; }
      if (el.tagName !== "INPUT") return;
      if (el.type === "checkbox") { mzPlay(el.checked ? "check" : "uncheck"); return; }
      if (el.type === "radio") { mzPlay("select"); return; }
    });
  }

  var SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>';
  var MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';

  /* ---------- Scroll reveal (opt-in via .mz-reveal) ---------- */
  function initReveal() {
    var els = document.querySelectorAll(".mz-reveal");
    if (!els.length || !("IntersectionObserver" in window)) {
      els.forEach(function (e) { e.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- 0. Preloader (pixel-dissolve, once per session) ---------- */
  // Markup is inline at top of <body> so it covers before first paint.
  // A synchronous inline guard hides it when already preloaded this session.
  function initPreloader() {
    var wrap = document.getElementById("mz-preloader");
    if (!wrap) return;
    // Already shown this session → the inline guard set display:none; just remove.
    if (getComputedStyle(wrap).display === "none") {
      wrap.remove();
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      return;
    }
    try { sessionStorage.setItem("mz-preloaded", "1"); } catch (e) {}

    // Cover color follows theme: dark cover on light page, light cover on dark page.
    var COLOR = document.documentElement.getAttribute("data-theme") === "light" ? "#0f0f0f" : "#faf9f7";
    var GRID = 16, EDGE = 0.12, DUR = 2.4;

    var canvas = wrap.querySelector("canvas");
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    var ctx = canvas.getContext("2d");
    var grid = null, dpr = Math.min(window.devicePixelRatio || 1, 2);

    function build() {
      var W = window.innerWidth, H = window.innerHeight;
      canvas.width = Math.floor(W * dpr); canvas.height = Math.floor(H * dpr);
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var cols = Math.ceil(W / GRID), rows = Math.ceil(H / GRID);
      var cw = W / cols, ch = H / rows, th = new Float32Array(cols * rows);
      for (var r = 0; r < rows; r++)
        for (var c = 0; c < cols; c++)
          th[r * cols + c] = (rows === 1 ? 0 : 1 - r / (rows - 1)) * (1 - EDGE) + Math.random() * EDGE;
      grid = { cols: cols, rows: rows, cw: cw, ch: ch, W: W, H: H, th: th };
    }
    function draw(p) {
      if (!grid) return;
      ctx.clearRect(0, 0, grid.W, grid.H);
      ctx.fillStyle = COLOR;
      for (var r = 0; r < grid.rows; r++)
        for (var c = 0; c < grid.cols; c++)
          if (grid.th[r * grid.cols + c] > p)
            ctx.fillRect(c * grid.cw, r * grid.ch, grid.cw + 1, grid.ch + 1);
    }
    var ease = function (t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; };
    build(); draw(0);
    // Canvas now fully covers — drop the fallback bg so dissolving cells reveal the page.
    wrap.style.background = "transparent";
    window.addEventListener("resize", function () { build(); }, { passive: true });

    var t0 = null;
    function frame(now) {
      if (t0 === null) t0 = now;
      var lin = Math.min(1, (now - t0) / 1000 / DUR);
      draw(ease(lin));
      if (lin >= 1) {
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
        setTimeout(function () { wrap.remove(); }, 120);
        return;
      }
      requestAnimationFrame(frame);
    }
    // Brief hold on the full cover, then dissolve (~2.9s total).
    setTimeout(function () { requestAnimationFrame(frame); }, 500);
  }
  initPreloader();

  /* ---------- 1. Active nav link ---------- */
  function setActiveNav() {
    var path = (location.pathname.split("/").pop() || "index.html") || "index.html";
    // Detail pages aren't nav items — light up their parent tab so a tab is always active.
    var parent = null;
    if (/(case-study|zebralearn|30-days|product-vision|ux-review|uxd-for)/i.test(path)) parent = "best-work.html";
    else if (/-blog\.html$/i.test(path)) parent = "blog.html";
    var links = document.querySelectorAll(".mz-nav__pill a, .mz-drawer__links a");
    links.forEach(function (a) {
      var href = (a.getAttribute("href") || "").split("/").pop();
      var on = href === path || (parent !== null && href === parent);
      a.classList.toggle("active", on);
    });
  }

  /* ---------- 2. Custom cursor (arrow + trailing label, spring + tilt) ---------- */
  function initCursor() {
    // Desktop pointer devices only — skip touch/coarse.
    if (!window.matchMedia || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    var SIZE = 30;
    var NAME = "Designer";
    var TILT_STRENGTH = 22;             // max label rock (deg)
    var LABEL_OX = SIZE * 0.9;          // label trails to the right of tip
    var LABEL_OY = SIZE * 0.2 + 6;

    var arrow = document.createElement("div");
    arrow.className = "mz-cursor";
    arrow.innerHTML =
      '<svg width="' + SIZE + '" height="' + SIZE + '" viewBox="0 0 28 28" fill="none" aria-hidden="true" style="display:block;overflow:visible">' +
      '<path d="M5 3 L23 14 L14 16 L11 24 Z" fill="currentColor" stroke="rgba(0,0,0,0.18)" stroke-width="0.6" stroke-linejoin="round"/>' +
      "</svg>";

    var follow = document.createElement("div");
    follow.className = "mz-cursor-follow";
    follow.innerHTML = "<span>" + NAME + "</span>";

    document.body.appendChild(arrow);
    document.body.appendChild(follow);
    document.body.classList.add("mz-cursor-on");

    var tx = 0, ty = 0;          // pointer target
    var ax = 0, ay = 0;          // arrow (snappy)
    var lx = 0, ly = 0;          // label (laggier)
    var rot = 0, rotTarget = 0;  // label tilt
    var scale = 1, scaleTarget = 1;
    var visible = false, primed = false;
    var last = null;             // {x,y,t} for velocity

    function onMove(e) {
      tx = e.clientX;
      ty = e.clientY;
      var now = performance.now();
      if (last) {
        var dt = Math.max(1, now - last.t);
        var vx = ((tx - last.x) / dt) * 1000;
        var vy = ((ty - last.y) / dt) * 1000;
        var speed = Math.hypot(vx, vy);
        var norm = Math.min(1, speed / 1500);
        var sign = vx === 0 ? 0 : vx > 0 ? 1 : -1;
        rotTarget = sign * norm * TILT_STRENGTH;
      }
      last = { x: tx, y: ty, t: now };
      if (!primed) { ax = lx = tx; ay = ly = ty; primed = true; }
      if (!visible) { visible = true; arrow.style.opacity = "1"; follow.style.opacity = "1"; }
    }
    function onLeave() {
      visible = false; last = null; rotTarget = 0;
      arrow.style.opacity = "0"; follow.style.opacity = "0";
    }
    function onDown() { scaleTarget = 0.92; }
    function onUp() { scaleTarget = 1; }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);

    (function raf() {
      ax += (tx - ax) * 0.35;   // arrow snappier
      ay += (ty - ay) * 0.35;
      lx += (tx - lx) * 0.16;   // label trails
      ly += (ty - ly) * 0.16;
      rot += (rotTarget - rot) * 0.2;
      scale += (scaleTarget - scale) * 0.25;
      arrow.style.transform = "translate(" + ax + "px," + ay + "px) scale(" + scale + ")";
      follow.style.transform =
        "translate(" + (lx + LABEL_OX) + "px," + (ly + LABEL_OY) + "px) rotate(" + rot + "deg) scale(" + scale + ")";
      requestAnimationFrame(raf);
    })();
  }

  /* ---------- 3. Chat widget (Muzeeb AI) ---------- */
  function initChat() {
    if (!document.body || document.getElementById("cw-launcher")) return;
    // No chat on the playground canvas — keeps it clean.
    if ((location.pathname.split("/").pop() || "") === "playground.html") return;
    var LINKEDIN = "https://www.linkedin.com/in/muzeeburrahaman";
    var RESUME = "https://drive.google.com/file/d/13s3keaT9t40X_bJCd_FmL5hiAKgMgaNj/view?usp=sharing";
    var CALENDLY = "https://calendly.com/rahamanmuzeeb1108/new-meeting";
    var MAILTO = "mailto:rahamanmuzeeb1108@gmail.com";
    var KB = [
      { k: ["who", "about", "yourself", "tell me about", "introduce", "muzeeb", "intro"], a: "Muzeeb is an end-to-end Product Designer & Builder with 4.5+ years across AI, SaaS, and e-commerce. His edge: he designs AND builds — taking ideas from 0 → 1. (It's pronounced “muh-zeeb”, by the way.)", l: [{ t: "About Muzeeb", u: "about.html" }, { t: "Selected work", u: "index.html#work" }] },
      { k: ["project", "projects", "work on", "worked", "worked on", "built", "build", "shipped", "portfolio", "selected work"], a: "On the Home page you'll find his Selected Work: Omnis AI (a unified design system + AI tools for 8+ legal products), a Zebralearn product-page redesign, and a 30-day Daily UI series. Playground has side experiments too.", l: [{ t: "Selected work", u: "index.html#work" }, { t: "Best work", u: "best-work.html" }, { t: "Playground", u: "playground.html" }] },
      { k: ["omnis", "legal", "current", "current role", "recent"], a: "At Omnis AI (2025–now) Muzeeb leads product design across 8+ AI-powered legal products, built and scaled a 200+ component design system adopted across the suite, and shipped AI design-automation tools — a UX Audit Assistant and an AI Edge Fixer.", l: [{ t: "UX Audit Assistant", u: "audit-engine-case-study.html" }, { t: "Edge-State Fixer", u: "edge-state-fixer-case-study.html" }] },
      { k: ["design system", "system", "component", "tokens"], a: "He builds and scales design systems end-to-end — most notably a 200+ component system at Omnis AI adopted across 8+ products, and a unifying system at LetmeGrab. One source of truth, faster shipping, consistent UX.", l: [{ t: "Best work", u: "best-work.html" }] },
      { k: ["ai tool", "ai tools", "automation", "audit", "edge fixer", "plugin"], a: "He builds AI design-automation tools: a UX Audit Assistant (automated design reviews at scale) and an AI Edge Fixer (catches UI edge-cases). Experiments live on the Playground page.", l: [{ t: "UX Audit Assistant", u: "audit-engine-case-study.html" }, { t: "Edge-State Fixer", u: "edge-state-fixer-case-study.html" }, { t: "Forge", u: "forge-case-study.html" }] },
      { k: ["case study", "case studies", "letmegrab", "zebralearn", "zebra", "30 day", "daily ui", "catchly", "fontlens", "forge"], a: "Case studies you can open: the Omnis UX Audit Assistant, Edge-State Fixer, Catchly, FontLens, Forge, a Zebralearn redesign, and a 30 Days Daily UI series.", l: [{ t: "UX Audit Assistant", u: "audit-engine-case-study.html" }, { t: "Edge-State Fixer", u: "edge-state-fixer-case-study.html" }, { t: "Catchly", u: "catchly-case-study.html" }, { t: "FontLens", u: "fontlens-case-study.html" }, { t: "Forge", u: "forge-case-study.html" }, { t: "All work", u: "best-work.html" }] },
      { k: ["playground", "side project", "experiment", "fun"], a: "The Playground page has his side projects and experiments — tools, AI ideas, and things built to test a concept or scratch an itch.", l: [{ t: "Open Playground", u: "playground.html" }] },
      { k: ["experience", "background", "career", "years", "history", "journey"], a: "4.5+ years as a Product Designer & Builder across AI, SaaS, and e-commerce. Timeline: Product Designer / UX Lead at Omnis AI (2025–now), UI/UX Designer at LetmeGrab (2023–24), UX Designer at Photoshooto (2022–23), plus earlier design internships.", l: [{ t: "About & experience", u: "about.html" }, { t: "Résumé", u: RESUME, x: true }] },
      { k: ["tool", "tools", "software", "stack", "figma", "framer", "cursor", "tech", "claude"], a: "His toolkit: Figma (design & prototyping), Cursor (AI-assisted coding), Claude (AI workflows & automation), Framer (no-code / coded web), and Adobe Illustrator & Photoshop." },
      { k: ["available", "availability", "hire", "hiring", "freelance", "open", "job", "role", "opportunity", "why hire"], a: "Yes — Muzeeb is open to remote work and relocation, exploring Product Designer, Founding Designer, and Design Engineer roles to help build AI products from 0 → 1. Fastest way in: email him.", l: [{ t: "Email Muzeeb", u: MAILTO, x: true }, { t: "Book a call", u: CALENDLY, x: true }, { t: "Résumé", u: RESUME, x: true }] },
      { k: ["contact", "email", "reach", "connect", "linkedin", "touch", "message", "hello"], a: "Easiest is email: rahamanmuzeeb1108@gmail.com. He's also on LinkedIn, Behance, Dribbble and Instagram — links are in the footer.", l: [{ t: "Email", u: MAILTO, x: true }, { t: "LinkedIn", u: LINKEDIN, x: true }, { t: "Book a call", u: CALENDLY, x: true }] },
      { k: ["resume", "cv", "download"], a: "Grab his résumé from the Resume button in the nav, or right here:", l: [{ t: "Download résumé", u: RESUME, x: true }] },
      { k: ["challenge", "challenges", "hard", "difficult", "tough", "problem", "complex"], a: "His favorite problems are dense B2B workflows — legal tools full of edge cases, regulations and trade-offs — where the job is turning real complexity into something clear and usable.", l: [{ t: "About Muzeeb", u: "about.html" }] },
      { k: ["process", "approach", "how do you", "how does he", "method", "workflow"], a: "He starts by asking a lot of questions to find what's actually causing a problem before touching screens, maps how flows connect, and stress-tests the weak spots before users hit them.", l: [{ t: "About Muzeeb", u: "about.html" }] },
      { k: ["location", "based", "where", "country", "relocat", "india", "remote"], a: "Based in Uttar Pradesh, India — open to remote work and relocation." },
      { k: ["skill", "skills", "strength", "good at", "specialize", "expertise", "do you do"], a: "End-to-end: discovery & research, design systems, prototyping, and launch — then building AI-assisted workflows and internal tools. He sits between UX logic and UI craft, and ships, not just mockups.", l: [{ t: "Best work", u: "best-work.html" }, { t: "About Muzeeb", u: "about.html" }] },
      { k: ["blog", "writing", "notes", "article"], a: "He writes notes on AI, design systems, and building — check his prototyping & process notes.", l: [{ t: "Prototyping notes", u: "Prototyping-blog.html" }] },
      { k: ["name", "pronounce", "pronunciation", "say your name"], a: "It's “muh-zeeb” — easier than it looks :)" }
    ];
    var FALLBACK = "Good question! I can cover Muzeeb's projects, experience, design systems, AI tools, process, availability, or how to reach him. Try a suggestion, or ask another way.";
    var SUGGEST = ["Projects", "Experience", "Tools", "Available?", "Design systems", "Contact"];

    var wrap = document.createElement("div");
    wrap.innerHTML =
      '<svg class="cw-mask-host" width="0" height="0" aria-hidden="true"><defs><mask id="cwclip">' +
      '<polygon points="0,0 100,0 100,100 0,100" fill="black"/>' +
      '<polygon points="25,25 75,25 50,75" fill="white"/><polygon points="50,25 75,75 25,75" fill="white"/>' +
      '<polygon points="35,35 65,35 50,65" fill="white"/><polygon points="35,35 65,35 50,65" fill="white"/>' +
      '<polygon points="35,35 65,35 50,65" fill="white"/><polygon points="35,35 65,35 50,65" fill="white"/>' +
      '</mask></defs></svg>' +
      '<button id="cw-launcher" aria-label="Ask about Muzeeb"><span class="cw-load"><span class="cw-load-box"></span></span></button>' +
      '<div id="cw-panel" role="dialog" aria-label="Muzeeb AI assistant">' +
      '<div class="cw-head"><span class="cw-havatar"><span class="cw-load"><span class="cw-load-box"></span></span></span>' +
      '<div class="cw-name">Muzeeb AI<span>● online</span></div><span class="sp"></span>' +
      '<button id="cw-reset" aria-label="Reset"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg></button>' +
      '<button id="cw-close" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>' +
      '<div class="cw-body" id="cw-body"></div>' +
      '<div class="cw-foot"><div class="cw-inrow">' +
      '<svg class="cw-search" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>' +
      '<input class="cw-input" id="cw-input" placeholder="Ask about my work…" autocomplete="off">' +
      '<button class="cw-send" id="cw-send" aria-label="Send"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/></svg></button>' +
      '</div><div class="cw-note">Answers are pre-written · not stored</div></div></div>';
    document.body.appendChild(wrap);

    var launcher = document.getElementById("cw-launcher"), panel = document.getElementById("cw-panel"),
        body = document.getElementById("cw-body"), input = document.getElementById("cw-input"), send = document.getElementById("cw-send");
    document.getElementById("cw-close").onclick = function () { toggle(false); mzPlay("close"); };
    document.getElementById("cw-reset").onclick = function () { body.innerHTML = ""; greet(); mzPlay("undo"); };
    launcher.onclick = function () {
      var willOpen = !panel.classList.contains("open");
      toggle(willOpen);
      mzPlay(willOpen ? "open" : "close");
    };
    function toggle(on) {
      panel.classList.toggle("open", on);
      launcher.style.display = on ? "none" : "block";
      document.body.classList.toggle("cw-open", on);
      if (on && !body.childElementCount) greet();
      if (on) setTimeout(function () { input.focus(); }, 200);
    }
    function bubble(t, w) { var d = document.createElement("div"); d.className = "cw-msg " + w; d.textContent = t; body.appendChild(d); scroll(); }
    function scroll() { body.scrollTop = body.scrollHeight; }
    function greet() {
      bubble("Hey there! 👋", "bot");
      bubble("Ask me anything about Muzeeb's work, experience, or projects — or pick one below.", "bot");
      var l = document.createElement("div"); l.className = "cw-suggest-label"; l.textContent = "Suggested questions"; body.appendChild(l);
      var c = document.createElement("div"); c.className = "cw-chips";
      SUGGEST.forEach(function (q) { var b = document.createElement("button"); b.className = "cw-chip"; b.textContent = q; b.onclick = function () { ask(q); mzPlay("select"); }; c.appendChild(b); });
      body.appendChild(c); scroll();
    }
    function matchEntry(q) { var s = q.toLowerCase(), best = null, sc = 0; KB.forEach(function (e) { var n = 0; e.k.forEach(function (k) { if (s.indexOf(k) !== -1) n++; }); if (n > sc) { sc = n; best = e; } }); return sc > 0 ? best : null; }
    function answer(q) { var e = matchEntry(q); return e ? e.a : FALLBACK; }
    var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
    function renderLinks(links) {
      if (!links || !links.length) return;
      var c = document.createElement("div"); c.className = "cw-links";
      links.forEach(function (ln) {
        var a = document.createElement("a"); a.className = "cw-link"; a.href = ln.u;
        a.appendChild(document.createTextNode(ln.t));
        var s = document.createElement("span"); s.className = "cw-link-ic"; s.innerHTML = ARROW; a.appendChild(s);
        if (ln.x) { a.target = "_blank"; a.rel = "noopener"; }
        c.appendChild(a);
      });
      body.appendChild(c); scroll();
    }
    function ask(q) {
      var chips = document.querySelectorAll(".cw-chips,.cw-suggest-label"); chips.forEach(function (e) { e.remove(); });
      bubble(q, "user");
      var entry = matchEntry(q);               // links come from the local KB match, even when the backend supplies the text
      var words = ["Thinking", "Collecting", "Looking it up", "Digging in", "One sec"];
      var word = words[Math.floor(Math.random() * words.length)];
      var t = document.createElement("div"); t.className = "cw-think";
      t.innerHTML = word + '<span class="cw-dots"><i></i><i></i><i></i></span>';
      body.appendChild(t); scroll();

      var loopHandle = mzStartLoop("processing");
      var done = false, started = Date.now();
      function finish(text, isError) {
        if (done) return; done = true;
        var wait = Math.max(0, 500 - (Date.now() - started));
        setTimeout(function () {
          if (loopHandle && typeof loopHandle.stop === "function") {
            try { loopHandle.stop(); } catch (err) {}
            loopHandle = null;
          }
          mzStopLoop("processing");
          t.remove();
          bubble(text, "bot");
          renderLinks(entry && entry.l);
          mzPlay(isError ? "error" : "receive");
        }, wait);
      }
      fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q })
      })
        .then(function (r) { return r.ok ? r.json() : Promise.reject(); })
        .then(function (d) { finish((d && d.reply) ? d.reply : answer(q), false); })
        .catch(function () { finish(answer(q), false); });
    }
    function submit() {
      var q = input.value.trim();
      if (!q) return;
      input.value = "";
      mzPlay("send");
      ask(q);
    }
    send.onclick = submit;
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") submit(); });
    input.addEventListener("input", function () { mzPlay("typing"); });
  }

  function ready(fn) {
    // Enhanced mail icon click handler: opens Gmail Web Composer directly in a new tab
    document.addEventListener("click", function (e) {
      var mailBtn = e.target.closest(".mz-nav__mail");
      if (!mailBtn) return;

      var email = "rahamanmuzeeb1108@gmail.com";
      var gmailUrl = "https://mail.google.com/mail/?view=cm&fs=1&to=" + encodeURIComponent(email);

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(email);
        }
      } catch (err) {}

      window.open(gmailUrl, "_blank");

      var toast = document.getElementById("mz-email-toast");
      if (!toast) {
        toast = document.createElement("div");
        toast.id = "mz-email-toast";
        toast.style.cssText = "position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#18181b;color:#ffffff;padding:10px 20px;border-radius:999px;font-size:0.85rem;font-weight:600;z-index:99999;box-shadow:0 10px 30px rgba(0,0,0,0.3);opacity:0;transition:opacity 0.2s, transform 0.2s;pointer-events:none;";
        document.body.appendChild(toast);
      }
      toast.textContent = "Opening Gmail to rahamanmuzeeb1108@gmail.com...";
      toast.style.opacity = "1";
      toast.style.transform = "translateX(-50%) translateY(-4px)";

      setTimeout(function () {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(-50%) translateY(0)";
      }, 2400);
    });
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }
  /* ---------- Light / dark theme toggle ---------- */
  function initTheme() {
    var root = document.documentElement;
    var page = (location.pathname.split("/").pop() || "");
    // coming-soon is a dark-only surface.
    if (page === "coming-soon.html") {
      root.setAttribute("data-theme", "dark");
      return;
    }
    var saved = null;
    try { saved = localStorage.getItem("mz-theme"); } catch (e) {}
    var sys = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    var cur = root.getAttribute("data-theme") || saved || sys;
    root.setAttribute("data-theme", cur);

    // Theme toggle binding: check for header button or create floating fallback
    var btn = document.getElementById("siteThemeBtn") || document.querySelector(".mz-theme-btn");
    if (!btn) {
      btn = document.createElement("button");
      btn.className = "mz-theme-btn";
      btn.type = "button";
      btn.setAttribute("aria-label", "Toggle light or dark theme");
      document.body.appendChild(btn);
    }

    function render() {
      var light = root.getAttribute("data-theme") === "light";
      btn.innerHTML = (light ? MOON : SUN);
    }
    render();
    btn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("mz-theme", next); } catch (e) {}
      render();
      mzPlay(next === "dark" ? "toggle-on" : "toggle-off");
    });
  }

  /* ---------- Mobile nav: logo left, hamburger right -> slide-in drawer ---------- */
  function initMobileNav() {
    var nav = document.querySelector(".mz-nav");
    if (!nav || nav.querySelector(".mz-nav__burger")) return;
    var pill = nav.querySelector(".mz-nav__pill");
    var resume = nav.querySelector(".mz-nav__resume");
    var mail = nav.querySelector(".mz-nav__mail");

    var burger = document.createElement("button");
    burger.className = "mz-nav__burger";
    burger.type = "button";
    burger.setAttribute("aria-label", "Open menu");
    burger.setAttribute("aria-expanded", "false");
    burger.innerHTML = "<span></span><span></span><span></span>";
    nav.appendChild(burger);

    var links = "";
    if (pill) [].forEach.call(pill.querySelectorAll("a"), function (a) {
      var label = a.querySelector("span") ? a.querySelector("span").textContent : a.textContent.trim();
      links += '<a href="' + a.getAttribute("href") + '">' + label + "</a>";
    });
    if (resume) links += '<a href="' + resume.getAttribute("href") + '" target="_blank" rel="noopener">Résumé</a>';
    if (mail) links += '<a href="' + mail.getAttribute("href") + '">Email me</a>';

    var overlay = document.createElement("div");
    overlay.className = "mz-drawer__ov";
    var drawer = document.createElement("div");
    drawer.className = "mz-drawer";
    drawer.innerHTML = '<div class="mz-drawer__panel"><button class="mz-drawer__close" type="button" aria-label="Close menu">&times;</button><nav class="mz-drawer__links">' + links + "</nav></div>";
    document.body.appendChild(overlay);
    document.body.appendChild(drawer);

    function open(o) {
      drawer.classList.toggle("open", o);
      overlay.classList.toggle("open", o);
      document.body.style.overflow = o ? "hidden" : "";
      burger.setAttribute("aria-expanded", o ? "true" : "false");
    }
    burger.addEventListener("click", function () { open(true); mzPlay("open"); });
    overlay.addEventListener("click", function () { open(false); mzPlay("close"); });
    drawer.querySelector(".mz-drawer__close").addEventListener("click", function () { open(false); mzPlay("close"); });
    [].forEach.call(drawer.querySelectorAll(".mz-drawer__links a"), function (a) {
      a.addEventListener("click", function () { open(false); mzPlay("forward"); });
    });
  }

  /* ---------- Back/forward cache restore: never leave the page locked ---------- */
  // On browser Back, bfcache restores the DOM without re-running scripts. If the
  // preloader's overflow:hidden was still set, the page would be stuck/unscrollable.
  window.addEventListener("pageshow", function (e) {
    if (!e.persisted) return;
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    var pl = document.getElementById("mz-preloader");
    if (pl) pl.remove();
  });

  /* ---------- Social Profile Popovers & GitHub Contribution Heatmap ---------- */
  function initSocialPopovers() {
    var ghGrids = document.querySelectorAll(".mz-js-gh-grid");
    ghGrids.forEach(function (grid) {
      if (grid.childElementCount > 0) return;
      var frag = document.createDocumentFragment();
      for (var i = 0; i < 196; i++) {
        var cell = document.createElement("div");
        cell.className = "mz-gh-cell";
        var rand = Math.random();
        var level = "0";
        if (rand > 0.88) level = "4";
        else if (rand > 0.72) level = "3";
        else if (rand > 0.52) level = "2";
        else if (rand > 0.32) level = "1";
        cell.setAttribute("data-level", level);
        frag.appendChild(cell);
      }
      grid.appendChild(frag);
    });

    var copyBtn = document.getElementById("mz-copyEmail");
    if (copyBtn) {
      copyBtn.addEventListener("click", function () {
        var email = copyBtn.getAttribute("data-email") || "rahamanmuzeeb1108@gmail.com";
        var label = document.getElementById("mz-copyLabel") || copyBtn;
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(email).then(function () {
            var origText = label.textContent;
            label.textContent = "Copied!";
            setTimeout(function () { label.textContent = origText; }, 1800);
          });
        }
      });
    }

    // Smooth morphing social popover cards (profile section only)
    var container = document.querySelector(".mz-ab-contact");
    if (!container) return;
    var items = container.querySelectorAll(".mz-social-item");
    var activeItem = null;
    var leaveTimer = null;

    items.forEach(function (item) {
      var popover = item.querySelector(".mz-social-popover");
      if (!popover) return;

      item.addEventListener("mouseenter", function () {
        document.body.classList.add("mz-hide-cursor-follow");
        if (leaveTimer) {
          clearTimeout(leaveTimer);
          leaveTimer = null;
        }

        if (activeItem && activeItem !== item) {
          var prevPopover = activeItem.querySelector(".mz-social-popover");
          if (prevPopover) {
            prevPopover.classList.remove("is-active", "is-morphing");
          }
          popover.classList.add("is-morphing");
          void popover.offsetWidth;
          popover.classList.add("is-active");
        } else {
          popover.classList.remove("is-morphing");
          popover.classList.add("is-active");
        }
        activeItem = item;
      });

      item.addEventListener("mouseleave", function () {
        leaveTimer = setTimeout(function () {
          if (activeItem === item) {
            popover.classList.remove("is-active", "is-morphing");
            activeItem = null;
            document.body.classList.remove("mz-hide-cursor-follow");
          }
        }, 140);
      });

      item.addEventListener("focusin", function () {
        popover.classList.add("is-active");
      });
      item.addEventListener("focusout", function () {
        popover.classList.remove("is-active", "is-morphing");
      });
    });
  }

  /* ---------- Hero Typing Text Animation (Motion-like TypingText) ---------- */
  function initTypingText() {
    var target = document.getElementById("heroTypingText");
    if (!target) return;

    var words = [
      "scale & ship.",
      "craft & ship.",
      "solve & build.",
      "scale systems.",
      "ship in code."
    ];
    var wordIndex = 0;
    var charIndex = words[0].length;
    var isDeleting = true;
    var typingSpeed = 65;
    var deletingSpeed = 35;
    var holdDelay = 2200;
    var pauseBeforeType = 350;

    // Start cycling only after the hero entrance rise animation has settled (2200ms)
    setTimeout(tick, 2200);

    function tick() {
      var currentWord = words[wordIndex];

      if (isDeleting) {
        charIndex--;
        if (charIndex <= 0) {
          charIndex = 0;
          target.innerHTML = "&nbsp;";
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
          setTimeout(tick, pauseBeforeType);
          return;
        }
        target.textContent = currentWord.substring(0, charIndex);
        setTimeout(tick, deletingSpeed);
      } else {
        charIndex++;
        target.textContent = currentWord.substring(0, charIndex);
        if (charIndex >= currentWord.length) {
          isDeleting = true;
          setTimeout(tick, holdDelay);
          return;
        }
        setTimeout(tick, typingSpeed + (Math.random() * 12));
      }
    }
  }

  // Loads the SFX engine (used by hover/click sound cues elsewhere on the
  // page) without any visible sound toggle — there's no UI for muting.
  function ensureSFXLoaded() {
    if (window.mzSFX || window.nachiSFX) return;
    var s1 = document.createElement("script");
    s1.src = "assets/js/nachi-sfx.js";
    s1.onload = function () {
      var s2 = document.createElement("script");
      s2.src = "assets/js/sfx.js";
      document.head.appendChild(s2);
    };
    document.head.appendChild(s1);
  }

  /* ---------- 5. Problem Solving Side Sheet ---------- */
  function initProblemSheet() {
    var openBtn = document.getElementById("openProblemSheet") || document.querySelector(".js-open-problem-sheet");
    var sheet = document.getElementById("problemSheet");
    var overlay = document.getElementById("problemSheetOverlay");
    var closeBtn = document.getElementById("problemSheetClose");

    if (!sheet || !overlay) return;

    var sheetBody = sheet.querySelector(".mz-sheet__body");
    var scrollPos = 0;

    function onWheel(e) {
      if (!sheet.classList.contains("opened")) return;
      
      // Always prevent background scroll when sheet is open
      e.preventDefault();
      
      // If cursor is over sheet or overlay, scroll the sheet body directly
      if (sheetBody) {
        sheetBody.scrollTop += e.deltaY;
      }
    }

    function onTouchMove(e) {
      if (!sheet.classList.contains("opened")) return;
      if (!sheet.contains(e.target)) {
        e.preventDefault();
      }
    }

    function open() {
      scrollPos = window.pageYOffset || document.documentElement.scrollTop || 0;

      document.documentElement.classList.add("mz-sheet-open");
      document.body.classList.add("mz-sheet-open");
      document.body.style.top = "-" + scrollPos + "px";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";

      sheet.classList.add("opened");
      overlay.classList.add("opened");
      sheet.setAttribute("aria-hidden", "false");
      
      window.addEventListener("wheel", onWheel, { passive: false });
      window.addEventListener("touchmove", onTouchMove, { passive: false });
      
      if (closeBtn) closeBtn.focus();
      mzPlay("press");
    }

    function close() {
      sheet.classList.remove("opened");
      overlay.classList.remove("opened");
      sheet.setAttribute("aria-hidden", "true");

      document.documentElement.classList.remove("mz-sheet-open");
      document.body.classList.remove("mz-sheet-open");
      document.body.style.top = "";
      document.body.style.position = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollPos);

      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchmove", onTouchMove);

      if (openBtn) openBtn.focus();
      mzPlay("press");
    }

    if (openBtn) {
      openBtn.addEventListener("click", function (e) {
        e.preventDefault();
        open();
      });
    }

    if (closeBtn) closeBtn.addEventListener("click", close);
    if (overlay) overlay.addEventListener("click", close);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && sheet.classList.contains("opened")) {
        close();
      }
    });
  }

  ready(function () {
    ensureSFXLoaded();
    initTheme();
    initMobileNav();
    setActiveNav();
    initCursor();
    initChat();
    initReveal();
    initSocialPopovers();
    initHoverSFX();
    initGlobalSFX();
    initTypingText();
    initProblemSheet();
  });
})();
