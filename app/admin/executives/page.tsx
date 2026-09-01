import { createServiceClient } from "@/lib/supabase/server";
import NewExecutiveForm from "@/components/NewExecutiveForm";

export const dynamic = "force-dynamic";

export default async function AdminExecutivesPage() {
  const supabase = createServiceClient();
  const { data: execs } = await supabase.from("executives").select("*").order("display_order");

  return (
    <div className="max-w-[560px] mx-auto px-5 py-10">
      <h1 className="font-serif font-semibold text-3xl mb-8">Executives</h1>

      <div className="space-y-2 mb-10">
        {(execs ?? []).map((e) => (
          <div key={e.id} className="border border-border rounded-sm px-4 py-3">
            <div className="font-medium text-[14px]">{e.name}</div>
            <div className="text-[12px] text-gray-muted uppercase tracking-wide">{e.role}</div>
          </div>
        ))}
        {(!execs || execs.length === 0) && <p className="text-gray-dark text-[14px]">No executives added yet.</p>}
      </div>

      <h2 className="text-[13px] uppercase tracking-wide font-semibold text-gray-dark mb-4">Add an Executive</h2>
      <NewExecutiveForm />
    </div>
  );
}
