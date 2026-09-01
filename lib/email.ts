import { Resend } from "resend";

/**
 * Sends the approval confirmation email via Resend.
 * Returns { ok: false } instead of throwing so a failed email never
 * rolls back an already-approved payment.
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

  const fromAddress = "NFCS Federation Week <onboarding@resend.dev>";
  const fallbackRecipient = "nwabuisiikechukwu66@gmail.com";

  const emailHtml = `
    <div style="font-family:Georgia,serif;max-width:480px;margin:0 auto;color:#242424;padding:20px;border:1px solid #e5e5e5;border-radius:6px;">
      <p style="letter-spacing:.1em;text-transform:uppercase;font-size:11px;color:#3E6B4F;font-weight:bold;">NFCS Federation Week 2026</p>
      <h1 style="font-size:24px;margin:8px 0 20px;color:#0B0B0B;">Congratulations, ${params.fullName}.</h1>
      <p style="font-size:15px;line-height:1.5;">Your registration for NFCS Federation Week 2026 has been approved!</p>
      <div style="margin-top:20px;padding:16px;background-color:#FAF8F3;border-left:4px solid #3E6B4F;">
        <p style="margin:0;font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:#858585;">Your Assigned Picnic Team:</p>
        <p style="margin:4px 0 0;font-size:22px;font-weight:bold;color:#0B0B0B;">${params.teamName}</p>
      </div>
      <p style="margin-top:16px;color:#454545;font-size:13px;">Registration ID: <strong style="font-family:monospace;">${params.registrationId}</strong></p>
      <p style="margin-top:16px;font-style:italic;color:#3E6B4F;font-size:14px;">&ldquo;Christ Our Foundation, Love Our Mission.&rdquo;</p>
      <div style="margin-top:24px;">
        <a href="${params.ticketUrl}" style="display:inline-block;background:#0B0B0B;color:#FAF8F3;padding:14px 24px;text-decoration:none;letter-spacing:.06em;text-transform:uppercase;font-size:12px;font-weight:bold;border-radius:4px;">View Digital Ticket Pass</a>
      </div>
    </div>
  `;

  try {
    // Primary attempt: Send to student's registered email
    const res = await resend.emails.send({
      from: fromAddress,
      to: params.to,
      subject: "You're officially part of NFCS Federation Week 2026",
      html: emailHtml
    });

    if (res.error) {
      const errObj = res.error as any;
      console.warn("Resend primary send error:", errObj);

      // If error is unverified domain recipient restriction (HTTP 403), fallback to account owner email during testing
      if (errObj.statusCode === 403 || errObj.message?.includes("own email address") || errObj.message?.includes("verify a domain")) {
        console.log(`Resend testing mode restriction: Redirecting test email for ${params.to} to ${fallbackRecipient}`);
        
        const fallbackRes = await resend.emails.send({
          from: fromAddress,
          to: fallbackRecipient,
          subject: `[For: ${params.fullName} (${params.to})] NFCS Federation Week 2026 Ticket`,
          html: `
            <div style="background:#fff8e1;padding:10px 15px;margin-bottom:15px;border:1px solid #ffe082;font-family:sans-serif;font-size:12px;color:#7f6000;">
              <strong>Resend Testing Mode Notice:</strong> This email was originally intended for <u>${params.to}</u>. Delivered to account owner (${fallbackRecipient}) because a custom domain has not been verified on Resend yet.
            </div>
            ${emailHtml}
          `
        });

        if (!fallbackRes.error) {
          return { ok: true as const, fallback: true as const, recipient: fallbackRecipient };
        }
      }

      return { ok: false as const, reason: errObj.message || "send_failed" };
    }

    return { ok: true as const };
  } catch (err: any) {
    console.error("Email send exception:", err);
    return { ok: false as const, reason: err?.message || "send_exception" };
  }
}
