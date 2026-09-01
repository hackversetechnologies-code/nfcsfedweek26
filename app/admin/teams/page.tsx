import { createServiceClient } from "@/lib/supabase/server";
import TeamToggle from "@/components/TeamToggle";
import NewTeamForm from "@/components/NewTeamForm";

export const dynamic = "force-dynamic";

export default async function AdminTeamsPage() {
  const supabase = createServiceClient();
  const { data: teams } = await supabase.from("teams").select("*").order("order");

  return (
    <div className="max-w-[640px] mx-auto px-5 py-10">
      <h1 className="font-serif font-semibold text-3xl mb-8">Teams</h1>

      <div className="space-y-2 mb-10">
        {(teams ?? []).map((t) => (
          <div key={t.id} className="flex items-center justify-between border border-border rounded-sm px-4 py-3.5">
            <span className="flex items-center gap-2.5 text-[14px] font-medium">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.hex }} />
              {t.name}
              {!t.active && <span className="text-[10px] uppercase text-gray-muted">(inactive)</span>}
            </span>
            <TeamToggle id={t.id} active={t.active} />
          </div>
        ))}
      </div>

      <h2 className="text-[13px] uppercase tracking-wide font-semibold text-gray-dark mb-4">Add a Team</h2>
      <NewTeamForm />
    </div>
  );
}
