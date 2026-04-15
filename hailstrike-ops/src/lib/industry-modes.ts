export type IndustryMode = "auto" | "roofing" | "autoglass" | "solar" | "fleet" | "commercial";

export const INDUSTRY_MODES: Record<IndustryMode, { label: string; icon: string; types: string[]; description: string }> = {
  auto: {
    label: "Automotive / PDR",
    icon: "🚗",
    types: ["car_repair", "car_dealer", "car_wash"],
    description: "Body shops, dealerships, PDR, detailers, fleet service",
  },
  roofing: {
    label: "Roofing",
    icon: "🏠",
    types: ["roofing_contractor", "general_contractor"],
    description: "Roofing contractors, restoration, insurance adjusters",
  },
  autoglass: {
    label: "Auto Glass",
    icon: "🪟",
    types: ["car_repair"],
    description: "Auto glass, windshield repair, mobile glass",
  },
  solar: {
    label: "Solar / HVAC",
    icon: "☀️",
    types: ["electrician"],
    description: "Solar installers, HVAC contractors, panel repair",
  },
  fleet: {
    label: "Fleet",
    icon: "🚚",
    types: ["car_rental_agency", "car_repair"],
    description: "Rental agencies, fleet managers, delivery companies",
  },
  commercial: {
    label: "Commercial",
    icon: "🏢",
    types: ["roofing_contractor", "general_contractor"],
    description: "Property managers, commercial roofing, facility maintenance",
  },
};

export const OUTREACH_TEMPLATES: Record<IndustryMode, { sms: string; email: { subject: string; body: string } }> = {
  auto: {
    sms: "Hi {name}, a {size}\" hail storm just hit {city}. Missouri Dent Bully has mobile PDR teams ready to handle your overflow. We come to you — no customer disruption. Reply for availability.",
    email: {
      subject: "Hail Storm in {city} — PDR Overflow Support Available",
      body: "Hi {name},\n\nA confirmed {size}\" hail event hit {city}, {state} and we know your phones are about to blow up.\n\nMissouri Dent Bully specializes in high-volume PDR and we're ready to deploy mobile teams to support your shop. We handle overflow so you keep the customer relationship.\n\n- Certified PDR technicians\n- Mobile units — we come to your lot\n- Insurance-direct billing\n- Same-day deployment available\n\nLet's talk before the rush hits. Reply or call us directly.\n\nJason Wallis\nMissouri Dent Bully",
    },
  },
  roofing: {
    sms: "Hi {name}, {size}\" hail confirmed in {city}. Missouri Dent Bully partners with roofers for vehicle damage referrals. Let's cross-refer — reply for details.",
    email: {
      subject: "Hail in {city} — Vehicle Damage Referral Partnership",
      body: "Hi {name},\n\nWith {size}\" hail confirmed in {city}, homeowners calling you about roof damage likely have vehicle damage too.\n\nMissouri Dent Bully handles the automotive side. We can set up a cross-referral arrangement — you send us vehicle leads, we send you roofing leads.\n\nJason Wallis\nMissouri Dent Bully",
    },
  },
  autoglass: {
    sms: "Hi {name}, {size}\" hail in {city}. Missouri Dent Bully handles dent repair — let's partner on hail claims. We refer glass, you refer dents. Reply to connect.",
    email: {
      subject: "Hail Storm in {city} — Dent + Glass Partnership",
      body: "Hi {name},\n\nThe {size}\" hail event in {city} means vehicles need both glass and dent repair. Let's partner — we handle dents, you handle glass, customers get full-service repair.\n\nJason Wallis\nMissouri Dent Bully",
    },
  },
  solar: {
    sms: "Hi {name}, hail hit {city} at {size}\". If your customers have vehicle damage too, Missouri Dent Bully can help. Cross-referral opportunity — reply for details.",
    email: {
      subject: "Post-Hail Partnership — Solar + Vehicle Repair in {city}",
      body: "Hi {name},\n\nAfter the {size}\" hail in {city}, homeowners dealing with panel damage likely have vehicle damage too. Missouri Dent Bully can handle the automotive side while you handle solar. Let's set up a referral pipeline.\n\nJason Wallis\nMissouri Dent Bully",
    },
  },
  fleet: {
    sms: "Hi {name}, {size}\" hail just hit {city}. Missouri Dent Bully does high-volume fleet PDR — we come to your lot, minimal downtime. Reply for a fleet quote.",
    email: {
      subject: "Fleet Hail Damage Repair — {city} Storm Response",
      body: "Hi {name},\n\nThe {size}\" hail event in {city} likely affected your fleet vehicles. Missouri Dent Bully specializes in high-volume fleet PDR with minimal vehicle downtime.\n\n- On-site mobile repair\n- Priority scheduling for fleet accounts\n- Insurance-direct billing\n- Detailed per-vehicle reporting\n\nLet's get your fleet back on the road.\n\nJason Wallis\nMissouri Dent Bully",
    },
  },
  commercial: {
    sms: "Hi {name}, {size}\" hail confirmed in {city}. Missouri Dent Bully handles vehicle damage for commercial properties — employee cars, company vehicles. Reply for details.",
    email: {
      subject: "Commercial Property Hail Response — {city}",
      body: "Hi {name},\n\nThe {size}\" hail event in {city} means vehicles at your properties likely sustained damage. Missouri Dent Bully can set up on-site at your property to repair employee and visitor vehicles.\n\n- On-site service at your property\n- Minimal disruption to tenants\n- Group scheduling available\n\nJason Wallis\nMissouri Dent Bully",
    },
  },
};
