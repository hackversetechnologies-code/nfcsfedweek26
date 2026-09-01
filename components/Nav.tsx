import Link from "next/link";

export default function Nav() {
  return (
    <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur border-b border-border">
      <div className="max-w-[1120px] mx-auto flex items-center justify-between px-5 py-3.5">
        <Link href="/" className="font-serif font-semibold text-xl">NFCS</Link>
        <nav className="hidden md:flex gap-7 text-[13px] uppercase tracking-wide font-medium">
          <Link href="/schedule">The Week</Link>
          <Link href="/#picnic">Picnic</Link>
          <Link href="/teams">Teams</Link>
          <Link href="/executives">Executives</Link>
          <Link href="/about">About</Link>
        </nav>
        <Link href="/register" className="text-xs uppercase tracking-wide font-semibold bg-jet text-paper-soft px-4 py-2.5 rounded-sm">
          Join
        </Link>
      </div>
    </header>
  );
}
