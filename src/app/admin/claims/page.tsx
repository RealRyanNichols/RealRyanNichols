import type { Metadata } from "next";
import AdminClaimsClient from "@/components/admin/AdminClaimsClient";

export const metadata: Metadata = {
  title: "Claim Queue | RepWatchr Admin",
  description: "Review RepWatchr profile ownership claims.",
};

export default function AdminClaimsPage() {
  return <AdminClaimsClient />;
}
