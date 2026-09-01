import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

// Server component / route handler client — reads auth cookies, still bound by RLS.
export function createClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try { cookieStore.set(name, value, options); } catch {}
        },
        remove(name: string, options: CookieOptions) {
          try { cookieStore.set(name, "", { ...options, maxAge: 0 }); } catch {}
        }
      }
    }
  );
}

// Service-role client — ONLY used in server-only route handlers that need to
// bypass RLS (e.g. admin approval writing to multiple tables atomically).
// Never import this into a client component.
import { createClient as createRawClient } from "@supabase/supabase-js";
export function createServiceClient() {
  return createRawClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
