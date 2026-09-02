/* HighlightText & Underline Highlighter Component (Motion Gradient Sweep + RoughNotation)
   - Box/Highlight actions: Gradient sweep rectangle (blue-100 to purple-100 on light theme, blue-500 to purple-500 on dark theme)
   - Underline action: Hand-drawn yellow/amber sketch stroke via RoughNotation
   - Auto-triggers when element enters viewport via IntersectionObserver
*/
(function () {
  "use strict";

  function initHighlighters() {
    // 1. Motion Gradient Sweep Rectangles (data-slot="highlight-text", data-action="box", data-action="highlight")
    var sweepElements = document.querySelectorAll(
      '[data-slot="highlight-text"], .highlight-text, .mz-highlight-sweep, .mz-highlight[data-action="box"], .mz-highlight[data-action="highlight"]'
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

    // 2. RoughNotation for Underlines and Sketch Annotations (data-action="underline", etc.)
    if (typeof window.RoughNotation !== "undefined") {
      var annotate = window.RoughNotation.annotate;
      var sketchElements = document.querySelectorAll(
        '.mz-highlight[data-action="underline"], .mz-highlight[data-action="circle"], .mz-highlight[data-action="strike-through"]'
      );

      if (sketchElements.length) {
        var annotations = [];

        sketchElements.forEach(function (el) {
          if (el._mzAnnotated) return;
          el._mzAnnotated = true;

          var action = el.getAttribute("data-action") || "underline";
          var isDark = document.documentElement.getAttribute("data-theme") === "dark";
          var rawColor = el.getAttribute("data-color");
          var color = rawColor || (isDark ? "#f5b84f" : "#FF9800");

          var strokeWidth = parseFloat(el.getAttribute("data-stroke-width")) || 2.2;
          var animationDuration = parseInt(el.getAttribute("data-duration"), 10) || 700;

          var annotation = annotate(el, {
            type: action,
            color: color,
            strokeWidth: strokeWidth,
            animationDuration: animationDuration,
            iterations: 1,
            multiline: true,
            padding: 2
          });

          annotations.push({ el: el, annotation: annotation, rawColor: rawColor, shown: false });
        });

        if ("IntersectionObserver" in window) {
          var sketchObserver = new IntersectionObserver(
            function (entries) {
              entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                  var match = annotations.find(function (a) { return a.el === entry.target; });
                  if (match && !match.shown) {
                    match.shown = true;
                    setTimeout(function () {
                      match.annotation.show();
                    }, 120);
                    sketchObserver.unobserve(entry.target);
                  }
                }
              });
            },
            { threshold: 0.15, rootMargin: "0px 0px -30px 0px" }
          );

          annotations.forEach(function (a) {
            if (!a.shown) sketchObserver.observe(a.el);
          });
        } else {
          annotations.forEach(function (a) {
            a.annotation.show();
          });
        }

        // Theme switch support for sketch annotations
        var themeObserver = new MutationObserver(function (mutations) {
          mutations.forEach(function (m) {
            if (m.attributeName === "data-theme") {
              var isDarkNow = document.documentElement.getAttribute("data-theme") === "dark";
              annotations.forEach(function (a) {
                if (!a.rawColor) {
                  a.annotation.color = isDarkNow ? "#f5b84f" : "#FF9800";
                }
              });
            }
          });
        });
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHighlighters);
  } else {
    initHighlighters();
  }

  window.initHighlighters = initHighlighters;
})();
