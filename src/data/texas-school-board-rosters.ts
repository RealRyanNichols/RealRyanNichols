/**
 * Texas school-board roster extension module.
 *
 * Drop new sourced districts here as object literals and they will be
 * imported automatically by `src/lib/school-board-research.ts`. No code
 * changes required outside this file.
 *
 * Schema (one entry per district):
 *
 *   {
 *     district: "Frisco ISD",                  // human-readable district name
 *     district_slug: "frisco_isd",             // snake_case unique slug
 *     county: "Collin/Denton",                 // primary county or counties
 *     sources: [                               // 1+ sources for the roster
 *       { url: "...", title: "...", source_type: "district_official" },
 *       ...
 *     ],
 *     roster: [                                // 1+ board members
 *       { full_name: "...", role: "Trustee", seat: "Place 1",
 *         term: "2024-2027", occupation: "...", summary: "..." },
 *       ...
 *     ],
 *     branding?: {                             // optional district colors
 *       primary: "#1e3a8a", secondary: "#fbbf24",
 *       accent: "#eef4ff", label: "Frisco blue and gold"
 *     },
 *     investigationNotes?: ["..."],            // optional research-gap notes
 *     queueStatus?: "dossiers_started" | "needs_full_records_pull",
 *   }
 *
 * Hard rule: every roster entry must trace back to a public source URL in
 * `sources` (district board page, election filing, news outlet, official
 * meeting record, etc.). Anonymous or unsourced rosters are not accepted.
 */

import type { SchoolBoardBranding } from "./school-board-branding";

export interface RosterMemberInput {
  full_name: string;
  role?: string;
  seat?: string;
  term?: string;
  occupation?: string;
  summary?: string;
}

export interface DistrictSourceInput {
  url: string;
  title: string;
  source_type?: "district_official" | "ballotpedia" | "news" | "education_agency" | "election_office" | "business" | "campaign_filing" | string;
  accessed_date?: string;
}

export interface DistrictRosterRecord {
  district: string;
  district_slug: string;
  county: string;
  sources: DistrictSourceInput[];
  roster: RosterMemberInput[];
  branding?: SchoolBoardBranding;
  investigationNotes?: string[];
  queueStatus?: "dossiers_started" | "needs_full_records_pull";
}

const ACCESSED_DATE = "2026-04-25";

// Helper so callers don't need to repeat accessed_date on every source.
function withAccessedDate(sources: DistrictSourceInput[]): DistrictSourceInput[] {
  return sources.map((s) => ({ accessed_date: s.accessed_date ?? ACCESSED_DATE, ...s }));
}

export const TEXAS_ROSTER_EXTENSIONS: DistrictRosterRecord[] = [
  // ---- DFW ISDs added 2026-04-25 ----
  {
    district: "Allen ISD",
    district_slug: "allen_isd",
    county: "Collin",
    sources: withAccessedDate([
      { url: "https://www.allenisd.org/Page/41", title: "Allen ISD Board of Trustees", source_type: "district_official" },
    ]),
    branding: { primary: "#dc2626", secondary: "#0f172a", accent: "#fff1f2", label: "Allen Eagles red and black" },
    roster: [
      { full_name: "Vatsa Ramanathan", role: "Board President", summary: "Listed on the Allen ISD Board of Trustees page." },
      { full_name: "Sarah Mitchell", role: "Vice President", summary: "Listed on the Allen ISD Board of Trustees page." },
      { full_name: "Amy Gnadt", role: "Secretary", summary: "Listed on the Allen ISD Board of Trustees page." },
    ],
    investigationNotes: ["Pull seat numbers, term-end dates, and the remaining 4 Allen ISD trustees."],
    queueStatus: "needs_full_records_pull",
  },
  {
    district: "McKinney ISD",
    district_slug: "mckinney_isd",
    county: "Collin",
    sources: withAccessedDate([
      { url: "https://www.mckinneyisd.net/board-of-trustees/", title: "McKinney ISD Board of Trustees", source_type: "district_official" },
    ]),
    branding: { primary: "#0f172a", secondary: "#dc2626", accent: "#fff1f2", label: "McKinney red and black" },
    roster: [
      { full_name: "Lynn Sperry", role: "Board President", summary: "Listed on the McKinney ISD Board of Trustees page." },
      { full_name: "Curtis Rippee", role: "Trustee", summary: "Listed on the McKinney ISD Board of Trustees page." },
      { full_name: "Stephanie O'Dell", role: "Trustee", summary: "Listed on the McKinney ISD Board of Trustees page." },
    ],
    investigationNotes: ["Pull seat numbers, term-end dates, and the remaining 4 McKinney ISD trustees."],
    queueStatus: "needs_full_records_pull",
  },
  {
    district: "Prosper ISD",
    district_slug: "prosper_isd",
    county: "Collin/Denton",
    sources: withAccessedDate([
      { url: "https://www.prosper-isd.net/Page/15", title: "Prosper ISD Board of Trustees", source_type: "district_official" },
    ]),
    branding: { primary: "#1e3a8a", secondary: "#facc15", accent: "#eff6ff", label: "Prosper Eagles blue and gold" },
    roster: [
      { full_name: "Drew Wilborn", role: "Board President", summary: "Listed on the Prosper ISD Board of Trustees page." },
      { full_name: "Brandon Latiolais", role: "Vice President", summary: "Listed on the Prosper ISD Board of Trustees page." },
      { full_name: "Bret Jimerson", role: "Secretary", summary: "Listed on the Prosper ISD Board of Trustees page." },
    ],
    investigationNotes: ["Pull seat numbers, term-end dates, and the remaining Prosper ISD trustees."],
    queueStatus: "needs_full_records_pull",
  },
  {
    district: "Garland ISD",
    district_slug: "garland_isd",
    county: "Dallas",
    sources: withAccessedDate([
      { url: "https://www.garlandisd.net/about/board-trustees", title: "Garland ISD Board of Trustees", source_type: "district_official" },
    ]),
    branding: { primary: "#7c2d12", secondary: "#fbbf24", accent: "#fff8ed", label: "Garland maroon and gold" },
    roster: [
      { full_name: "Linda Griffin", role: "Board President", summary: "Listed on the Garland ISD Board of Trustees page." },
      { full_name: "Robert Vera", role: "Trustee", summary: "Listed on the Garland ISD Board of Trustees page." },
    ],
    investigationNotes: ["Pull seat numbers, term-end dates, and the remaining 5 Garland ISD trustees."],
    queueStatus: "needs_full_records_pull",
  },
  {
    district: "Mesquite ISD",
    district_slug: "mesquite_isd",
    county: "Dallas",
    sources: withAccessedDate([
      { url: "https://www.mesquiteisd.org/about/leadership/board-of-trustees", title: "Mesquite ISD Board of Trustees", source_type: "district_official" },
    ]),
    branding: { primary: "#1e3a8a", secondary: "#fbbf24", accent: "#eff6ff", label: "Mesquite blue and gold" },
    roster: [
      { full_name: "Cary Cheshire", role: "Board President", summary: "Listed on the Mesquite ISD Board of Trustees page." },
    ],
    investigationNotes: ["Pull the remaining 6 Mesquite ISD trustees, seat numbers, and term-end dates."],
    queueStatus: "needs_full_records_pull",
  },
  {
    district: "Richardson ISD",
    district_slug: "richardson_isd",
    county: "Dallas/Collin",
    sources: withAccessedDate([
      { url: "https://web.risd.org/board/", title: "Richardson ISD Board of Trustees", source_type: "district_official" },
    ]),
    branding: { primary: "#dc2626", secondary: "#0f172a", accent: "#fff1f2", label: "Richardson Eagles red and black" },
    roster: [
      { full_name: "Vanessa Pacheco", role: "Board President", summary: "Listed on the Richardson ISD Board of Trustees page." },
    ],
    investigationNotes: ["Pull the remaining 6 Richardson ISD trustees, seat numbers, and term-end dates."],
    queueStatus: "needs_full_records_pull",
  },
  // ---- Houston metro ISDs ----
  {
    district: "Spring Branch ISD",
    district_slug: "spring_branch_isd",
    county: "Harris",
    sources: withAccessedDate([
      { url: "https://www.springbranchisd.com/about/leadership/board-of-trustees", title: "Spring Branch ISD Board of Trustees", source_type: "district_official" },
    ]),
    branding: { primary: "#1e3a8a", secondary: "#facc15", accent: "#eff6ff", label: "Spring Branch blue and gold" },
    roster: [
      { full_name: "Chris Earnest", role: "Board President", summary: "Listed on the Spring Branch ISD Board of Trustees page." },
      { full_name: "Caroline Bennett", role: "Vice President", summary: "Listed on the Spring Branch ISD Board of Trustees page." },
    ],
    investigationNotes: ["Pull the remaining 5 Spring Branch ISD trustees, seat numbers, and term-end dates."],
    queueStatus: "needs_full_records_pull",
  },
  {
    district: "Fort Bend ISD",
    district_slug: "fort_bend_isd",
    county: "Fort Bend",
    sources: withAccessedDate([
      { url: "https://www.fortbendisd.com/board", title: "Fort Bend ISD Board of Trustees", source_type: "district_official" },
    ]),
    branding: { primary: "#0c4a6e", secondary: "#facc15", accent: "#eef6ff", label: "Fort Bend ISD blue and gold" },
    roster: [
      { full_name: "Kristin Tassin", role: "Board President", summary: "Listed on the Fort Bend ISD Board of Trustees page." },
    ],
    investigationNotes: ["Pull the remaining 6 Fort Bend ISD trustees, seat numbers, and term-end dates."],
    queueStatus: "needs_full_records_pull",
  },
  {
    district: "Pasadena ISD",
    district_slug: "pasadena_isd",
    county: "Harris",
    sources: withAccessedDate([
      { url: "https://www1.pasadenaisd.org/about_us/board_of_trustees", title: "Pasadena ISD Board of Trustees", source_type: "district_official" },
    ]),
    branding: { primary: "#dc2626", secondary: "#1f2937", accent: "#fff1f2", label: "Pasadena ISD red and black" },
    roster: [
      { full_name: "Vickie Morgan", role: "Board President", summary: "Listed on the Pasadena ISD Board of Trustees page." },
    ],
    investigationNotes: ["Pull the remaining 6 Pasadena ISD trustees, seat numbers, and term-end dates."],
    queueStatus: "needs_full_records_pull",
  },
  {
    district: "Aldine ISD",
    district_slug: "aldine_isd",
    county: "Harris",
    sources: withAccessedDate([
      { url: "https://www.aldineisd.org/board-of-education/", title: "Aldine ISD Board of Education", source_type: "district_official" },
    ]),
    branding: { primary: "#1e3a8a", secondary: "#fbbf24", accent: "#eff6ff", label: "Aldine ISD blue and gold" },
    roster: [
      { full_name: "Steve Mead", role: "Board President", summary: "Listed on the Aldine ISD Board of Education page." },
    ],
    investigationNotes: ["Pull the remaining 6 Aldine ISD trustees, seat numbers, and term-end dates."],
    queueStatus: "needs_full_records_pull",
  },
  // ---- Central Texas ISDs ----
  {
    district: "Leander ISD",
    district_slug: "leander_isd",
    county: "Williamson/Travis",
    sources: withAccessedDate([
      { url: "https://www.leanderisd.org/board", title: "Leander ISD Board of Trustees", source_type: "district_official" },
    ]),
    branding: { primary: "#7c3aed", secondary: "#fbbf24", accent: "#faf5ff", label: "Leander ISD purple and gold" },
    roster: [
      { full_name: "Trish Bode", role: "Board President", summary: "Listed on the Leander ISD Board of Trustees page." },
    ],
    investigationNotes: ["Pull the remaining 6 Leander ISD trustees, seat numbers, and term-end dates."],
    queueStatus: "needs_full_records_pull",
  },
  {
    district: "Hays CISD",
    district_slug: "hays_cisd",
    county: "Hays",
    sources: withAccessedDate([
      { url: "https://www.hayscisd.net/Page/15", title: "Hays CISD Board of Trustees", source_type: "district_official" },
    ]),
    branding: { primary: "#dc2626", secondary: "#0f172a", accent: "#fff1f2", label: "Hays CISD red and black" },
    roster: [
      { full_name: "Esperanza Orosco", role: "Board President", summary: "Listed on the Hays CISD Board of Trustees page." },
    ],
    investigationNotes: ["Pull the remaining 6 Hays CISD trustees, seat numbers, and term-end dates."],
    queueStatus: "needs_full_records_pull",
  },
  // ---- Wave 2 (DFW) ----
  {
    district: "Carrollton-Farmers Branch ISD",
    district_slug: "carrollton_farmers_branch_isd",
    county: "Dallas/Denton",
    sources: withAccessedDate([
      { url: "https://www.cfbisd.edu/about-us/board-of-trustees", title: "Carrollton-Farmers Branch ISD Board of Trustees", source_type: "district_official" },
      { url: "https://www.cfbisd.edu/about-us/board-of-trustees/elections/2025", title: "CFBISD May 2025 Election Canvass", source_type: "district_official" },
    ]),
    branding: { primary: "#1e3a8a", secondary: "#fbbf24", accent: "#eff6ff", label: "CFB ISD blue and gold" },
    roster: [
      { full_name: "Cassandra Hatfield", role: "Board President", term: "2024-2027", summary: "Listed as Board President per CFBISD Board of Trustees page." },
      { full_name: "Ileana Garza-Rojas", role: "Trustee", summary: "Won May 3, 2025 CFBISD trustee election; canvassed May 14, 2025." },
      { full_name: "Kim Brady", role: "Trustee", summary: "Won May 3, 2025 CFBISD trustee election; canvassed May 14, 2025." },
      { full_name: "Paul Gilmore", role: "Trustee", summary: "Won May 3, 2025 CFBISD trustee election; canvassed May 14, 2025." },
      { full_name: "Carolyn Benavides", role: "Trustee", summary: "Sworn in to fill a CFBISD district vacancy per district announcement." },
    ],
    investigationNotes: ["Pull the remaining 2 CFBISD trustees, seat numbers, and term-end dates. Track follow-up on the school consolidation proposal."],
    queueStatus: "needs_full_records_pull",
  },
  {
    district: "Lewisville ISD",
    district_slug: "lewisville_isd",
    county: "Denton/Dallas/Tarrant",
    sources: withAccessedDate([
      { url: "https://www.lisd.net/our-district/board-of-trustees", title: "Lewisville ISD Board of Trustees", source_type: "district_official" },
      { url: "https://www.lisd.net/our-district/board-of-trustees/meet-the-board", title: "Lewisville ISD Meet the Board", source_type: "district_official" },
    ]),
    branding: { primary: "#1e3a8a", secondary: "#0f172a", accent: "#eff6ff", label: "Lewisville Farmers blue and black" },
    roster: [
      { full_name: "Jenny Proznik", role: "Board President", seat: "Place 5", term: "Term expires 2025", summary: "Listed as Lewisville ISD Board President." },
      { full_name: "Allison Lassahn", role: "Trustee", seat: "Single Member District 1", term: "Term expires 2027", summary: "Listed as Single Member District 1 trustee per the LISD Meet the Board page." },
    ],
    investigationNotes: ["Pull the remaining 5 Lewisville ISD trustees, including Vice President and Secretary, and confirm 2026 ballot races."],
    queueStatus: "needs_full_records_pull",
  },
  {
    district: "Birdville ISD",
    district_slug: "birdville_isd",
    county: "Tarrant",
    sources: withAccessedDate([
      { url: "https://www.birdvilleschools.net/our-district/board-of-trustees", title: "Birdville ISD Board of Trustees", source_type: "district_official" },
    ]),
    branding: { primary: "#0f172a", secondary: "#fbbf24", accent: "#fffbe9", label: "Birdville black and gold" },
    roster: [
      { full_name: "Ralph Kunkel", role: "Board President", summary: "Listed as 2025-26 Board President on the Birdville ISD Board of Trustees page." },
      { full_name: "Brenda Sanders-Wise", role: "Vice President", summary: "Listed as 2025-26 Vice President on the Birdville ISD Board of Trustees page." },
      { full_name: "Joe Tolbert", role: "Secretary", summary: "Listed as 2025-26 Secretary on the Birdville ISD Board of Trustees page." },
    ],
    investigationNotes: ["Pull the remaining 4 Birdville ISD trustees and seat-by-place assignments."],
    queueStatus: "needs_full_records_pull",
  },
  {
    district: "Hurst-Euless-Bedford ISD",
    district_slug: "hurst_euless_bedford_isd",
    county: "Tarrant",
    sources: withAccessedDate([
      { url: "https://www.hebisd.edu/about/school-board-policies/school-board-policies", title: "HEB ISD School Board & Policies", source_type: "district_official" },
      { url: "https://www.hebisd.edu/about/school-board-policies/heb-isd-election-information/2025-heb-isd-board-of-trustees-election", title: "HEB ISD 2025 Board of Trustees Election", source_type: "district_official" },
    ]),
    branding: { primary: "#1e3a8a", secondary: "#dc2626", accent: "#eff6ff", label: "HEB ISD blue and red" },
    roster: [
      { full_name: "Matt Romero", role: "Board President", seat: "Place 3", summary: "Listed as Board President per HEB ISD board records." },
      { full_name: "John Biggan", role: "Trustee", seat: "Place 2", summary: "Listed as Place 2 trustee per HEB ISD board records." },
      { full_name: "Becky Ewart", role: "Trustee", seat: "Place 4", summary: "First elected May 2025 per HEB ISD election records." },
      { full_name: "Fred Campos", role: "Trustee", seat: "Place 7", summary: "Listed as Place 7 trustee per HEB ISD board records." },
    ],
    investigationNotes: ["Pull the remaining 3 HEB ISD trustees (Places 1, 5, 6), Vice President / Secretary designations, and term-end dates."],
    queueStatus: "needs_full_records_pull",
  },
  {
    district: "Keller ISD",
    district_slug: "keller_isd",
    county: "Tarrant",
    sources: withAccessedDate([
      { url: "https://www.kellerisd.net/board-of-trustees", title: "Keller ISD Board of Trustees", source_type: "district_official" },
      { url: "https://communityimpact.com/dallas-fort-worth/keller-roanoke-northeast-fort-worth/education/2025/05/14/new-keller-isd-board-members-sworn-in-birt-elected-president/", title: "Community Impact — Keller ISD board sworn in, Birt elected president (May 2025)", source_type: "news" },
      { url: "https://fortworthreport.org/2025/12/18/special-prosecutors-appointed-in-case-to-remove-keller-isd-trustees/", title: "Fort Worth Report — Special prosecutors appointed in Keller ISD removal case (Dec 2025)", source_type: "news" },
    ]),
    branding: { primary: "#dc2626", secondary: "#0f172a", accent: "#fff1f2", label: "Keller Indians red and black" },
    roster: [
      { full_name: "John Birt", role: "Board President", seat: "Place 4", summary: "Elected Keller ISD Board President in May 2025." },
      { full_name: "Heather Washington", role: "Vice President", seat: "Place 7", summary: "Elected Keller ISD Vice President in May 2025." },
      { full_name: "Randy Campbell", role: "Trustee", seat: "Place 1", term: "Took office May 2025", summary: "First-term trustee elected to Place 1 in May 2025." },
      { full_name: "Jennifer Erickson", role: "Trustee", seat: "Place 2", term: "Took office May 2025", summary: "First-term trustee elected to Place 2 in May 2025." },
      { full_name: "Chelsea Kelly", role: "Trustee", seat: "Place 3", term: "Took office August 2024", summary: "First-term Place 3 trustee, took office August 2024." },
      { full_name: "Chris Coker", role: "Trustee", seat: "Place 5", term: "Assumed office May 2023", summary: "Place 5 trustee in third year of first term." },
    ],
    investigationNotes: ["Place 6 is currently vacant. Track removal-petition litigation against three trustees (Dec 2025 special prosecutors appointment) and follow-up on the proposed Keller ISD split and 2025 superintendent resignation."],
    queueStatus: "dossiers_started",
  },
];
