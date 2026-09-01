import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, MapPin, Sparkles, CheckCircle2 } from "lucide-react";

const DETAILED_WEEK = [
  {
    day: "Monday",
    date: "21 September 2026",
    title: "Praise & Worship Day",
    time: "4:00 PM – 7:00 PM",
    venue: "Our Mother of Perpetual Help Chaplaincy Auditorium",
    image: "/images/hero-praise.jpg",
    desc: "The week opens in solemn worship and joyous praise. As one undivided Federation across all departments and levels, we gather to seek God's presence, listen to the Chaplain's welcome address, and lift up prayers for a fruitful week ahead.",
    highlights: ["Opening Mass & Adoration", "Federation Choir Performances", "Presidential Welcome Address", "Praise & Intercession"]
  },
  {
    day: "Tuesday",
    date: "22 September 2026",
    title: "Academic Showdown: Debate · Quiz · Spelling Bee",
    time: "3:30 PM – 6:30 PM",
    venue: "Chaplaincy Multipurpose Hall",
    image: "/images/schedule-quiz.jpg",
    desc: "Intellectual bragging rights are put on the line! Departmental representatives lock horns in high-stakes debates on contemporary Catholic ethics, a rigorous doctrine quiz, and a fast-paced spelling bee competition.",
    highlights: ["Inter-Departmental Debate", "Catholic Doctrine & General Knowledge Quiz", "Spelling Bee Final", "Trophy Presentation"]
  },
  {
    day: "Wednesday",
    date: "23 September 2026",
    title: "Sports Day & Inter-Team Battles",
    time: "2:00 PM – 6:30 PM",
    venue: "AEFUTHA 1 Main Sports Pitch",
    image: "/images/hero-sports.jpg",
    desc: "Team Green, Team Blue, Team Black, and Team Red enter the arena! A high-energy day of sportsmanship featuring competitive football matches, 100m/200m track sprints, tug-of-war, and fun field challenges.",
    highlights: ["Inter-Team Football Championship", "Track & Athletics Sprints", "Tug-of-War Showdown", "Cheerleading & Team Spirit Awards"]
  },
  {
    day: "Thursday",
    date: "24 September 2026",
    title: "Community Outreach & Hospital Visit",
    time: "10:00 AM – 2:00 PM",
    venue: "AEFUTHA 1 Hospital Wards & Local Community",
    image: "/images/schedule-outreach.jpg",
    desc: "Embodying our motto 'Love Our Mission'. Catholic students step beyond campus walls to share love, donate medical care supplies, food baskets, and pray with hospital patients and less privileged community members.",
    highlights: ["Hospital Ward Visitation & Care Packages", "Charity Outreaches", "Prayer Support for Patients", "Community Service"]
  },
  {
    day: "Friday",
    date: "25 September 2026",
    title: "Symposium & Spiritual Workshop",
    time: "4:00 PM – 7:30 PM",
    venue: "Chaplaincy Main Auditorium",
    image: "/images/hero-praise.jpg",
    desc: "A reflective, enriching evening featuring keynote presentations by distinguished alumni and spiritual directors. Topics cover career development, Christian ethics in medical/professional practice, followed by interactive breakout groups and Christian movie night.",
    highlights: ["Keynote Address by Guest Speaker", "Career & Faith Workshop", "Interactive Q&A Session", "Evening Fellowship & Movie Night"]
  },
  {
    day: "Saturday",
    date: "26 September 2026",
    title: "The Grand Picnic",
    time: "10:00 AM – 6:00 PM",
    venue: "Federation Picnic Grounds",
    image: "/images/hero-picnic.jpg",
    picnic: true,
    desc: "The hallmark event of Federation Week! All four picnic teams unite for a memorable day of non-stop excitement, buffet meals, live DJ music, comedy, cultural dance performances, team games, and networking.",
    highlights: ["Grand Picnic Feast & Barbecue", "Team Championship Trophy Presentation", "Cultural Dance & Drama", "Live Music & DJ Performances"]
  },
  {
    day: "Sunday",
    date: "27 September 2026",
    title: "Thanksgiving Mass & Monastery Visitation",
    time: "8:00 AM – 3:00 PM",
    venue: "Chaplaincy Mass followed by Excursion to Monastery",
    image: "/images/schedule-monastery.jpg",
    desc: "We conclude Federation Week in deep gratitude and divine quietude. Following the Holy Thanksgiving Mass at Our Mother of Perpetual Help Chaplaincy, students embark on an excursion for Monastery Visitation — a peaceful retreat for silent prayer and contemplation.",
    highlights: ["Solemn Thanksgiving High Mass", "Official Excursion to the Monastery", "Silent Prayer & Rosary Walk", "Final Blessing & Farewell"]
  }
];

export default function SchedulePage() {
  return (
    <div className="bg-paper min-h-screen pb-20">
      {/* HEADER BANNER */}
      <section className="bg-jet text-paper-soft py-16 px-5 border-b border-border text-center relative overflow-hidden">
        <div className="max-w-[760px] mx-auto relative z-10">
          <p className="eyebrow text-accent mb-2">21 &ndash; 27 September 2026</p>
          <h1 className="font-serif font-semibold text-4xl sm:text-5xl md:text-6xl mb-4">
            Federation Week Schedule
          </h1>
          <p className="text-[15px] text-[#D0CEC7] leading-relaxed max-w-[600px] mx-auto font-serif italic">
            &ldquo;Seven days of worship, academic rigor, athletic rivalry, service, and serene retreat.&rdquo;
          </p>
        </div>
      </section>

      {/* SCHEDULE LISTING */}
      <section className="max-w-[960px] mx-auto px-5 pt-16">
        <div className="space-y-12">
          {DETAILED_WEEK.map((item, idx) => (
            <div
              key={item.day}
              className={`border border-border rounded-md overflow-hidden bg-paper-soft shadow-sm hover:shadow-md transition-shadow ${
                item.picnic ? "ring-2 ring-accent" : ""
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-12">
                {/* Visual Image Banner */}
                <div className="md:col-span-5 relative h-56 md:h-auto min-h-[220px]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover object-center"
                  />
                  <div className="absolute top-3 left-3 bg-jet/90 text-paper-soft text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-sm backdrop-blur">
                    Day {String(idx + 1).padStart(2, "0")} &middot; {item.day}
                  </div>
                </div>

                {/* Content */}
                <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between bg-paper">
                  <div>
                    <div className="flex flex-wrap items-center gap-3 text-[12px] text-gray-muted font-medium mb-2">
                      <span className="flex items-center gap-1 text-accent font-semibold">
                        <Calendar size={14} /> {item.date}
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> {item.time}
                      </span>
                    </div>

                    <h2 className="font-serif font-semibold text-2xl text-jet mb-2">
                      {item.title}
                    </h2>

                    <div className="flex items-start gap-1.5 text-[12px] text-gray-dark mb-4 bg-paper-soft p-2.5 rounded border border-border">
                      <MapPin size={15} className="text-accent shrink-0 mt-0.5" />
                      <span>{item.venue}</span>
                    </div>

                    <p className="text-[14px] text-gray-dark leading-relaxed mb-6">
                      {item.desc}
                    </p>

                    {/* Highlights */}
                    <div className="space-y-1.5 mb-6">
                      <p className="text-[11px] uppercase tracking-widest font-bold text-gray-muted mb-2">Event Highlights:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {item.highlights.map((h) => (
                          <div key={h} className="flex items-center gap-2 text-[12.5px] text-jet font-medium">
                            <CheckCircle2 size={14} className="text-accent shrink-0" />
                            <span>{h}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {item.picnic && (
                    <div className="pt-4 border-t border-border flex items-center justify-between">
                      <span className="text-[12px] font-semibold text-accent uppercase tracking-wider">Pass required for entry</span>
                      <Link
                        href="/register"
                        className="bg-jet text-paper-soft px-5 py-2.5 text-[12px] uppercase tracking-wider font-semibold rounded-sm hover:bg-accent transition-colors"
                      >
                        Register for Pass
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CALL TO ACTION */}
        <div className="mt-16 text-center bg-paper-soft border border-border p-10 rounded-md">
          <h3 className="font-serif font-semibold text-2xl mb-2">Ready to Be Part of Federation Week?</h3>
          <p className="text-[14px] text-gray-dark mb-6 max-w-[500px] mx-auto">
            Registration is ₦2,000 only and covers all events, picnic team allocation, and ticket pass.
          </p>
          <Link
            href="/register"
            className="inline-block bg-jet text-paper-soft px-8 py-4 text-[13px] uppercase tracking-wider font-semibold rounded-sm hover:bg-accent transition-colors shadow-md"
          >
            Register Now
          </Link>
        </div>
      </section>
    </div>
  );
}
