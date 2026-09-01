# NFCS Federation Week 2026

Event website + registration platform for NFCS Federation Week 2026
(Nigeria Federation of Catholic Students, AEFUTHA 1, Our Mother of
Perpetual Help Chaplaincy). Built with Next.js (App Router), TypeScript,
Tailwind CSS, and Supabase.

## What's built

- Public site: landing page, `/schedule`, `/about`, `/teams` + team member
  pages, `/executives`
- Registration flow: `/register` → `/payment/[id]` → `/ticket/[id]`
- Manual bank-transfer payment confirmation
- Admin (`/admin`, gated by a shared access code): dashboard, registrations,
  payment review with approve/reject, balanced team assignment, team +
  executive management, event settings
- Balanced random team assignment (`lib/team-assignment.ts`)
- QR-coded digital ticket + `/api/verify-ticket` for door scanning
- Confirmation email via Resend, sent on approval (`lib/email.ts`)
- Full Supabase schema + Row Level Security policies (`supabase/`)

## Setup

### 1. Create a Supabase project
Go to supabase.com, create a project, then in the SQL editor run, in order:
1. `supabase/schema.sql`
2. `supabase/policies.sql`

### 2. Environment variables
Copy `.env.example` to `.env.local` and fill in:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase
  project settings → API
- `SUPABASE_SERVICE_ROLE_KEY` — same page, **never** exposed to the browser,
  only used in server-only route handlers
- `RESEND_API_KEY` / `EMAIL_FROM` — create a free account at resend.com,
  verify a sending domain
- `ADMIN_ACCESS_CODE` — pick any private string; this is the password for
  `/admin/login`. It's a lightweight shared-secret gate, good enough for a
  small organizing team. Swap for real Supabase Auth if you want individual
  admin accounts or an audit trail.
- `NEXT_PUBLIC_SITE_URL` — your deployed URL (used in QR codes/email links)

### 3. Install and run
```
npm install
npm run dev
```

### 4. Deploy
Push to GitHub, import into Vercel, add the same environment variables
there, deploy. `NEXT_PUBLIC_SITE_URL` should be your production URL.

## Notes / things intentionally left simple

- Payment verification is manual by design — admins check the bank account
  and approve in `/admin/payments`. Nothing here claims to auto-confirm a
  transfer.
- The four starter teams (Green/Blue/Black/Red) are seeded in
  `schema.sql` but are fully configurable — add, rename, recolour, or
  deactivate any team in `/admin/teams`. Assignment always balances across
  whichever teams are currently active.
- Bank account details, contribution amount, and dates all live in
  `event_settings` (editable at `/admin/settings`) — nothing is hardcoded
  in the UI.
- Executive photos/bios, precise venue info, and social links weren't
  provided in the brief, so those stay as empty states / admin-fillable
  fields rather than invented placeholders.
- No PDF ticket generation — the ticket page itself is the deliverable
  (viewable, shareable via the Web Share API, screenshot-friendly).

## Still to wire up before launch

- Real admin auth if more than a couple of trusted people need access
- A physical door-scanning UI for `/api/verify-ticket` (currently just an
  API endpoint — pair it with any QR scanner that can POST the token)
- Executive photos and bios (add via `/admin/executives`)
- Verify Resend sending domain so approval emails don't land in spam
