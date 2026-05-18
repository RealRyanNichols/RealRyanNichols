import { predatorWatchSeedProfiles } from "@/data/predator-watch";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";
import type {
  PredatorProfile,
  PredatorProfileSource,
  PredatorPublicNote,
  PredatorRegistryStatus,
  PredatorRiskLevel,
  PredatorSourceFreshness,
  PredatorSourceType,
  PredatorWatchStats,
} from "@/types/predator-watch";

type PredatorSourceRow = {
  id?: string;
  title?: string | null;
  url?: string | null;
  source_type?: string | null;
  last_checked_at?: string | null;
  detail?: string | null;
};

type PredatorPublicNoteRow = {
  id?: string;
  label?: string | null;
  body?: string | null;
  source_label?: string | null;
  status?: string | null;
  published_at?: string | null;
};

type PredatorProfileRow = {
  slug?: string | null;
  full_name?: string | null;
  aliases?: string[] | null;
  city?: string | null;
  county?: string | null;
  state?: string | null;
  registry_address?: string | null;
  registry_status?: string | null;
  risk_level?: string | null;
  registration_type?: string | null;
  offense?: string | null;
  offense_category?: string | null;
  conviction_date?: string | null;
  punishment?: string | null;
  victim_age?: string | null;
  registering_agency?: string | null;
  official_profile_url?: string | null;
  photo_url?: string | null;
  photo_source_url?: string | null;
  last_verified_at?: string | null;
  source_freshness?: string | null;
  watch_priority?: number | null;
  priority_reason?: string | null;
  is_wanted?: boolean | null;
  warrant_source_url?: string | null;
  failure_to_register?: boolean | null;
  civil_commitment?: boolean | null;
  recent_address_change?: boolean | null;
  records_show?: string[] | null;
  safety_notes?: string[] | null;
  predator_profile_sources?: PredatorSourceRow[] | null;
  predator_public_notes?: PredatorPublicNoteRow[] | null;
};

const riskLevels = new Set<PredatorRiskLevel>([
  "low",
  "moderate",
  "high",
  "civil_commitment",
  "not_reported",
]);

const registryStatuses = new Set<PredatorRegistryStatus>([
  "registered",
  "wanted",
  "failure_to_register",
  "address_change",
  "under_review",
  "inactive",
]);

const sourceTypes = new Set<PredatorSourceType>([
  "txdps-registry",
  "nsopw",
  "court-record",
  "sheriff-record",
  "police-record",
  "official-notice",
  "public-record",
]);

const sourceFreshness = new Set<PredatorSourceFreshness>([
  "checked_30_days",
  "checked_90_days",
  "stale",
  "needs_recheck",
]);

function cleanString(value: unknown, fallback = "") {
  if (typeof value !== "string") return fallback;
  return value.trim() || fallback;
}

function optionalString(value: unknown) {
  const cleaned = cleanString(value);
  return cleaned || undefined;
}

function cleanArray(value: unknown) {
  return Array.isArray(value)
    ? value.map((item) => cleanString(item)).filter(Boolean)
    : [];
}

function normalizeRiskLevel(value: unknown): PredatorRiskLevel {
  return typeof value === "string" && riskLevels.has(value as PredatorRiskLevel)
    ? (value as PredatorRiskLevel)
    : "not_reported";
}

function normalizeRegistryStatus(value: unknown): PredatorRegistryStatus {
  return typeof value === "string" && registryStatuses.has(value as PredatorRegistryStatus)
    ? (value as PredatorRegistryStatus)
    : "under_review";
}

function normalizeSourceType(value: unknown): PredatorSourceType {
  return typeof value === "string" && sourceTypes.has(value as PredatorSourceType)
    ? (value as PredatorSourceType)
    : "public-record";
}

function normalizeSourceFreshness(value: unknown): PredatorSourceFreshness {
  return typeof value === "string" && sourceFreshness.has(value as PredatorSourceFreshness)
    ? (value as PredatorSourceFreshness)
    : "needs_recheck";
}

function normalizeDate(value: unknown) {
  return cleanString(value, new Date().toISOString().slice(0, 10)).slice(0, 10);
}

function sourceFromRow(row: PredatorSourceRow): PredatorProfileSource | null {
  const title = cleanString(row.title);
  const url = cleanString(row.url);
  if (!title || !url) return null;

  return {
    id: row.id,
    title,
    url,
    sourceType: normalizeSourceType(row.source_type),
    lastCheckedAt: normalizeDate(row.last_checked_at),
    detail: optionalString(row.detail),
  };
}

function noteFromRow(row: PredatorPublicNoteRow): PredatorPublicNote | null {
  if (row.status && row.status !== "published") return null;
  const label = cleanString(row.label);
  const body = cleanString(row.body);
  if (!label || !body) return null;

  return {
    id: row.id,
    label,
    body,
    sourceLabel: optionalString(row.source_label),
    publishedAt: normalizeDate(row.published_at),
  };
}

function profileFromRow(row: PredatorProfileRow): PredatorProfile | null {
  const slug = cleanString(row.slug);
  const fullName = cleanString(row.full_name);
  const county = cleanString(row.county);
  const city = cleanString(row.city);
  const offense = cleanString(row.offense);
  const officialProfileUrl = cleanString(row.official_profile_url);

  if (!slug || !fullName || !county || !city || !offense || !officialProfileUrl) return null;

  return {
    slug,
    fullName,
    aliases: cleanArray(row.aliases),
    city,
    county,
    state: "TX",
    registryAddress: optionalString(row.registry_address),
    registryStatus: normalizeRegistryStatus(row.registry_status),
    riskLevel: normalizeRiskLevel(row.risk_level),
    registrationType: optionalString(row.registration_type),
    offense,
    offenseCategory: cleanString(row.offense_category, "Registry offense"),
    convictionDate: optionalString(row.conviction_date),
    punishment: optionalString(row.punishment),
    victimAge: optionalString(row.victim_age),
    registeringAgency: optionalString(row.registering_agency),
    officialProfileUrl,
    photoUrl: optionalString(row.photo_url),
    photoSourceUrl: optionalString(row.photo_source_url),
    lastVerifiedAt: normalizeDate(row.last_verified_at),
    sourceFreshness: normalizeSourceFreshness(row.source_freshness),
    watchPriority: Math.max(0, Number(row.watch_priority ?? 0)),
    priorityReason: cleanString(row.priority_reason, "Official registry record requires review."),
    isWanted: Boolean(row.is_wanted),
    warrantSourceUrl: optionalString(row.warrant_source_url),
    failureToRegister: Boolean(row.failure_to_register),
    civilCommitment: Boolean(row.civil_commitment),
    recentAddressChange: Boolean(row.recent_address_change),
    recordsShow: cleanArray(row.records_show),
    safetyNotes: cleanArray(row.safety_notes),
    sources: (row.predator_profile_sources ?? []).map(sourceFromRow).filter(Boolean) as PredatorProfileSource[],
    publicNotes: (row.predator_public_notes ?? []).map(noteFromRow).filter(Boolean) as PredatorPublicNote[],
  };
}

function sortProfiles(profiles: PredatorProfile[]) {
  return [...profiles].sort(
    (a, b) =>
      b.watchPriority - a.watchPriority ||
      a.county.localeCompare(b.county) ||
      a.city.localeCompare(b.city) ||
      a.fullName.localeCompare(b.fullName),
  );
}

export async function getPredatorWatchProfiles(): Promise<PredatorProfile[]> {
  const admin = getSupabaseAdminClient();
  if (!admin) return sortProfiles(predatorWatchSeedProfiles);

  const { data, error } = await admin
    .from("predator_profiles")
    .select(
      "*, predator_profile_sources(*), predator_public_notes!predator_public_notes_profile_id_fkey(*)",
    )
    .eq("status", "published")
    .order("watch_priority", { ascending: false });

  if (error) {
    console.error(JSON.stringify({ level: "error", msg: "predator_profiles_fetch_failed", error: error.message }));
    return sortProfiles(predatorWatchSeedProfiles);
  }

  const profiles = ((data ?? []) as PredatorProfileRow[])
    .map(profileFromRow)
    .filter(Boolean) as PredatorProfile[];

  return sortProfiles(profiles.length ? profiles : predatorWatchSeedProfiles);
}

export async function getPredatorWatchProfileBySlug(slug: string): Promise<PredatorProfile | undefined> {
  const admin = getSupabaseAdminClient();
  const seedProfile = predatorWatchSeedProfiles.find((profile) => profile.slug === slug);
  if (!admin) return seedProfile;

  const { data, error } = await admin
    .from("predator_profiles")
    .select(
      "*, predator_profile_sources(*), predator_public_notes!predator_public_notes_profile_id_fkey(*)",
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    console.error(JSON.stringify({ level: "error", msg: "predator_profile_fetch_failed", error: error.message }));
    return seedProfile;
  }

  return data ? profileFromRow(data as PredatorProfileRow) ?? seedProfile : seedProfile;
}

export function getPredatorWatchStats(profiles: PredatorProfile[]): PredatorWatchStats {
  return {
    totalProfiles: profiles.length,
    highRiskOrCivil: profiles.filter((profile) => profile.riskLevel === "high" || profile.civilCommitment).length,
    wantedOrFailureToRegister: profiles.filter((profile) => profile.isWanted || profile.failureToRegister).length,
    recentAddressChanges: profiles.filter((profile) => profile.recentAddressChange).length,
    countiesCovered: new Set(profiles.map((profile) => profile.county)).size,
    sourceLinks: new Set(profiles.flatMap((profile) => profile.sources.map((source) => source.url))).size,
    reportsPublished: profiles.reduce((total, profile) => total + profile.publicNotes.length, 0),
  };
}

export function filterPredatorWatchProfiles(
  profiles: PredatorProfile[],
  filters: {
    q?: string;
    county?: string;
    risk?: string;
    status?: string;
    offense?: string;
    freshness?: string;
  },
) {
  const q = cleanString(filters.q).toLowerCase();
  const county = cleanString(filters.county);
  const risk = cleanString(filters.risk);
  const status = cleanString(filters.status);
  const offense = cleanString(filters.offense).toLowerCase();
  const freshness = cleanString(filters.freshness);

  return profiles.filter((profile) => {
    const matchesSearch =
      !q ||
      [profile.fullName, profile.city, profile.county, profile.offense, ...profile.aliases]
        .join(" ")
        .toLowerCase()
        .includes(q);
    const matchesCounty = !county || profile.county === county;
    const matchesRisk = !risk || profile.riskLevel === risk;
    const matchesStatus = !status || profile.registryStatus === status;
    const matchesOffense = !offense || profile.offenseCategory.toLowerCase().includes(offense);
    const matchesFreshness = !freshness || profile.sourceFreshness === freshness;

    return matchesSearch && matchesCounty && matchesRisk && matchesStatus && matchesOffense && matchesFreshness;
  });
}
