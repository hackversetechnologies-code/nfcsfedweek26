import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-guard";


export async function POST(req: Request) {
  const guard = requireAdmin(req);
  if (guard) return guard;
  const { name, colour, hex } = await req.json();
  if (!name?.trim() || !hex?.trim()) return NextResponse.json({ error: "Name and hex are required." }, { status: 400 });

  const supabase = createServiceClient();
  const { data: existing } = await supabase.from("teams").select("order").order("order", { ascending: false }).limit(1);
  const nextOrder = (existing?.[0]?.order ?? 0) + 1;

  const { error } = await supabase.from("teams").insert({ name, colour: colour || name.toLowerCase(), hex, order: nextOrder });
  if (error) return NextResponse.json({ error: "Could not create team." }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function PATCH(req: Request) {
  const guard = requireAdmin(req);
  if (guard) return guard;
  const { id, active } = await req.json();
  if (!id) return NextResponse.json({ error: "id is required." }, { status: 400 });

  const supabase = createServiceClient();
  const { error } = await supabase.from("teams").update({ active }).eq("id", id);
  if (error) return NextResponse.json({ error: "Could not update team." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
