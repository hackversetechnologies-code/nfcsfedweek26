import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { registration_id, amount, bank_used, sender_name, transaction_reference, transfer_time } = body;

  if (!registration_id || !bank_used?.trim() || !sender_name?.trim() || !transaction_reference?.trim() || !transfer_time) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { error } = await supabase.from("payments").insert({
    registration_id,
    amount,
    bank_used,
    sender_name,
    transaction_reference,
    transfer_time
  });

  if (error) {
    return NextResponse.json({ error: "Your payment information was not submitted. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
