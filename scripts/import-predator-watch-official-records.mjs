#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { createClient } from "@supabase/supabase-js";

const officialSourceTypes = new Set([
  "txdps-registry",
  "nsopw",
  "court-record",
  "sheriff-record",
  "police-record",
  "official-notice",
  "public-record",
]);

const requiredFields = [
  "slug",
  "fullName",
  "city",
  "county",
  "offense",
  "offenseCategory",
  "officialProfileUrl",
  "lastVerifiedAt",
  "sources",
];

function argValue(name) {
  const index = process.argv.indexOf(name);
  return index === -1 ? null : process.argv[index + 1] ?? null;
}

function fail(message) {
  console.error(message);
  process.exit(1);
}

function validateUrl(url, field) {
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("unsupported protocol");
    return parsed.toString();
  } catch {
    fail(`Invalid ${field}: ${url}`);
  }
}

function validateRecord(record, index) {
  for (const field of requiredFields) {
    if (!record[field] || (Array.isArray(record[field]) && record[field].length === 0)) {
      fail(`Record ${index + 1} is missing ${field}.`);
    }
  }

  validateUrl(record.officialProfileUrl, `record ${index + 1} officialProfileUrl`);
  if (record.photoUrl) validateUrl(record.photoUrl, `record ${index + 1} photoUrl`);
  if (record.photoSourceUrl) validateUrl(record.photoSourceUrl, `record ${index + 1} photoSourceUrl`);

  for (const source of record.sources) {
    if (!officialSourceTypes.has(source.sourceType)) {
      fail(`Record ${index + 1} has a non-official source type: ${source.sourceType}`);
    }
    validateUrl(source.url, `record ${index + 1} source url`);
  }
}

function toProfileRow(record) {
  return {
    slug: record.slug,
    full_name: record.fullName,
    aliases: record.aliases ?? [],
    city: record.city,
    county: record.county,
    state: "TX",
    registry_address: record.registryAddress ?? null,
    registry_status: record.registryStatus ?? "registered",
    risk_level: record.riskLevel ?? "not_reported",
    registration_type: record.registrationType ?? null,
    offense: record.offense,
    offense_category: record.offenseCategory,
    conviction_date: record.convictionDate ?? null,
    punishment: record.punishment ?? null,
    victim_age: record.victimAge ?? null,
    registering_agency: record.registeringAgency ?? null,
    official_profile_url: record.officialProfileUrl,
    photo_url: record.photoUrl ?? null,
    photo_source_url: record.photoSourceUrl ?? null,
    last_verified_at: record.lastVerifiedAt,
    source_freshness: record.sourceFreshness ?? "checked_30_days",
    watch_priority: record.watchPriority ?? 0,
    priority_reason: record.priorityReason ?? "Official registry record requires review.",
    is_wanted: Boolean(record.isWanted),
    warrant_source_url: record.warrantSourceUrl ?? null,
    failure_to_register: Boolean(record.failureToRegister),
    civil_commitment: Boolean(record.civilCommitment),
    recent_address_change: Boolean(record.recentAddressChange),
    records_show: record.recordsShow ?? [],
    safety_notes: record.safetyNotes ?? [],
    status: record.status ?? "review",
  };
}

async function main() {
  const filePath = argValue("--file");
  const apply = process.argv.includes("--apply");
  if (!filePath) fail("Usage: node scripts/import-predator-watch-official-records.mjs --file ./records.json [--apply]");

  const records = JSON.parse(await readFile(filePath, "utf8"));
  if (!Array.isArray(records)) fail("Input file must be a JSON array.");
  records.forEach(validateRecord);

  console.log(`Validated ${records.length} official-source Predator Watch records.`);
  if (!apply) {
    console.log("Dry run only. Re-run with --apply to upsert into Supabase.");
    return;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) fail("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  for (const record of records) {
    const { data: profile, error: profileError } = await supabase
      .from("predator_profiles")
      .upsert(toProfileRow(record), { onConflict: "slug" })
      .select("id")
      .single();

    if (profileError || !profile) fail(`Profile upsert failed for ${record.slug}: ${profileError?.message}`);

    await supabase.from("predator_profile_sources").delete().eq("profile_id", profile.id);
    const sourceRows = record.sources.map((source) => ({
      profile_id: profile.id,
      title: source.title,
      url: source.url,
      source_type: source.sourceType,
      last_checked_at: source.lastCheckedAt ?? record.lastVerifiedAt,
      detail: source.detail ?? null,
    }));
    const { error: sourcesError } = await supabase.from("predator_profile_sources").insert(sourceRows);
    if (sourcesError) fail(`Source import failed for ${record.slug}: ${sourcesError.message}`);

    console.log(`Imported ${record.slug}`);
  }
}

main().catch((error) => fail(error instanceof Error ? error.message : String(error)));
