import { createServiceClient } from "@/lib/supabase/server";
import QRCode from "qrcode";
import ShareTicket from "@/components/ShareTicket";

export default async function TicketPage({ params }: { params: { id: string } }) {
  const supabase = createServiceClient();

  const { data: reg } = await supabase.from("registrations").select("*").eq("id", params.id).single();
  const { data: ticket } = await supabase.from("tickets").select("*").eq("registration_id", params.id).single();
  const { data: team } = reg?.team_id ? await supabase.from("teams").select("*").eq("id", reg.team_id).single() : { data: null };

  if (!reg) {
    return <section className="max-w-[440px] mx-auto px-5 py-20 text-center text-gray-dark">Registration not found.</section>;
  }

  if (reg.status !== "approved" || !ticket) {
    return (
      <section className="max-w-[440px] mx-auto px-5 py-20 text-center">
        <p className="eyebrow mb-3">Status</p>
        <h1 className="font-serif font-semibold text-2xl mb-4">
          {reg.status === "rejected" ? "Payment Not Verified" : "Pending Verification"}
        </h1>
        <p className="text-[15px] text-gray-dark leading-relaxed">
          {reg.status === "rejected"
            ? "We couldn't verify a payment for this registration. Please contact the organizing team."
            : "Your ticket will appear here as soon as your payment is approved."}
        </p>
      </section>
    );
  }

  const qrDataUrl = await QRCode.toDataURL(ticket.qr_token, { margin: 1, width: 220, color: { dark: "#0B0B0B", light: "#00000000" } });
  const teamHex = team?.hex ?? "#454545";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

  return (
    <section className="max-w-[420px] mx-auto px-5 py-14">
      <div className="border border-border rounded-md overflow-hidden bg-paper-soft">
        <div className="p-7 text-center" style={{ borderBottom: `3px solid ${teamHex}` }}>
          <p className="eyebrow mb-1">NFCS Federation Week 2026</p>
          <p className="font-serif italic text-[13px] text-gray-dark">Christ Our Foundation, Love Our Mission</p>
        </div>

        <div className="p-7">
          <div className="text-center mb-6">
            <div className="font-serif font-semibold text-2xl">{reg.full_name}</div>
            <div className="inline-flex items-center gap-1.5 mt-2 text-[12px] uppercase tracking-wide font-semibold" style={{ color: teamHex }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: teamHex }} />
              {team?.name ?? "Team Pending"}
            </div>
          </div>

          <div className="flex justify-center mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrDataUrl} alt="Ticket QR code" width={180} height={180} />
          </div>

          <div className="text-center text-[13px] tracking-wide text-gray-dark mb-1">{ticket.ticket_code}</div>
          <div className="text-center text-[11px] uppercase tracking-wide text-gray-muted">21&ndash;27 September 2026</div>
          <div className="text-center text-[11px] uppercase tracking-wide text-gray-muted mt-1">OMPH Chaplaincy &middot; AEFUTHA 1</div>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <ShareTicket url={`${siteUrl}/ticket/${reg.id}`} name={reg.full_name} />
      </div>
    </section>
  );
}
