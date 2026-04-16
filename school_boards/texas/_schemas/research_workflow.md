# Research Workflow: Per Candidate (Expanded About Edition)

Follow this sequence. Do not skip steps. Label every claim with FACT, DOCUMENTED_INFERENCE, or REQUIRES_FURTHER_EVIDENCE, and attach a source URL.

---

## Part 1: Election and Identity

### Step 1: Confirm the filing
- Pull the district's own press release or the county election page for the May 2, 2026 ballot.
- Confirm exact name, seat, and opponents.

### Step 2: Professional identity
- LinkedIn search: full name + city + employer guess
- Texas Secretary of State business entity search: https://www.sos.state.tx.us/corp/sosda/ and https://mycpa.cpa.state.tx.us/coa/
- Licensing boards: TDLR, State Bar of Texas, TMB (medical), TREC (real estate), TDI (insurance), TEA (educator certs)

### Step 3: Social media sweep (current)
- Facebook (personal + campaign page)
- X / Twitter, Instagram, TikTok, LinkedIn, YouTube, Rumble, Truth Social, Nextdoor
- Save every handle

### Step 4: Content analysis
- 10-20 most recent public posts per active platform
- Classify into themes, note defining statements
- Quote under 15 words, paraphrase the rest

---

## Part 2: Expanded "About" Public Record Dive

This is the section candidates rarely aggregate themselves.

### Step 5: Full identity record
- Year of birth from ballot application (public) or voter roll
- Maiden / prior names from marriage records (county clerk), old news clippings
- Aliases from court filings, business records
- Family name connections: check if relatives are district employees, vendors, other elected officials
  - District employee directory
  - District vendor list (contracts posted on district site or obtained via open records request)
  - Gregg/Harrison/Upshur/Smith County elected officials rosters

### Step 6: Residency & property
- **Gregg CAD**: https://www.gregg-cad.org/
- **Harrison CAD**: https://www.harrisoncad.org/
- **Upshur CAD**: https://www.upshurcad.org/
- **Smith CAD**: https://www.smithcad.org/
- Record parcels owned, homestead exemption status, appraised value
- **Do NOT publish full street address.** City or neighborhood only.
- Delinquent tax search on the county tax collector sites

### Step 7: Full education history
- Walk backward from current bio: every institution claimed
- Verify via alumni directories, LinkedIn, old news clippings, yearbooks if online
- Note any degree claimed but not verifiable: mark REQUIRES_FURTHER_EVIDENCE

### Step 8: Complete employment timeline
- Pull LinkedIn history (Wayback Machine if edits were made)
- Cross-reference against old news articles, bios on company sites (Wayback), state licensing records
- Flag gaps, overlapping employment, and any employer that is a district vendor or competitor

### Step 9: Business & financial record
- **Texas SOS business search**: list every entity candidate is or was tied to (registered agent, member, manager, officer)
- **County clerk assumed name search**: DBAs
- **UCC filings** (SOS UCC search): liens against candidate
- **Bankruptcy**: PACER, https://pcl.uscourts.gov/
- **Tax liens**: county clerk real property records search
- **Civil judgments**: district clerk civil records

### Step 10: Voting & political history
- **Texas voter registration**: via county voter registrar. Record year first registered.
- **Primary voting history**: which party primary pulled each year (PUBLIC RECORD in Texas).
- **Previous candidacies**: Ballotpedia, Texas Secretary of State election results archive
- **Political donations made BY the candidate**:
  - TEC: https://www.ethics.state.tx.us/search/cf/
  - FEC: https://www.fec.gov/data/receipts/individual-contributions/
- **PAC memberships**, **county party committee roles**: check county GOP/Dem officer lists

### Step 11: Court records (all jurisdictions)
Search for the candidate's name (and maiden/prior names) in:
- **Gregg County District Clerk**: https://www.co.gregg.tx.us/page/gregg.DistrictClerk
- **Harrison County District Clerk**: https://www.co.harrison.tx.us/page/harrison.DistrictClerk
- **Upshur County District Clerk**: https://www.countyofupshur.com/page/upshur.DistrictClerk
- **Smith County District Clerk**: https://smith-county.com/government/county-departments/district-clerk
- **Federal PACER**: https://pcl.uscourts.gov/
- **Texas appellate courts**: search.txcourts.gov
- Record civil, criminal, family, probate, bankruptcy, appeals
- For family court matters: note existence only, do NOT include salacious detail unless directly policy-relevant

### Step 12: Campaign finance deep dive (local + state)
- **School board candidates file LOCALLY** with each district, not with TEC.
- Pull CTA, any Modified Reporting Affidavit, and every periodic report
- Cross-reference donor list against known district vendors (flag as conflict)
- Flag in-kind contributions over $500
- Flag any late, amended, or missing reports

### Step 13: Affiliations full inventory
- **GuideStar** and **ProPublica Nonprofit Explorer**: search every 990 filing where candidate is listed as officer or director
- Nonprofit board seats (current and prior)
- Fraternal: Masons, Knights of Columbus, VFW, American Legion
- Alumni associations with political activity
- Professional associations with political arms
- Church leadership ONLY if publicly disclosed by candidate or church

### Step 14: Conflicts of interest inventory
For each potential conflict, document:
- Type: vendor_tie, family_employment, property_adjacency, business_partnership, legal_representation, consultant_relationship
- Description
- Severity (low / medium / high)
- Source URL

### Step 15: Digital footprint archive dive
- **Wayback Machine**: https://web.archive.org/
  - Snapshot candidate's personal site, old bios, campaign site, LinkedIn, firm bio
  - Look for changes: removed employment, removed affiliations, changed policy language
- **Google cache** and **Bing cache** for recently edited pages
- **Archive.today** for pages that resist Wayback
- **Social media archives**: politwoops-style tools for deleted tweets
- **Old press quotes**: newspaper archives, especially quotes that conflict with current positions

### Step 16: Board performance (incumbents only)
Pull from BoardBook or the district's posted agendas and minutes:
- Meeting attendance rate
- Notable votes (yea/nay/abstain/recuse/absent)
- Recusals and reasons given
- Committee assignments
- Items the candidate sponsored or moved
- Statements on the record at meetings

---

## Part 3: Issue Positions and Final Write-Up

### Step 17: Issue positions
Nine education policy areas. Each must have at least one sourced statement or vote, or be marked REQUIRES_FURTHER_EVIDENCE.

### Step 18: Red flags
Cross-reference everything. Specifically look for:
- Conflicts between bio claims and verifiable record
- Employment gaps unexplained
- Donors who later received contracts
- Family employed by district
- Recent address changes that may affect residency qualification
- Undisclosed prior names that would surface additional records

### Step 19: About narrative
Write a 3-6 paragraph neutral narrative that walks the reader through the expanded record. No editorializing beyond what the cited record directly supports. If the record shows something unflattering, state it plainly with the source; if the record is clean, state that plainly too.

### Step 20: Write output
- Fill `candidate.schema.json`-compliant JSON
- Generate matching markdown
- Flip status and timestamp
- Move to next queued candidate

---

## Non-Negotiable Rules

- Every claim: source URL + fact label
- No minor children mentioned, ever
- No medical info unless candidate has publicly disclosed
- No full home street addresses published (city/neighborhood only)
- No salacious family court detail unless directly policy-relevant
- Quotes under 15 words, one quote per source, paraphrase the rest
- No em dashes
- No moralizing; let the record speak
- If something is not in public record and the candidate has not said it, it does not go in
