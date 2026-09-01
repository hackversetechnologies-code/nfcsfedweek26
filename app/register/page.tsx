"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const steps = ["Details", "Review", "Payment"];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ full_name: "", email: "", phone: "", department: "", level: "" });

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const canContinue = form.full_name.trim() && form.email.trim() && form.phone.trim();

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong while creating your registration.");
      }
      router.push(`/payment/${data.id}`);
    } catch (err: any) {
      setError(err?.message || "Something went wrong while creating your registration. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <section className="max-w-[480px] mx-auto px-5 py-14">
      <p className="eyebrow mb-2">Join the Federation</p>
      <h1 className="font-serif font-semibold text-3xl mb-8">Register</h1>

      <div className="flex gap-4 mb-10">
        {steps.map((s, i) => (
          <div key={s} className="flex-1">
            <div className={`h-[2px] mb-2 ${i <= step ? "bg-jet" : "bg-border"}`} />
            <span className={`text-[10px] uppercase tracking-wide ${i <= step ? "text-charcoal" : "text-gray-muted"}`}>
              {String(i + 1).padStart(2, "0")} {s}
            </span>
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-4">
          <Field label="Full Name" value={form.full_name} onChange={(v) => update("full_name", v)} required />
          <Field label="Email" type="email" value={form.email} onChange={(v) => update("email", v)} required />
          <Field label="Phone Number" type="tel" value={form.phone} onChange={(v) => update("phone", v)} required />
          <Field label="Department / Class" value={form.department} onChange={(v) => update("department", v)} />
          <Field label="Level" value={form.level} onChange={(v) => update("level", v)} />
          <button
            disabled={!canContinue}
            onClick={() => setStep(1)}
            className="w-full bg-jet text-paper-soft py-4 rounded-sm text-[13px] uppercase tracking-wide font-semibold mt-4 disabled:opacity-40"
          >
            Continue
          </button>
        </div>
      )}

      {step === 1 && (
        <div>
          <div className="border border-border rounded-sm divide-y divide-border mb-8">
            <Row label="Full Name" value={form.full_name} />
            <Row label="Email" value={form.email} />
            <Row label="Phone" value={form.phone} />
            {form.department && <Row label="Department" value={form.department} />}
            {form.level && <Row label="Level" value={form.level} />}
          </div>
          {error && <p className="text-[13px] text-team-red mb-4">{error}</p>}
          <div className="flex gap-3">
            <button onClick={() => setStep(0)} className="flex-1 border border-border py-4 rounded-sm text-[13px] uppercase tracking-wide font-semibold">
              Back
            </button>
            <button
              onClick={submit}
              disabled={submitting}
              className="flex-[2] bg-jet text-paper-soft py-4 rounded-sm text-[13px] uppercase tracking-wide font-semibold disabled:opacity-60"
            >
              {submitting ? "Creating Registration…" : "Continue to Payment"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function Field({ label, value, onChange, type = "text", required = false }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="block text-[11px] uppercase tracking-wide text-gray-muted mb-1.5">
        {label}{required && <span className="text-team-red"> *</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-border rounded-sm px-4 py-3.5 text-[15px] bg-paper-soft focus:outline-none focus:ring-2 focus:ring-accent"
      />
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between px-4 py-3.5 text-[14px]">
      <span className="text-gray-muted">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
