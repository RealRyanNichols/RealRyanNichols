import Link from "next/link";
import type { Official, ScoreCard } from "@/types";
import PartyBadge from "@/components/officials/PartyBadge";
import LetterGradeBadge from "@/components/scores/LetterGradeBadge";

const partyBorderColor: Record<string, string> = {
  R: "border-l-red-500",
  D: "border-l-blue-500",
  I: "border-l-purple-500",
  NP: "border-l-gray-400",
};

interface OfficialCardProps {
  official: Official;
  scoreCard?: ScoreCard;
}

export default function OfficialCard({
  official,
  scoreCard,
}: OfficialCardProps) {
  const borderClass = partyBorderColor[official.party] ?? "border-l-gray-400";

  return (
    <Link
      href={`/officials/${official.id}`}
      className={`group block rounded-lg border border-gray-200 border-l-4 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800 ${borderClass}`}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold text-gray-900 group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400">
            {official.name}
          </h3>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            {official.position}
          </p>
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-500">
            {official.jurisdiction}
          </p>
        </div>
        {scoreCard && (
          <div className="ml-3 shrink-0">
            <LetterGradeBadge grade={scoreCard.letterGrade} />
          </div>
        )}
      </div>
      <div className="mt-3">
        <PartyBadge party={official.party} />
      </div>
    </Link>
  );
}
