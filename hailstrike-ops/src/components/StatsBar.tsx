"use client";

interface StatsBarProps {
  alertCount: number;
  reportCount: number;
  lastUpdated: Date | null;
}

export default function StatsBar({
  alertCount,
  reportCount,
  lastUpdated,
}: StatsBarProps) {
  return (
    <div className="h-8 bg-gray-950 border-t border-gray-800 flex items-center px-4 gap-6 text-xs text-gray-400 z-[1001] relative">
      <span>
        NWS Active: <span className="text-cyan-400 font-semibold">{alertCount}</span>
      </span>
      <span>
        SPC Reports: <span className="text-orange-400 font-semibold">{reportCount}</span>
      </span>
      <span className="flex-1" />
      {lastUpdated && (
        <span>
          Updated: {lastUpdated.toLocaleTimeString()}
        </span>
      )}
      <span className="text-gray-600">Missouri Dent Bully &middot; HailStrike Ops</span>
    </div>
  );
}
