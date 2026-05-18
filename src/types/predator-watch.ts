export type PredatorRiskLevel = "low" | "moderate" | "high" | "civil_commitment" | "not_reported";

export type PredatorRegistryStatus =
  | "registered"
  | "wanted"
  | "failure_to_register"
  | "address_change"
  | "under_review"
  | "inactive";

export type PredatorSourceType =
  | "txdps-registry"
  | "nsopw"
  | "court-record"
  | "sheriff-record"
  | "police-record"
  | "official-notice"
  | "public-record";

export type PredatorSourceFreshness = "checked_30_days" | "checked_90_days" | "stale" | "needs_recheck";

export interface PredatorProfileSource {
  id?: string;
  title: string;
  url: string;
  sourceType: PredatorSourceType;
  lastCheckedAt: string;
  detail?: string;
}

export interface PredatorPublicNote {
  id?: string;
  label: string;
  body: string;
  sourceLabel?: string;
  publishedAt: string;
}

export interface PredatorProfile {
  slug: string;
  fullName: string;
  aliases: string[];
  city: string;
  county: string;
  state: "TX";
  registryAddress?: string;
  registryStatus: PredatorRegistryStatus;
  riskLevel: PredatorRiskLevel;
  registrationType?: string;
  offense: string;
  offenseCategory: string;
  convictionDate?: string;
  punishment?: string;
  victimAge?: string;
  registeringAgency?: string;
  officialProfileUrl: string;
  photoUrl?: string;
  photoSourceUrl?: string;
  lastVerifiedAt: string;
  sourceFreshness: PredatorSourceFreshness;
  watchPriority: number;
  priorityReason: string;
  isWanted: boolean;
  warrantSourceUrl?: string;
  failureToRegister: boolean;
  civilCommitment: boolean;
  recentAddressChange: boolean;
  recordsShow: string[];
  safetyNotes: string[];
  sources: PredatorProfileSource[];
  publicNotes: PredatorPublicNote[];
}

export interface PredatorWatchStats {
  totalProfiles: number;
  highRiskOrCivil: number;
  wantedOrFailureToRegister: number;
  recentAddressChanges: number;
  countiesCovered: number;
  sourceLinks: number;
  reportsPublished: number;
}
