import fs from "fs";
import path from "path";

export type ResearchStatus = "initial_dossier" | "stub" | "needs_review" | "complete" | string;

export interface SourceLink {
  url: string;
  title?: string;
  accessed_date?: string;
  source_type?: string;
}

export interface ConflictRecord {
  type?: string;
  description: string;
  severity?: string;
  fact_label?: string;
  source_url?: string;
}

export interface VoteRecord {
  meeting_date?: string;
  item?: string;
  vote?: string;
  board_outcome?: string;
  source_url?: string;
}

export interface CandidateDossier {
  candidate_id: string;
  full_name: string;
  preferred_name?: string;
  age?: number | string | null;
  hometown?: string;
  occupation?: string;
  employer?: string;
  district: string;
  district_slug: string;
  county: string;
  state: string;
  seat?: string;
  role?: string;
  incumbent?: boolean;
  years_on_board?: number | null;
  election_date?: string;
  election_type?: string;
  on_2026_ballot?: boolean;
  unopposed?: boolean | null;
  opponents?: string[];
  party_registration?: string;
  social_media?: Record<string, string>;
  content_themes?: string[];
  notable_statements?: Array<{
    quote_or_paraphrase?: string;
    date?: string;
    platform?: string;
    source_url?: string;
    fact_label?: string;
  }>;
  education_policy_positions?: Record<string, string>;
  red_flags?: ConflictRecord[];
  summary?: string;
  analyst_notes?: string;
  research_gaps?: string[];
  sources?: SourceLink[];
  status?: ResearchStatus;
  last_updated?: string;
  about_public_record?: {
    complete_employment_timeline?: Array<{
      employer?: string;
      title?: string;
      source_url?: string;
      notes?: string;
    }>;
    affiliations_full_inventory?: Array<{
      organization?: string;
      role?: string;
      years?: string;
      source_url?: string;
    }>;
    conflicts_of_interest_inventory?: ConflictRecord[];
    board_performance_incumbents_only?: {
      notable_votes?: VoteRecord[];
      committee_assignments?: string[];
      meeting_attendance_pct?: number | null;
      meetings_missed_count?: number | null;
    };
    about_summary_narrative?: string;
  };
}

export interface DistrictResearch {
  district: string;
  district_slug: string;
  county: string;
  candidates: CandidateDossier[];
  overview?: {
    title: string;
    quickFacts: Array<{ label: string; value: string }>;
    rawText: string;
  };
}

const RESEARCH_ROOT = path.join(
  process.cwd(),
  "school_boards",
  "texas",
  "east_texas"
);

function collectFiles(dir: string, extension: string): string[] {
  const files: string[] = [];

  try {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...collectFiles(fullPath, extension));
      } else if (entry.isFile() && entry.name.endsWith(extension)) {
        files.push(fullPath);
      }
    }
  } catch {
    return files;
  }

  return files;
}

function readJson<T>(filePath: string): T | undefined {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
  } catch {
    return undefined;
  }
}

function readOverview(dir: string): DistrictResearch["overview"] {
  const filePath = path.join(dir, "_district_overview.md");
  if (!fs.existsSync(filePath)) return undefined;

  const rawText = fs.readFileSync(filePath, "utf8");
  const title = rawText.match(/^#\s+(.+)$/m)?.[1] ?? "District Overview";
  const quickFacts: Array<{ label: string; value: string }> = [];
  const tableLines = rawText
    .split("\n")
    .filter((line) => line.startsWith("|") && !line.includes("---"));

  for (const line of tableLines.slice(1)) {
    const cells = line
      .split("|")
      .map((cell) => cell.trim().replace(/\*\*/g, ""))
      .filter(Boolean);
    if (cells.length >= 2) {
      quickFacts.push({ label: cells[0], value: cells[1].replace(/\[(.+?)\]\(.+?\)/g, "$1") });
    }
  }

  return { title, quickFacts: quickFacts.slice(0, 10), rawText };
}

export function getSchoolBoardDossiers(): CandidateDossier[] {
  return collectFiles(RESEARCH_ROOT, ".json")
    .map((file) => readJson<CandidateDossier>(file))
    .filter((candidate): candidate is CandidateDossier => Boolean(candidate?.candidate_id))
    .sort((a, b) => {
      const districtCompare = a.district.localeCompare(b.district);
      if (districtCompare !== 0) return districtCompare;
      return (a.seat ?? a.full_name).localeCompare(b.seat ?? b.full_name);
    });
}

export function getSchoolBoardDistricts(): DistrictResearch[] {
  const bySlug = new Map<string, DistrictResearch>();
  const fileByCandidateId = new Map<string, string>();

  for (const file of collectFiles(RESEARCH_ROOT, ".json")) {
    const candidate = readJson<CandidateDossier>(file);
    if (candidate?.candidate_id) {
      fileByCandidateId.set(candidate.candidate_id, file);
    }
  }

  for (const candidate of getSchoolBoardDossiers()) {
    const existing = bySlug.get(candidate.district_slug);
    if (existing) {
      existing.candidates.push(candidate);
    } else {
      bySlug.set(candidate.district_slug, {
        district: candidate.district,
        district_slug: candidate.district_slug,
        county: candidate.county,
        candidates: [candidate],
      });
    }
  }

  for (const district of bySlug.values()) {
    const candidateFile = fileByCandidateId.get(district.candidates[0]?.candidate_id ?? "");
    const overviewDir = candidateFile ? path.dirname(candidateFile) : undefined;
    if (overviewDir) {
      district.overview = readOverview(overviewDir);
    }
  }

  return Array.from(bySlug.values()).sort((a, b) => a.district.localeCompare(b.district));
}

export function getSchoolBoardDistrict(slug: string): DistrictResearch | undefined {
  return getSchoolBoardDistricts().find((district) => district.district_slug === slug);
}

export function getSchoolBoardCandidate(id: string): CandidateDossier | undefined {
  return getSchoolBoardDossiers().find((candidate) => candidate.candidate_id === id);
}

export function getCandidateGoodRecords(candidate: CandidateDossier): string[] {
  const items = new Set<string>();

  if (candidate.incumbent && candidate.seat) {
    items.add(`Serves ${candidate.seat}${candidate.role ? ` as ${candidate.role}` : ""} on the ${candidate.district} board.`);
  }
  if (candidate.occupation && !candidate.occupation.includes("REQUIRES_FURTHER_EVIDENCE")) {
    items.add(`Public profile lists occupation as ${candidate.occupation}.`);
  }
  candidate.about_public_record?.affiliations_full_inventory?.slice(0, 3).forEach((item) => {
    if (item.organization && item.role) {
      items.add(`${item.role} with ${item.organization}.`);
    }
  });
  candidate.about_public_record?.complete_employment_timeline?.slice(0, 2).forEach((item) => {
    if (item.employer && item.title && !item.title.includes("REQUIRES_FURTHER_EVIDENCE")) {
      items.add(`${item.title} at ${item.employer}.`);
    }
  });
  candidate.about_public_record?.board_performance_incumbents_only?.notable_votes?.slice(0, 2).forEach((vote) => {
    if (vote.item) items.add(`Board record includes ${vote.item}.`);
  });

  return Array.from(items).slice(0, 6);
}

export function getCandidateFlags(candidate: CandidateDossier): ConflictRecord[] {
  return [
    ...(candidate.red_flags ?? []),
    ...(candidate.about_public_record?.conflicts_of_interest_inventory ?? []),
  ].filter((flag, index, flags) => {
    const key = flag.description;
    return flags.findIndex((item) => item.description === key) === index;
  });
}

export function getCandidateGaps(candidate: CandidateDossier): string[] {
  const gaps = new Set(candidate.research_gaps ?? []);
  const serialized = JSON.stringify(candidate);

  if (serialized.includes("REQUIRES_FURTHER_EVIDENCE")) {
    gaps.add("One or more profile fields still need direct source confirmation.");
  }
  if (candidate.unopposed === null || candidate.unopposed === undefined) {
    gaps.add("Opponent status needs direct election filing confirmation.");
  }
  if (!candidate.about_public_record?.board_performance_incumbents_only?.notable_votes?.length) {
    gaps.add("Board attendance and vote record needs deeper minutes review.");
  }

  return Array.from(gaps).slice(0, 8);
}

export function getShareLine(candidate: CandidateDossier): string {
  const flags = getCandidateFlags(candidate);
  const gaps = getCandidateGaps(candidate);
  const good = getCandidateGoodRecords(candidate);

  if (flags[0]) return flags[0].description;
  if (candidate.summary) return candidate.summary;
  if (good[0]) return good[0];
  return gaps[0] ?? `${candidate.full_name} has a RepWatchr public-record profile in progress.`;
}

export function getSchoolBoardStats() {
  const candidates = getSchoolBoardDossiers();
  const districts = getSchoolBoardDistricts();
  const onBallot = candidates.filter((candidate) => candidate.on_2026_ballot || candidate.election_date?.includes("2026"));
  const sourceCount = new Set(candidates.flatMap((candidate) => candidate.sources?.map((source) => source.url) ?? [])).size;
  const flagCount = candidates.reduce((total, candidate) => total + getCandidateFlags(candidate).length, 0);
  const gapCount = candidates.reduce((total, candidate) => total + getCandidateGaps(candidate).length, 0);

  return {
    candidates: candidates.length,
    districts: districts.length,
    onBallot: onBallot.length,
    sourceCount,
    flagCount,
    gapCount,
  };
}
