import nodemailer from "nodemailer";

/**
 * Sends the approval confirmation email via Gmail SMTP (free, no domain needed).
 *
 * Required environment variables:
 *   GMAIL_USER  — the Gmail address to send from  e.g. nfcsaefutha@gmail.com
 *   GMAIL_PASS  — a Gmail App Password (not your real password).
 *                 To create one: Google Account → Security → 2-Step Verification ON
 *                 → search "App passwords" → create one for "Mail / Other"
 *
 * Returns { ok: false } instead of throwing so a failed email never
 * rolls back an already-approved registration.
 */
export async function sendApprovalEmail(params: {
  to: string;
  fullName: string;
  teamName: string;
  registrationId: string;
  ticketUrl: string;
}) {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_PASS;

  if (!gmailUser || !gmailPass) {
    console.warn("GMAIL_USER or GMAIL_PASS not set — skipping email send.");
    return { ok: false, reason: "not_configured" as const };
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailPass, // App Password, not your real Gmail password
    },
  });

  const emailHtml = `
    <div style="font-family:Georgia,serif;max-width:520px;margin:0 auto;color:#242424;padding:28px;border:1px solid #e5e5e5;border-radius:8px;">
      <p style="letter-spacing:.1em;text-transform:uppercase;font-size:11px;color:#3E6B4F;font-weight:bold;margin-bottom:4px;">
        NFCS · AEFUTHA 1
      </p>
      <h1 style="font-size:26px;margin:8px 0 20px;color:#0B0B0B;">
        Congratulations, ${params.fullName}! 🎉
      </h1>
      <p style="font-size:15px;line-height:1.6;color:#333;">
        Your registration for <strong>NFCS Federation Week 2026</strong> has been verified and approved. We're so glad you're joining us!
      </p>

      <div style="margin-top:24px;padding:18px 20px;background-color:#F4FBF6;border-left:5px solid #3E6B4F;border-radius:4px;">
        <p style="margin:0 0 4px;font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:#666;">Your Assigned Picnic Team:</p>
        <p style="margin:0;font-size:26px;font-weight:bold;color:#0B0B0B;">${params.teamName}</p>
      </div>

      <table style="margin-top:20px;width:100%;border-collapse:collapse;font-size:13px;color:#555;">
        <tr>
          <td style="padding:6px 0;color:#888;width:140px;">Registration ID</td>
          <td style="padding:6px 0;font-family:monospace;font-weight:bold;color:#222;">${params.registrationId}</td>
        </tr>
      </table>

      <div style="margin-top:28px;">
        <a href="${params.ticketUrl}"
           style="display:inline-block;background:#0B0B0B;color:#FAF8F3;padding:14px 28px;
                  text-decoration:none;letter-spacing:.06em;text-transform:uppercase;
                  font-size:12px;font-weight:bold;border-radius:5px;">
          View My Digital Ticket →
        </a>
      </div>

      <p style="margin-top:32px;font-style:italic;color:#3E6B4F;font-size:14px;border-top:1px solid #eee;padding-top:16px;">
        "Christ Our Foundation, Love Our Mission."
      </p>
      <p style="font-size:12px;color:#aaa;margin-top:8px;">
        NFCS AEFUTHA 1 · Our Mother of Perpetual Help Chaplaincy · Fed Week 2026
      </p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"NFCS Federation Week 2026" <${gmailUser}>`,
      to: params.to,
      subject: "✅ You're officially in! — NFCS Federation Week 2026",
      html: emailHtml,
    });

    console.log("Email sent:", info.messageId, "→", params.to);
    return { ok: true as const, messageId: info.messageId };
  } catch (err: any) {
    console.error("Email send failed:", err?.message || err);
    return { ok: false as const, reason: err?.message || "send_failed" };
  }
}
