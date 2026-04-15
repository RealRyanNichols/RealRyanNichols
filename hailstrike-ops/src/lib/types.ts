export interface NWSAlert {
  id: string;
  properties: {
    id: string;
    event: string;
    headline: string;
    description: string;
    severity: string;
    urgency: string;
    areaDesc: string;
    effective: string;
    expires: string;
    parameters: {
      maxHailSize?: string[];
      hailThreat?: string[];
      thunderstormDamageThreat?: string[];
    };
  };
  geometry: {
    type: string;
    coordinates: number[][][];
  } | null;
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

export interface HailEventClient {
  id: string;
  nwsAlertId?: string;
  latitude: number;
  longitude: number;
  city: string;
  county: string;
  state: string;
  hailSize: number;
  source: string;
  sourceDetail?: string;
  damage: string;
  windSpeed?: number;
  verified: boolean;
  reportCount: number;
  avgHomeValue?: number;
  medianIncome?: number;
  population?: number;
}

export interface BusinessResult {
  name: string;
  address: string;
  phone?: string;
  website?: string;
  type: string;
  lat: number;
  lng: number;
}

export interface DemographicsData {
  medianHomeValue: number;
  medianIncome: number;
  population: number;
  county: string;
  state: string;
}
