import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function AdminRegistrationsPage() {
  const supabase = createServiceClient();
  const { data: regs } = await supabase
    .from("registrations")
    .select("*, teams(name)")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-[960px] mx-auto px-5 py-10">
      <h1 className="font-serif font-semibold text-3xl mb-8">Registrations</h1>

      {(!regs || regs.length === 0) ? (
        <p className="text-gray-dark text-[15px]">No registrations yet.</p>
      ) : (
        <>
          {/* Mobile: stacked cards */}
          <div className="space-y-3 sm:hidden">
            {regs.map((r: any) => (
              <div key={r.id} className="border border-border rounded-sm p-4">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-[15px]">{r.full_name}</span>
                  <StatusPill status={r.status} />
                </div>
                <div className="text-[13px] text-gray-dark">{r.email}</div>
                <div className="text-[13px] text-gray-dark">{r.phone}</div>
                {r.teams?.name && <div className="text-[12px] text-gray-muted mt-1.5">{r.teams.name}</div>}
              </div>
            ))}
          </div>

          {/* Desktop: table */}
          <table className="hidden sm:table w-full text-[14px] border-t border-border">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide text-gray-muted">
                <th className="py-3">Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Team</th><th>Date</th>
              </tr>
            </thead>
            <tbody>
              {regs.map((r: any) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="py-3 font-medium">{r.full_name}</td>
                  <td>{r.email}</td>
                  <td>{r.phone}</td>
                  <td><StatusPill status={r.status} /></td>
                  <td>{r.teams?.name ?? "—"}</td>
                  <td className="text-gray-muted">{new Date(r.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const colors: Record<string, string> = {
    approved: "bg-team-green/10 text-team-green",
    pending: "bg-accent/15 text-accent",
    rejected: "bg-team-red/10 text-team-red"
  };
  return <span className={`text-[10px] uppercase tracking-wide font-semibold px-2 py-1 rounded-sm ${colors[status] ?? ""}`}>{status}</span>;
}
