"use client";

import { useState, useEffect } from "react";
import {
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  CreditCard,
  Search,
  RefreshCw,
  Sliders,
  Award,
  Database,
  Check,
  X,
  UserCheck,
  Plus,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Trash2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"overview" | "payments" | "registrations" | "teams" | "executives" | "settings">("overview");
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  // Data states
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [executives, setExecutives] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>(null);

  // Action loading state
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [notification, setNotification] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Forms state
  const [newTeam, setNewTeam] = useState({ name: "", hex: "#3E6B4F" });
  const [newExec, setNewExec] = useState({ name: "", role: "", photo_url: "" });
  const [settingsForm, setSettingsForm] = useState({
    contribution_amount: 2000,
    bank_name: "First Bank of Nigeria",
    account_name: "Ogochukwu Stella Chimuanya",
    account_number: "3225195083",
    registration_open: true
  });

  async function loadData() {
    setLoading(true);
    setDbError(false);
    try {
      const res = await fetch("/api/admin/data");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      if (data.db_error) {
        setDbError(true);
        return;
      }
      setRegistrations(data.registrations ?? []);
      setPayments(data.payments ?? []);

      // Deduplicate teams by name
      const rawTeams = data.teams ?? [];
      const teamsMap = new Map<string, any>();
      for (const t of rawTeams) {
        if (!teamsMap.has(t.name)) {
          teamsMap.set(t.name, t);
        }
      }
      setTeams(Array.from(teamsMap.values()));

      setExecutives(data.executives ?? []);
      if (data.settings) {
        setSettings(data.settings);
        setSettingsForm({
          contribution_amount: data.settings.contribution_amount,
          bank_name: data.settings.bank_name,
          account_name: data.settings.account_name,
          account_number: data.settings.account_number,
          registration_open: data.settings.registration_open
        });
      }
    } catch (e) {
      console.error("Data load error:", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Show temporary toast message
  function notify(msg: string, type: "success" | "error" = "success") {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  }

  // 1-Click Approve Payment
  async function handleApprove(paymentId?: string, regId?: string) {
    const key = paymentId || regId || "";
    setActionLoading((prev) => ({ ...prev, [key]: true }));
    try {
      const res = await fetch("/api/admin/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_id: paymentId, registration_id: regId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Approval failed");

      notify(`Approved! Team assigned: ${data.team || "Assigned"}. Email sent: ${data.email_sent ? "Yes" : "Pending"}`);
      loadData();
    } catch (err: any) {
      notify(err?.message || "Could not approve. Try again.", "error");
    } finally {
      setActionLoading((prev) => ({ ...prev, [key]: false }));
    }
  }

  // 1-Click Reject Payment
  async function handleReject(paymentId?: string, regId?: string) {
    const key = paymentId || regId || "";
    setActionLoading((prev) => ({ ...prev, [key]: true }));
    try {
      const res = await fetch("/api/admin/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_id: paymentId, registration_id: regId })
      });
      if (!res.ok) throw new Error();
      notify("Registration marked rejected.", "error");
      loadData();
    } catch {
      notify("Could not reject registration.", "error");
    } finally {
      setActionLoading((prev) => ({ ...prev, [key]: false }));
    }
  }

  // Delete User Registration
  async function handleDelete(regId: string, fullName: string) {
    if (!confirm(`Are you sure you want to delete ${fullName}? This will permanently remove their registration and payment records.`)) {
      return;
    }
    setActionLoading((prev) => ({ ...prev, [regId]: true }));
    try {
      const res = await fetch("/api/admin/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registration_id: regId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      notify(`User ${fullName} deleted successfully.`);
      loadData();
    } catch (err: any) {
      notify(err?.message || "Could not delete user.", "error");
    } finally {
      setActionLoading((prev) => ({ ...prev, [regId]: false }));
    }
  }

  // Toggle Team Active State
  async function handleToggleTeam(teamId: string, currentActive: boolean) {
    try {
      const res = await fetch("/api/admin/teams", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: teamId, active: !currentActive })
      });
      if (!res.ok) throw new Error();
      notify("Team updated.");
      loadData();
    } catch {
      notify("Could not update team.", "error");
    }
  }

  // Add New Team
  async function handleAddTeam(e: React.FormEvent) {
    e.preventDefault();
    if (!newTeam.name.trim()) return;
    try {
      const res = await fetch("/api/admin/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTeam)
      });
      if (!res.ok) throw new Error();
      setNewTeam({ name: "", hex: "#3E6B4F" });
      notify("New team created!");
      loadData();
    } catch {
      notify("Could not create team.", "error");
    }
  }

  // Add Executive
  async function handleAddExec(e: React.FormEvent) {
    e.preventDefault();
    if (!newExec.name.trim() || !newExec.role.trim()) return;
    try {
      const res = await fetch("/api/admin/executives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newExec)
      });
      if (!res.ok) throw new Error();
      setNewExec({ name: "", role: "", photo_url: "" });
      notify("Executive added!");
      loadData();
    } catch {
      notify("Could not add executive.", "error");
    }
  }

  // Save Settings
  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingsForm)
      });
      if (!res.ok) throw new Error();
      notify("Event settings updated successfully!");
      loadData();
    } catch {
      notify("Could not update settings.", "error");
    }
  }

  // Logout Admin
  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }

  // Computed Stats
  const totalRegistered = registrations.length;
  const approvedCount = registrations.filter((r) => r.status === "approved").length;
  const pendingCount = registrations.filter((r) => r.status === "pending").length;
  const rejectedCount = registrations.filter((r) => r.status === "rejected").length;

  // Filtered Registrations
  const filteredRegistrations = registrations.filter((r) => {
    const matchesStatus = statusFilter === "all" || r.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      r.full_name?.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q) ||
      r.phone?.toLowerCase().includes(q) ||
      r.department?.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="bg-paper min-h-screen pb-20">
      {/* TOP HEADER */}
      <header className="bg-jet text-paper-soft border-b border-border py-4 px-5 sticky top-0 z-40">
        <div className="max-w-[1120px] mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck size={24} className="text-accent" />
            <div>
              <h1 className="font-serif font-semibold text-lg sm:text-xl">NFCS Admin Portal</h1>
              <p className="text-[10.5px] uppercase tracking-widest text-[#B8B8B0]">AEFUTHA 1 Chaplaincy</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              disabled={loading}
              className="inline-flex items-center gap-1.5 text-[12px] bg-white/10 hover:bg-white/20 text-paper-soft px-3 py-1.5 rounded-sm transition-colors"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              <span>Refresh</span>
            </button>
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1 text-[12px] text-gray-muted hover:text-paper-soft px-2 py-1 transition-colors"
            >
              <span>View Site</span>
              <ExternalLink size={13} />
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-[12px] bg-team-red/20 text-team-red hover:bg-team-red hover:text-white px-3 py-1.5 rounded-sm transition-colors font-medium"
            >
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* NOTIFICATION TOAST */}
      {notification && (
        <div
          className={`fixed top-16 right-5 z-50 p-4 rounded-md shadow-xl text-[13px] font-medium border flex items-center gap-2 max-w-[360px] animate-in fade-in slide-in-from-top-3 ${
            notification.type === "success"
              ? "bg-emerald-950 text-emerald-100 border-emerald-800"
              : "bg-red-950 text-red-100 border-red-800"
          }`}
        >
          {notification.type === "success" ? <CheckCircle2 size={18} className="text-emerald-400 shrink-0" /> : <XCircle size={18} className="text-red-400 shrink-0" />}
          <span>{notification.msg}</span>
        </div>
      )}

      <div className="max-w-[1120px] mx-auto px-5 pt-8">
        {/* DATABASE WARNING ALERT */}
        {dbError && (
          <div className="bg-amber-50 border border-amber-300 text-amber-900 rounded-md p-5 mb-8 flex items-start gap-3 shadow-sm">
            <Database className="text-amber-600 shrink-0 mt-0.5" size={22} />
            <div>
              <h3 className="font-semibold text-sm mb-1">Database Setup Required</h3>
              <p className="text-[13px] leading-relaxed text-amber-800">
                The Supabase database tables have not been created yet in your project. Please copy the SQL code from{" "}
                <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-[12px] font-bold">supabase/full_setup.sql</code>{" "}
                and run it in your <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="underline font-semibold">Supabase SQL Editor</a>.
              </p>
            </div>
          </div>
        )}

        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-paper-soft border border-border p-5 rounded-md shadow-sm">
            <div className="flex items-center justify-between text-gray-muted mb-2">
              <span className="text-[11px] uppercase tracking-wider font-bold">Total Registered</span>
              <Users size={18} className="text-jet" />
            </div>
            <div className="font-serif font-semibold text-3xl text-jet">{totalRegistered}</div>
            <p className="text-[11px] text-gray-muted mt-1">Students signed up</p>
          </div>

          <div className="bg-paper-soft border border-border p-5 rounded-md shadow-sm">
            <div className="flex items-center justify-between text-gray-muted mb-2">
              <span className="text-[11px] uppercase tracking-wider font-bold">Approved</span>
              <CheckCircle2 size={18} className="text-accent" />
            </div>
            <div className="font-serif font-semibold text-3xl text-accent">{approvedCount}</div>
            <p className="text-[11px] text-gray-muted mt-1">Payment verified & ticketed</p>
          </div>

          <div className="bg-paper-soft border border-border p-5 rounded-md shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between text-gray-muted mb-2">
              <span className="text-[11px] uppercase tracking-wider font-bold">Pending Review</span>
              <Clock size={18} className="text-amber-600" />
            </div>
            <div className="font-serif font-semibold text-3xl text-amber-700">{payments.length || pendingCount}</div>
            <p className="text-[11px] text-gray-muted mt-1">Awaiting 1-click review</p>
            {(payments.length > 0) && (
              <span className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            )}
          </div>

          <div className="bg-paper-soft border border-border p-5 rounded-md shadow-sm">
            <div className="flex items-center justify-between text-gray-muted mb-2">
              <span className="text-[11px] uppercase tracking-wider font-bold">Rejected</span>
              <XCircle size={18} className="text-team-red" />
            </div>
            <div className="font-serif font-semibold text-3xl text-team-red">{rejectedCount}</div>
            <p className="text-[11px] text-gray-muted mt-1">Unverified transfers</p>
          </div>
        </div>

        {/* NAVIGATION TAB BAR */}
        <div className="flex overflow-x-auto border-b border-border gap-2 mb-8 no-scrollbar scroll-smooth">
          {[
            { id: "overview", label: "Overview", icon: Users },
            { id: "payments", label: `Pending Claims (${payments.length})`, icon: CreditCard, highlight: payments.length > 0 },
            { id: "registrations", label: `All Members (${totalRegistered})`, icon: UserCheck },
            { id: "teams", label: "Picnic Teams", icon: Award },
            { id: "executives", label: "Executives", icon: Users },
            { id: "settings", label: "Event Settings", icon: Sliders }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-[13px] uppercase tracking-wider font-semibold border-b-2 transition-all shrink-0 ${
                  isActive
                    ? "border-jet text-jet bg-paper-soft"
                    : "border-transparent text-gray-muted hover:text-jet hover:border-border"
                } ${tab.highlight ? "text-amber-700" : ""}`}
              >
                <Icon size={16} className={isActive ? "text-accent" : ""} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* PENDING CLAIMS QUICK BANNER */}
            {payments.length > 0 && (
              <div className="bg-jet text-paper-soft p-6 rounded-md shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-accent bg-accent/10 px-2.5 py-1 rounded">
                    Action Needed
                  </span>
                  <h3 className="font-serif font-semibold text-2xl mt-2">
                    {payments.length} Payment Claim{payments.length === 1 ? "" : "s"} Waiting
                  </h3>
                  <p className="text-[13px] text-[#B8B8B0]">Students have clicked &lsquo;I Have Made the Transfer&rsquo;. Verify and approve below.</p>
                </div>
                <button
                  onClick={() => setActiveTab("payments")}
                  className="bg-accent text-paper-soft px-6 py-3 rounded-sm text-[12px] uppercase tracking-wider font-bold shrink-0 hover:bg-emerald-700 transition-colors shadow"
                >
                  Review Pending Claims &rarr;
                </button>
              </div>
            )}

            {/* DEDUPLICATED TEAM BALANCING BREAKDOWN */}
            <div className="bg-paper-soft border border-border p-6 rounded-md shadow-sm">
              <h3 className="font-serif font-semibold text-xl text-jet mb-4">Picnic Team Distribution</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {teams.map((t) => {
                  const teamMembers = registrations.filter(
                    (r) => r.status === "approved" && (r.team_id === t.id || r.teams?.name === t.name)
                  ).length;
                  return (
                    <div key={t.id || t.name} className="bg-paper border border-border p-4 rounded-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: t.hex }} />
                        <span className="font-semibold text-[15px]">{t.name}</span>
                        {!t.active && <span className="text-[10px] uppercase text-gray-muted">(inactive)</span>}
                      </div>
                      <div className="font-serif font-semibold text-2xl text-jet">{teamMembers}</div>
                      <p className="text-[11px] text-gray-muted mt-1">Approved Members</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RECENT REGISTRATIONS PREVIEW */}
            <div className="bg-paper-soft border border-border p-6 rounded-md shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif font-semibold text-xl text-jet">Recent Member Signups</h3>
                <button onClick={() => setActiveTab("registrations")} className="text-[12px] font-bold text-accent hover:underline uppercase">
                  View All ({totalRegistered}) &rarr;
                </button>
              </div>

              {registrations.length === 0 ? (
                <p className="text-gray-dark text-[14px] italic py-4">No member registrations yet.</p>
              ) : (
                <div className="divide-y divide-border border-t border-border">
                  {registrations.slice(0, 5).map((r) => (
                    <div key={r.id} className="py-3.5 flex flex-wrap items-center justify-between gap-3 text-[14px]">
                      <div>
                        <div className="font-semibold text-jet">{r.full_name}</div>
                        <div className="text-[12px] text-gray-muted">
                          {r.email} &bull; {r.phone} {r.department ? `&bull; ${r.department}` : ""}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <StatusBadge status={r.status} />
                        {r.status === "pending" && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleApprove(undefined, r.id)}
                              disabled={actionLoading[r.id]}
                              className="bg-accent text-white px-2.5 py-1 text-[11px] uppercase font-bold rounded hover:bg-emerald-700"
                            >
                              Approve
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: PENDING PAYMENTS QUEUE */}
        {activeTab === "payments" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif font-semibold text-2xl">Pending Payment Claims</h2>
                <p className="text-[13px] text-gray-dark mt-0.5">Students who confirmed their bank transfer. Verify and click Approve to assign team & email ticket.</p>
              </div>
            </div>

            {payments.length === 0 ? (
              <div className="bg-paper-soft border border-border p-12 text-center rounded-md">
                <CheckCircle2 size={40} className="text-accent mx-auto mb-3" />
                <h3 className="font-serif font-semibold text-xl text-jet mb-1">Queue Clear</h3>
                <p className="text-[13px] text-gray-dark">No pending payment claims awaiting verification right now.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {payments.map((p) => {
                  const reg = p.registrations;
                  const key = p.id;
                  const isBusy = actionLoading[key];
                  return (
                    <div key={p.id} className="bg-paper-soft border-2 border-amber-300/80 rounded-md p-6 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                              Claimed Transfer: ₦{p.amount?.toLocaleString()}
                            </span>
                            <h3 className="font-serif font-semibold text-xl text-jet mt-1.5">{reg?.full_name || "Student"}</h3>
                          </div>
                          <span className="text-[11px] text-gray-muted font-mono">{new Date(p.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>

                        <div className="space-y-1.5 text-[13px] text-gray-dark bg-paper p-3.5 rounded border border-border mb-4 font-medium">
                          <div><span className="text-gray-muted font-normal">Email:</span> {reg?.email}</div>
                          <div><span className="text-gray-muted font-normal">Phone:</span> {reg?.phone}</div>
                          {reg?.department && <div><span className="text-gray-muted font-normal">Dept / Level:</span> {reg.department} {reg.level ? `(${reg.level})` : ""}</div>}
                          <div><span className="text-gray-muted font-normal font-semibold">Transfer Claim:</span> {p.bank_used || "Direct Bank Transfer"}</div>
                        </div>
                      </div>

                      {/* 1-CLICK ACTION BUTTONS */}
                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => handleApprove(p.id)}
                          disabled={isBusy}
                          className="flex-1 bg-accent hover:bg-emerald-700 text-paper-soft py-3 rounded text-[12px] uppercase tracking-wider font-bold shadow flex items-center justify-center gap-1.5 disabled:opacity-60"
                        >
                          <Check size={16} />
                          <span>{isBusy ? "Approving…" : "Approve & Email Ticket"}</span>
                        </button>
                        <button
                          onClick={() => handleReject(p.id)}
                          disabled={isBusy}
                          title="Reject Transfer"
                          className="bg-paper border border-amber-600/40 text-amber-700 hover:bg-amber-600 hover:text-white px-3 py-3 rounded text-[12px] uppercase tracking-wider font-bold transition-colors disabled:opacity-60"
                        >
                          <X size={16} />
                        </button>
                        {reg?.id && (
                          <button
                            onClick={() => handleDelete(reg.id, reg.full_name)}
                            disabled={actionLoading[reg.id]}
                            title="Delete User Registration"
                            className="bg-paper border border-team-red/40 text-team-red hover:bg-team-red hover:text-white px-3 py-3 rounded text-[12px] uppercase tracking-wider font-bold transition-colors disabled:opacity-60"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ALL REGISTRATIONS */}
        {activeTab === "registrations" && (
          <div className="space-y-6">
            {/* SEARCH & FILTER CONTROLS */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-paper-soft p-4 rounded-md border border-border">
              <div className="relative w-full sm:w-80">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-muted" />
                <input
                  type="text"
                  placeholder="Search name, email, dept..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-[13px] border border-border rounded-sm bg-paper focus:outline-none focus:ring-2 focus:ring-accent"
                />
              </div>

              <div className="flex items-center gap-1 text-[12px] uppercase tracking-wider font-semibold">
                {(["all", "pending", "approved", "rejected"] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-sm transition-colors ${
                      statusFilter === st ? "bg-jet text-paper-soft font-bold" : "text-gray-dark hover:bg-paper"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* MEMBER TABLE */}
            {filteredRegistrations.length === 0 ? (
              <p className="text-gray-dark text-[14px] italic py-8 text-center bg-paper-soft border border-border rounded-md">
                No member registrations match your query.
              </p>
            ) : (
              <div className="border border-border rounded-md overflow-hidden bg-paper-soft shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-[13.5px] text-left">
                    <thead className="bg-paper border-b border-border text-[11px] uppercase tracking-widest text-gray-muted font-bold">
                      <tr>
                        <th className="py-3.5 px-4">Student Name</th>
                        <th className="py-3.5 px-4">Contact Info</th>
                        <th className="py-3.5 px-4">Department / Level</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4">Assigned Team</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredRegistrations.map((r) => (
                        <tr key={r.id} className="hover:bg-paper transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-jet">{r.full_name}</td>
                          <td className="py-3.5 px-4">
                            <div>{r.email}</div>
                            <div className="text-[12px] text-gray-muted">{r.phone}</div>
                          </td>
                          <td className="py-3.5 px-4 text-gray-dark">
                            {r.department || "—"} {r.level ? `(${r.level})` : ""}
                          </td>
                          <td className="py-3.5 px-4">
                            <StatusBadge status={r.status} />
                          </td>
                          <td className="py-3.5 px-4 font-medium">
                            {r.teams ? (
                              <span className="inline-flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: r.teams.hex }} />
                                {r.teams.name}
                              </span>
                            ) : (
                              <span className="text-gray-muted italic">Unassigned</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {r.status === "pending" && (
                                <>
                                  <button
                                    onClick={() => handleApprove(undefined, r.id)}
                                    disabled={actionLoading[r.id]}
                                    className="bg-accent text-white text-[11px] uppercase font-bold px-3 py-1.5 rounded hover:bg-emerald-700 transition-colors shadow-sm"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleReject(undefined, r.id)}
                                    disabled={actionLoading[r.id]}
                                    className="border border-amber-600/40 text-amber-700 text-[11px] uppercase font-bold px-2 py-1.5 rounded hover:bg-amber-600 hover:text-white transition-colors"
                                  >
                                    Reject
                                  </button>
                                </>
                              )}
                              {r.status === "approved" && (
                                <Link
                                  href={`/ticket/${r.id}`}
                                  target="_blank"
                                  className="text-[12px] text-accent hover:underline font-semibold mr-1"
                                >
                                  Ticket &rarr;
                                </Link>
                              )}
                              <button
                                onClick={() => handleDelete(r.id, r.full_name)}
                                disabled={actionLoading[r.id]}
                                title="Delete Member"
                                className="border border-team-red/30 text-team-red hover:bg-team-red hover:text-white p-1.5 rounded transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: TEAMS */}
        {activeTab === "teams" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-7 space-y-4">
              <h2 className="font-serif font-semibold text-2xl mb-4">Picnic Teams Manager</h2>
              {teams.map((t) => (
                <div key={t.id || t.name} className="bg-paper-soft border border-border p-4 rounded-md flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: t.hex }} />
                    <div>
                      <div className="font-semibold text-[15px]">{t.name}</div>
                      <div className="text-[12px] text-gray-muted">Hex: {t.hex} &bull; Order: {t.order}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleTeam(t.id, t.active)}
                    className={`text-[11px] uppercase tracking-wider font-bold px-3 py-1.5 rounded transition-colors ${
                      t.active ? "bg-accent/15 text-accent border border-accent/30" : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {t.active ? "Active" : "Inactive"}
                  </button>
                </div>
              ))}
            </div>

            <div className="md:col-span-5 bg-paper-soft border border-border p-6 rounded-md">
              <h3 className="font-serif font-semibold text-xl mb-4">Create New Team</h3>
              <form onSubmit={handleAddTeam} className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-muted mb-1">Team Name</label>
                  <input
                    type="text"
                    required
                    value={newTeam.name}
                    onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })}
                    placeholder="e.g. Team Gold"
                    className="w-full border border-border px-3.5 py-2.5 text-[14px] rounded-sm bg-paper"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-muted mb-1">Color Hex</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={newTeam.hex}
                      onChange={(e) => setNewTeam({ ...newTeam, hex: e.target.value })}
                      className="w-10 h-10 border border-border rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={newTeam.hex}
                      onChange={(e) => setNewTeam({ ...newTeam, hex: e.target.value })}
                      className="flex-1 border border-border px-3.5 py-2.5 text-[14px] rounded-sm bg-paper font-mono"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-jet text-paper-soft py-3 rounded-sm text-[12px] uppercase tracking-wider font-bold hover:bg-accent transition-colors shadow"
                >
                  Add Team
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 5: EXECUTIVES */}
        {activeTab === "executives" && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-7 space-y-4">
              <h2 className="font-serif font-semibold text-2xl mb-4">Executive Leadership</h2>
              {executives.length === 0 ? (
                <p className="text-gray-dark italic">No executives listed.</p>
              ) : (
                executives.map((e) => (
                  <div key={e.id} className="bg-paper-soft border border-border p-4 rounded-md flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-[15px]">{e.name}</div>
                      <div className="text-[12px] text-accent font-medium uppercase tracking-wider">{e.role}</div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="md:col-span-5 bg-paper-soft border border-border p-6 rounded-md">
              <h3 className="font-serif font-semibold text-xl mb-4">Add Executive</h3>
              <form onSubmit={handleAddExec} className="space-y-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-muted mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newExec.name}
                    onChange={(e) => setNewExec({ ...newExec, name: e.target.value })}
                    placeholder="e.g. Bro. Chidiebere Okeke"
                    className="w-full border border-border px-3.5 py-2.5 text-[14px] rounded-sm bg-paper"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-muted mb-1">Role / Office</label>
                  <input
                    type="text"
                    required
                    value={newExec.role}
                    onChange={(e) => setNewExec({ ...newExec, role: e.target.value })}
                    placeholder="e.g. President / Organizing Chair"
                    className="w-full border border-border px-3.5 py-2.5 text-[14px] rounded-sm bg-paper"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-jet text-paper-soft py-3 rounded-sm text-[12px] uppercase tracking-wider font-bold hover:bg-accent transition-colors shadow"
                >
                  Save Executive Profile
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 6: EVENT SETTINGS */}
        {activeTab === "settings" && (
          <div className="max-w-[600px] bg-paper-soft border border-border p-8 rounded-md shadow-sm">
            <h2 className="font-serif font-semibold text-2xl mb-6">Federation Week Settings</h2>
            <form onSubmit={handleSaveSettings} className="space-y-5">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <span className="font-semibold text-[15px]">Registration Status</span>
                  <p className="text-[12px] text-gray-muted font-normal">Allow students to sign up online</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSettingsForm({ ...settingsForm, registration_open: !settingsForm.registration_open })}
                  className={`px-4 py-2 rounded text-[12px] font-bold uppercase tracking-wider ${
                    settingsForm.registration_open ? "bg-accent text-white" : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {settingsForm.registration_open ? "OPEN" : "CLOSED"}
                </button>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-muted mb-1">Contribution Fee (₦)</label>
                <input
                  type="number"
                  value={settingsForm.contribution_amount}
                  onChange={(e) => setSettingsForm({ ...settingsForm, contribution_amount: Number(e.target.value) })}
                  className="w-full border border-border px-3.5 py-2.5 text-[15px] rounded-sm bg-paper font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-muted mb-1">Bank Name</label>
                <input
                  type="text"
                  value={settingsForm.bank_name}
                  onChange={(e) => setSettingsForm({ ...settingsForm, bank_name: e.target.value })}
                  className="w-full border border-border px-3.5 py-2.5 text-[14px] rounded-sm bg-paper"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-muted mb-1">Account Name</label>
                <input
                  type="text"
                  value={settingsForm.account_name}
                  onChange={(e) => setSettingsForm({ ...settingsForm, account_name: e.target.value })}
                  className="w-full border border-border px-3.5 py-2.5 text-[14px] rounded-sm bg-paper"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-gray-muted mb-1">Account Number</label>
                <input
                  type="text"
                  value={settingsForm.account_number}
                  onChange={(e) => setSettingsForm({ ...settingsForm, account_number: e.target.value })}
                  className="w-full border border-border px-3.5 py-2.5 text-[14px] rounded-sm bg-paper font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-jet text-paper-soft py-3.5 rounded-sm text-[13px] uppercase tracking-wider font-bold hover:bg-accent transition-colors shadow-md"
              >
                Save Settings
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    approved: "bg-accent/15 text-accent border-accent/30",
    pending: "bg-amber-100 text-amber-800 border-amber-300",
    rejected: "bg-red-100 text-red-800 border-red-300"
  };
  return (
    <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded border ${styles[status] || ""}`}>
      {status}
    </span>
  );
}
