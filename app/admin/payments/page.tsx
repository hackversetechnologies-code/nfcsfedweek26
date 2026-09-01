import { createServiceClient } from "@/lib/supabase/server";
import PaymentActions from "@/components/PaymentActions";

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  const supabase = createServiceClient();
  const { data: payments } = await supabase
    .from("payments")
    .select("*, registrations(full_name, email, phone)")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  return (
    <div className="max-w-[720px] mx-auto px-5 py-10">
      <h1 className="font-serif font-semibold text-3xl mb-8">Payment Review</h1>

      {(!payments || payments.length === 0) ? (
        <p className="text-gray-dark text-[15px]">No pending payments.</p>
      ) : (
        <div className="space-y-4">
          {payments.map((p: any) => (
            <div key={p.id} className="border border-border rounded-sm p-5">
              <div className="font-semibold text-[16px] mb-3">{p.registrations?.full_name}</div>
              <div className="grid grid-cols-2 gap-y-2 text-[13px] mb-4">
                <Info label="Amount" value={`₦${p.amount?.toLocaleString()}`} />
                <Info label="Bank Used" value={p.bank_used} />
                <Info label="Sender Name" value={p.sender_name} />
                <Info label="Reference" value={p.transaction_reference} />
                <Info label="Transfer Time" value={new Date(p.transfer_time).toLocaleString()} />
                <Info label="Registered" value={new Date(p.created_at).toLocaleDateString()} />
                <Info label="Email" value={p.registrations?.email} />
                <Info label="Phone" value={p.registrations?.phone} />
              </div>
              <PaymentActions paymentId={p.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wide text-gray-muted">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
