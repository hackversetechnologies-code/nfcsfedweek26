import Image from "next/image";
import Link from "next/link";
import { BookOpen, Shield, HeartHandshake, Award, Users, Church, Compass } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-paper min-h-screen pb-20">
      {/* HERO BANNER */}
      <section className="bg-jet text-paper-soft py-16 px-5 border-b border-border text-center relative overflow-hidden">
        <div className="max-w-[800px] mx-auto relative z-10">
          <p className="eyebrow text-accent mb-2">Our Heritage & Mission</p>
          <h1 className="font-serif font-semibold text-4xl sm:text-5xl md:text-6xl mb-4">
            Nigeria Federation of Catholic Students
          </h1>
          <p className="text-[16px] text-[#D0CEC7] leading-relaxed max-w-[640px] mx-auto font-serif italic">
            &ldquo;Christ Our Foundation, Love Our Mission&rdquo;
          </p>
        </div>
      </section>

      <section className="max-w-[960px] mx-auto px-5 pt-16">
        {/* MAIN OVERVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center mb-16">
          <div className="md:col-span-6 space-y-5 text-[15px] leading-relaxed text-gray-dark">
            <span className="eyebrow text-accent">Who We Are</span>
            <h2 className="font-serif font-semibold text-3xl text-jet">
              A Vibrant Catholic Community on Campus
            </h2>
            <p>
              The <strong>Nigeria Federation of Catholic Students (NFCS)</strong> is the umbrella body for all Catholic students studying across tertiary institutions in Nigeria. Founded with the solemn mandate of nurturing spiritual growth, moral excellence, and academic distinction, NFCS serves as a home away from home.
            </p>
            <p>
              At <strong>AEFUTHA 1</strong> (Alex Ekwueme Federal University Teaching Hospital Abakaliki 1), our local chapter thrives under the maternal patronage of <strong>Our Mother of Perpetual Help Chaplaincy</strong>.
            </p>
          </div>
          <div className="md:col-span-6 relative h-[340px] rounded-md overflow-hidden border border-border shadow-lg">
            <Image
              src="/images/hero-praise.jpg"
              alt="NFCS Community Fellowship"
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* CORE PILLARS */}
        <div className="mb-20">
          <p className="eyebrow text-center mb-2">Our Core Pillars</p>
          <h2 className="font-serif font-semibold text-3xl text-center mb-12">Driven by Faith, Built on Love</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-paper-soft border border-border p-7 rounded-sm">
              <Church className="text-accent mb-4" size={28} />
              <h3 className="font-serif font-semibold text-xl mb-2">Spiritual Growth</h3>
              <p className="text-[13.5px] text-gray-dark leading-relaxed">
                Daily Mass, adoration, retreats, and rosary devotions that deepen our relationship with Jesus Christ through Mary.
              </p>
            </div>

            <div className="bg-paper-soft border border-border p-7 rounded-sm">
              <Users className="text-accent mb-4" size={28} />
              <h3 className="font-serif font-semibold text-xl mb-2">Academic & Career Excellence</h3>
              <p className="text-[13.5px] text-gray-dark leading-relaxed">
                Mentorship, study groups, symposiums, and professional ethics workshops tailored for healthcare and academic success.
              </p>
            </div>

            <div className="bg-paper-soft border border-border p-7 rounded-sm">
              <HeartHandshake className="text-accent mb-4" size={28} />
              <h3 className="font-serif font-semibold text-xl mb-2">Charity & Mission</h3>
              <p className="text-[13.5px] text-gray-dark leading-relaxed">
                Reaching out to hospital patients, rural communities, and vulnerable individuals with food, medical aid, and prayer.
              </p>
            </div>
          </div>
        </div>

        {/* HISTORY SECTION */}
        <div className="bg-paper-soft border border-border rounded-md p-8 sm:p-12 mb-16">
          <div className="max-w-[760px]">
            <p className="eyebrow text-accent mb-2">History & Evolution</p>
            <h2 className="font-serif font-semibold text-3xl text-jet mb-6">The Legacy of NFCS</h2>
            <div className="space-y-4 text-[14.5px] text-gray-dark leading-relaxed">
              <p>
                NFCS traces its origins back decades to the early Catholic student movements across pioneer Nigerian universities. Established to unify Catholic students, protect their moral identity amidst secular campus challenges, and train patriotic Catholic leaders, NFCS has grown into a formidable national body under the Catholic Bishops' Conference of Nigeria (CBCN).
              </p>
              <p>
                Our national motto, <strong>&ldquo;Christ Our Foundation, Love Our Mission&rdquo;</strong>, encapsulates our dual duty: grounding our character firmly on Catholic doctrine while pouring out selfless love and service to society.
              </p>
              <p>
                Over the years, the AEFUTHA 1 chapter has produced compassionate doctors, nurses, medical laboratory scientists, administrators, and dedicated servant leaders serving across Nigeria and globally.
              </p>
            </div>
          </div>
        </div>

        {/* FEDERATION WEEK TRADITION */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center mb-16">
          <div className="md:col-span-6 relative h-[360px] rounded-md overflow-hidden border border-border shadow-lg order-2 md:order-1">
            <Image
              src="/images/hero-picnic.jpg"
              alt="Federation Week Celebration"
              fill
              className="object-cover"
            />
          </div>
          <div className="md:col-span-6 space-y-5 text-[15px] leading-relaxed text-gray-dark order-1 md:order-2">
            <span className="eyebrow text-accent">Annual Tradition</span>
            <h2 className="font-serif font-semibold text-3xl text-jet">
              What is Federation Week?
            </h2>
            <p>
              <strong>Federation Week</strong> is the highlight of the academic calendar for NFCS AEFUTHA 1. For seven consecutive days every September, academic stress takes a back seat as the entire Catholic student body comes together in solidarity.
            </p>
            <p>
              The week kicks off with <strong>Praise & Worship</strong>, transitions through academic debates, intense sports rivalries across four color teams (Green, Blue, Black, Red), community outreach, and culminates in the famous <strong>Grand Picnic</strong> on Saturday and solemn <strong>Monastery Visitation</strong> on Sunday.
            </p>
            <p>
              It is more than just events — it is where lifelong friendships are forged, team spirit is ignited, and faith is renewed.
            </p>
          </div>
        </div>

        {/* JOIN CALLOUT */}
        <div className="text-center bg-jet text-paper-soft p-10 rounded-md shadow-xl">
          <h3 className="font-serif font-semibold text-3xl mb-3">Be Part of Federation Week 2026</h3>
          <p className="text-[14px] text-[#D0CEC7] mb-8 max-w-[540px] mx-auto font-serif italic">
            Join hundreds of Catholic students for a week of transformation, sports, picnic, and spiritual renewal.
          </p>
          <Link
            href="/register"
            className="inline-block bg-accent hover:bg-emerald-700 text-paper-soft px-8 py-4 text-[13px] uppercase tracking-wider font-semibold rounded-sm transition-transform hover:scale-105"
          >
            Register Now (₦2,000)
          </Link>
        </div>
      </section>
    </div>
  );
}
