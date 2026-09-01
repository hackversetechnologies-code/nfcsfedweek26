import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-guard";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const guard = requireAdmin(req);
  if (guard) return guard;

  const supabase = createServiceClient();

  try {
    // 1. Fetch Registrations with Team info (using service role key to bypass RLS)
    const { data: registrations, error: regError } = await supabase
      .from("registrations")
      .select("*, teams(name, colour, hex)")
      .order("created_at", { ascending: false });

    if (regError && (regError.code === "PGRST205" || regError.message?.includes("schema cache") || regError.message?.includes("relation"))) {
      return NextResponse.json({ db_error: true, message: "Database tables not initialized in Supabase." }, { status: 200 });
    }

    // 2. Fetch Pending Payments
    const { data: payments } = await supabase
      .from("payments")
      .select("*, registrations(full_name, email, phone, department, level)")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    // 3. Fetch Teams
    const { data: rawTeams } = await supabase
      .from("teams")
      .select("*")
      .order("order", { ascending: true });

    // Deduplicate teams by name
    const teamsMap = new Map<string, any>();
    for (const t of rawTeams ?? []) {
      if (!teamsMap.has(t.name)) {
        teamsMap.set(t.name, t);
      }
    }
    const teams = Array.from(teamsMap.values());

    // 4. Fetch Executives
    const { data: executives } = await supabase
      .from("executives")
      .select("*")
      .order("display_order", { ascending: true });

    // 5. Fetch Event Settings
    const { data: settings } = await supabase
      .from("event_settings")
      .select("*")
      .single();

    return NextResponse.json({
      db_error: false,
      registrations: registrations ?? [],
      payments: payments ?? [],
      teams: teams ?? [],
      executives: executives ?? [],
      settings: settings ?? null
    });
  } catch (err: any) {
    console.error("Admin data fetch error:", err);
    return NextResponse.json({ error: err?.message || "Failed to fetch admin data." }, { status: 500 });
  }
}
