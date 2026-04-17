-- Seed feature flags
insert into feature_flags(key, enabled) values
  ('module.lead_reply', true),
  ('module.estimate_writer', true),
  ('module.review_rocket', true),
  ('module.reactivation_vault', true),
  ('module.booking_guard', true),
  ('module.content_blitz', true),
  ('module.profit_snapshot', true),
  ('module.sop_builder', true),
  ('module.scoreboard', true),
  ('module.concierge_lite', true),
  ('billing.affiliate', false)
on conflict (key) do nothing;
