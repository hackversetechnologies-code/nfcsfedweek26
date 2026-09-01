import { createClient } from "@/lib/supabase/server";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function ExecutivesPage() {
  const supabase = createClient();
  const { data: execs } = await supabase
    .from("executives")
    .select("*")
    .eq("active", true)
    .order("display_order");

  return (
    <section className="max-w-[960px] mx-auto px-5 py-16">
      <p className="eyebrow mb-2">The People Behind the Week</p>
      <h1 className="font-serif font-semibold text-[clamp(32px,8vw,48px)] mb-10">Executives</h1>

      {(!execs || execs.length === 0) ? (
        <p className="text-gray-dark text-[15px]">Executive profiles will be added here soon.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {execs.map((e) => (
            <div key={e.id}>
              <div className="aspect-[3/4] bg-paper-soft border border-border rounded-sm mb-3 relative overflow-hidden">
                {e.photo_url && <Image src={e.photo_url} alt={e.name} fill className="object-cover" />}
              </div>
              <div className="font-semibold text-[14px]">{e.name}</div>
              <div className="text-[12px] text-gray-muted uppercase tracking-wide">{e.role}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
