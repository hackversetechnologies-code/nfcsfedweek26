"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminBar() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  }
  return (
    <div className="border-b border-border bg-paper-soft">
      <div className="max-w-[960px] mx-auto px-5 py-3 flex items-center justify-between text-[12px] uppercase tracking-wide font-semibold">
        <Link href="/admin">NFCS Admin</Link>
        <button onClick={logout} className="text-gray-muted">Log Out</button>
      </div>
    </div>
  );
}
