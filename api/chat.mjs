// Vercel serverless function — Muzeeb AI chat (Gemini).
// Key is read from the GEMINI_API_KEY environment variable (set in Vercel → Settings → Environment Variables).
// Never hardcode the key here.

const CONTEXT = `
Muzeeb Urrahaman — Product Designer & Builder with 4.5+ years across AI, SaaS, and e-commerce. He designs AND builds — he ships in code, not just mockups. Name is pronounced "muh-zeeb".

Now: Product Designer / UX Lead at Omnis AI (2025–present) — leads design across 8+ AI-powered legal products; built and scaled a 200+ component design system adopted across the suite; built AI design-automation tools (a UX Audit Assistant and an AI Edge Fixer).
Past: UI/UX Designer at LetmeGrab (2023–24), UX Designer at Photoshooto (2022–23), design internships at EngineerHub and Kartexa (2022).
Tools: Figma, Cursor, Claude, Framer, Adobe Illustrator & Photoshop.
Case studies: LetmeGrab design system, Zebralearn product-detail-page redesign, 30 Days Daily UI. Side experiments live on the Playground page.
Strengths: end-to-end — discovery & research, design systems, prototyping, launch; then AI-assisted workflows and internal tools. Sits between UX logic and UI craft. Loves dense B2B workflows.
Location: Uttar Pradesh, India. Open to remote work and relocation. Exploring Product Designer, Founding Designer, and Design Engineer roles.
Contact: email rahamanmuzeeb1108@gmail.com; LinkedIn linkedin.com/in/muzeeburrahaman; also Behance, Dribbble, Instagram (footer links). Résumé is in the site nav.
`;

const SYSTEM = `You are "Muzeeb AI", the assistant on Muzeeb Urrahaman's portfolio website.
RULES:
- ONLY answer questions about Muzeeb Urrahaman — his work, projects, experience, design systems, AI tools, skills, process, availability, location, or how to contact/hire him.
- If the question is unrelated to Muzeeb or his career (general knowledge, coding help, math, other people, current events, anything off-topic), politely decline in ONE short sentence and steer back to his work — e.g. "I can only help with questions about Muzeeb's work and career — ask me about his projects, tools, or how to reach him."
- Keep answers concise (2–4 sentences), warm and professional. Refer to him as "Muzeeb" (third person).
- Never invent facts beyond the context below. If you don't know, say so and point to email.
- Plain text only, no markdown, no bullet symbols.

CONTEXT:
${CONTEXT}`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    res.status(500).json({ error: "Server not configured" });
    return;
  }
  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const message = (body.message || "").toString().slice(0, 500).trim();
    if (!message) { res.status(400).json({ error: "Empty message" }); return; }

    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + key;
    const r = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: SYSTEM }] },
        contents: [{ role: "user", parts: [{ text: message }] }],
        generationConfig: { maxOutputTokens: 240, temperature: 0.6 },
        safetySettings: []
      })
    });
    const data = await r.json();
    if (!r.ok) {
      res.status(502).json({ error: "Upstream error", detail: data && data.error ? data.error.message : "" });
      return;
    }
    var reply = "";
    try { reply = data.candidates[0].content.parts[0].text.trim(); } catch (e) {}
    if (!reply) { res.status(502).json({ error: "No reply" }); return; }
    res.status(200).json({ reply: reply });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
}
