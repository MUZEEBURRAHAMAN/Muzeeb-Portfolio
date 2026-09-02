// Vercel Serverless Function — CaseNotes Access Request Dispatcher
// Sends the custom HTML template with the 'Send Password' action button to Muzeeb's Gmail.

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    let body = {};
    if (typeof req.body === "string") {
      try {
        body = JSON.parse(req.body || "{}");
      } catch (err) {
        res.status(400).json({ error: "Invalid JSON body" });
        return;
      }
    } else {
      body = req.body || {};
    }

    const email = (body.email || body.requester_email || "").trim();
    if (!email || !email.includes("@")) {
      res.status(400).json({ error: "Valid email is required" });
      return;
    }

    const approveLink = `https://muzeeb-portfolio.vercel.app/api/approve-access?email=${encodeURIComponent(email)}`;
    const approveMailto = `mailto:${encodeURIComponent(email)}?subject=CaseNotes%20Case%20Study%20Password%20Access&body=Hi%2C%0A%0AYour%20request%20to%20view%20the%20CaseNotes%20case%20study%20has%20been%20approved!%0A%0A%F0%9F%94%91%20Password%3A%20casenotes%402026%0A%F0%9F%94%97%20Link%3A%20https%3A%2F%2Fmuzeeb-portfolio.vercel.app%2Fcasenotes-case-study.html%0A%0ABest%20regards%2C%0AMuzeeb%20Urrahaman%0AProduct%20Designer%20%26%20Design%20Engineer`;

    // 1. If RESEND_API_KEY is configured in Vercel, send the 100% custom styled HTML card
    const resendApiKey = process.env.RESEND_API_KEY;
    if (resendApiKey) {
      const ownerHtml = `
        <!DOCTYPE html>
        <html>
        <body style="margin: 0; padding: 40px 16px; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border-radius: 14px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05); overflow: hidden; border: 1px solid #e4e4e7;">
            <tr>
              <td style="padding: 32px 36px 10px 36px;">
                <div style="width: 36px; height: 36px; border-radius: 8px; background-color: #18181b; color: #ffffff; font-weight: 800; font-size: 14px; line-height: 36px; text-align: center;">MZ</div>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 36px 36px 36px;">
                <h2 style="font-size: 20px; font-weight: 700; color: #09090b; margin: 0 0 14px 0;">Hi Muzeeb,</h2>
                <p style="font-size: 14.5px; line-height: 1.6; color: #3f3f46; margin: 0 0 16px 0;">A visitor has requested password access to your private <strong>CaseNotes: AI Meeting Notetaker for Lawyers</strong> case study.</p>
                <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 24px;">
                  <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #64748b; margin-bottom: 4px;">Requester Email</div>
                  <div style="font-size: 15px; font-weight: 700; color: #0f172a;">${email}</div>
                  <div style="font-size: 11px; font-weight: 600; text-transform: uppercase; color: #64748b; margin-top: 10px; margin-bottom: 4px;">Access Password</div>
                  <div style="font-size: 14px; font-weight: 600; color: #4f46e5; font-family: monospace;">casenotes@2026</div>
                </div>
                <table border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                  <tr>
                    <td align="center" style="border-radius: 10px; background-color: #4f46e5;">
                      <a href="${approveLink}" target="_blank" style="display: inline-block; padding: 13px 26px; font-size: 14.5px; font-weight: 600; color: #ffffff; text-decoration: none; border-radius: 10px;">Send Password</a>
                    </td>
                  </tr>
                </table>
                <p style="font-size: 13.5px; line-height: 1.5; color: #71717a; margin: 0;">Best regards,<br><strong style="color: #18181b;">Muzeeb Portfolio</strong></p>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": `Bearer ${resendApiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "CaseNotes Access <onboarding@resend.dev>",
          to: "rahamanmuzeeb1108@gmail.com",
          subject: `🔐 CaseNotes Access Request from ${email}`,
          html: ownerHtml
        })
      });

      res.status(200).json({ success: true, via: "resend" });
      return;
    }

    // 2. Fallback to FormSubmit gateway
    await fetch("https://formsubmit.co/ajax/rahamanmuzeeb1108@gmail.com", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        _subject: `🔐 CaseNotes Access Request from ${email}`,
        _replyto: email,
        _template: "box",
        "Requester Email": email,
        "Requested Case Study": "CaseNotes: AI Meeting Notetaker for Lawyers",
        "Access Password": "casenotes@2026",
        "1-Click Send Password Link": approveMailto,
        "Requested At": new Date().toLocaleString()
      })
    });

    res.status(200).json({ success: true, via: "formsubmit" });
  } catch (error) {
    console.error("Request access error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
