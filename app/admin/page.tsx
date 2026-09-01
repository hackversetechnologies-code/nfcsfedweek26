import { createServiceClient } from "@/lib/supabase/server";
import Link from "next/link";
import { AlertCircle, Database } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = createServiceClient();

  let registered = 0;
  let approved = 0;
  let pending = 0;
  let rejected = 0;
  let pendingPayments = 0;
  let teams: any[] = [];
  let teamCounts: any[] = [];
  let dbError = false;

  try {
    const [{ count: regC }, { count: appC }, { count: penC }, { count: rejC }] = await Promise.all([
      supabase.from("registrations").select("*", { count: "exact", head: true }),
      supabase.from("registrations").select("*", { count: "exact", head: true }).eq("status", "approved"),
      supabase.from("registrations").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("registrations").select("*", { count: "exact", head: true }).eq("status", "rejected")
    ]);

    registered = regC ?? 0;
    approved = appC ?? 0;
    pending = penC ?? 0;
    rejected = rejC ?? 0;

    const { data: t } = await supabase.from("teams").select("id,name,hex").eq("active", true).order("order");
    teams = t ?? [];

    teamCounts = await Promise.all(
      teams.map(async (team) => {
        const { count } = await supabase.from("registrations").select("*", { count: "exact", head: true }).eq("status", "approved").eq("team_id", team.id);
        return { ...team, count: count ?? 0 };
      })
    );

    const { count: pPay } = await supabase.from("payments").select("*", { count: "exact", head: true }).eq("status", "pending");
    pendingPayments = pPay ?? 0;
  } catch (err) {
    dbError = true;
  }

  return (
    <div className="max-w-[960px] mx-auto px-5 py-10">
      <p className="eyebrow mb-1">Federation Week 2026</p>
      <h1 className="font-serif font-semibold text-3xl mb-8">Admin Dashboard</h1>

      {dbError && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-md p-5 mb-8 flex items-start gap-3">
          <Database className="text-amber-600 shrink-0 mt-1" size={20} />
          <div>
            <h3 className="font-semibold text-sm mb-1">Supabase Database Tables Not Found</h3>
            <p className="text-[13px] leading-relaxed text-amber-800">
              The Supabase database tables have not been created yet. Please copy the contents of{" "}
              <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-[12px]">supabase/full_setup.sql</code>{" "}
              and execute it in your Supabase SQL Editor to initialize the system.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <Stat label="Registered" value={registered} />
        <Stat label="Approved" value={approved} />
        <Stat label="Pending" value={pending} />
        <Stat label="Rejected" value={rejected} />
      </div>

      {pendingPayments > 0 && (
        <Link href="/admin/payments" className="block bg-jet text-paper-soft rounded-sm p-5 mb-10 hover:bg-accent transition-colors">
          <span className="text-[13px] uppercase tracking-wide font-semibold">
            {pendingPayments} payment{pendingPayments === 1 ? "" : "s"} awaiting review &rarr;
          </span>
        </Link>
      )}

      <h2 className="text-[13px] uppercase tracking-wide font-semibold text-gray-dark mb-4">Team Distribution</h2>
      <div className="space-y-2 mb-10">
        {teamCounts.length > 0 ? (
          teamCounts.map((t) => (
            <div key={t.id} className="flex items-center justify-between border border-border rounded-sm px-4 py-3">
              <span className="flex items-center gap-2.5 text-[14px] font-medium">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.hex }} />
                {t.name}
              </span>
              <span className="text-[13px] text-gray-dark font-semibold">{t.count}</span>
            </div>
          ))
        ) : (
          <p className="text-[13px] text-gray-muted italic">No active teams loaded.</p>
        )}
      </div>

      <nav className="grid grid-cols-2 gap-3 text-[13px] uppercase tracking-wide font-semibold">
        <Link href="/admin/registrations" className="border border-border rounded-sm p-4 text-center hover:bg-paper-soft">Registrations</Link>
        <Link href="/admin/payments" className="border border-border rounded-sm p-4 text-center hover:bg-paper-soft">Payments</Link>
        <Link href="/admin/teams" className="border border-border rounded-sm p-4 text-center hover:bg-paper-soft">Teams</Link>
        <Link href="/admin/executives" className="border border-border rounded-sm p-4 text-center hover:bg-paper-soft">Executives</Link>
        <Link href="/admin/settings" className="border border-border rounded-sm p-4 text-center col-span-2 hover:bg-paper-soft">Event Settings</Link>
      </nav>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border border-border rounded-sm p-4 bg-paper-soft">
      <div className="font-serif font-semibold text-3xl">{value}</div>
      <div className="text-[11px] uppercase tracking-wide text-gray-muted mt-1">{label}</div>
    </div>
  );
}
