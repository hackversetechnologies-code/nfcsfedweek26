"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, ChevronDown, ChevronUp } from "lucide-react";

interface TeamMember {
  displayName: string;
  department: string | null;
}

interface Team {
  id: string;
  name: string;
  hex: string;
  colour: string;
  memberCount: number;
  members: TeamMember[];
}

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [totalApproved, setTotalApproved] = useState(0);
  const [loading, setLoading] = useState(true);
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/public/stats", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => {
        setTeams(data.teams ?? []);
        setTotalApproved(data.totalApproved ?? 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="max-w-[860px] mx-auto px-5 py-16 pb-24">
      {/* Header */}
      <p className="eyebrow mb-2">Picnic Teams</p>
      <h1 className="font-serif font-semibold text-[clamp(32px,8vw,52px)] mb-3">
        The Four Teams
      </h1>
      <p className="text-[14px] text-gray-dark leading-relaxed mb-10 max-w-[560px]">
        Every approved member is automatically balanced across these four teams.
        Find your name below once your payment is confirmed by the organizing team.
      </p>

      {/* Total count banner */}
      {!loading && totalApproved > 0 && (
        <div className="flex items-center gap-3 bg-accent/10 border border-accent/20 text-accent px-5 py-3.5 rounded-md mb-10 text-[13px] font-semibold">
          <Users size={18} className="shrink-0" />
          <span>
            <strong>{totalApproved}</strong> student{totalApproved !== 1 ? "s" : ""} registered & approved so far
          </span>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-border animate-pulse rounded-sm" />
          ))}
        </div>
      )}

      {/* Team Cards */}
      {!loading && (
        <div className="space-y-4">
          {teams.map((t) => {
            const isOpen = expandedTeam === t.id;
            return (
              <div
                key={t.id}
                className="border border-border rounded-md overflow-hidden bg-paper-soft shadow-sm transition-all"
              >
                {/* Team Header — click to expand */}
                <button
                  onClick={() => setExpandedTeam(isOpen ? null : t.id)}
                  className="w-full flex items-center justify-between px-5 py-5 hover:bg-paper transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <span
                      className="w-4 h-4 rounded-full shrink-0 shadow-sm ring-2 ring-white/30"
                      style={{ backgroundColor: t.hex }}
                    />
                    <div>
                      <div className="font-serif font-semibold text-[18px] sm:text-[20px] text-jet">
                        {t.name}
                      </div>
                      <div className="text-[12px] text-gray-muted mt-0.5 font-medium">
                        {t.memberCount === 0
                          ? "No members yet"
                          : `${t.memberCount} approved member${t.memberCount !== 1 ? "s" : ""}`}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {t.memberCount > 0 && (
                      <span
                        className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border"
                        style={{
                          backgroundColor: `${t.hex}20`,
                          color: t.hex,
                          borderColor: `${t.hex}40`
                        }}
                      >
                        {t.memberCount}
                      </span>
                    )}
                    {isOpen ? (
                      <ChevronUp size={18} className="text-gray-muted" />
                    ) : (
                      <ChevronDown size={18} className="text-gray-muted" />
                    )}
                  </div>
                </button>

                {/* Member list — expands on click */}
                {isOpen && (
                  <div className="border-t border-border bg-paper px-5 py-5 animate-in fade-in slide-in-from-top-1 duration-200">
                    {t.members.length === 0 ? (
                      <div className="text-center py-8">
                        <Users size={32} className="text-border mx-auto mb-3" />
                        <p className="text-[13px] text-gray-muted font-medium">
                          No approved members yet.
                        </p>
                        <p className="text-[12px] text-gray-muted mt-1">
                          Members appear here once the admin confirms their payment.
                        </p>
                        <Link
                          href="/register"
                          className="inline-block mt-4 text-[12px] font-bold uppercase tracking-wider text-accent hover:underline"
                        >
                          Register now →
                        </Link>
                      </div>
                    ) : (
                      <div>
                        <p className="text-[11px] uppercase tracking-widest font-bold text-gray-muted mb-4">
                          Members of {t.name}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {t.members.map((m, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2.5 bg-paper-soft border border-border rounded px-3.5 py-2.5"
                            >
                              <span
                                className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                                style={{ backgroundColor: t.hex }}
                              >
                                {m.displayName[0]}
                              </span>
                              <div className="min-w-0">
                                <div className="font-semibold text-[13.5px] text-jet truncate">
                                  {m.displayName}
                                </div>
                                {m.department && (
                                  <div className="text-[11px] text-gray-muted truncate">
                                    {m.department}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* No teams at all */}
      {!loading && teams.length === 0 && (
        <div className="text-center py-16 border border-border rounded-md bg-paper-soft">
          <Users size={40} className="text-border mx-auto mb-4" />
          <h3 className="font-serif font-semibold text-xl mb-2">Teams coming soon</h3>
          <p className="text-[13px] text-gray-dark">
            Teams will appear here once the database is set up and registrations open.
          </p>
        </div>
      )}

      {/* Bottom CTA */}
      {!loading && (
        <div className="mt-12 pt-10 border-t border-border text-center">
          <p className="text-[14px] text-gray-dark mb-4 font-medium">
            Not registered yet? Join the Federation Week today.
          </p>
          <Link
            href="/register"
            className="inline-block bg-jet text-paper-soft py-3.5 px-8 rounded-sm text-[12px] uppercase tracking-wider font-bold hover:bg-accent transition-colors shadow-md"
          >
            Register & Get Your Team →
          </Link>
        </div>
      )}
    </section>
  );
}
