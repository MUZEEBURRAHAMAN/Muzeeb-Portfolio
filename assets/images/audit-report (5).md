# UX Audit Report

**Total:** 25 issues (21 design + 4 content)

## Fix These First (Top 5 by Priority)

1. **[MAJOR]** Below-fold image not lazy-loaded: td td · td
2. **[MINOR]** Inconsistent heights among 37 sibling elements (11–1076px)
3. **[MINOR]** Unoptimized large image (1210px wide): td td · td
4. **[BLOCKER]** Images must have alternate text
5. **[BLOCKER]** Elements overlap: span.titleline and span "()"

## Blocker (3)

### #1 — Images must have alternate text
- **Category:** a11y
- **Rule:** AXE-image-alt
- **Confidence:** 100%
- **Fix difficulty:** needs dev

**Why:** Ensures <img> elements have alternate text or a role of none or presentation

**Fix:** Fix: Images must have alternate text.

> 2 instance(s). First: the site logo image (y18.svg) has no alt text.

<details><summary>Prompt-ready fix</summary>

## Fix #1: Images must have alternate text [BLOCKER]


Fix: Images must have alternate text.

</details>

---

### #2 — Elements overlap: span.titleline and span "()"
- **Category:** spacing
- **Rule:** SPACE-OVERLAP-001
- **Confidence:** 100%
- **Fix difficulty:** needs design

**Why:** Overlapping non-modal elements obscure content and create confusion.

**Fix:** Adjust layout so elements don't overlap. Check z-index, position, and margins.

> Overlap area: 82x13px (99% of smaller element) between the title link and the domain-in-parens span.

<details><summary>Prompt-ready fix</summary>

## Fix #2: Elements overlap: span.titleline and span "()" [BLOCKER]


Adjust layout so elements don't overlap. Check z-index, position, and margins.

</details>

---

### #3 — Form elements must have labels
- **Category:** a11y
- **Rule:** AXE-label
- **Confidence:** 100%
- **Fix difficulty:** needs dev

**Why:** Ensures every form element has a label

**Fix:** Fix: Form elements must have labels.

> The bottom-of-page search input has no programmatically associated label.

<details><summary>Prompt-ready fix</summary>

## Fix #3: Form elements must have labels [BLOCKER]


Fix: Form elements must have labels.

</details>

---

## Major (12)

### #1 — Below-fold image not lazy-loaded: td td · td
- **Category:** performance
- **Rule:** PERF-LAZYLOAD-001
- **Confidence:** 100%
- **Fix difficulty:** needs design

**Why:** Images below the fold that load eagerly block initial render and waste bandwidth for content the user hasn't scrolled to yet.

**Fix:** Add loading="lazy" to all below-fold <img> elements to defer offscreen image loading.

> Image at y=1118px (below 900px fold) lacks loading="lazy".

<details><summary>Prompt-ready fix</summary>

## Fix #14: Below-fold image not lazy-loaded: td td · td [MAJOR]


Add loading="lazy" to all below-fold <img> elements to defer offscreen image loading.

</details>

---

### #2 — Text measure too wide: ~84 chars/line (max 80)
- **Category:** typography
- **Rule:** TYPO-MEASURE-WIDE-001
- **Confidence:** 100%
- **Fix difficulty:** needs design

**Why:** Lines wider than 80 characters force excessive eye movement when returning to the next line start, increasing reading fatigue and error rate.

**Fix:** Constrain text container to max-width of ~500px (75 chars) or use a multi-column layout.

> link is 558px wide at 13.3333px font size, yielding ~84 characters per line. Optimal: 45-75 chars.

<details><summary>Prompt-ready fix</summary>

## Fix #9: Text measure too wide: ~84 chars/line (max 80) [MAJOR]


Constrain text container to max-width of ~500px (75 chars) or use a multi-column layout.

</details>

---

### #3 — Font too small (9.33333px): span "by | |"
- **Category:** responsive
- **Rule:** RESP-FONTSCALE-001
- **Confidence:** 100%
- **Fix difficulty:** needs design

**Why:** Text below 11px is illegible on most screens and impossible to read on mobile devices.

**Fix:** Increase font size to at least 12px (ideally 14px+). Use rem units so text scales with user preferences.

> Metadata text ("47 points by ... | hide | 3 comments") renders at 9.33333px — below 11px minimum for readability.

<details><summary>Prompt-ready fix</summary>

## Fix #10: Font too small (9.33333px): span "by | |" [MAJOR]


Increase font size to at least 12px (ideally 14px+). Use rem units so text scales with user preferences.

</details>

---

### #4 — Font too small (10.6667px): span "gowers.wordpress.com"
- **Category:** responsive
- **Rule:** RESP-FONTSCALE-001
- **Confidence:** 100%
- **Fix difficulty:** needs design

**Why:** Text below 11px is illegible on most screens and impossible to read on mobile devices.

**Fix:** Increase font size to at least 12px (ideally 14px+).

> Domain text rendered at 10.6667px — below 11px minimum for readability.

<details><summary>Prompt-ready fix</summary>

## Fix #11: Font too small (10.6667px): span "gowers.wordpress.com" [MAJOR]


Increase font size to at least 12px (ideally 14px+).

</details>

---

### #5 — Element off-center by 28px within parent
- **Category:** spacing
- **Rule:** SPACE-CENTERALIGN-001
- **Confidence:** 100%
- **Fix difficulty:** needs design

**Why:** Nearly-centered elements that are slightly off look like alignment bugs and undermine perceived quality.

**Fix:** Use margin: 0 auto, flexbox justify-content: center, or grid place-items to center precisely.

> Search input center X=748, parent center X=720. Offset: 28px.

<details><summary>Prompt-ready fix</summary>

## Fix #15: Element off-center by 28px within parent [MAJOR]


Use margin: 0 auto, flexbox justify-content: center, or grid place-items to center precisely.

</details>

---

### #6 — Interactive elements only 5px apart — risk of mis-taps
- **Category:** spacing
- **Rule:** SPACE-BREATHING-001
- **Confidence:** 100%
- **Fix difficulty:** needs design

**Why:** Interactive elements too close together cause accidental taps, especially on touch devices.

**Fix:** Add at least 8px gap between interactive elements to prevent mis-taps.

> link "Hacker News" and link "new" are 5px apart. Minimum recommended: 8px.

<details><summary>Prompt-ready fix</summary>

## Fix #6: Interactive elements only 5px apart — risk of mis-taps [MAJOR]


Add at least 8px gap between interactive elements to prevent mis-taps.

</details>

---

### #7 — Touch targets too close (5px gap): "Hacker News" & "new"
- **Category:** responsive
- **Rule:** RESP-TOUCH-SPACING-001
- **Confidence:** 100%
- **Fix difficulty:** needs design

**Why:** Adjacent touch targets with insufficient spacing cause accidental taps on mobile devices.

**Fix:** Add at least 8px gap between interactive elements.

> Interactive elements are only 5px apart. Minimum recommended spacing for touch is 8px.

<details><summary>Prompt-ready fix</summary>

## Fix #7: Touch targets too close (5px gap): "Hacker News" & "new" [MAJOR]


Add at least 8px gap between interactive elements.

</details>

---

### #8 — Focus indicator suppressed on link "Hacker News"
- **Category:** a11y
- **Rule:** DET-FOCUS-VISIBLE-001
- **Confidence:** 100%
- **Fix difficulty:** needs dev

**Why:** Suppressing outline without a visual replacement violates WCAG 2.4.7 Focus Visible.

**Fix:** Add visible focus style: outline: 2px solid #4F46E5 or equivalent box-shadow.

> Link has outline:none with no box-shadow replacement. Keyboard users cannot see focus.

<details><summary>Prompt-ready fix</summary>

## Fix #8: Focus indicator suppressed on link "Hacker News" [MAJOR]


Add visible focus style: outline: 2px solid #4F46E5 or equivalent box-shadow.

</details>

---

### #9 — Icon-only link without accessible label
- **Category:** a11y
- **Rule:** DET-ICON-ONLY-001
- **Confidence:** 100%
- **Fix difficulty:** needs dev

**Why:** Icon-only buttons without text labels are invisible to screen readers.

**Fix:** Add aria-label describing the action.

> Link has no visible text and no aria-label. Screen readers announce nothing useful.

<details><summary>Prompt-ready fix</summary>

## Fix #12: Icon-only link without accessible label [MAJOR]


Add aria-label describing the action.

</details>

---

### #10 — 1 element(s) misaligned in row at Y~1118px
- **Category:** spacing
- **Rule:** SPACE-GRID-001
- **Confidence:** 100%
- **Fix difficulty:** needs design

**Why:** Elements in a visual row should be vertically aligned. Even 4-5px offsets look sloppy.

**Fix:** Use flexbox align-items: center or align to a shared baseline.

> Y positions: [1118, 1128]. Max deviation: 10px.

<details><summary>Prompt-ready fix</summary>

## Fix #13: 1 element(s) misaligned in row at Y~1118px [MAJOR]


Use flexbox align-items: center or align to a shared baseline.

</details>

---

### #11 — Touch target too small: upvote arrow is 14×10px (min 24px)
- **Category:** a11y
- **Rule:** DET-TARGET-001
- **Confidence:** 100%
- **Fix difficulty:** needs dev

**Why:** Very small touch targets cause mis-taps and accessibility issues for users with motor impairments.

**Fix:** Increase clickable area to at least 24×24px (desktop) or 44×44px (mobile) via padding.

> Upvote arrow link measures 14×10px. Interactive elements need adequate click area.

<details><summary>Prompt-ready fix</summary>

## Fix #4: Touch target too small: upvote arrow is 14×10px (min 24px) [MAJOR]


Increase clickable area to at least 24×24px (desktop) or 44×44px (mobile) via padding.

</details>

---

### #12 — Touch targets too close (0px gap): upvote arrow & headline link
- **Category:** responsive
- **Rule:** RESP-TOUCH-SPACING-001
- **Confidence:** 100%
- **Fix difficulty:** needs design

**Why:** Adjacent touch targets with insufficient spacing cause accidental taps on mobile devices.

**Fix:** Add at least 8px gap between interactive elements.

> Interactive elements are only 0px apart. Minimum recommended spacing for touch is 8px.

<details><summary>Prompt-ready fix</summary>

## Fix #5: Touch targets too close (0px gap): upvote arrow & headline link [MAJOR]


Add at least 8px gap between interactive elements.

</details>

---

## Minor (5)

### #1 — Inconsistent heights among 37 sibling elements (11–1076px)
- **Category:** spacing
- **Rule:** SPACE-PADDING-001
- **Confidence:** 100%
- **Fix difficulty:** needs design

**Why:** Same-type elements with different heights indicate inconsistent padding, breaking visual rhythm.

**Fix:** Standardize padding/height across sibling elements. Use shared CSS classes or design tokens.

> Selector group "td" has 37 elements with heights ranging 11–1076px (CV: 400%).

<details><summary>Prompt-ready fix</summary>

## Fix #16: Inconsistent heights among 37 sibling elements (11–1076px) [MINOR]


Standardize padding/height across sibling elements. Use shared CSS classes or design tokens.

</details>

---

### #2 — Unoptimized large image (1210px wide): td td · td
- **Category:** performance
- **Rule:** PERF-CWV-HINTS-001
- **Confidence:** 100%
- **Fix difficulty:** needs design

**Why:** Large images without responsive attributes or lazy loading waste bandwidth on smaller screens and delay page load.

**Fix:** Add loading="lazy", srcset with multiple resolutions, and a sizes attribute.

> Large image (1210px wide) lacks loading="lazy", srcset, and sizes attributes.

<details><summary>Prompt-ready fix</summary>

## Fix #18: Unoptimized large image (1210px wide): td td · td [MINOR]


Add loading="lazy", srcset with multiple resolutions, and a sizes attribute.

</details>

---

### #3 — Pagination without total count or result summary
- **Category:** navigation
- **Rule:** PAT-PAGE-001
- **Confidence:** 100%
- **Fix difficulty:** needs design

**Why:** Without knowing the total number of pages or results, users cannot estimate how much content exists or plan their navigation strategy.

**Fix:** Add a result summary near pagination (e.g., 'Showing 1-30 of N stories').

> "More" pagination link found but no "X of Y" or total count text detected nearby.

<details><summary>Prompt-ready fix</summary>

## Fix #22: Pagination without total count or result summary [MINOR]


Add a result summary near pagination (e.g., 'Showing 1-30 of N stories').

</details>

---

### #4 — Mixed labels for same action: "submit" vs "Apply to YC"
- **Category:** consistency
- **Rule:** CONS-LABEL-001
- **Confidence:** 100%
- **Fix difficulty:** needs design

**Why:** Using different labels for the same action creates cognitive overhead.

**Fix:** Pick one label and use it consistently where the action is genuinely the same.

> Buttons use different words for a similar action: "submit" and "Apply to YC".

<details><summary>Prompt-ready fix</summary>

## Fix #20: Mixed labels for same action: "submit" vs "Apply to YC" [MINOR]


Pick one label and use it consistently where the action is genuinely the same.

</details>

---

### #5 — Uneven horizontal gutters in row (17px, 3px, 11px, 11px)
- **Category:** spacing
- **Rule:** SPACE-GUTTER-001
- **Confidence:** 100%
- **Fix difficulty:** needs design

**Why:** Inconsistent horizontal gaps between aligned elements break visual balance and look unpolished.

**Fix:** Use consistent gap values (e.g., 8px, 16px, 24px) between row elements.

> 9 elements in row at Y~61px have gutters [17, 3, 11, 11]px (CV: 47%).

<details><summary>Prompt-ready fix</summary>

## Fix #17: Uneven horizontal gutters in row (17px, 3px, 11px, 11px) [MINOR]


Use consistent gap values (e.g., 8px, 16px, 24px) between row elements.

</details>

---

## Nit (1)

### #1 — Input zoom risk on iOS: search input uses 13.3333px font
- **Category:** responsive
- **Rule:** MOB-006
- **Confidence:** 100%
- **Fix difficulty:** needs design

**Why:** iOS auto-zooms the viewport when users tap inputs with font-size below 16px, disorienting the layout.

**Fix:** Set font-size to at least 16px on all form inputs to prevent iOS auto-zoom on focus.

> Font size 13.3333px < 16px on the search input.

<details><summary>Prompt-ready fix</summary>

## Fix #25: Input zoom risk on iOS: search input uses 13.3333px font [NIT]


Set font-size to at least 16px on all form inputs to prevent iOS auto-zoom on focus.

</details>

---

## Content Issues (4)

### #1 — Raw timestamp displayed in title attribute
- **Category:** copy
- **Rule:** DET-TIMESTAMP-001

**Why:** Users can't quickly parse ISO timestamps. Show relative ('2 hours ago') or localized time.

**Fix:** Format dates for humans in any visible/hover surface.

> span.age title attribute shows an unformatted ISO/epoch date.

<details><summary>Prompt-ready fix</summary>

## Fix #19: Raw timestamp displayed in title attribute [MINOR]


Format dates for humans in any visible/hover surface.

</details>

---

### #2 — Unexplained abbreviation: "LLM"
- **Category:** copy
- **Rule:** CONTENT-ABBREVIATION

**Why:** "LLM" may confuse users who don't know what it stands for.

**Fix:** This is user-submitted content, not product UI copy — no action needed on HN's side.

> Post title uses "LLM" with no expansion.

<details><summary>Prompt-ready fix</summary>

## Fix #24: Unexplained abbreviation: "LLM" [NIT]


This is user-submitted content, not product UI copy — no action needed on HN's side.

</details>

---

### #3 — Non-descriptive link text: "More"
- **Category:** copy
- **Rule:** DET-LINKTEXT-001
- **Suggested rewrite:** More stories

**Why:** Users scanning by links hear ambiguous destinations. Link text must describe destination.

**Fix:** Replace with descriptive text: "More stories" or "Next page".

> Pagination link says "More" — screen readers announce this without context.

<details><summary>Prompt-ready fix</summary>

## Fix #21: Non-descriptive link text: "More" [MINOR]


Replace with descriptive text: "More stories" or "Next page".

</details>

---

### #4 — Duplicate text: "upvote" appears on every row
- **Category:** copy
- **Rule:** CONTENT-DUPLICATE

**Why:** Same title-attribute text repeated on every row's upvote arrow adds no distinguishing information.

**Fix:** Low priority — this is a conventional, low-stakes pattern; consider only if doing a broader copy pass.

> "upvote" title attribute repeats identically on all 30 rows.

<details><summary>Prompt-ready fix</summary>

## Fix #23: Duplicate text: "upvote" appears on every row [NIT]


Low priority — this is a conventional, low-stakes pattern; consider only if doing a broader copy pass.

</details>

---
