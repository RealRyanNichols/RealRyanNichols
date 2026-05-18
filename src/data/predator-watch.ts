import type { PredatorProfile, PredatorProfileSource } from "@/types/predator-watch";

const checkedAt = "2026-05-17";

function source(
  title: string,
  url: string,
  sourceType: PredatorProfileSource["sourceType"],
  detail?: string,
): PredatorProfileSource {
  return {
    title,
    url,
    sourceType,
    lastCheckedAt: checkedAt,
    detail,
  };
}

export const eastTexasPredatorWatchCounties = [
  "Gregg",
  "Smith",
  "Harrison",
  "Upshur",
  "Rusk",
  "Panola",
  "Cherokee",
  "Anderson",
  "Henderson",
  "Van Zandt",
  "Wood",
  "Rains",
  "Camp",
  "Morris",
  "Titus",
  "Cass",
  "Marion",
  "Bowie",
  "Nacogdoches",
  "Angelina",
  "Shelby",
  "Sabine",
  "San Augustine",
] as const;

export const predatorWatchSourceAnchors = [
  source(
    "Texas DPS Sex Offender Registration Program",
    "https://www.dps.texas.gov/section/crime-records/texas-sex-offender-registration-program",
    "txdps-registry",
    "DPS explains Texas registration, public notification, local authority registration, and public database access.",
  ),
  source(
    "Texas DPS Sex Offender Registration FAQ",
    "https://www.dps.texas.gov/section/crime-records/faq/criminal-history-records-and-texas-sex-offender-registration-program-faq",
    "txdps-registry",
    "DPS lists public and non-public fields, registration duties, risk levels, and agency update paths.",
  ),
  source(
    "Dru Sjodin National Sex Offender Public Website Conditions",
    "https://organizations.nsopw.gov/Conditions",
    "nsopw",
    "DOJ warns that registry data can be stale and may not be used to threaten, intimidate, or harass.",
  ),
  source(
    "NSOPW After Your Search",
    "https://www.nsopw.gov/safety-and-education/after-your-search",
    "nsopw",
    "DOJ guidance points users to local law enforcement for risk details and reporting concerns.",
  ),
  source(
    "FBI Sex Offender Registry Websites overview",
    "https://www.fbi.gov/how-we-can-help-you/scams-and-safety/sex-offender-registry",
    "nsopw",
    "FBI describes NSOPW as the national public search gateway and distinguishes it from law-enforcement-only registries.",
  ),
] as const;

export const predatorWatchImportPlan = {
  title: "East Texas Predator Watch official-record import",
  region: "East Texas core counties",
  summary:
    "Profiles must be built from Texas DPS, NSOPW, court records, sheriff records, police records, or other official public sources. Third-party mugshot scrapes and unsourced allegations stay out of v1.",
  sourceLinks: predatorWatchSourceAnchors,
  counties: eastTexasPredatorWatchCounties,
} as const;

export const predatorWatchSeedProfiles: PredatorProfile[] = [];
