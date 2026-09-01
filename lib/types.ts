export type RegistrationStatus = "pending" | "approved" | "rejected";
export type PaymentStatus = "pending" | "approved" | "rejected";

export interface EventSettings {
  event_name: string;
  theme: string;
  start_date: string;
  end_date: string;
  picnic_date: string;
  contribution_amount: number;
  bank_name: string;
  account_name: string;
  account_number: string;
  registration_open: boolean;
  team_assignment_enabled: boolean;
}

export interface Registration {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  department: string | null;
  level: string | null;
  status: RegistrationStatus;
  team_id: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  registration_id: string;
  amount: number;
  bank_used: string;
  sender_name: string;
  transaction_reference: string;
  transfer_time: string;
  status: PaymentStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface Team {
  id: string;
  name: string;
  colour: string;
  hex: string;
  active: boolean;
  order: number;
}

export interface Executive {
  id: string;
  name: string;
  role: string;
  photo_url: string | null;
  bio: string | null;
  display_order: number;
  active: boolean;
}

export interface Ticket {
  id: string;
  registration_id: string;
  ticket_code: string;
  qr_token: string;
  created_at: string;
}
