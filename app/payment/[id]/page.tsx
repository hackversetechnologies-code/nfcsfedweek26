"use client";
import { useEffect, useState } from "react";
import CopyButton from "@/components/CopyButton";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Settings {
  contribution_amount: number;
  bank_name: string;
  account_name: string;
  account_number: string;
}

export default function PaymentPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.from("event_settings").select("contribution_amount,bank_name,account_name,account_number").single().then(({ data }) => {
      if (data) setSettings(data as Settings);
    });
  }, []);

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registration_id: params.id,
          amount: settings?.contribution_amount ?? 2000
        })
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Submission failed");
      }
      setSubmitted(true);
    } catch (err: any) {
      setError(err?.message || "Your payment confirmation could not be sent. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <section className="max-w-[480px] mx-auto px-5 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent/20 text-accent flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={36} />
        </div>
        <p className="eyebrow text-accent mb-2">Transfer Claim Received</p>
        <h1 className="font-serif font-semibold text-3xl mb-4">Pending Verification</h1>
        <p className="text-[14.5px] text-gray-dark leading-relaxed mb-8">
          Thank you! Your payment notice has been sent to the organizing team. Once verified against our bank account, your team assignment & digital ticket will be sent to your email.
        </p>

        <div className="bg-paper-soft border border-border p-5 rounded-md text-left mb-8 space-y-2 text-[13px]">
          <div className="flex justify-between">
            <span className="text-gray-muted">Registration ID:</span>
            <span className="font-mono font-medium text-jet">{params.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-muted">Status:</span>
            <span className="font-semibold text-accent uppercase tracking-wider text-[11px] bg-accent/10 px-2 py-0.5 rounded">Pending Admin Approval</span>
          </div>
        </div>

        <Link
          href={`/ticket/${params.id}`}
          className="inline-flex items-center gap-2 bg-jet text-paper-soft px-6 py-3.5 rounded-sm text-[13px] uppercase tracking-wider font-semibold hover:bg-accent transition-colors shadow-md"
        >
          <span>View Ticket Status Page</span>
          <ArrowRight size={16} />
        </Link>
      </section>
    );
  }

  return (
    <section className="max-w-[480px] mx-auto px-5 py-14">
      <div className="flex gap-4 mb-10">
        {["Details", "Payment", "Confirmation"].map((s, i) => (
          <div key={s} className="flex-1">
            <div className={`h-[2px] mb-2 ${i <= 1 ? "bg-jet" : "bg-border"}`} />
            <span className={`text-[10px] uppercase tracking-wide font-semibold ${i <= 1 ? "text-jet" : "text-gray-muted"}`}>
              {String(i + 1).padStart(2, "0")} {s}
            </span>
          </div>
        ))}
      </div>

      <p className="eyebrow mb-2">Step 2 of 3 &bull; Bank Transfer</p>
      <h1 className="font-serif font-semibold text-4xl mb-6">
        {settings ? `₦${settings.contribution_amount.toLocaleString()}` : "₦2,000"}
      </h1>

      <div className="bg-paper-soft border border-border rounded-md p-6 mb-6">
        <p className="text-[11px] uppercase tracking-widest font-bold text-gray-muted mb-4">Transfer Account Details</p>
        <div className="space-y-3.5">
          <Row label="Bank" value={settings?.bank_name ?? "First Bank of Nigeria"} />
          <Row label="Account Name" value={settings?.account_name ?? "Ogochukwu Stella Chimuanya"} />
          <Row label="Account Number" value={settings?.account_number ?? "3225195083"} />
        </div>

        <div className="mt-5">
          <CopyButton value={settings?.account_number ?? "3225195083"} />
        </div>
      </div>

      <div className="flex items-start gap-2.5 text-[12px] text-gray-dark bg-accent/10 border border-accent/20 p-3.5 rounded-sm mb-6">
        <ShieldCheck size={18} className="text-accent shrink-0 mt-0.5" />
        <span>After making the bank transfer on your mobile app or USSD code, click the button below to notify the organizers.</span>
      </div>

      {error && <p className="text-[13px] text-team-red font-medium mb-4">{error}</p>}

      <button
        onClick={submit}
        disabled={submitting}
        className="w-full bg-jet text-paper-soft py-4 rounded-sm text-[13px] uppercase tracking-wider font-semibold shadow-lg hover:bg-accent transition-colors disabled:opacity-60"
      >
        {submitting ? "Confirming Transfer…" : "I Have Made the Transfer"}
      </button>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-[14px] border-b border-border/50 pb-2.5 last:border-0 last:pb-0">
      <span className="text-gray-muted">{label}</span>
      <span className="font-semibold text-jet">{value}</span>
    </div>
  );
}
