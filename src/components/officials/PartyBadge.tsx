import type { Party } from "@/types";

const partyConfig: Record<Party, { label: string; classes: string }> = {
  R: {
    label: "Republican",
    classes: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
  },
  D: {
    label: "Democrat",
    classes: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  },
  I: {
    label: "Independent",
    classes:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
  },
  NP: {
    label: "Non-Partisan",
    classes: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
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
