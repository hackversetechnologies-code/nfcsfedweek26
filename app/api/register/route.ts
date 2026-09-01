import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { full_name, email, phone, department, level } = body;

  if (!full_name?.trim() || !email?.trim() || !phone?.trim()) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  const supabase = createServiceClient();

  try {
    const { data: settings } = await supabase.from("event_settings").select("registration_open").single();
    if (settings && settings.registration_open === false) {
      return NextResponse.json({ error: "Registration is currently closed." }, { status: 403 });
    }
  } catch (err) {
    // Continue if event_settings query fails gracefully
  }

  const { data, error } = await supabase
    .from("registrations")
    .insert({ full_name, email, phone, department: department || null, level: level || null })
    .select("id")
    .single();

  if (error || !data) {
    console.error("Registration DB error:", error);
    if (error?.code === "PGRST205" || error?.message?.includes("schema cache") || error?.message?.includes("relation")) {
      return NextResponse.json({
        error: "Database tables are not initialized in Supabase yet. Please run the SQL setup script (supabase/full_setup.sql) in your Supabase SQL Editor."
      }, { status: 500 });
    }
    return NextResponse.json({ error: error?.message || "Something went wrong while creating your registration." }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}
