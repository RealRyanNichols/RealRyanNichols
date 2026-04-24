import type { Metadata } from "next";
import ClaimedProfileEditor from "@/components/profile/ClaimedProfileEditor";

export const metadata: Metadata = {
  title: "Official Profile Tools | RepWatchr",
  description:
    "Manage approved RepWatchr claimed-profile submissions, media, and reviewed public statements.",
};

export default async function OfficialProfileDashboardPage({
  params,
}: {
  params: Promise<{ claimId: string }>;
}) {
  const { claimId } = await params;
  return <ClaimedProfileEditor claimId={claimId} />;
}
