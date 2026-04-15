import { IndustryConfig } from "./types";

export const industryModes: IndustryConfig[] = [
  {
    id: "auto",
    label: "Automotive / PDR",
    icon: "🚗",
    businessTypes: [
      "body shop",
      "dealership",
      "tire shop",
      "mechanical",
      "detail",
      "car wash",
      "glass",
      "PDR",
      "fleet service",
    ],
    googlePlaceTypes: ["car_repair", "car_dealer", "car_wash"],
    smsTemplate:
      "HAIL ALERT: {size}\" hail hit {city} on {date}. Missouri Dent Bully is mobilizing PDR teams NOW. Need overflow help? We bring trained techs + tools. Reply YES for priority scheduling. Reply STOP to opt out.",
    emailSubject: "Hail Damage Alert: {size}\" hail in {city} - PDR Support Available",
    emailTemplate: `Hi {ownerName},

{size}" hail hit {city}, {state} and we're already mobilizing. Missouri Dent Bully has trained PDR technicians ready to support your shop with overflow work.

Storm Details:
- Location: {city}, {county} County, {state}
- Hail Size: {size}"
- Damage Level: {damage}

We can have a team on-site within 24-48 hours. No long-term commitments — just storm support when you need it most.

Want to discuss? Reply to this email or call us directly.

Best,
Missouri Dent Bully
Jason Wallis`,
    adHeadline: "Hail Damage in {city}? We Fix It Fast!",
    adBody:
      "{size}\" hail just hit {city}. Missouri Dent Bully offers fast, affordable PDR. No paint needed. Insurance approved. Call now for free estimate!",
  },
  {
    id: "roofing",
    label: "Roofing",
    icon: "🏠",
    businessTypes: [
      "roofing contractor",
      "general contractor",
      "restoration",
      "insurance adjuster",
    ],
    googlePlaceTypes: ["roofing_contractor", "general_contractor"],
    smsTemplate:
      "STORM ALERT: {size}\" hail confirmed in {city}. Roofs are getting hammered. Missouri Dent Bully is coordinating auto+roof response teams. Partner with us? Reply YES. Reply STOP to opt out.",
    emailSubject: "Storm Partnership Opportunity: {city} Hail Event",
    emailTemplate: `Hi {ownerName},

Major hail event in {city} — {size}" stones confirmed. While we handle the auto damage, we're looking for roofing partners to cross-refer homeowners.

Storm Details:
- Location: {city}, {county} County, {state}
- Hail Size: {size}"
- Damage Level: {damage}

Let's coordinate — we refer roof leads to you, you refer auto to us. Win-win.

Best,
Missouri Dent Bully`,
    adHeadline: "Roof Damage from {city} Hail Storm?",
    adBody:
      "Your roof took a beating. {size}\" hail confirmed in {city}. Free roof inspections available. Don't wait — file your claim now!",
  },
  {
    id: "auto-glass",
    label: "Auto Glass",
    icon: "🔧",
    businessTypes: ["auto glass", "windshield repair", "mobile glass"],
    googlePlaceTypes: ["car_repair"],
    smsTemplate:
      "HAIL ALERT: {size}\" hail in {city}. Windshields are cracking. Missouri Dent Bully + glass partners mobilizing. Need extra hands? Reply YES. Reply STOP to opt out.",
    emailSubject: "Glass Damage Surge: {city} Hail Event - Partnership Opportunity",
    emailTemplate: `Hi {ownerName},

{size}" hail just hit {city}. We're seeing massive demand for windshield replacements alongside our PDR work.

We'd love to partner — we refer glass work to you, you refer dent work to us.

Storm Details:
- Location: {city}, {county} County, {state}
- Hail Size: {size}"

Let's talk,
Missouri Dent Bully`,
    adHeadline: "Cracked Windshield from {city} Hail?",
    adBody:
      "Hail cracked your windshield? We work with top glass shops to get you fixed fast. Insurance-approved repairs. Call now!",
  },
  {
    id: "solar-hvac",
    label: "Solar / HVAC",
    icon: "☀️",
    businessTypes: [
      "solar installer",
      "HVAC contractor",
      "panel repair",
    ],
    googlePlaceTypes: ["electrician"],
    smsTemplate:
      "HAIL ALERT: {size}\" hail in {city}. Solar panels and HVAC units at risk. Missouri Dent Bully coordinating response. Partner? Reply YES. Reply STOP to opt out.",
    emailSubject: "Solar/HVAC Damage Alert: {city} Hail Storm",
    emailTemplate: `Hi {ownerName},

{size}" hail confirmed in {city}. Solar panels and outdoor HVAC units are taking hits.

We're coordinating a multi-trade response and looking for solar/HVAC partners to handle equipment damage while we handle auto.

Storm Details:
- Location: {city}, {county} County, {state}
- Hail Size: {size}"
- Damage Level: {damage}

Interested in cross-referrals?

Best,
Missouri Dent Bully`,
    adHeadline: "Solar Panels Damaged by {city} Hail?",
    adBody:
      "{size}\" hail can crack solar panels and damage HVAC units. Get a free inspection before it's too late. Insurance claims welcome!",
  },
  {
    id: "fleet",
    label: "Fleet",
    icon: "🚛",
    businessTypes: [
      "rental agency",
      "fleet manager",
      "delivery company",
      "corporate fleet",
    ],
    googlePlaceTypes: ["car_rental", "car_dealer"],
    smsTemplate:
      "FLEET ALERT: {size}\" hail in {city}. Your vehicles need protection. Missouri Dent Bully deploys rapid PDR teams for fleets. Reply YES for priority. Reply STOP to opt out.",
    emailSubject: "Fleet Hail Damage Response: {city} Storm Event",
    emailTemplate: `Hi {ownerName},

{size}" hail just hit {city}. If your fleet was exposed, we can have PDR technicians on-site within 24 hours.

We specialize in high-volume fleet repair — minimal downtime, no paint, insurance-friendly.

Storm Details:
- Location: {city}, {county} County, {state}
- Hail Size: {size}"

We've handled fleets of 500+ vehicles. Let us get your fleet back on the road.

Best,
Missouri Dent Bully`,
    adHeadline: "Fleet Damaged by {city} Hail?",
    adBody:
      "Don't let hail sideline your fleet. Rapid PDR repairs — no paint, no body filler. 500+ vehicles, no problem. Call now!",
  },
  {
    id: "commercial",
    label: "Commercial",
    icon: "🏢",
    businessTypes: [
      "property manager",
      "commercial roofing",
      "facility maintenance",
    ],
    googlePlaceTypes: ["general_contractor", "roofing_contractor"],
    smsTemplate:
      "PROPERTY ALERT: {size}\" hail in {city}. Commercial properties at risk. Missouri Dent Bully + partners mobilizing. Need assessment? Reply YES. Reply STOP to opt out.",
    emailSubject: "Commercial Property Hail Damage: {city} Storm Alert",
    emailTemplate: `Hi {ownerName},

{size}" hail confirmed in {city}. Commercial properties — parking lots full of vehicles, rooftops, HVAC units — all at risk.

We coordinate complete storm response: vehicles (PDR), roofs (partners), and equipment.

Storm Details:
- Location: {city}, {county} County, {state}
- Hail Size: {size}"
- Damage Level: {damage}

One call handles everything.

Best,
Missouri Dent Bully`,
    adHeadline: "Commercial Hail Damage in {city}?",
    adBody:
      "Your commercial property took a hit. {size}\" hail confirmed. Full-service storm response: vehicles, roofs, equipment. Free assessment!",
  },
];

export function getIndustryMode(id: string): IndustryConfig {
  return industryModes.find((m) => m.id === id) || industryModes[0];
}

export function fillTemplate(
  template: string,
  data: Record<string, string>
): string {
  let result = template;
  for (const [key, value] of Object.entries(data)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, "g"), value);
  }
  return result;
}
