# Email sign-up ("Want to stay up to date?")

A pop-up on the guides page (`/characters`) asks visitors for their email so we can tell them when new resources are added. It opens once per browser, 5 seconds after arriving, and never on top of another pop-up.

Code: [`src/components/layout/EmailSignupPopup.tsx`](../src/components/layout/EmailSignupPopup.tsx), [`src/lib/signup/submitEmailSignup.ts`](../src/lib/signup/submitEmailSignup.ts). Settings: `emailSignup` in [`src/config/site.ts`](../src/config/site.ts). Copy: `emailSignup` in [`src/locales/en.json`](../src/locales/en.json).

## Setup

1. Run this in Supabase → SQL editor:

```sql
create table public.email_signups (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  email         text not null check (
                  char_length(email) <= 254
                  and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
                ),
  source        text check (char_length(source) <= 40),
  consent_text  text not null check (char_length(consent_text) <= 500)
);

-- One row per address, whatever the capitalisation.
create unique index email_signups_email_key on public.email_signups (lower(email));

alter table public.email_signups enable row level security;

-- The site can add rows; nobody can read or change them through the public key.
create policy "anyone can sign up"
  on public.email_signups for insert
  to anon
  with check (true);
```

2. Set `emailSignup.enabled` to `true` in `src/config/site.ts`, then push.

## What's stored

| Field | Why |
| --- | --- |
| `email` | To send updates |
| `created_at` | When they signed up |
| `source` | Where they signed up (`guides`) |
| `consent_text` | The exact wording they agreed to, as a record of consent |

Emails are kept in their own table and are never linked to quiz answers or visits.

## Sending updates and unsubscribing

- Export the list from the Table editor (CSV) and send from your mail tool.
- **Every email must include a way to unsubscribe** (Canada's anti-spam law, CASL, requires it). When someone asks, delete their row in the Table editor.
