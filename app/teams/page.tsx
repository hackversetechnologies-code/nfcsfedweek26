import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function TeamsPage() {
  const supabase = createClient();
  const { data: teams } = await supabase.from("teams").select("*").eq("active", true).order("order");

  const withCounts = await Promise.all(
    (teams ?? []).map(async (t) => {
      const { count } = await supabase
        .from("registrations")
        .select("*", { count: "exact", head: true })
        .eq("status", "approved")
        .eq("team_id", t.id);
      return { ...t, count: count ?? 0 };
    })
  );

  return (
    <section className="max-w-[720px] mx-auto px-5 py-16">
      <p className="eyebrow mb-2">Picnic Teams</p>
      <h1 className="font-serif font-semibold text-[clamp(32px,8vw,48px)] mb-10">Teams</h1>

      {withCounts.length === 0 && (
        <p className="text-gray-dark text-[15px]">Teams will appear here once registration opens.</p>
      )}

      <div className="space-y-3">
        {withCounts.map((t) => (
          <Link
            key={t.id}
            href={`/teams/${t.id}`}
            className="flex items-center justify-between border border-border rounded-sm p-5 transition-transform active:scale-[.99]"
          >
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: t.hex }} />
              <span className="font-semibold text-[15px]">{t.name}</span>
            </div>
            <span className="text-[13px] text-gray-dark">{t.count} members</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
