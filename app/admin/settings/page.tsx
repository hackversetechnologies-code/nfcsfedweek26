import { createServiceClient } from "@/lib/supabase/server";
import SettingsForm from "@/components/SettingsForm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const supabase = createServiceClient();
  const { data: settings } = await supabase.from("event_settings").select("*").single();

  return (
    <div className="max-w-[520px] mx-auto px-5 py-10">
      <h1 className="font-serif font-semibold text-3xl mb-8">Event Settings</h1>
      {settings && <SettingsForm settings={settings} />}
    </div>
  );
}
