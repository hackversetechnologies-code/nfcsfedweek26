import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-guard";


export async function POST(req: Request) {
  const guard = requireAdmin(req);
  if (guard) return guard;
  const { name, role, photo_url, bio } = await req.json();
  if (!name?.trim() || !role?.trim()) return NextResponse.json({ error: "Name and role are required." }, { status: 400 });

  const supabase = createServiceClient();
  const { error } = await supabase.from("executives").insert({ name, role, photo_url: photo_url || null, bio: bio || null });
  if (error) return NextResponse.json({ error: "Could not add executive." }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const guard = requireAdmin(req);
  if (guard) return guard;
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id is required." }, { status: 400 });

  const supabase = createServiceClient();
  const { error } = await supabase.from("executives").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Could not remove executive." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
