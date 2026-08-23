# ux-audit (Claude Skill)

Turns any Claude subscription (Claude Code, Cowork, Desktop) into a UX auditor: give it a URL or a screenshot, get back an annotated screenshot, an interactive viewer, and a downloadable markdown report — the same output the `ux-audit-mcp` project produces internally.

## What makes this different from a typical "AI UX audit" skill

Most UX-audit tools call out to a separate vision-LLM API (OpenRouter, an OpenAI key, Gemini directly) to look at the screenshot. This one doesn't. **Claude — the model already running this conversation, on the user's existing subscription — is the vision model.** [`SKILL.md`](SKILL.md) is the protocol Claude follows to read the screenshot itself, pack by pack, and turn what it sees into structured, validated findings. No API key, nothing to configure, nothing billed outside the subscription. That's what lets this install and behave like any other Claude skill.

The `ux-audit-mcp` server does the parts that aren't vision: capturing a URL with a real headless browser (so findings can be grounded to exact DOM element positions, not guessed), assembling each skill pack's prompt from a shared rules library, running deterministic code-based checks (contrast ratios, touch-target sizes, axe-core), validating and grounding the findings Claude produces, and rendering the final annotated PNG + interactive viewer.

## Installing

This skill needs its MCP server connected — the skill alone can't launch a browser or render images.

```bash
git clone <this repo>
cd ux-audit-mcp
npm install && npx playwright install chromium
npm run build
claude mcp add ux-audit -- node "$(pwd)/dist/index.js"
```

No environment variables and no API key are required for the interactive skill in [`SKILL.md`](SKILL.md). (The server also ships an `analyze_image` tool that talks to OpenRouter/Gemini — that exists only for a separate headless CLI path, `scripts/run-audit.sh`. This skill's protocol never calls it; see the "Rules" section at the bottom of `SKILL.md`.)

Once the MCP server is connected, this `SKILL.md` is picked up automatically whenever a user asks Claude to "audit this screenshot" or "audit this URL/page," and the mcp__ux-audit__* tools are available.

## Using it

- **A URL:** "Audit https://example.com" — Claude captures it (desktop or mobile viewport), reads it, and produces the findings.
- **A screenshot:** attach an image, or give a path — Claude grids it for accurate coordinates and reads it the same way.
- **First, it asks.** Before it looks for issues, Claude asks 2-3 questions — what the user was trying to do, where they came from, anything not visible in the frame (routing, hover states, defaults). Skips this only if you've already given it written intent. This is what keeps findings specific instead of generic.
- **Corrections:** tell Claude a finding is wrong, or that it missed something, or that terminology should change — it writes the correction into the engine's own rule files so it doesn't happen again (see `_self-improve/SKILL.md`).
- **Send findings to a tracker:** in `viewer.html`, tick the findings you want to act on and hit "Shortlist" — it copies a small JSON payload to your clipboard. Paste it back into the conversation and Claude creates one issue per finding in whatever tracker you have connected (or writes them to markdown if nothing's connected).

Output for every audit: `annotated.png` (numbered severity boxes), `viewer.html` (interactive, with a built-in download-as-markdown button for a plain report file, and the shortlist-to-tracker checkbox), and `findings.json` (the canonical structured data, in case you want to pipe it elsewhere).
