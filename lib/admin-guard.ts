import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * Minimal admin gate for API routes that mutate data (approve/reject).
 * Checks the same cookie middleware.ts sets after /admin/login.
 * For a bigger volunteer team, swap this for real Supabase Auth + a
 * roles table — this is intentionally the lightweight version.
 */
export function requireAdmin(req: Request): NextResponse | null {
  const cookieStore = cookies();
  const session = cookieStore.get("nfcs_admin")?.value;
  if (session !== process.env.ADMIN_ACCESS_CODE) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  return null;
}
