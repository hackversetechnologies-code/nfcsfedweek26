"use client";

export default function ShareTicket({ url, name }: { url: string; name: string }) {
  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title: "NFCS Federation Week 2026", text: `${name}'s Federation Week ticket`, url });
      } catch {}
    } else {
      await navigator.clipboard.writeText(url);
    }
  }
  return (
    <button onClick={share} className="flex-1 border border-border py-3.5 rounded-sm text-[13px] uppercase tracking-wide font-semibold">
      Share Ticket
    </button>
  );
}
