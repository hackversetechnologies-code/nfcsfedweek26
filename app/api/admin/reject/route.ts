import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-guard";


export async function POST(req: Request) {
  const guard = requireAdmin(req);
  if (guard) return guard;

  const { payment_id } = await req.json();
  if (!payment_id) return NextResponse.json({ error: "payment_id is required." }, { status: 400 });

  const supabase = createServiceClient();
  const { data: payment } = await supabase.from("payments").select("registration_id").eq("id", payment_id).single();
  if (!payment) return NextResponse.json({ error: "Payment not found." }, { status: 404 });

  await supabase.from("payments").update({ status: "rejected", reviewed_at: new Date().toISOString() }).eq("id", payment_id);
  await supabase.from("registrations").update({ status: "rejected" }).eq("id", payment.registration_id);

  return NextResponse.json({ ok: true });
}
