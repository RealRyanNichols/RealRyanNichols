# RepWatchr Sync Index

Last updated: 2026-04-24

This file is the working map for keeping RepWatchr aligned across GitHub, Vercel, local Drive assets, Claude Code/Cowork notes, and future admin/research work.

## Canonical Build Path

- Canonical repository: `RealRyanNichols/RepWatchr`
- Production branch: `main`
- Current Codex working branch: `gideon-brand-assets`
- GitHub publish branch: `codex/brand-quo-national`
- Vercel project: `repwatchr`
- Production domain: `www.repwatchr.com`
- Vercel team: `theflashflash24-9833s-projects`

RepWatchr should deploy from GitHub through Vercel. Local Google Drive folders and Claude exports are source drops and research references, not the canonical app unless their contents are intentionally imported into the GitHub repository.

## Current Publish Status

- Local branch `gideon-brand-assets` is ahead of `origin/main` with the RepWatchr/Gideon brand asset work, Quo SMS webhook scaffold, national elected-official framing, and no-fake-completion school-board language.
- Vercel is connected to the GitHub repository and auto-deploys the GitHub branch `codex/brand-quo-national`.
- Production is still expected to track `main` until the publish branch is merged or promoted.
- Preview deployments from branch builds may require a Vercel share link when Vercel authentication protection is enabled.

## Local RepWatchr Sources Found

### Google Drive

- `/Users/ryannichols/Library/CloudStorage/GoogleDrive-theflashflash24@gmail.com/My Drive/Real Ryan Nichols LLC/RepWatchr`
- `/Users/ryannichols/Library/CloudStorage/GoogleDrive-theflashflash24@gmail.com/My Drive/Real Ryan Nichols LLC/RepWatchr/RepWatchr Profile Pic.png`
- `/Users/ryannichols/Library/CloudStorage/GoogleDrive-theflashflash24@gmail.com/My Drive/Real Ryan Nichols LLC/RepWatchr/repwatchr_cover.png`
- `/Users/ryannichols/Library/CloudStorage/GoogleDrive-theflashflash24@gmail.com/My Drive/Real Ryan Nichols LLC/RepWatchr/lib/repwatchr-data.ts`
- `/Users/ryannichols/Library/CloudStorage/GoogleDrive-theflashflash24@gmail.com/My Drive/RepWatchr/RepWatchr Logo.png`
- `/Users/ryannichols/Library/CloudStorage/GoogleDrive-theflashflash24@gmail.com/My Drive/RepWatchr/RepWatchr Cover Photo.png`

### Downloads

- `/Users/ryannichols/Downloads/RepWatchr/README.md`
- `/Users/ryannichols/Downloads/RepWatchr/HANDOFF.md`
- `/Users/ryannichols/Downloads/RepWatchr/CLAUDE.md`
- `/Users/ryannichols/Downloads/RepWatchr 2/README.md`
- `/Users/ryannichols/Downloads/RepWatchr 2/HANDOFF.md`
- `/Users/ryannichols/Downloads/RepWatchr 2/CLAUDE.md`
- `/Users/ryannichols/Downloads/RepWatchr 2/DEEP_OSINT_PASS_NOTES.md`
- `/Users/ryannichols/Downloads/RepWatchr_school_boards_drop.zip`
- `/Users/ryannichols/Downloads/RepWatchr_school_boards_drop_v4.zip`

These files should be treated as import candidates. Any public claims, elected-official data, school-board allegations, political-lean labels, or scoring inputs must be source-checked before publishing as fact.

## Claude RepWatchr and Gideon References Found

Local Claude storage includes RepWatchr and GideonAI work in:

- `/Users/ryannichols/.claude/projects/`
- `/Users/ryannichols/Library/Application Support/Claude/`
- `/Users/ryannichols/Library/Application Support/Claude/claude-code`
- `/Users/ryannichols/Library/Application Support/Claude/claude-code-sessions`
- `/Users/ryannichols/Library/Application Support/Claude/local-agent-mode-sessions`
- `/Users/ryannichols/Documents/Claude`

Important Claude session leads:

- `f32ec4ce-f45b-4f92-9fc5-c78548422eff.jsonl`
  - Location: `/Users/ryannichols/.claude/projects/-Users-ryannichols-Library-CloudStorage-GoogleDrive-theflashflash24-gmail-com-My-Drive-Real-Ryan-Nichols-LLC/`
  - Date range found: 2026-04-21 through 2026-04-25.
  - Why it matters: active Real Ryan Nichols LLC / RepWatchr / GideonAI continuation thread with Vercel, Supabase, Stripe, Resend, HubSpot, Quo, blog sync, and dashboard work.

- `39c7302d-c705-41d4-82ad-493ebbca5d89.jsonl`
  - Location: Claude local-agent-mode sessions.
  - Date range found: 2026-04-21 through 2026-04-22.
  - Why it matters: login portal, dashboard, GideonAI platform integration, and source-scrape planning.

- `5b375d8e-e4ee-4e3d-ac49-f6c23394c2d2.jsonl`
  - Location: Claude local-agent-mode sessions.
  - Date found: 2026-04-20.
  - Why it matters: GideonAI bootstrap thread and shared product structure.

- `253c809c-5e2c-46f8-aeea-b4ddb14d977c.jsonl`
  - Location: `/Users/ryannichols/.claude/projects/-Users-ryannichols-Library-CloudStorage-GoogleDrive-theflashflash24-gmail-com-My-Drive-Real-Ryan-Nichols-LLC/`
  - Date range found: 2026-04-20 through 2026-04-21.
  - Why it matters: Real Ryan Nichols LLC app/dashboard/Vercel/Supabase work and project/deployment inventory.

- `7b0e9938-e0f5-468f-895b-dd0295afc21c.jsonl`
  - Location: `/Users/ryannichols/.claude/projects/-Users-ryannichols-Library-CloudStorage-GoogleDrive-theflashflash24-gmail-com-My-Drive-Real-Ryan-Nichols-LLC/`
  - Date range found: 2026-04-21.
  - Why it matters: home page, dashboard, and build-now work.

Important Claude memory lead:

- `/Users/ryannichols/Library/Application Support/Claude/local-agent-mode-sessions/.../memory/gideonai_brain_skill.md`
  - Notes found: GideonAI Brain skill drafted under `/Users/ryannichols/Documents/Claude/Projects/Real Ryan Nichols LLC/skills/gideonai-brain/`.
  - Notes found: Supabase project `vkyniojtuznaawqrapma` is the intended shared project; empty project `octudbtqmeidwtycguhf` should be decommissioned.

## Open Items Imported From Claude Notes

- Finish deploying the RepWatchr publish branch and confirm the Vercel production path.
- Keep `www.repwatchr.com` connected to the Vercel project backed by `RealRyanNichols/RepWatchr`.
- Import only verified RepWatchr data from Drive/Downloads/Claude into the repo.
- Preserve school-board and elected-official source discipline: no fake completion counts, no unsourced allegations, and clear labels for verified records versus submitted content.
- Set up OpenAI or approved model routing for GideonAI chat after the correct API key and environment strategy are confirmed.
- Keep Quo SMS integration behind environment variables and webhook verification.
- Add Supabase migrations for member dashboards, claims, submissions, and audit trails before accepting sensitive user submissions.
- Add public/legal copy review before publishing allegations, child-safety claims, political-lean ratings, or scoring outputs.

## Operating Rules Going Forward

- GitHub is the source of truth for app code.
- Vercel should deploy from GitHub, not from untracked local folders.
- Google Drive is the source of truth for raw brand assets, source drops, and research files until those files are imported.
- Claude transcripts are reference material. They can guide work, but they are not evidence by themselves.
- Every public official, school board member, district, score, concern, praise item, and red flag needs a source trail before it is presented as a fact.
- Profile-owner edits must remain separate from RepWatchr verified facts, source links, scores, evidence, red flags, and research gaps.
