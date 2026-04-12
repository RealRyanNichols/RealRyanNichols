import type { ScoredVote } from "@/types";
import VoteCard from "@/components/votes/VoteCard";

interface VoteTimelineProps {
  votes: ScoredVote[];
}

export default function VoteTimeline({ votes }: VoteTimelineProps) {
  const sorted = [...votes].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  if (sorted.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No votes recorded yet.
        </p>
      </div>
    );
  }

  return (
    <div className="relative space-y-4">
      {/* Timeline line */}
      <div className="absolute bottom-0 left-4 top-0 hidden w-px bg-gray-200 sm:block dark:bg-gray-700" />

      {sorted.map((vote, idx) => (
        <div key={`${vote.billId}-${vote.date}-${idx}`} className="relative sm:pl-10">
          {/* Timeline dot */}
          <div
            className={`absolute left-2.5 top-5 hidden h-3 w-3 rounded-full border-2 border-white sm:block dark:border-gray-900 ${
              vote.aligned ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <VoteCard vote={vote} />
        </div>
      ))}
    </div>
  );
}
