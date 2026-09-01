import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { assignBalancedTeam } from "@/lib/team-assignment";
import { sendApprovalEmail } from "@/lib/email";
import { requireAdmin } from "@/lib/admin-guard";


export async function POST(req: Request) {
  const guard = requireAdmin(req);
  if (guard) return guard;

  const { payment_id } = await req.json();
  if (!payment_id) return NextResponse.json({ error: "payment_id is required." }, { status: 400 });

  const supabase = createServiceClient();

  const { data: payment } = await supabase.from("payments").select("*").eq("id", payment_id).single();
  if (!payment) return NextResponse.json({ error: "Payment not found." }, { status: 404 });

  // 1. mark payment approved
  await supabase.from("payments").update({ status: "approved", reviewed_at: new Date().toISOString() }).eq("id", payment_id);

  // 2. assign balanced team
  const teamId = await assignBalancedTeam();

  // 3. mark registration approved + assign team
  await supabase.from("registrations").update({ status: "approved", team_id: teamId }).eq("id", payment.registration_id);

  // 4. generate ticket identifier
  const ticketCode = `NFCS-FW-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
  const { data: ticket } = await supabase
    .from("tickets")
    .insert({ registration_id: payment.registration_id, ticket_code: ticketCode })
    .select("*")
    .single();

  // 5. send confirmation email — failure here never rolls back the approval above
  const { data: reg } = await supabase.from("registrations").select("full_name, email").eq("id", payment.registration_id).single();
  const { data: team } = teamId ? await supabase.from("teams").select("name").eq("id", teamId).single() : { data: null };

  let emailResult = { ok: false as boolean };
  if (reg) {
    emailResult = await sendApprovalEmail({
      to: reg.email,
      fullName: reg.full_name,
      teamName: team?.name ?? "Unassigned",
      registrationId: payment.registration_id,
      ticketUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/ticket/${payment.registration_id}`
    });
  }

  return NextResponse.json({
    ok: true,
    ticket_code: ticket?.ticket_code,
    team: team?.name ?? null,
    email_sent: emailResult.ok
  });
}
