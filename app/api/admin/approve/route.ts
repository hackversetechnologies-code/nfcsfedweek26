import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { assignBalancedTeam } from "@/lib/team-assignment";
import { sendApprovalEmail } from "@/lib/email";
import { requireAdmin } from "@/lib/admin-guard";

export async function POST(req: Request) {
  const guard = requireAdmin(req);
  if (guard) return guard;

  const { payment_id, registration_id } = await req.json();
  if (!payment_id && !registration_id) {
    return NextResponse.json({ error: "payment_id or registration_id is required." }, { status: 400 });
  }

  const supabase = createServiceClient();

  let regId = registration_id;

  if (payment_id) {
    const { data: payment } = await supabase.from("payments").select("*").eq("id", payment_id).single();
    if (payment) {
      regId = payment.registration_id;
      // Mark payment approved
      await supabase.from("payments").update({ status: "approved", reviewed_at: new Date().toISOString() }).eq("id", payment_id);
    }
  }

  if (!regId) {
    return NextResponse.json({ error: "Target registration not found." }, { status: 404 });
  }

  // 1. Assign balanced team
  const teamId = await assignBalancedTeam();

  // 2. Mark registration approved + assign team
  await supabase.from("registrations").update({ status: "approved", team_id: teamId }).eq("id", regId);

  // 3. Generate ticket identifier (upsert/insert)
  const ticketCode = `NFCS-FW-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  const { data: ticket } = await supabase
    .from("tickets")
    .upsert({ registration_id: regId, ticket_code: ticketCode }, { onConflict: "registration_id" })
    .select("*")
    .single();

  // 4. Send confirmation email
  const { data: reg } = await supabase.from("registrations").select("full_name, email").eq("id", regId).single();
  const { data: team } = teamId ? await supabase.from("teams").select("name").eq("id", teamId).single() : { data: null };

  let emailResult = { ok: false as boolean };
  if (reg) {
    emailResult = await sendApprovalEmail({
      to: reg.email,
      fullName: reg.full_name,
      teamName: team?.name ?? "Team Member",
      registrationId: regId,
      ticketUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/ticket/${regId}`
    });
  }

  return NextResponse.json({
    ok: true,
    ticket_code: ticket?.ticket_code,
    team: team?.name ?? null,
    email_sent: emailResult.ok
  });
}
