import type { Metadata } from "next";
import { getAllOfficials, getAllScoreCards } from "@/lib/data";
import OfficialGrid from "@/components/officials/OfficialGrid";

export const metadata: Metadata = {
  title: "All Officials",
  description:
    "Browse all tracked elected officials in East Texas - federal, state, county, city, and school board.",
};

export default function OfficialsPage() {
  const officials = getAllOfficials();
  const scoreCards = getAllScoreCards();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Elected Officials</h1>
        <p className="mt-2 text-gray-600">
          {officials.length} officials tracked across East Texas. Filter by
          government level, county, or party.
        </p>
      </div>
      <OfficialGrid officials={officials} scoreCards={scoreCards} />
    </div>
  );
}
