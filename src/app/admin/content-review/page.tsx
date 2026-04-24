import type { Metadata } from "next";
import AdminContentReviewClient from "@/components/admin/AdminContentReviewClient";

export const metadata: Metadata = {
  title: "Content Review | RepWatchr Admin",
  description: "Review claimed-profile text, photos, videos, and links.",
};

export default function AdminContentReviewPage() {
  return <AdminContentReviewClient />;
}
