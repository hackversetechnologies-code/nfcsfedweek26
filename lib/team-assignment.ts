import { createServiceClient } from "@/lib/supabase/server";

/**
 * Balanced random team assignment.
 * 1. Get active teams (deduplicated by name).
 * 2. Count approved members per team.
 * 3. Find the team(s) with the lowest count.
 * 4. Randomly pick among the lowest-count teams.
 * 5. Return that team id.
 */
export async function assignBalancedTeam(): Promise<string | null> {
  const supabase = createServiceClient();

  const { data: rawTeams, error: teamsError } = await supabase
    .from("teams")
    .select("id, name")
    .eq("active", true);

  if (teamsError || !rawTeams || rawTeams.length === 0) return null;

  // Deduplicate teams by name
  const teamsMap = new Map<string, any>();
  for (const t of rawTeams) {
    if (!teamsMap.has(t.name)) {
      teamsMap.set(t.name, t);
    }
  }
  const teams = Array.from(teamsMap.values());

  const { data: counts, error: countsError } = await supabase
    .from("registrations")
    .select("team_id")
    .eq("status", "approved")
    .not("team_id", "is", null);

  if (countsError) return null;

  const tally: Record<string, number> = {};
  for (const t of teams) tally[t.id] = 0;
  for (const row of counts ?? []) {
    if (row.team_id && tally[row.team_id] !== undefined) tally[row.team_id]++;
  }

  const minCount = Math.min(...teams.map((t) => tally[t.id]));
  const lowest = teams.filter((t) => tally[t.id] === minCount);
  const chosen = lowest[Math.floor(Math.random() * lowest.length)];
  return chosen.id;
}
