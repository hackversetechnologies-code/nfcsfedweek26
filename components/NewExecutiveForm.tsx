"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewExecutiveForm() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", role: "", photo_url: "" });
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!form.name.trim() || !form.role.trim()) return;
    setBusy(true);
    await fetch("/api/admin/executives", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setForm({ name: "", role: "", photo_url: "" });
    router.refresh();
    setBusy(false);
  }

  return (
    <div className="space-y-3">
      <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="Full name" className="w-full border border-border rounded-sm px-4 py-3 text-[14px] bg-paper-soft" />
      <input value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} placeholder="Role" className="w-full border border-border rounded-sm px-4 py-3 text-[14px] bg-paper-soft" />
      <input value={form.photo_url} onChange={(e) => setForm((f) => ({ ...f, photo_url: e.target.value }))} placeholder="Photo URL (optional)" className="w-full border border-border rounded-sm px-4 py-3 text-[14px] bg-paper-soft" />
      <button onClick={submit} disabled={busy} className="w-full bg-jet text-paper-soft py-3.5 rounded-sm text-[13px] uppercase tracking-wide font-semibold">
        Add Executive
      </button>
    </div>
  );
}
