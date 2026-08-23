---
name: ux-audit
description: Run a complete UX audit of a SCREENSHOT IMAGE or URL using the ux-audit MCP server (capture_url, prepare_image, get_skill_pack, run_deterministic, validate_findings, save_audit, annotate_image, build_viewer) — produces an annotated PNG with numbered severity boxes plus an interactive viewer.html (with a built-in "download as markdown" report). Runs entirely on your own Claude subscription: you are the vision model, there is no external API key. ALWAYS use this (not frontend-design-audit, design-critique-evaluation, accessibility-audit, or visual-critique) when the user says "audit this screenshot", "audit this URL/site/page", "ux audit", or gives an image/URL to audit and the ux-audit MCP tools are available. Those other skills review code or give text-only critique; only this one renders annotated artifacts. Follow the protocol exactly — never improvise the loop.
---

# UX Audit Orchestrator

You are the orchestrator **and** the vision model. This session — your Claude subscription, whatever it's running in (Claude Code, Cowork, Desktop) — reads every screenshot itself and writes the findings. The `ux-audit-mcp` server is "the hands": it captures pages, assembles the analysis prompt for each skill pack, runs deterministic (zero-AI) checks, validates and grounds findings, then renders and stores the result. **It makes no AI calls of its own.** Nothing in this protocol talks to OpenRouter, Gemini, or any other external model — that keeps the whole audit inside the user's existing Claude subscription, with no separate API key to configure, exactly like any other Claude skill.

The `analyze_image` tool exists on the server for a different, non-interactive use case (a headless CLI script driving a fresh `claude -p` process per skill pack). **Do not call it here.** In this protocol you read the pack prompt from `get_skill_pack` and analyze the screenshot yourself.

## Protocol

### Step 0 — Get the image

- Image attached/path given → note the path. Call `prepare_image` to get exact `width`/`height`, `image_path`, and `grid_image_path`.
- URL given → call `capture_url` (+ `viewport: "mobile"` if asked). Use the returned `image_path`, `grid_image_path`, `width`, `height`, and — when present — `elements_path`, `dom_text_path`, `axe_path`, `regions_path`. These come from real DOM measurement and give the strongest possible grounding later, so always capture via `capture_url` rather than asking the user to screenshot a URL themselves.
- If the user attached an image in chat, save it to a file first (or ask for the path).

Always work from `grid_image_path` when reading the screenshot for analysis — the magenta gridlines every 100 units are what let you report accurate `bbox` values in normalized 0-1000 space, immune to any downscaling between what you see and the true pixel dimensions.

### Step 0.5 — Interview before auditing (required)

**Do not skip this, even for a single screenshot with an explicit "audit this" request. Ask before you look for issues, wait for the answer, then proceed.** A screenshot shows what's on screen, not what the user was trying to do, where they came from, or what a click leads to — and those are exactly the things that separate a sharp finding from a generic one.

Ask in one message, tailored to the input:

**Single screen, three questions:**
1. **User goal.** What is the user trying to accomplish on this screen?
2. **Context.** Where do they arrive from, and what's the intended next step?
3. **Anything not visible.** What wouldn't be obvious from the image alone — what a button click navigates to, hover-only controls, scroll behavior, default selections, popover destinations, animation states?

**Multi-screen / flow, three questions:**
1. **User goal.** "A user should be able to [do X] in [N] steps and feel [Y] when done."
2. **User tasks.** A numbered list of what each screen (or screen range) was for.
3. **Exception notes.** Anything on a specific screen that isn't obvious from the image alone — routing, scroll cues, hover-only controls, defaults, animation states. Let the user volunteer only what matters; don't ask them to narrate every screen.

Fold the answers into the audit: pass the user goal and relevant context as `product_context` to `save_audit` and as `flow_context` to `validate_findings` (this also feeds priority scoring); use the exception notes to justify findings a screenshot alone wouldn't support — cite them in `evidence` so the finding doesn't read as fabricated to someone re-reading the report later.

**Skip the interview only if** the user already supplied written intent (an `intent.md`, a PRD, a ticket) — read that instead, spot-check anything ambiguous, and proceed. If the request itself is ambiguous with nothing else given (just "audit this flow," no target), ask what to audit before anything else.

### Step 1 — Run the skill packs yourself

Phase-1 groups (default set for a single screen or page): `hierarchy`, `copy`, `forms`, `navigation`, `feedback`, `layout`, `a11y-visual`. The registry has more groups beyond these seven (`list_skills` shows all of them) for deeper or flow-specific audits — pull in extras only when the user asks for a deeper pass, or when `flow_context` is available (adds `flow-patterns`, `consistency`, `persuasion`) for a multi-screen journey.

For each group:

1. Call `get_skill_pack` with that group name — it returns the assembled prompt (methodology + the group's skill docs + its rules + the required output JSON schema).
2. Apply that prompt to the gridded screenshot **yourself**, the way the prompt asks: look at the image, run the pack's checks, and produce a JSON findings array matching its output spec exactly (`bbox` in normalized 0-1000 units read off the gridlines, `anchor_text` = exact visible text for later snapping, `fp_check`, `confidence`, etc.). No tool call does this step for you — it's you looking and reasoning, same as any other multimodal read.

**Parallel mode (preferred, when the Agent/Task tool is available):** spawn one subagent per group, in parallel, in a single message. Give each subagent only that group's `get_skill_pack` prompt and the image path — a fresh, isolated context per pack, same as the headless `run-audit.sh` path. Collect each subagent's JSON findings array when it returns.

**Sequential fallback:** if subagents aren't available (plain chat with no Agent tool), work through the seven packs yourself, one at a time. You only need to actually look at the image once — keep it in view and re-apply each pack's checklist against what you already saw, rather than re-reading it from disk seven times.

Also run, in parallel with the above:

- `run_deterministic` (with `elements_path`, `meta_path`, `axe_path` when a URL capture provided them) — free, instant, code-based checks (contrast, touch targets, console errors, axe violations). Zero hallucination risk; always include these.
- `content_lint` (with `elements_path`, when available) — free retext-based copy checks (passive voice, readability, repeated words).

Merge every group's findings plus the deterministic and content-lint findings into one flat array.

### Step 2 — Validate (local grounding only)

Call `validate_findings` with:
- `findings`: the full merged array
- `image_width` / `image_height`: the TRUE pixel dimensions from Step 0
- `coordinate_space`: `"normalized_1000"`
- `image_path`: the ORIGINAL (non-gridded) image path — enables local OCR text-region snapping via `anchor_text`
- `elements_path` / `regions_path`: pass these when Step 0 was a `capture_url` — pixel-perfect DOM-measured bbox is the strongest grounding available
- `use_gemini: false` — **always set this explicitly.** This skill never grounds findings through an external model, regardless of whether an OpenRouter/Google AI key happens to be set in the environment it's running in. Grounding runs on the DOM element inventory (best) and local OCR (offline, no key) only.

Then:
- `rejected` non-empty → review reasons. Fixable (missing field) → fix and re-validate. Gate failures → drop. Max 2 rounds.
- Check the `snap` stats — `inventory`/`dom` and `ocr` counts show how many boxes were grounded precisely; `gemini` should always read 0 (confirms no external call happened).
- Only the final `accepted` array moves forward.

### Step 3 — Persist

Call `save_audit` with the image, ACCEPTED findings, `skill_groups_used`, and `validation_bounce_count`.

### Step 4 — Render

1. `annotate_image` with the `audit_id` → annotated.png
2. `build_viewer` with the `audit_id` → viewer.html (self-contained: overlay boxes, comment sidebar, filters, keyboard nav, and a "copy/download as markdown" button — this is the markdown report; nothing extra to generate)

### Step 5 — Report to the user

- The "one big thing": the most severe, highest-confidence issue, one sentence.
- Counts by severity + praise count.
- Snap stats (inventory/DOM vs OCR — no external calls were made).
- Paths: annotated.png and viewer.html, with the `open` command. Mention that viewer.html has a download-as-markdown button if the user wants a plain report file.
- Offer `explain_finding` for any number.
- One line: tick findings in the viewer and hit "Shortlist" to send them to an issue tracker.

### Step 6 — Capture corrections (self-improvement)

If, after seeing the results, the user corrects anything — a wrong/false-positive finding ("that's intentional, don't flag it again"), a missed issue ("you should always catch X"), a standing do/don't ("never report more than one nit"), or a terminology fix ("we call it Y not Z") — do NOT just acknowledge it in chat. Follow `_self-improve/SKILL.md` to capture it into the engine's stores (rule yml, known-issues.md, glossary.yml, standing-guidance.md) so the same mistake never repeats. Chat is forgotten; the stores are read on every future run.

## Sending shortlisted findings to an issue tracker

`viewer.html` has a checkbox on every issue card (not praise) and a "Shortlist" button in the header. The user ticks the findings they want to act on, clicks it, and a JSON payload gets copied to their clipboard — they paste it back into the conversation. When that payload arrives, turn it into issues.

This works with any issue tracker the user has connected (Linear, Jira, GitHub Issues, Asana, and so on). If nothing is connected, offer to write the issues to a markdown file instead, so they can be pasted in manually.

The payload shape:

```json
{
  "kind": "ux-audit/shortlist",
  "audit_id": "2026-08-12T13-51-36_7c6e",
  "selected_finding_ids": [1, 3, 7]
}
```

### Handoff flow

1. **Load the findings.** Call `get_findings` with the `audit_id` and pull the full finding objects whose `number` matches each id in `selected_finding_ids`. If a number is missing, report it and stop — do not invent content.
2. **Confirm settings in one message before creating anything**, and remember the answers for the rest of the session so you only ask once:
   - Which project, team, or board the issues belong to.
   - Assignee — default to the user themselves.
   - Labels or tags to apply.
   - Whether to embed a screenshot inline. Default yes — use the audit's `annotated.png`, or crop a tighter view around the finding's `bbox` with `crop_image` if the tracker supports attachments and a focused image reads better than the full page.
   - Priority mapping from severity. Default: `blocker` → urgent/highest, `major` → high, `minor` → medium, `nit` → low/none — adjust to whatever priority levels the connected tracker actually uses.
   - Show the count of issues about to be created and the first two or three titles as a sanity check.
3. **Upload the screenshot once, reuse it** across issues that share it (most will, since they're all findings on the same audit).
4. **Create one issue per shortlisted finding.** Title: use the finding's `title` as-is — the methodology already requires it to stand alone without the audit for context. Description:

   ```markdown
   ![](...uploaded screenshot...)

   ## Problem

   <evidence>

   ## Why it matters

   <why>

   <!-- if how_it_happens is set -->
   **How it likely happens:** <how_it_happens>

   ## Recommendation

   <recommendation>

   <!-- if suggested_rewrite is set (copy findings) -->
   **Suggested rewrite:** <suggested_rewrite>

   ## Context

   - **Category:** <category> · **Severity:** <severity> · **Confidence:** <confidence as %>
   - **Rule:** <rule> <!-- plus Standard: <standard> and Principle: <principle> when set -->
   - **Who's affected:** <who_affected>
   - **Source:** UX audit `<audit_id>`, finding #<number>
   ```

   Use real newlines; skip a subsection whose field is empty. The audit id and finding number stay in the Source line as a back-reference, not as the headline.
5. **Report back** with a small table of finding number → issue URL. Note any failures; don't let one error silently drop the rest.

### Things to never do

- Don't create issues silently — always confirm scope (count, project, assignee, image embed, labels, priority mapping) in one message before the batch.
- Don't loop past a failed creation — stop and report which one broke.
- Don't rewrite `evidence`, `why`, or `recommendation` — those are the audit's voice, not yours to paraphrase.
- Don't invent a `project`/`assignee`/`labels` value the user didn't give you.

## Completion checklist

- [ ] Interview asked and answered (or written intent supplied) before Step 1 started
- [ ] All 7 phase-1 groups analyzed by you (this session), via `get_skill_pack` — never via `analyze_image`
- [ ] `run_deterministic` (and `content_lint` when applicable) ran and were merged in
- [ ] `validate_findings` ran with `coordinate_space="normalized_1000"`, `image_path`, and `use_gemini: false`
- [ ] `save_audit` → `annotate_image` → `build_viewer` all succeeded
- [ ] Report includes viewer path + severity counts + snap stats (gemini count = 0)

## Rules

- You ARE the vision model for every pack. `get_skill_pack` hands you the prompt; you supply the analysis by looking at the screenshot yourself. This is what makes the skill work on any Claude subscription with zero setup beyond connecting the MCP server — no API key, ever.
- Never call `analyze_image`. Never pass `use_gemini: true`. If you notice `OPENROUTER_API_KEY` or `GOOGLE_AI_KEY` configured in the environment, ignore it — this protocol doesn't use it.
- Never save unvalidated findings.
- `save_audit` always gets the ORIGINAL image path.
- If a parallel subagent pass for a group comes back empty, malformed, or fails outright, redo that one pack yourself in the main context — don't silently skip a group.
- Never start Step 1 before the Step 0.5 interview is answered (or written intent was supplied). A screenshot alone under-specifies the audit; skipping this produces generic findings.
- Never create tracker issues from a shortlist payload without confirming scope first, and never invent the project/assignee/labels the user didn't give you.
