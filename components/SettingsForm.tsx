"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsForm({ settings }: { settings: any }) {
  const router = useRouter();
  const [form, setForm] = useState(settings);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (k: string, v: any) => setForm((f: any) => ({ ...f, [k]: v }));

  async function save() {
    setBusy(true);
    setSaved(false);
    await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contribution_amount: Number(form.contribution_amount),
        bank_name: form.bank_name,
        account_name: form.account_name,
        account_number: form.account_number,
        registration_open: form.registration_open,
        team_assignment_enabled: form.team_assignment_enabled
      })
    });
    setBusy(false);
    setSaved(true);
    router.refresh();
  }

  return (
    <div className="space-y-5">
      <Field label="Contribution Amount (₦)" value={String(form.contribution_amount)} onChange={(v) => set("contribution_amount", v)} type="number" />
      <Field label="Bank Name" value={form.bank_name} onChange={(v) => set("bank_name", v)} />
      <Field label="Account Name" value={form.account_name} onChange={(v) => set("account_name", v)} />
      <Field label="Account Number" value={form.account_number} onChange={(v) => set("account_number", v)} />

      <Toggle label="Registration Open" value={form.registration_open} onChange={(v) => set("registration_open", v)} />
      <Toggle label="Team Assignment Enabled" value={form.team_assignment_enabled} onChange={(v) => set("team_assignment_enabled", v)} />

      <button onClick={save} disabled={busy} className="w-full bg-jet text-paper-soft py-4 rounded-sm text-[13px] uppercase tracking-wide font-semibold">
        {busy ? "Saving…" : "Save Settings"}
      </button>
      {saved && <p className="text-[12px] text-team-green text-center">Saved.</p>}
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-wide text-gray-muted mb-1.5">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full border border-border rounded-sm px-4 py-3 text-[14px] bg-paper-soft" />
    </label>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between border border-border rounded-sm px-4 py-3">
      <span className="text-[13px] font-medium">{label}</span>
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} className="w-5 h-5" />
    </label>
  );
}
