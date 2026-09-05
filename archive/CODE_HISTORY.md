# Portfolio Code History & Archived Components

This file provides a complete, permanent historical record of all code snippets, case study cards, animation scripts, audio effects, and UI components that were paused or commented out during the Matt Sellers craft and performance optimization passes.

If you ever want to re-enable or reference any of these in the future, simply copy the code snippets below directly back into your HTML/JS files.

---

## Table of Contents
1. [Archived Case Study Cards](#1-archived-case-study-cards)
   - [MedChron: Complex Medical Records](#medchron)
   - [Omnis AI: Scaling Design System](#omnis-ai-design-system)
   - [Edge-State Fixer: AI State Generator](#edge-state-fixer)
   - [FontLens: Typography Inspector](#fontlens)
   - [Zebralearn: Learning Platform Redesign](#zebralearn)
2. [About Page: Original 4-Step Pipeline](#2-about-page-original-4-step-pipeline)
3. [Legacy JavaScript Libraries & Configs](#3-legacy-javascript-libraries--configs)
   - [Typed.js Rotating Hero Text](#typedjs-rotating-hero-text)
   - [Slick Slider Testimonial Carousel](#slick-slider-testimonial-carousel)
   - [GSAP ScrambleText Animation](#gsap-scrambletext-animation)
   - [jQuery Scroll-to-Top Indicator](#jquery-scroll-to-top-indicator)
   - [Sound Effects (SFX)](#sound-effects-sfx)
4. [Hatched Section Dividers CSS Guide](#4-hatched-section-dividers-css-guide)

---

## 1. Archived Case Study Cards

These cards were previously displayed under `#work` on `index.html`. They are currently safely commented out in `index.html`.

### MedChron
```html
<article class="mz-work-card">
    <div class="mz-work-card__inner">
        <div class="mz-work-card__img-container">
            <img loading="lazy" src="assets/images/medchron-cover.webp" alt="MedChron: Turning Complex Medical Records into Structured Legal Timelines">
            <span class="mz-work-card__badge mz-work-card__badge--cover">Coming soon</span>
        </div>
        <div class="mz-work-card__text">
            <div class="mz-work-card__content">
                <h3 class="mz-work-card__title">MedChron: Turning Complex Medical Records into Structured Legal Timelines</h3>
                <p class="mz-work-card__desc">Designing a legal workflow that helps lawyers review, verify, and extract chronological facts from thousands of medical record pages.</p>
            </div>
        </div>
    </div>
</article>
```

### Omnis AI Design System
```html
<article class="mz-work-card">
    <div class="mz-work-card__inner">
        <div class="mz-work-card__img-container">
            <img loading="lazy" src="assets/images/best-work/bw_image 38(component design).webp" alt="Omnis AI: Scaling Design Across 8+ Products">
            <span class="mz-work-card__badge mz-work-card__badge--cover">Coming soon</span>
        </div>
        <div class="mz-work-card__text">
            <div class="mz-work-card__content">
                <h3 class="mz-work-card__title">Omnis AI: Scaling Design Across 8+ Products</h3>
                <p class="mz-work-card__desc">Building a unified design system that gave a growing suite of AI-powered legal products a shared foundation for consistency, scalability, and faster delivery.</p>
            </div>
        </div>
    </div>
</article>
```

### Edge-State Fixer
```html
<article class="mz-work-card">
    <a href="edge-state-fixer-case-study.html" class="mz-work-card__link" aria-label="Edge-State Fixer: AI State Generator">
        <div class="mz-work-card__img-container">
            <img loading="lazy" src="assets/images/best-work/bw_image 38(component design).webp" alt="Edge-State Fixer: AI State Generator">
        </div>
        <div class="mz-work-card__text">
            <h3 class="mz-work-card__title">Edge-State Fixer: AI State Generator</h3>
            <p class="mz-work-card__desc">AI developer tool that inspects React components, flags missing edge states, and writes production-ready empty, error, and loading states.</p>
        </div>
    </a>
</article>
```

### FontLens
```html
<article class="mz-work-card">
    <a href="fontlens-case-study.html" class="mz-work-card__link" aria-label="FontLens: Typography Inspector Extension">
        <div class="mz-work-card__img-container">
            <img loading="lazy" src="assets/images/best-work/bw_image 11 (affil.ai).webp" alt="FontLens: Typography Inspector Extension">
        </div>
        <div class="mz-work-card__text">
            <h3 class="mz-work-card__title">FontLens: Typography Inspector Extension</h3>
            <p class="mz-work-card__desc">Chrome extension that inspects, extracts, and organizes live typography, font weights, and type scales in one click.</p>
        </div>
    </a>
</article>
```

### Zebralearn
```html
<article class="mz-work-card">
    <a href="zebralearn-case-study.html" class="mz-work-card__link" aria-label="Zebralearn: Learning Platform Redesign">
        <div class="mz-work-card__img-container">
            <img loading="lazy" src="assets/images/case-studies/zebralearn-case study-img1.png" alt="Zebralearn: Learning Platform Redesign">
        </div>
        <div class="mz-work-card__text">
            <h3 class="mz-work-card__title">Zebralearn: Learning Platform Redesign</h3>
            <p class="mz-work-card__desc">Comprehensive web and mobile product redesign simplifying complex finance and business learning for 100k+ active learners.</p>
        </div>
    </a>
</article>
```

---

## 2. About Page: Original 4-Step Pipeline

Previously in `about.html` under "My Approach" before being upgraded to "How I Think & Build":

```html
<div class="mz-approach-pipeline">
    <div class="mz-approach-step">
        <span class="mz-approach-step__num">01 / DISCOVER</span>
        <span class="mz-approach-step__title">Understand the problem</span>
        <span class="mz-approach-step__desc">Business needs, friction points &amp; constraints</span>
    </div>
    <div class="mz-approach-step">
        <span class="mz-approach-step__num">02 / CRAFT</span>
        <span class="mz-approach-step__title">Design the system</span>
        <span class="mz-approach-step__desc">Figma components, design tokens &amp; patterns</span>
    </div>
    <div class="mz-approach-step">
        <span class="mz-approach-step__num">03 / PROTOTYPE</span>
        <span class="mz-approach-step__title">Build realistic UX</span>
        <span class="mz-approach-step__desc">High-fidelity interactive states &amp; flows</span>
    </div>
    <div class="mz-approach-step">
        <span class="mz-approach-step__num">04 / EXECUTE</span>
        <span class="mz-approach-step__title">Ship the product</span>
        <span class="mz-approach-step__desc">Production-grade code close to metal</span>
    </div>
</div>
```

---

## 3. Legacy JavaScript Libraries & Configs

### Typed.js Rotating Hero Text
Requires: `assets/js/jquery-3.7.1.min.js` and `assets/js/typed.min.js`
```javascript
$("#typed").typed({
    strings: ["Figma", "Cursor", "Claude", "Framer", "Illustrator"],
    typeSpeed: 100,
    startDelay: 0,
    backSpeed: 60,
    backDelay: 100,
    loop: true,
    cursorChar: "|",
    contentType: 'html'
});
```

### Slick Slider Testimonial Carousel
Requires: `assets/css/slick.css`, `assets/css/slick-theme.css`, `assets/js/jquery-3.7.1.min.js`, `assets/js/slick.min.js`
```javascript
var windowWidth = $(window).width();
if (windowWidth < 1024) {
    $('.rating-slider').slick({
        slidesToShow: 2,
        arrows: false,
        infinite: true,
        speed: 8000,
        autoplay: true,
        autoplaySpeed: 0,
        cssEase: 'linear',
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 1.5,
                }
            },
            {
                breakpoint: 550,
                settings: {
                    slidesToShow: 1,
                }
            }
        ]
    });
} else {
    $('.rating-slider').slick({
        centerMode: true,
        slidesToShow: 1,
        vertical: true,
        verticalSwiping: true,
        arrows: false,
        infinite: true,
        speed: 8000,
        autoplay: true,
        autoplaySpeed: 0,
        cssEase: 'linear',
    });
}
```

### GSAP ScrambleText Animation
Requires: `assets/js/gsap-latest-beta.min.js` and `assets/js/ScrambleText.js`
```javascript
var tl = gsap.timeline({ defaults: { duration: 2, ease: "none" } });
tl.to("#text1", { scrambleText: { text: "Hello! I'm Muzeeb, a UI/UX", chars: "lowerCase", speed: 0.1, ease: Linear.easeNone } })
  .to("#text2", { scrambleText: { text: "Designer & No Code Developer,", chars: "lowerCase", speed: 0.1, ease: Linear.easeNone } })
  .to("#text3", { scrambleText: { text: "Crafting Digital", chars: "lowerCase", speed: 0.1, ease: Linear.easeNone } })
  .to("#text4", { scrambleText: { text: "Experiences Simple &", chars: "lowerCase", speed: 0.1, ease: Linear.easeNone } })
  .to("#text5", { scrambleText: { text: "Easy to Use.", chars: "lowerCase", speed: 0.1, ease: Linear.easeNone } });
```

### jQuery Scroll-to-Top Indicator
Requires: `assets/js/jquery-3.7.1.min.js`
```javascript
$(window).on('scroll', function () {
    const bHeight = $('body').height();
    const scrolled = $(window).innerHeight() + $(window).scrollTop();
    let percentage = ((scrolled / bHeight) * 100);
    if (percentage > 100) percentage = 100;
    $('.scroll-top:not(.slider-scroll-top) .scroll-track').css('width', percentage + '%');
    if ($(window).scrollTop() > 250) {
        $('.scroll-top').addClass('opacity-100 visible').removeClass('opacity-0 invisible');
    } else {
        $('.scroll-top').addClass('opacity-0 invisible').removeClass('opacity-100 visible');
    }
});
$('.scroll-top').on("click", function () {
    $('html, body').animate({ scrollTop: 0 }, 800);
    return false;
});
```

### Sound Effects (SFX)
Original script tags:
```html
<script src="assets/js/nachi-sfx.js"></script>
<script src="assets/js/sfx.js"></script>
```

---

## 4. Hatched Section Dividers CSS Guide

The diagonal textured divider between sections is implemented as follows:

```html
<div class="hatched-divider" aria-hidden="true">
    <div class="hatched-divider__pattern"></div>
</div>
```

CSS rule (in `assets/css/style.css`):
```css
.hatched-divider {
    display: block !important;
    width: calc(100% + 32px) !important;
    margin: 3.5rem -16px !important;
    height: 32px !important;
    position: relative !important;
    overflow: hidden !important;
    border-top: 1px solid rgba(255, 255, 255, 0.18) !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.18) !important;
}

.hatched-divider__pattern {
    width: 100% !important;
    height: 100% !important;
    opacity: 0.45 !important;
    background-image: repeating-linear-gradient(
        -45deg,
        rgba(255, 255, 255, 0.95),
        rgba(255, 255, 255, 0.95) 1px,
        transparent 1px,
        transparent 6px
    ) !important;
    background-size: 8.49px 8.49px !important;
}

[data-theme="light"] .hatched-divider {
    border-top-color: rgba(0, 0, 0, 0.18) !important;
    border-bottom-color: rgba(0, 0, 0, 0.18) !important;
}

[data-theme="light"] .hatched-divider__pattern {
    opacity: 0.4 !important;
    background-image: repeating-linear-gradient(
        -45deg,
        rgba(0, 0, 0, 0.85),
        rgba(0, 0, 0, 0.85) 1px,
        transparent 1px,
        transparent 6px
    ) !important;
}
```
