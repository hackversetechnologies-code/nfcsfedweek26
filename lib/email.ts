import { Resend } from "resend";

/**
 * Sends the approval confirmation email via Resend.
 * Returns { ok: false } instead of throwing so a failed email never
 * rolls back an already-approved payment — callers show
 * "Payment approved, email pending" and can retry via lib/email again.
 */
export async function sendApprovalEmail(params: {
  to: string;
  fullName: string;
  teamName: string;
  registrationId: string;
  ticketUrl: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set — skipping email send.");
    return { ok: false, reason: "not_configured" as const };
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  // Resend requires verified domains or 'onboarding@resend.dev' for free/unverified accounts.
  // Using an unverified @gmail.com as the 'from' header causes Resend API to fail with HTTP 403/400.
  let fromAddress = process.env.EMAIL_FROM || "NFCS Federation Week <onboarding@resend.dev>";
  if (fromAddress.includes("@gmail.com") || fromAddress.includes("@yahoo.com") || fromAddress.includes("@outlook.com")) {
    fromAddress = "NFCS Federation Week <onboarding@resend.dev>";
  }

  try {
    await resend.emails.send({
      from: fromAddress,
      replyTo: process.env.EMAIL_FROM && !process.env.EMAIL_FROM.includes("noreply") ? process.env.EMAIL_FROM : undefined,
      to: params.to,
      subject: "You're officially part of NFCS Federation Week 2026",
      html: `
        <div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;color:#242424;">
          <p style="letter-spacing:.1em;text-transform:uppercase;font-size:11px;color:#858585;">NFCS Federation Week 2026</p>
          <h1 style="font-size:24px;margin:8px 0 20px;">Congratulations, ${params.fullName}.</h1>
          <p>Your registration for NFCS Federation Week 2026 has been approved.</p>
          <p style="margin-top:16px;">Your picnic team is:</p>
          <p style="font-size:20px;font-weight:600;">${params.teamName}</p>
          <p style="margin-top:16px;color:#454545;">Registration ID: ${params.registrationId}</p>
          <p style="margin-top:16px;font-style:italic;color:#454545;">Christ Our Foundation, Love Our Mission.</p>
          <a href="${params.ticketUrl}" style="display:inline-block;margin-top:24px;background:#0B0B0B;color:#FAF8F3;padding:14px 24px;text-decoration:none;letter-spacing:.06em;text-transform:uppercase;font-size:13px;">View My Ticket</a>
        </div>
      `
    });
    return { ok: true as const };
  } catch (err) {
    console.error("Email send failed:", err);
    return { ok: false, reason: "send_failed" as const };
  }
}
