import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-guard";


export async function PATCH(req: Request) {
  const guard = requireAdmin(req);
  if (guard) return guard;
  const updates = await req.json();

  const supabase = createServiceClient();
  const { error } = await supabase.from("event_settings").update(updates).eq("id", 1);
  if (error) return NextResponse.json({ error: "Could not update settings." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
