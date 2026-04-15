export type IndustryMode =
  | "auto"
  | "roofing"
  | "auto-glass"
  | "solar-hvac"
  | "fleet"
  | "commercial";

export interface IndustryConfig {
  id: IndustryMode;
  label: string;
  icon: string;
  businessTypes: string[];
  googlePlaceTypes: string[];
  smsTemplate: string;
  emailSubject: string;
  emailTemplate: string;
  adHeadline: string;
  adBody: string;
}

export interface HailReport {
  id: string;
  lat: number;
  lon: number;
  size: number;
  city: string;
  county: string;
  state: string;
  time: string;
  comments: string;
  source: "nws" | "spc" | "iem";
  damage: string;
  verified: boolean;
  nwsAlertId?: string;
  geometry?: GeoJSON.Geometry | null;
  windSpeed?: number;
  hailThreat?: string;
}

export interface NWSAlert {
  id: string;
  properties: {
    id: string;
    event: string;
    headline: string;
    description: string;
    severity: string;
    certainty: string;
    areaDesc: string;
    effective: string;
    expires: string;
    parameters?: {
      maxHailSize?: string[];
      hailThreat?: string[];
      thunderstormDamageThreat?: string[];
    };
  };
  geometry: GeoJSON.Geometry | null;
}

export interface SPCReport {
  time: string;
  size: number;
  location: string;
  county: string;
  state: string;
  lat: number;
  lon: number;
  comments: string;
}

export interface BusinessResult {
  id?: string;
  name: string;
  type: string;
  address: string;
  phone?: string;
  website?: string;
  lat: number;
  lon: number;
  status?: string;
  ownerName?: string;
  email?: string;
  notes?: string;
  hailExperience?: string;
  carsPerMonth?: number;
  outreachMethod?: string;
  outreachSentAt?: string;
  industryMode?: string;
}

export interface DemographicsData {
  medianHomeValue: number | null;
  medianIncome: number | null;
  population: number | null;
  countyName: string;
  stateFips: string;
  countyFips: string;
}
