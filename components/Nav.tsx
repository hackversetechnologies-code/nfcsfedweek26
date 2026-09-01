"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ShieldCheck } from "lucide-react";

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur border-b border-border">
      <div className="max-w-[1120px] mx-auto flex items-center justify-between px-5 py-3.5">
        {/* Brand Logo */}
        <Link href="/" onClick={closeMobile} className="font-serif font-semibold text-xl tracking-tight flex items-center gap-2">
          <span>NFCS</span>
          <span className="text-[10px] font-sans uppercase tracking-widest font-bold bg-accent/10 text-accent px-2 py-0.5 rounded border border-accent/20">
            AEFUTHA 1
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-[13px] uppercase tracking-wider font-semibold text-jet">
          <Link href="/schedule" className="hover:text-accent transition-colors">The Week</Link>
          <Link href="/#picnic" className="hover:text-accent transition-colors">Picnic</Link>
          <Link href="/teams" className="hover:text-accent transition-colors">Teams</Link>
          <Link href="/executives" className="hover:text-accent transition-colors">Executives</Link>
          <Link href="/about" className="hover:text-accent transition-colors">About</Link>
          <Link href="/admin" className="text-gray-muted hover:text-jet transition-colors flex items-center gap-1">
            <ShieldCheck size={14} /> Admin
          </Link>
        </nav>

        {/* Action Buttons & Mobile Hamburger */}
        <div className="flex items-center gap-3">
          <Link href="/register" className="text-xs uppercase tracking-wider font-semibold bg-jet text-paper-soft px-4 py-2.5 rounded-sm hover:bg-accent transition-colors shadow-sm">
            Join
          </Link>

          {/* Hamburger Icon for Mobile */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-sm border border-border text-jet hover:bg-paper-soft transition-colors"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="md:hidden bg-paper/98 border-b border-border shadow-xl px-5 pt-4 pb-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3 text-[14px] uppercase tracking-wider font-semibold text-jet">
            <Link href="/" onClick={closeMobile} className="py-2 border-b border-border/50 hover:text-accent">
              Home
            </Link>
            <Link href="/schedule" onClick={closeMobile} className="py-2 border-b border-border/50 hover:text-accent">
              The Week Schedule
            </Link>
            <Link href="/#picnic" onClick={closeMobile} className="py-2 border-b border-border/50 hover:text-accent">
              The Picnic (26 Sept)
            </Link>
            <Link href="/teams" onClick={closeMobile} className="py-2 border-b border-border/50 hover:text-accent">
              Picnic Teams
            </Link>
            <Link href="/executives" onClick={closeMobile} className="py-2 border-b border-border/50 hover:text-accent">
              Executives
            </Link>
            <Link href="/about" onClick={closeMobile} className="py-2 border-b border-border/50 hover:text-accent">
              About NFCS
            </Link>
            <Link href="/admin" onClick={closeMobile} className="py-2 text-accent flex items-center gap-2">
              <ShieldCheck size={16} /> Admin Portal
            </Link>
          </nav>
          <div className="pt-2">
            <Link
              href="/register"
              onClick={closeMobile}
              className="block w-full text-center bg-jet text-paper-soft py-3 rounded-sm text-[13px] uppercase tracking-wider font-semibold shadow-md"
            >
              Join Federation Week
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
