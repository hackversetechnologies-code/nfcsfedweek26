"use client";
import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyButton({ value, label = "Copy Account Number" }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable — fail silently, number is still visible on screen
    }
  };

  return (
    <button
      onClick={copy}
      className="w-full flex items-center justify-center gap-2 bg-jet text-paper-soft py-4 rounded-sm text-[13px] uppercase tracking-wide font-semibold transition-transform active:scale-[.98]"
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
      {copied ? "Copied" : label}
    </button>
  );
}
