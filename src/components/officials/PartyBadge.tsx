import type { Party } from "@/types";

const partyConfig: Record<Party, { label: string; classes: string }> = {
  R: {
    label: "Republican",
    classes: "bg-red-100 text-red-700",
  },
  D: {
    label: "Democrat",
    classes: "bg-blue-100 text-blue-700",
  },
  I: {
    label: "Independent",
    classes: "bg-purple-100 text-purple-700",
  },
  NP: {
    label: "Non-Partisan",
    classes: "bg-gray-100 text-gray-700",
  },
  VR: {
    label: "Votes Republican",
    classes: "bg-red-50 text-red-600 border border-red-200",
  },
  VD: {
    label: "Votes Democrat",
    classes: "bg-blue-50 text-blue-600 border border-blue-200",
  },
};

interface PartyBadgeProps {
  party: Party;
}

export default function PartyBadge({ party }: PartyBadgeProps) {
  const config = partyConfig[party] ?? partyConfig.NP;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.classes}`}
    >
      {config.label}
    </span>
  );
}
