import { createServiceClient } from "@/lib/supabase/server";

/**
 * Balanced random team assignment.
 * 1. Get active teams.
 * 2. Count approved members per team.
 * 3. Find the team(s) with the lowest count.
 * 4. Randomly pick among the lowest-count teams.
 * 5. Return that team id. Assignment is permanent — this is only ever
 *    called once per registration, at approval time.
 */
export async function assignBalancedTeam(): Promise<string | null> {
  const supabase = createServiceClient();

  const { data: teams, error: teamsError } = await supabase
    .from("teams")
    .select("id, name")
    .eq("active", true);

  if (teamsError || !teams || teams.length === 0) return null;

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
