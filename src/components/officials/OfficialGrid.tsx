"use client";

import { useMemo, useState } from "react";
import type { GovernmentLevel, Official, Party, ScoreCard } from "@/types";
import OfficialCard from "@/components/officials/OfficialCard";

const levelOptions: { value: GovernmentLevel | "all"; label: string }[] = [
  { value: "all", label: "All Levels" },
  { value: "federal", label: "Federal" },
  { value: "state", label: "State" },
  { value: "county", label: "County" },
  { value: "city", label: "City" },
  { value: "school-board", label: "School Board" },
];

const partyOptions: { value: Party | "all"; label: string }[] = [
  { value: "all", label: "All Parties" },
  { value: "R", label: "Republican" },
  { value: "D", label: "Democrat" },
  { value: "I", label: "Independent" },
  { value: "NP", label: "Non-Partisan" },
];

interface OfficialGridProps {
  officials: Official[];
  scoreCards: ScoreCard[];
}

export default function OfficialGrid({
  officials,
  scoreCards,
}: OfficialGridProps) {
  const [levelFilter, setLevelFilter] = useState<GovernmentLevel | "all">(
    "all",
  );
  const [partyFilter, setPartyFilter] = useState<Party | "all">("all");
  const [countyFilter, setCountyFilter] = useState("all");

  const counties = useMemo(() => {
    const set = new Set<string>();
    for (const o of officials) {
      for (const c of o.county) {
        set.add(c);
      }
    }
    return Array.from(set).sort();
  }, [officials]);

  const scoreCardMap = useMemo(() => {
    const map = new Map<string, ScoreCard>();
    for (const sc of scoreCards) {
      map.set(sc.officialId, sc);
    }
    return map;
  }, [scoreCards]);

  const filtered = useMemo(() => {
    return officials.filter((o) => {
      if (levelFilter !== "all" && o.level !== levelFilter) return false;
      if (partyFilter !== "all" && o.party !== partyFilter) return false;
      if (countyFilter !== "all" && !o.county.includes(countyFilter))
        return false;
      return true;
    });
  }, [officials, levelFilter, partyFilter, countyFilter]);

  return (
    <div>
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        {/* Level filter */}
        <div className="flex flex-wrap gap-1">
          {levelOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setLevelFilter(opt.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                levelFilter === opt.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Party filter */}
        <div className="flex flex-wrap gap-1">
          {partyOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setPartyFilter(opt.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                partyFilter === opt.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* County filter */}
        {counties.length > 0 && (
          <select
            value={countyFilter}
            onChange={(e) => setCountyFilter(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
          >
            <option value="all">All Counties</option>
            {counties.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Results count */}
      <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
        Showing {filtered.length} of {officials.length} officials
      </p>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((official) => (
          <OfficialCard
            key={official.id}
            official={official}
            scoreCard={scoreCardMap.get(official.id)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No officials match the selected filters.
          </p>
        </div>
      )}
    </div>
  );
}
