"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";

interface ApprovalRatingProps {
  officialId: string;
  officialCounties: string[]; // Counties this official serves
}

interface RatingData {
  totalVotes: number;
  approveCount: number;
  disapproveCount: number;
  approvalPercentage: number;
}

export default function ApprovalRating({
  officialId,
  officialCounties,
}: ApprovalRatingProps) {
  const [allTexas, setAllTexas] = useState<RatingData | null>(null);
  const [inDistrict, setInDistrict] = useState<RatingData | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadRatings() {
      // Load overall ratings
      const { data: overallData } = await supabase
        .from("approval_ratings")
        .select("*")
        .eq("official_id", officialId)
        .single();

      if (overallData) {
        setAllTexas({
          totalVotes: overallData.total_votes,
          approveCount: overallData.approve_count,
          disapproveCount: overallData.disapprove_count,
          approvalPercentage: overallData.approval_percentage,
        });
      }

      // Load in-district ratings
      const { data: countyData } = await supabase
        .from("approval_ratings_by_county")
        .select("*")
        .eq("official_id", officialId)
        .in("county", officialCounties);

      if (countyData && countyData.length > 0) {
        const districtTotals = countyData.reduce(
          (acc, row) => ({
            totalVotes: acc.totalVotes + row.total_votes,
            approveCount: acc.approveCount + row.approve_count,
            disapproveCount: acc.disapproveCount + row.disapprove_count,
          }),
          { totalVotes: 0, approveCount: 0, disapproveCount: 0 }
        );

        setInDistrict({
          ...districtTotals,
          approvalPercentage:
            districtTotals.totalVotes > 0
              ? Math.round(
                  (districtTotals.approveCount / districtTotals.totalVotes) * 1000
                ) / 10
              : 0,
        });
      }

      setLoading(false);
    }

    loadRatings();
  }, [officialId, officialCounties, supabase]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-3">
        <div className="h-4 w-32 rounded bg-gray-200" />
        <div className="h-8 rounded bg-gray-200" />
      </div>
    );
  }

  if (!allTexas || allTexas.totalVotes === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="text-sm font-semibold text-gray-700">
          Citizen Approval Rating
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          No votes yet. Be the first to rate this official.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-4">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
        Citizen Approval Rating
      </h3>

      {/* In-District Rating */}
      {inDistrict && inDistrict.totalVotes > 0 && (
        <RatingBar
          label="In-District Residents"
          data={inDistrict}
          primary
        />
      )}

      {/* All Texas Rating */}
      <RatingBar
        label="All Texas Voters"
        data={allTexas}
        primary={!inDistrict || inDistrict.totalVotes === 0}
      />

      <p className="text-xs text-gray-400">
        Based on {allTexas.totalVotes} verified Texas voter
        {allTexas.totalVotes !== 1 ? "s" : ""}
      </p>
    </div>
  );
}

function RatingBar({
  label,
  data,
  primary,
}: {
  label: string;
  data: RatingData;
  primary?: boolean;
}) {
  const approveWidth = data.approvalPercentage;
  const disapproveWidth = 100 - data.approvalPercentage;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span
          className={`text-sm ${primary ? "font-semibold text-gray-900" : "text-gray-600"}`}
        >
          {label}
        </span>
        <span className="text-xs text-gray-500">
          {data.totalVotes} vote{data.totalVotes !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="flex h-6 overflow-hidden rounded-full bg-gray-100">
        {approveWidth > 0 && (
          <div
            className="flex items-center justify-center bg-green-500 text-xs font-semibold text-white transition-all duration-500"
            style={{ width: `${approveWidth}%` }}
          >
            {approveWidth >= 15 && `${data.approvalPercentage}%`}
          </div>
        )}
        {disapproveWidth > 0 && (
          <div
            className="flex items-center justify-center bg-red-400 text-xs font-semibold text-white transition-all duration-500"
            style={{ width: `${disapproveWidth}%` }}
          >
            {disapproveWidth >= 15 &&
              `${(100 - data.approvalPercentage).toFixed(1)}%`}
          </div>
        )}
      </div>
      <div className="mt-1 flex justify-between text-xs text-gray-500">
        <span className="text-green-600">
          {data.approveCount} approve
        </span>
        <span className="text-red-500">
          {data.disapproveCount} disapprove
        </span>
      </div>
    </div>
  );
}
