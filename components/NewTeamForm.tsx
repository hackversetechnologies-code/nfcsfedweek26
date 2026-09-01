"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewTeamForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [hex, setHex] = useState("#454545");
  const [busy, setBusy] = useState(false);

  async function submit() {
    if (!name.trim()) return;
    setBusy(true);
    await fetch("/api/admin/teams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, hex })
    });
    setName("");
    router.refresh();
    setBusy(false);
  }

  return (
    <div className="flex gap-3">
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Team name" className="flex-1 border border-border rounded-sm px-4 py-3 text-[14px] bg-paper-soft" />
      <input type="color" value={hex} onChange={(e) => setHex(e.target.value)} className="w-12 border border-border rounded-sm" />
      <button onClick={submit} disabled={busy} className="bg-jet text-paper-soft px-5 rounded-sm text-[13px] uppercase tracking-wide font-semibold">Add</button>
    </div>
  );
}
