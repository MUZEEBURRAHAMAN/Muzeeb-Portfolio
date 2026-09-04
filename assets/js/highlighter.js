/* HighlightText & Underline Highlighter Component (Motion Gradient Sweep)
   - Box/Rectangle actions: Gradient sweep rectangle (dark slate on light theme, bone/white on dark theme)
   - Yellow actions: Authentic legal yellow marker sweep (sunny yellow on light, amber gold on dark)
   - Auto-triggers when element enters viewport via IntersectionObserver
   - Strictly 0px border-radius with rock-solid inline positioning (never drifts onto images)
*/
(function () {
  "use strict";

  function initHighlighters() {
    var sweepElements = document.querySelectorAll(
      '[data-slot="highlight-text"], .highlight-text, .mz-highlight-sweep, .mz-highlight[data-action="box"], .mz-highlight--box, .mz-highlight-rect, .mz-highlight-yellow, .mz-highlight--yellow, .mz-highlight[data-action="yellow"], .mz-highlight[data-action="highlight"]'
    );

    if (sweepElements.length) {
      if ("IntersectionObserver" in window) {
        var sweepObserver = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                entry.target.classList.add("is-in-view");
                entry.target.style.backgroundSize = "100% 100%";
                sweepObserver.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.15, rootMargin: "0px 0px -20px 0px" }
        );

        sweepElements.forEach(function (el) {
          sweepObserver.observe(el);
        });
      } else {
        sweepElements.forEach(function (el) {
          el.classList.add("is-in-view");
          el.style.backgroundSize = "100% 100%";
        });
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHighlighters);
  } else {
    initHighlighters();
  }

  // Re-run if dynamically loaded or route changes
  window.initHighlighters = initHighlighters;
})();
