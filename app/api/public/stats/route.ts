import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Public endpoint that returns:
 * - approved count
 * - teams with their approved member lists (first name only for privacy)
 */
export async function GET() {
  const supabase = createServiceClient();

  try {
    // Get deduplicated active teams
    const { data: rawTeams } = await supabase
      .from("teams")
      .select("id, name, colour, hex, order")
      .eq("active", true)
      .order("order", { ascending: true });

    const teamsMap = new Map<string, any>();
    for (const t of rawTeams ?? []) {
      if (!teamsMap.has(t.name)) teamsMap.set(t.name, t);
    }
    const teams = Array.from(teamsMap.values());

    // Get all approved registrations with team info
    const { data: approved } = await supabase
      .from("registrations")
      .select("id, full_name, department, level, team_id")
      .eq("status", "approved");

    const totalApproved = approved?.length ?? 0;

    // Map team members — only show first name + last initial for privacy
    const teamsWithMembers = teams.map((t) => {
      const members = (approved ?? [])
        .filter((r) => r.team_id === t.id)
        .map((r) => {
          const parts = (r.full_name || "").trim().split(" ");
          const displayName =
            parts.length > 1
              ? `${parts[0]} ${parts[parts.length - 1][0]}.`
              : parts[0] || "Member";
          return { displayName, department: r.department || null };
        });
      return { ...t, members, memberCount: members.length };
    });

    return NextResponse.json({ totalApproved, teams: teamsWithMembers });
  } catch (err: any) {
    console.error("Public stats error:", err);
    return NextResponse.json({ totalApproved: 0, teams: [] });
  }
}
