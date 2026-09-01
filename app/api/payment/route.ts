import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { registration_id, amount, bank_used, sender_name, transaction_reference, transfer_time } = body;

  if (!registration_id) {
    return NextResponse.json({ error: "Registration ID is required." }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { error } = await supabase.from("payments").insert({
    registration_id,
    amount: amount || 2000,
    bank_used: bank_used || "First Bank Direct",
    sender_name: sender_name || "Bank Transfer",
    transaction_reference: transaction_reference || `TXN-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    transfer_time: transfer_time || new Date().toISOString()
  });

  if (error) {
    console.error("Payment insert error:", error);
    return NextResponse.json({ error: error.message || "Your payment claim was not submitted." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
