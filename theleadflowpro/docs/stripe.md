# Stripe setup

## 1. Products + prices

In Stripe dashboard → Products, create three:

| Product | Price | Billing |
|---|---|---|
| Starter | $47 | Monthly |
| Growth | $97 | Monthly |
| Pro | $197 | Monthly |

Copy each price ID to `.env.local`:

```
STRIPE_PRICE_STARTER_MONTHLY=price_...
STRIPE_PRICE_GROWTH_MONTHLY=price_...
STRIPE_PRICE_PRO_MONTHLY=price_...
```

The 7-day trial is applied per-subscription in the checkout route from `PLANS[plan].trialDays`.

## 2. Billing Portal

Settings → Customer portal → enable. Return URL: `https://theleadflowpro.com/app/billing`.

## 3. Webhook

Endpoint: `https://theleadflowpro.com/api/stripe/webhook`

Listen for:
- checkout.session.completed
- customer.subscription.created / updated / deleted / trial_will_end
- invoice.payment_failed

Copy signing secret to `STRIPE_WEBHOOK_SECRET`.

## 4. Local testing

```bash
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Test card: 4242 4242 4242 4242.
