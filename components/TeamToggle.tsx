"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TeamToggle({ id, active }: { id: string; active: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function toggle() {
    setBusy(true);
    await fetch("/api/admin/teams", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, active: !active })
    });
    router.refresh();
    setBusy(false);
  }

  return (
    <button onClick={toggle} disabled={busy} className="text-[11px] uppercase tracking-wide font-semibold border border-border rounded-sm px-3 py-1.5">
      {active ? "Deactivate" : "Activate"}
    </button>
  );
}
