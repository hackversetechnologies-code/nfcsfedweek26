import { NextRequest, NextResponse } from "next/server";

// Gates everything under /admin except /admin/login behind a single
// shared cookie (see ADMIN_ACCESS_CODE in .env.example). Swap for
// Supabase Auth if you need per-admin accounts / audit trails.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!pathname.startsWith("/admin") || pathname === "/admin/login") {
    return NextResponse.next();
  }

  const session = req.cookies.get("nfcs_admin")?.value;
  if (session !== process.env.ADMIN_ACCESS_CODE) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
