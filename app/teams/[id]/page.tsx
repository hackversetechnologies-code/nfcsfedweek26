import { createClient } from "@/lib/supabase/server";

export default async function TeamMembersPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: team } = await supabase.from("teams").select("*").eq("id", params.id).single();
  const { data: members } = await supabase
    .from("registrations")
    .select("full_name")
    .eq("status", "approved")
    .eq("team_id", params.id)
    .order("full_name");

  if (!team) {
    return <section className="max-w-[640px] mx-auto px-5 py-16 text-center text-gray-dark">Team not found.</section>;
  }

  return (
    <section className="max-w-[640px] mx-auto px-5 py-16">
      <div className="flex items-center gap-3 mb-10">
        <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: team.hex }} />
        <h1 className="font-serif font-semibold text-[clamp(28px,7vw,40px)]">{team.name}</h1>
      </div>
      {(!members || members.length === 0) ? (
        <p className="text-gray-dark text-[15px]">No members yet.</p>
      ) : (
        <ul className="border-t border-border">
          {members.map((m, i) => (
            <li key={i} className="py-3.5 border-b border-border text-[15px]">{m.full_name}</li>
          ))}
        </ul>
      )}
    </section>
  );
}
