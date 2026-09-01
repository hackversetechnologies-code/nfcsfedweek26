"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  async function submit() {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });
    if (res.ok) router.push("/admin");
    else setError(true);
  }

  return (
    <section className="max-w-[360px] mx-auto px-5 py-24">
      <h1 className="font-serif font-semibold text-2xl mb-6">Admin Access</h1>
      <input
        type="password"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Access code"
        className="w-full border border-border rounded-sm px-4 py-3.5 text-[15px] bg-paper-soft mb-4 focus:outline-none focus:ring-2 focus:ring-accent"
      />
      {error && <p className="text-[13px] text-team-red mb-4">Incorrect code.</p>}
      <button onClick={submit} className="w-full bg-jet text-paper-soft py-4 rounded-sm text-[13px] uppercase tracking-wide font-semibold">
        Enter
      </button>
    </section>
  );
}
