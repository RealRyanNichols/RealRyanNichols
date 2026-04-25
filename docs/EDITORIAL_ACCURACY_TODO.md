# RepWatchr Editorial Accuracy TODO

RepWatchr loses credibility if a public page mixes a real issue with the wrong bill, vote count, source, or dollar figure. Public content must stay source-first.

## Immediate Rule

- Do not publish a bill, vote, article, scorecard explanation, red flag, praise report, or savings estimate until the exact source record supports the exact claim.
- If a claim is not verified, mark it as a research question or leave it unpublished.
- Official source records beat summaries, campaign claims, social posts, AI output, and drafts.
- Never use placeholder/sample political articles as live content.

## HB 1750 Correction Queue

The following bad claim must not re-enter live data:

- False claim: 89R HB 1750 was a Texas property-tax relief bill.
- Official record issue: Texas Legislature materials identify 89R HB 1750 as a hemp-products-for-smoking bill, not a property-tax bill.
- False claim: HB 1750 passed the House 112-35 as a property-tax measure.
- Official record issue: the HB 1750 property-tax vote claim is unsupported.
- False claim: the current Texas residence homestead appraisal cap is 5%.
- Source issue: Texas Comptroller guidance describes the residence homestead appraisal limitation as generally 10%.
- Unsourced claim: Smith County homeowners would save $800-$1,200 from the alleged HB 1750 package.

## Required Fixes

- Keep the fake HB 1750 property-tax article removed from `src/data/news`.
- Keep the fake HB 1750 property-tax vote removed from `src/data/votes`.
- Keep HB 1750 property-tax scorecard vote references removed from scored officials.
- Replace with a sourced property-tax explainer only after checking the Texas Legislature record, Texas Comptroller guidance, and any cited news source.
- For 2025 property-tax relief, verify the actual measures before publishing. Current research lead: SB 4 / SJR 2 and the voter-approved school homestead exemption increase to $140,000.

## Site Safety Work

- Add a data validation script that fails when a scorecard vote references a missing bill file.
- Add a data validation script that fails when a news article has no source URL for factual legislative claims.
- Add an admin review status to public news: `draft`, `needs_source_review`, `approved`, `quarantined`.
- Add visible source labels on article pages.
- Add a "Correction needed" admin path for any reader to flag inaccurate public data.
