import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
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
    const { data: payment } = await supabase.from("payments").select("registration_id").eq("id", payment_id).single();
    if (payment) {
      regId = payment.registration_id;
      await supabase.from("payments").update({ status: "rejected", reviewed_at: new Date().toISOString() }).eq("id", payment_id);
    }
  }

  if (regId) {
    await supabase.from("registrations").update({ status: "rejected" }).eq("id", regId);
  }

  return NextResponse.json({ ok: true });
}
