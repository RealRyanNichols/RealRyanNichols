# Environment variables

Copy `.env.local.example` to `.env.local`, then fill these in.

## App

| Var | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_APP_URL` | ✓ | Fully-qualified URL. `http://localhost:3000` locally, `https://theleadflowpro.com` in prod. |

## Supabase

1. Create a project at supabase.com
2. Settings → API → copy values
3. SQL editor → paste `supabase/migrations/0001_init.sql` then `0002_seed.sql`

| Var | Notes |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Safe for browser |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only. Never expose. |

## Anthropic

Get a key at console.anthropic.com.

| Var | Notes |
|---|---|
| `ANTHROPIC_API_KEY` | Required |
| `ANTHROPIC_MODEL_FAST` | Default: claude-haiku-4-5-20251001 |
| `ANTHROPIC_MODEL_SMART` | Default: claude-sonnet-4-6 |

## Stripe

See `docs/stripe.md`.

## Admin

| Var | Notes |
|---|---|
| `ADMIN_ALLOWED_EMAILS` | Comma-separated emails allowed into /app/admin |
