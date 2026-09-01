"use client";
import { useEffect, useState } from "react";
import CopyButton from "@/components/CopyButton";
import { createClient } from "@/lib/supabase/client";

interface Settings {
  contribution_amount: number;
  bank_name: string;
  account_name: string;
  account_number: string;
}

export default function PaymentPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ bank_used: "", sender_name: "", transaction_reference: "", transfer_time: "" });

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
        body: JSON.stringify({ registration_id: params.id, amount: settings?.contribution_amount, ...form })
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setError("Your payment information was not submitted. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <section className="max-w-[440px] mx-auto px-5 py-20 text-center">
        <p className="eyebrow mb-3">Status</p>
        <h1 className="font-serif font-semibold text-3xl mb-4">Pending Verification</h1>
        <p className="text-[15px] text-gray-dark leading-relaxed">
          Thank you. Your transfer details have been submitted. The organizing team checks payments by
          hand — you&rsquo;ll get an email the moment yours is approved, and your ticket will appear at{" "}
          <a href={`/ticket/${params.id}`} className="underline">this link</a>.
        </p>
      </section>
    );
  }

  return (
    <section className="max-w-[440px] mx-auto px-5 py-14">
      <div className="flex gap-4 mb-10">
        {["Details", "Payment", "Confirmation"].map((s, i) => (
          <div key={s} className="flex-1">
            <div className={`h-[2px] mb-2 ${i <= 1 ? "bg-jet" : "bg-border"}`} />
            <span className={`text-[10px] uppercase tracking-wide ${i <= 1 ? "text-charcoal" : "text-gray-muted"}`}>
              {String(i + 1).padStart(2, "0")} {s}
            </span>
          </div>
        ))}
      </div>

      <p className="eyebrow mb-2">Your Registration Is Ready</p>
      <h1 className="font-serif font-semibold text-3xl mb-8">
        {settings ? `₦${settings.contribution_amount.toLocaleString()}` : "…"}
      </h1>

      {!showForm ? (
        <>
          <div className="border border-border rounded-sm divide-y divide-border mb-6">
            <Row label="Bank" value={settings?.bank_name ?? "…"} />
            <Row label="Account Name" value={settings?.account_name ?? "…"} />
            <Row label="Account Number" value={settings?.account_number ?? "…"} />
          </div>
          {settings && <CopyButton value={settings.account_number} />}
          <p className="text-[12px] text-gray-muted mt-4 leading-relaxed">
            Payment verification is manual. Once you&rsquo;ve made the transfer, confirm it below.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="w-full border border-border py-4 rounded-sm text-[13px] uppercase tracking-wide font-semibold mt-6"
          >
            I Have Made the Transfer
          </button>
        </>
      ) : (
        <div className="space-y-4">
          <Field label="Bank Used" value={form.bank_used} onChange={(v) => setForm((f) => ({ ...f, bank_used: v }))} />
          <Field label="Sender Name" value={form.sender_name} onChange={(v) => setForm((f) => ({ ...f, sender_name: v }))} />
          <Field label="Transaction Reference" value={form.transaction_reference} onChange={(v) => setForm((f) => ({ ...f, transaction_reference: v }))} />
          <Field label="Approx. Transfer Time" type="datetime-local" value={form.transfer_time} onChange={(v) => setForm((f) => ({ ...f, transfer_time: v }))} />
          {error && <p className="text-[13px] text-team-red">{error}</p>}
          <button
            onClick={submit}
            disabled={submitting}
            className="w-full bg-jet text-paper-soft py-4 rounded-sm text-[13px] uppercase tracking-wide font-semibold disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Payment for Verification"}
          </button>
        </div>
      )}
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between px-4 py-3.5 text-[14px]">
      <span className="text-gray-muted">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-wide text-gray-muted mb-1.5">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-border rounded-sm px-4 py-3.5 text-[15px] bg-paper-soft focus:outline-none focus:ring-2 focus:ring-accent"
      />
    </label>
  );
}
