# The Lead Flow Pro

A shared vault of AI-powered tools for service businesses.
One clean dashboard. Ten modules. Built to book jobs.

## What's in this repo

```
src/
  app/                  # Next.js App Router pages
    (marketing)/        # Public marketing site
    login/, signup/     # Email magic-link auth
    auth/callback/      # Supabase auth exchange
    app/                # Authed app
      m/<module-slug>/  # One folder per module
    api/                # Route handlers
  components/ui/        # shadcn-flavored UI primitives
  lib/
    supabase/           # browser/server/admin clients
    ai/anthropic.ts     # Provider abstraction (Fast/Smart tiers)
    plans.ts            # Plan definitions + entitlement checks
    usage.ts            # Quotas + metering
    audit.ts            # Audit log
    account.ts          # Current user + account
    stripe.ts, modules.ts, utils.ts
  modules/              # Per-module prompts + domain helpers
supabase/migrations/    # Schema, RLS, seed data
scripts/seed.ts         # Demo account seeds
```

## Quick start

```bash
cp .env.local.example .env.local
npm install
npm run dev
```

Open http://localhost:3000.

See `docs/` for env, Stripe, deploy, and launch checklist.

## Architecture

- One vault, many modules. Enable/disable via `src/lib/plans.ts`.
- Single AI entry point at `src/lib/ai/anthropic.ts`. Fast → Haiku, Smart → Sonnet. Costs and tokens metered + audited on every call.
- API routes gate every AI call through `moduleEnabled()` + daily/monthly quota checks. UI shows `UpgradeBanner` when blocked.
- Supabase RLS isolates accounts. Admin client only used server-side.
- Stripe webhook updates account plan + status on every sub event.

## Ships in v0.1

- Marketing site (landing, pricing, compare, FAQ, changelog, support, legal)
- Email magic-link auth + onboarding wizard + vault dashboard
- Stripe checkout + billing portal + webhook
- **Lead Reply Engine** — end-to-end
- **Estimate Scope Writer** — end-to-end
- Eight more modules with tables + routes + functional stubs
- Admin dashboard
- Vitest unit tests + seed script

## Scripts

| Command | What |
|---|---|
| `npm run dev` | Local dev |
| `npm run build` | Production build |
| `npm run typecheck` | TypeScript |
| `npm run lint` | ESLint |
| `npm run test` | Vitest |
| `npm run seed` | Seed demo accounts |
