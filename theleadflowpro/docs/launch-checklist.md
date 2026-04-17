# Launch checklist

## Pre-launch

- [ ] All env vars set in Vercel
- [ ] Supabase migrations applied on prod
- [ ] RLS verified (two users, no cross-visibility)
- [ ] Stripe products + prices exist, IDs match env
- [ ] Stripe webhook endpoint registered + secret in env
- [ ] Domain points to Vercel
- [ ] Supabase redirect URLs include prod URL
- [ ] Admin email on the allow list
- [ ] Feature flags for beta-only modules set

## Smoke test

1. `/` renders
2. `/pricing` shows 4 plans
3. `/signup` → email → magic link
4. Link → `/app` → onboarding
5. Complete onboarding → vault shows 10 modules
6. Lead Reply Engine generate → history shows entry
7. Estimate Writer generate → history shows entry
8. Billing → Start trial → Stripe checkout test card
9. Webhook fires → plan updates to starter / trialing
10. Portal loads
11. Admin → sees data
12. Non-admin → sees Admin only block

## Rollback

- Set `plan` in Supabase SQL if webhooks break
- Set `ANTHROPIC_MODEL_FAST` to cheaper model if spend spikes
- Toggle feature flags in `feature_flags` to hide modules

## Analytics to wire (v0.2)

`signup`, `onboarding_complete`, `module_opened`, `ai_generate`, `trial_started`, `trial_converted`, `trial_canceled`, `mrr_up`, `mrr_down`.
