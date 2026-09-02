// Vercel Serverless Function — 1-Click Access Approver
// When Muzeeb clicks "Approve & Send Password" in his email, this endpoint executes and confirms password delivery.

export default async function handler(req, res) {
  const email = (req.query.email || "").trim();
  const token = req.query.token || "";

  if (!email || !email.includes("@")) {
    res.status(400).send(`
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><title>Invalid Request</title><style>body{font-family:sans-serif;background:#0f0f0f;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;}</style></head>
      <body><div style="text-align:center;"><h2>Invalid Request</h2><p>No valid requester email provided.</p></div></body>
      </html>
    `);
    return;
  }

  // If RESEND_API_KEY is configured, send the password email automatically
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const userHtml = `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:520px;margin:30px auto;background:#ffffff;border-radius:14px;padding:36px;border:1px solid #e4e4e7;color:#18181b;">
          <div style="width:36px;height:36px;border-radius:8px;background:#18181b;color:#fff;font-weight:800;font-size:14px;line-height:36px;text-align:center;margin-bottom:20px;">MZ</div>
          <h2 style="font-size:20px;font-weight:700;margin:0 0 12px;color:#09090b;">Your CaseNotes Access Request</h2>
          <p style="font-size:14.5px;line-height:1.6;color:#3f3f46;margin:0 0 20px;">Your request to view the private <strong>CaseNotes: AI Meeting Notetaker for Lawyers</strong> case study has been approved.</p>
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:18px;text-align:center;margin-bottom:24px;">
            <div style="font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:#64748b;margin-bottom:6px;">Your Access Password</div>
            <div style="font-size:22px;font-weight:800;color:#4f46e5;font-family:monospace;">casenotes@2026</div>
          </div>
          <a href="https://muzeeb-portfolio.vercel.app/casenotes-case-study.html" style="display:inline-block;padding:12px 24px;background:#4f46e5;color:#ffffff;text-decoration:none;font-weight:600;border-radius:10px;font-size:14px;">Open Case Study →</a>
          <p style="font-size:13.5px;color:#71717a;margin:28px 0 0;">Best regards,<br><strong style="color:#18181b;">Muzeeb Urrahaman</strong></p>
        </div>
      `;

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: "Muzeeb Urrahaman <onboarding@resend.dev>",
          to: email,
          subject: "🔐 Your CaseNotes Case Study Access Password",
          html: userHtml
        })
      });
    } catch (e) {
      console.error("Resend auto-send error:", e);
    }
  }

  // Pre-filled mailto backup URL in case owner wants to open in client
  const mailtoUrl = `mailto:${encodeURIComponent(email)}?subject=CaseNotes%20Case%20Study%20Password%20Access&body=Hi%2C%0A%0AYour%20request%20to%20view%20the%20CaseNotes%20case%20study%20has%20been%20approved!%0A%0A%F0%9F%94%91%20Password%3A%20casenotes%402026%0A%F0%9F%94%97%20Link%3A%20https%3A%2F%2Fmuzeeb-portfolio.vercel.app%2Fcasenotes-case-study.html%0A%0ABest%20regards%2C%0AMuzeeb%20Urrahaman%0AProduct%20Designer%20%26%20Design%20Engineer`;

  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Access Approved · Muzeeb Urrahaman</title>
      <style>
        body { margin: 0; padding: 0; background: #0f0f0f; color: #f4f2ed; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
        .card { max-width: 460px; width: 90%; background: #171717; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 20px; padding: 40px 32px; text-align: center; box-shadow: 0 24px 60px rgba(0,0,0,0.5); }
        .icon { width: 56px; height: 56px; border-radius: 50%; background: rgba(34, 197, 94, 0.15); border: 1px solid rgba(34, 197, 94, 0.3); color: #22c55e; display: flex; align-items: center; justify-content: center; margin: 0 auto 18px; font-size: 26px; }
        h1 { font-size: 22px; font-weight: 700; margin: 0 0 10px; color: #fff; }
        p { font-size: 14.5px; line-height: 1.6; color: #a3a39d; margin: 0 0 24px; }
        .email-pill { background: rgba(255, 255, 255, 0.06); padding: 6px 14px; border-radius: 999px; font-family: monospace; font-size: 13.5px; color: #6ea8ff; display: inline-block; margin-bottom: 24px; }
        .btn { display: inline-block; width: 100%; box-sizing: border-box; background: #22c55e; color: #052e16; text-decoration: none; font-weight: 700; font-size: 15px; padding: 14px 20px; border-radius: 12px; transition: opacity 0.2s; }
        .btn:hover { opacity: 0.9; }
        .btn-alt { display: inline-block; margin-top: 14px; color: #a3a39d; text-decoration: underline; font-size: 13.5px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="icon">✓</div>
        <h1>Access Request Approved</h1>
        <p>You have approved password access for:</p>
        <div class="email-pill">${email}</div>
        
        <a href="${mailtoUrl}" class="btn">
          Open Email in Gmail / Mail Client →
        </a>

        <div>
          <a href="https://muzeeb-portfolio.vercel.app/casenotes-case-study.html" class="btn-alt">Back to CaseNotes</a>
        </div>
      </div>
    </body>
    </html>
  `);
}
