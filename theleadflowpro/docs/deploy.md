# Deploy to Vercel

## 1. Push to a GitHub repo

See `docs/extract-to-own-repo.md` to move this folder into its own repo.

## 2. Import into Vercel

- New Project → import the repo
- Framework: Next.js (auto-detected)
- Root directory: `.` (own repo) or `theleadflowpro/` (subfolder)

## 3. Env vars

Paste every var from `.env.local.example` with production values.

`NEXT_PUBLIC_APP_URL` must be the fully-qualified prod URL.

## 4. Domains

- Add `theleadflowpro.com` → root for marketing site
- (Future) `app.theleadflowpro.com` subdomain if splitting

## 5. Stripe webhook

Point webhook URL to `https://theleadflowpro.com/api/stripe/webhook`.

## 6. Supabase

- Apply migrations on prod DB
- Auth → URL Configuration:
  - Site URL: `https://theleadflowpro.com`
  - Additional redirect URLs: `https://theleadflowpro.com/auth/callback`

## 7. Smoke test

See `docs/launch-checklist.md`.
