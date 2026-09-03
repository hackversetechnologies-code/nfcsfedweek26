import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-guard";

export async function DELETE(req: Request) {
  const guard = requireAdmin(req);
  if (guard) return guard;

  try {
    const { registration_id } = await req.json();
    if (!registration_id) {
      return NextResponse.json({ error: "registration_id is required." }, { status: 400 });
    }

    const supabase = createServiceClient();

    // Cascading delete on registrations automatically cleans up dependent payments & tickets
    const { error } = await supabase
      .from("registrations")
      .delete()
      .eq("id", registration_id);

    if (error) {
      console.error("Delete registration error:", error);
      return NextResponse.json({ error: error.message || "Failed to delete user." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, deleted_id: registration_id });
  } catch (err: any) {
    console.error("Admin delete exception:", err);
    return NextResponse.json({ error: err?.message || "Internal server error." }, { status: 500 });
  }
}
