import { createClient } from "@/lib/supabase/server";
import Countdown from "@/components/Countdown";
import HeroSlideshow from "@/components/HeroSlideshow";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Users, Shuffle, Ticket, HandHeart, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

const WEEK = [
  { day: "Monday", title: "Praise & Worship Day", note: "Opens the week — worship as a federation, uniting all classes, departments, and levels." },
  { day: "Tuesday", title: "Debate · Spelling Bee · Quiz", note: "Friendly academic competition — bragging rights on the line between departments." },
  { day: "Wednesday", title: "Sports Day", note: "Team colours come out in force. Football, athletics, and energetic field games." },
  { day: "Thursday", title: "Community Outreach", note: "The Federation steps outside itself for a meaningful day of charitable service." },
  { day: "Friday", title: "Symposium & Spiritual Workshop", note: "A reflective day of keynote talks, panel discussions, and personal growth before the picnic." },
  { day: "Saturday", title: "The Grand Picnic", note: "The big one. Four teams, one field, food, music, and unforgettable fellowship.", picnic: true },
  { day: "Sunday", title: "Thanksgiving & Monastery Visitation", note: "The week closes in worship — Thanksgiving Mass followed by Monastery Visitation." }
];

const FACTS = [
  { n: "07", label: "Days of Federation Week, back to back" },
  { n: "04", label: "Picnic teams, balanced automatically as people register" },
  { n: "01", label: "Chaplaincy — Our Mother of Perpetual Help, AEFUTHA 1" },
  { n: "₦2K", label: "Contribution to take part in the full week" }
];

const FAQ = [
  { q: "How much does it cost to join?", a: "₦2,000 covers your place across the week. Payment is by direct bank transfer, confirmed manually by the organizing team." },
  { q: "How is my picnic team decided?", a: "Automatically, and fairly. Once your payment is approved, you're placed on whichever active team currently has the fewest members — picked at random among the lowest. No favourites, no reshuffling afterward." },
  { q: "Do I need to print anything?", a: "No. Your ticket lives on your phone with a QR code, ready to show at the door." },
  { q: "What if I already made the transfer but haven't heard back?", a: "Payments are checked by hand against the bank account, so there can be a short wait. You'll get an email the moment yours is approved." }
];

export default async function Home() {
  const supabase = createClient();

  let settings = null;
  let teams = null;
  let joinedCount = 0;

  try {
    const { data: s } = await supabase.from("event_settings").select("*").single();
    settings = s;
    const { data: t } = await supabase.from("teams").select("id,name,colour,hex").eq("active", true).order("order");
    teams = t;
    const { count: c } = await supabase
      .from("registrations")
      .select("*", { count: "exact", head: true })
      .eq("status", "approved");
    joinedCount = c ?? 0;
  } catch (e) {
    // Gracefully handle uninitialized database
  }

  const startDate = settings?.start_date ? new Date(settings.start_date).toISOString() : "2026-09-21T00:00:00";
  const picnicDate = settings?.picnic_date ? new Date(settings.picnic_date).toISOString() : "2026-09-26T00:00:00";

  return (
    <>
      {/* HERO SECTION */}
      <section className="max-w-[1120px] mx-auto px-5 pt-10 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[12px] uppercase tracking-widest font-semibold mb-4">
          <Sparkles size={14} /> Nigeria Federation of Catholic Students
        </div>
        
        <p className="text-[12px] tracking-widest uppercase text-gray-muted mb-5 font-medium">
          AEFUTHA 1 &middot; Our Mother of Perpetual Help Chaplaincy
        </p>

        <h1 className="font-serif font-semibold text-[clamp(48px,14vw,88px)] leading-[.92] -tracking-[.01em]">
          NFCS
          <span className="block text-[clamp(22px,6vw,32px)] font-medium uppercase tracking-widest mt-3 text-accent">
            Federation Week 2026
          </span>
        </h1>

        <p className="font-serif italic text-[clamp(18px,4.6vw,24px)] leading-snug my-6 text-gray-dark">
          &ldquo;Christ Our Foundation, Love Our Mission&rdquo;
        </p>

        <div className="flex items-center justify-center gap-3 text-[13px] tracking-widest uppercase font-semibold text-gray-dark mb-8">
          <span>21&ndash;27 September</span><span className="w-1.5 h-1.5 rounded-full bg-accent" /><span>2026</span>
        </div>

        {/* HERO SLIDESHOW COMPONENT */}
        <HeroSlideshow />

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-[420px] mx-auto">
          <Link href="/register" className="w-full sm:w-auto flex-1 bg-jet text-paper-soft py-4 px-7 rounded-sm text-[13px] uppercase tracking-wider font-semibold text-center transition-all hover:bg-accent active:scale-[.98] shadow-md">
            Join the Federation
          </Link>
          <Link href="/schedule" className="w-full sm:w-auto flex-1 border border-border bg-paper py-4 px-7 rounded-sm text-[13px] uppercase tracking-wider font-semibold text-center transition-all hover:border-jet active:scale-[.98]">
            Explore Schedule
          </Link>
        </div>
      </section>

      {/* COUNTDOWN */}
      <div className="max-w-[640px] mx-auto px-5 mt-4 mb-16">
        <p className="text-center text-[11px] tracking-widest uppercase text-gray-muted mb-4 font-semibold">Federation Week begins in</p>
        <Countdown target={startDate} />
      </div>

      {/* FEATURED HIGHLIGHT GALLERIES */}
      <section className="bg-paper-soft border-y border-border py-16">
        <div className="max-w-[1120px] mx-auto px-5">
          <div className="text-center mb-12">
            <p className="eyebrow text-accent mb-2">Week Highlights</p>
            <h2 className="font-serif font-semibold text-3xl sm:text-4xl">Experience the Energy & Spiritual Vibe</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-paper border border-border rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-48">
                <Image src="/images/hero-praise.jpg" alt="Praise & Worship" fill className="object-cover" />
              </div>
              <div className="p-6">
                <span className="text-[10px] uppercase tracking-widest text-accent font-bold">Monday Event</span>
                <h3 className="font-serif font-semibold text-xl mt-1 mb-2">Praise & Worship</h3>
                <p className="text-[13px] text-gray-dark leading-relaxed">Gathering as one body in song, praise, and adoration to kickstart Federation Week.</p>
              </div>
            </div>

            <div className="bg-paper border border-border rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-48">
                <Image src="/images/hero-sports.jpg" alt="Sports Day" fill className="object-cover" />
              </div>
              <div className="p-6">
                <span className="text-[10px] uppercase tracking-widest text-accent font-bold">Wednesday Event</span>
                <h3 className="font-serif font-semibold text-xl mt-1 mb-2">Sports & Team Battles</h3>
                <p className="text-[13px] text-gray-dark leading-relaxed">Rep your color in football, track events, and exciting field games.</p>
              </div>
            </div>

            <div className="bg-paper border border-border rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative h-48">
                <Image src="/images/schedule-monastery.jpg" alt="Monastery Visit" fill className="object-cover" />
              </div>
              <div className="p-6">
                <span className="text-[10px] uppercase tracking-widest text-accent font-bold">Sunday Excursion</span>
                <h3 className="font-serif font-semibold text-xl mt-1 mb-2">Monastery Visitation</h3>
                <p className="text-[13px] text-gray-dark leading-relaxed">A sacred, tranquil visit to the monastery exclusively on Sunday following Thanksgiving Mass.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY JOIN */}
      <section className="max-w-[1120px] mx-auto px-5 py-20">
        <div className="mb-10">
          <p className="eyebrow mb-2">Why Join</p>
          <h2 className="font-serif font-semibold text-[clamp(30px,7vw,44px)]">A week built around us.</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border border border-border">
          {[
            { icon: Users, title: "One Federation", text: "Every department, every level, on the same field for once." },
            { icon: Shuffle, title: "Fair Teams", text: "Balanced automatically — no one is stacking a team in their favour." },
            { icon: HandHeart, title: "Faith First", text: "Worship, outreach, reflection, and monastery visitation carry the week." },
            { icon: Ticket, title: "Simple to Join", text: "Three steps, a bank transfer, and a digital ticket on your phone." }
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="bg-paper p-7">
              <Icon size={20} className="text-accent mb-4" strokeWidth={1.5} />
              <div className="font-semibold text-[15px] mb-1.5">{title}</div>
              <div className="text-[13px] text-gray-dark leading-relaxed">{text}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FUN FACTS LEDGER */}
      <section className="bg-paper-soft border-y border-border">
        <div className="max-w-[1120px] mx-auto px-5 py-16">
          <p className="eyebrow text-center mb-10">Federation Week, by the Numbers</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {FACTS.map((f) => (
              <div key={f.label}>
                <div className="font-serif font-semibold text-[clamp(30px,7vw,44px)] leading-none text-jet">{f.n}</div>
                <div className="text-[12px] text-gray-dark mt-3 leading-relaxed font-medium">{f.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE WEEK SCHEDULE PREVIEW */}
      <section id="week" className="max-w-[1120px] mx-auto px-5 py-20">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2">21&ndash;27 September 2026</p>
            <h2 className="font-serif font-semibold text-[clamp(30px,7vw,44px)]">The Week Schedule</h2>
          </div>
          <Link href="/schedule" className="text-[12px] uppercase tracking-wider font-bold text-accent hover:underline">
            View Full Day-by-Day Breakdown &rarr;
          </Link>
        </div>
        <div className="border-t border-border">
          {WEEK.map((item, i) => (
            <div
              key={item.day}
              className={`grid grid-cols-[44px_1fr] gap-4 py-6 border-b border-border transition-colors ${item.picnic ? "bg-paper-soft -mx-5 px-5" : ""}`}
            >
              <div className={`font-serif text-xl font-semibold ${item.picnic ? "text-jet" : "text-accent"}`}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wide text-gray-muted mb-1 font-semibold">{item.day}</div>
                <div className={`text-[17px] font-semibold -tracking-[.005em] ${item.picnic ? "text-jet" : ""}`}>{item.title}</div>
                <div className="text-[13px] text-gray-dark mt-1.5 leading-relaxed">{item.note}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PICNIC SECTION */}
      <section id="picnic" className="bg-jet text-paper-soft py-20 px-5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <Image src="/images/hero-picnic.jpg" alt="Picnic background" fill className="object-cover" />
        </div>
        <div className="max-w-[640px] mx-auto text-center relative z-10">
          <p className="eyebrow text-accent mb-2">The Picnic</p>
          <h2 className="font-serif font-semibold text-[clamp(38px,10vw,60px)] mb-1.5">Saturday</h2>
          <p className="text-[13px] tracking-widest uppercase text-[#B8B8B0] mb-9 font-medium">26 September 2026</p>
          <p className="text-[11px] tracking-widest uppercase text-[#B8B8B0] mb-5 font-semibold">Picnic begins in</p>
          <Countdown target={picnicDate} dark />
          <p className="font-serif italic text-xl leading-relaxed my-9 text-[#E9E7DF]">
            One week.<br />One community.<br />One Federation.
          </p>
          <div className="flex justify-center gap-3.5 mb-8">
            {(teams ?? [{ id: "1", name: "Team Green", hex: "#3E6B4F" }, { id: "2", name: "Team Blue", hex: "#2E4E7E" }, { id: "3", name: "Team Black", hex: "#1A1A1A" }, { id: "4", name: "Team Red", hex: "#8C3A32" }]).map((t: any) => (
              <span key={t.id} title={t.name || "Team"} className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: t.hex }} />
            ))}
          </div>
          <Link href="/register" className="inline-block bg-accent hover:bg-emerald-700 text-paper-soft px-8 py-4 rounded-sm text-[13px] uppercase tracking-wider font-semibold shadow-lg transition-transform hover:scale-105">
            Get Your Picnic Ticket
          </Link>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="max-w-[1120px] mx-auto px-5 py-20 text-center">
        <div className="font-serif font-semibold text-[clamp(40px,10vw,56px)] text-accent">{joinedCount}</div>
        <p className="text-[13px] tracking-wider text-gray-dark mt-1.5 font-medium uppercase">Catholic Students registered for Federation Week</p>
      </section>

      {/* FAQ */}
      <section className="max-w-[720px] mx-auto px-5 pb-20">
        <div className="mb-10 text-center">
          <p className="eyebrow mb-2">Before You Join</p>
          <h2 className="font-serif font-semibold text-[clamp(28px,6vw,38px)]">A Few Questions</h2>
        </div>
        <div className="border-t border-border">
          {FAQ.map((item) => (
            <details key={item.q} className="group border-b border-border py-5">
              <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-[15px]">
                {item.q}
                <span className="text-accent text-lg transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="text-[13px] text-gray-dark leading-relaxed mt-3">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="max-w-[1120px] mx-auto px-5 pb-14 flex items-center justify-center gap-2 text-[11px] uppercase tracking-wide text-gray-muted font-medium">
        <ShieldCheck size={14} className="text-accent" />
        Payments verified by hand. Your data stays with the organizing team.
      </div>

      <div className="md:hidden fixed left-0 right-0 bottom-0 z-50 bg-paper/95 backdrop-blur border-t border-border p-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
        <Link href="/register" className="block text-center bg-jet text-paper-soft py-3.5 rounded-sm text-[13px] uppercase tracking-wider font-semibold shadow-md">
          Join the Week
        </Link>
      </div>
      <div className="h-[76px] md:hidden" />
    </>
  );
}
