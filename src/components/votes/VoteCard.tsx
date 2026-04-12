import type { ScoredVote } from "@/types";
import AlignmentIndicator from "@/components/votes/AlignmentIndicator";

interface VoteCardProps {
  vote: ScoredVote;
}

export default function VoteCard({ vote }: VoteCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
            {vote.billTitle}
          </h4>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {new Date(vote.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
          {vote.category}
        </span>
      </div>

      <div className="mt-3">
        <AlignmentIndicator aligned={vote.aligned} vote={vote.officialVote} />
      </div>

      {vote.explanation && (
        <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {vote.explanation}
        </p>
      )}
    </div>
  );
}
