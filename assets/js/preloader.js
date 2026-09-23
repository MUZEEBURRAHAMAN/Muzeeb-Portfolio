(() => {
  const GREETINGS = [
    { text: "hello",     lang: "en" },
    { text: "olá",       lang: "pt" },
    { text: "hola",      lang: "es" },
    { text: "bonjour",   lang: "fr" },
    { text: "ciao",      lang: "it" },
    { text: "привет",    lang: "ru" },
    { text: "नमस्ते",     lang: "hi" },
    { text: "مرحبا",     lang: "ar" },
    { text: "سلام",      lang: "ur" },
    { text: "こんにちは",  lang: "ja" },
    { text: "안녕하세요",  lang: "ko" },
  ];

  const HOLD = 330;             // ms each greeting stays (incl. fade in)
  const FADE = 130;             // must match CSS transition
  const TOTAL = GREETINGS.length * HOLD;

  const pre = document.getElementById("preloader");
  if (!pre) return;
  const word = document.getElementById("word");
  const counter = document.getElementById("counter");
  if (!word || !counter) return;

  // Session & Reload Detection
  let isReload = false;
  try {
    const navEntries = window.performance && performance.getEntriesByType && performance.getEntriesByType("navigation");
    if (navEntries && navEntries.length > 0) {
      isReload = navEntries[0].type === "reload";
    } else if (window.performance && window.performance.navigation) {
      isReload = window.performance.navigation.type === 1;
    }
  } catch (e) {}

  const hasSeen = sessionStorage.getItem("mz_greeting_seen");

  // If already seen in this session and NOT a hard refresh/reload, skip immediately
  if (hasSeen && !isReload) {
    document.documentElement.classList.add("skip-preloader");
    document.body.classList.remove("preloader-active");
    document.body.classList.add("loaded");
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    if (window.lenis) {
      try { window.lenis.start(); } catch (e) {}
    }
    pre.remove();
    return;
  }

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const easeOut = t => 1 - Math.pow(1 - t, 2);

  // Lock scroll immediately for first-time / reload
  document.documentElement.style.overflow = "hidden";
  document.body.classList.add("preloader-active");
  if (window.lenis) {
    try { window.lenis.stop(); } catch (e) {}
  }

  // Counter 0 -> 100 across the whole greeting sequence
  function runCounter() {
    const start = performance.now();
    (function tick(now) {
      const t = Math.min((now - start) / TOTAL, 1);
      counter.textContent = Math.round(easeOut(t) * 100);
      if (t < 1) requestAnimationFrame(tick);
    })(start);
  }

  async function show(g) {
    word.className = "word";
    word.textContent = g.text;
    word.lang = g.lang;
    void word.offsetWidth;          // restart transition
    word.classList.add("in");
    await sleep(HOLD - FADE);
  }

  async function run() {
    try {
      if (document.fonts && document.fonts.ready) {
        await Promise.race([
          document.fonts.ready,
          sleep(1200)
        ]);
      }
    } catch (e) {}

    runCounter();
    for (let i = 0; i < GREETINGS.length; i++) {
      await show(GREETINGS[i]);
      if (i < GREETINGS.length - 1) {
        word.classList.replace("in", "out");
        await sleep(FADE);
      }
    }
    counter.textContent = "100";
    await sleep(250);
    // last word scales up, then the curtain lifts
    counter.classList.add("hide");
    word.classList.remove("in");
    word.classList.add("zoom");
    await sleep(550);
    pre.classList.add("exit");
    document.body.classList.remove("preloader-active");
    document.body.classList.add("loaded");
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    if (window.lenis) {
      try { window.lenis.start(); } catch (e) {}
    }
    // Record that visitor has seen preloader in this session
    try {
      sessionStorage.setItem("mz_greeting_seen", "true");
    } catch (e) {}

    await sleep(950);
    pre.remove();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
