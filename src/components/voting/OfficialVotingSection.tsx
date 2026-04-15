"use client";

import ApproveButton from "./ApproveButton";
import ApprovalRating from "./ApprovalRating";

interface OfficialVotingSectionProps {
  officialId: string;
  officialCounties: string[];
}

export default function OfficialVotingSection({
  officialId,
  officialCounties,
}: OfficialVotingSectionProps) {
  return (
    <div className="space-y-4">
      <ApprovalRating
        officialId={officialId}
        officialCounties={officialCounties}
      />
      <ApproveButton officialId={officialId} />
    </div>
  );
}
