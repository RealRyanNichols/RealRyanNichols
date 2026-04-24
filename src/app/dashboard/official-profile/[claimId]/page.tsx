import type { Metadata } from "next";
import ClaimedProfileEditor from "@/components/profile/ClaimedProfileEditor";

export const metadata: Metadata = {
  title: "Official Profile Tools | RepWatchr",
  description:
    "Manage approved RepWatchr claimed-profile submissions, media, and reviewed public statements.",
};

export default async function OfficialProfileDashboardPage({
  params,
  searchParams,
}: {
  params: Promise<{ claimId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { claimId } = await params;
  const query = await searchParams;
  const checkout = query.checkout;
  const checkoutStatus = Array.isArray(checkout) ? checkout[0] : checkout;

  return <ClaimedProfileEditor claimId={claimId} checkoutStatus={checkoutStatus} />;
}
