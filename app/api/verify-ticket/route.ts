import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const { token } = await req.json();
  if (!token) return NextResponse.json({ valid: false }, { status: 400 });

  const supabase = createServiceClient();
  const { data: ticket } = await supabase.from("tickets").select("registration_id").eq("qr_token", token).single();
  if (!ticket) return NextResponse.json({ valid: false });

  const { data: reg } = await supabase
    .from("registrations")
    .select("id, full_name, status, team_id")
    .eq("id", ticket.registration_id)
    .single();

  if (!reg || reg.status !== "approved") return NextResponse.json({ valid: false });

  const { data: team } = reg.team_id ? await supabase.from("teams").select("name").eq("id", reg.team_id).single() : { data: null };

  return NextResponse.json({
    valid: true,
    name: reg.full_name,
    team: team?.name ?? null,
    registration_id: reg.id
  });
}
