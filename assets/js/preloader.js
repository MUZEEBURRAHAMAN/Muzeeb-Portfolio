(() => {
  // Preloader v2 — selection frame + real-progress counter, once per session
  // (and on hard reload). Markup lives inline at the top of <body> on Home.
  const MIN_DURATION = 1900;   // ms — never flash; lets the frame finish drawing
  const MAX_DURATION = 6000;   // ms — never hold the visitor hostage on slow nets
  const STATUS = [
    [0,   "Setting up the canvas"],
    [30,  "Loading case studies"],
    [60,  "Tuning type & spacing"],
    [88,  "Final polish"],
    [100, "Ready"],
  ];

  const pre = document.getElementById("preloader");
  if (!pre) return;
  const counter = pre.querySelector("[data-pl-counter]");
  const status = pre.querySelector("[data-pl-status]");
  const size = pre.querySelector("[data-pl-size]");
  const stage = pre.querySelector(".pl-stage");

  let isReload = false;
  try {
    const nav = performance.getEntriesByType && performance.getEntriesByType("navigation");
    if (nav && nav.length) isReload = nav[0].type === "reload";
    else if (performance.navigation) isReload = performance.navigation.type === 1;
  } catch (e) {}

  let seen = false;
  try { seen = !!sessionStorage.getItem("mz_greeting_seen"); } catch (e) {}

  const release = () => {
    document.body.classList.remove("preloader-active");
    document.body.classList.add("loaded");
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    if (window.lenis) { try { window.lenis.start(); } catch (e) {} }
  };

  if (seen && !isReload) {
    document.documentElement.classList.add("skip-preloader");
    release();
    pre.remove();
    return;
  }

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const easeOut = t => 1 - Math.pow(1 - t, 3);

  document.documentElement.style.overflow = "hidden";
  document.body.classList.add("preloader-active");
  if (window.lenis) { try { window.lenis.stop(); } catch (e) {} }

  // ---- real progress: eager images + fonts + window load ----
  let real = 0;
  let pageLoaded = document.readyState === "complete";
  function measure() {
    const imgs = Array.from(document.images).filter(i => i.loading !== "lazy");
    const total = imgs.length + 1;
    let done = imgs.filter(i => i.complete).length;
    if (!document.fonts || document.fonts.status === "loaded") done += 1;
    real = pageLoaded ? 1 : Math.min(0.95, done / total);
  }
  window.addEventListener("load", () => { pageLoaded = true; }, { once: true });

  function setStatus(pct) {
    let label = STATUS[0][1];
    for (const [at, text] of STATUS) if (pct >= at) label = text;
    if (status.textContent !== label) status.textContent = label;
  }

  function setSize() {
    if (!size || !stage) return;
    const r = stage.getBoundingClientRect();
    size.textContent = `${Math.round(r.width)} × ${Math.round(r.height)}`;
  }

  async function run() {
    pre.classList.add("is-run");
    setSize();
    window.addEventListener("resize", setSize);

    const start = performance.now();
    let shown = 0;

    await new Promise(resolve => {
      (function tick(now) {
        const elapsed = now - start;
        measure();
        // Time gate: the counter can't outrun MIN_DURATION; real progress can't
        // be faked past what has actually loaded (unless MAX_DURATION hits).
        const timeCap = easeOut(Math.min(elapsed / MIN_DURATION, 1));
        const target = elapsed >= MAX_DURATION ? 1 : Math.min(timeCap, real);
        shown += (target - shown) * 0.12;
        if (target === 1 && 1 - shown < 0.004) shown = 1;

        const pct = Math.round(shown * 100);
        counter.firstChild.nodeValue = String(pct).padStart(3, "0");
        pre.style.setProperty("--pl-p", shown.toFixed(4));
        setStatus(pct);

        if (shown >= 1) resolve();
        else requestAnimationFrame(tick);
      })(start);
    });

    window.removeEventListener("resize", setSize);
    pre.classList.add("is-done");
    await sleep(320);

    pre.classList.add("is-exit");
    await sleep(520);
    pre.classList.add("is-wipe");
    release();
    try { sessionStorage.setItem("mz_greeting_seen", "true"); } catch (e) {}

    await sleep(950);
    pre.remove();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run);
  else run();
})();
