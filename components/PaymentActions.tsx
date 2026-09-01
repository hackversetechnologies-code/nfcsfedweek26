"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PaymentActions({ paymentId }: { paymentId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState<"approve" | "reject" | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function act(action: "approve" | "reject") {
    setBusy(action);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_id: paymentId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (action === "approve") {
        setMessage(data.email_sent ? "Payment approved. Email sent." : "Payment approved. Email pending — you can retry later.");
      } else {
        setMessage("Payment rejected.");
      }
      setTimeout(() => router.refresh(), 900);
    } catch {
      setMessage(action === "approve" ? "Approval failed. Please try again." : "Rejection failed. Please try again.");
      setBusy(null);
    }
  }

  return (
    <div>
      <div className="flex gap-3">
        <button
          onClick={() => act("reject")}
          disabled={busy !== null}
          className="flex-1 border border-border py-3.5 rounded-sm text-[13px] uppercase tracking-wide font-semibold disabled:opacity-50"
        >
          {busy === "reject" ? "Rejecting…" : "Reject"}
        </button>
        <button
          onClick={() => act("approve")}
          disabled={busy !== null}
          className="flex-[2] bg-jet text-paper-soft py-3.5 rounded-sm text-[13px] uppercase tracking-wide font-semibold disabled:opacity-60"
        >
          {busy === "approve" ? "Approving…" : "Approve"}
        </button>
      </div>
      {message && <p className="text-[12px] text-gray-dark mt-3">{message}</p>}
    </div>
  );
}
