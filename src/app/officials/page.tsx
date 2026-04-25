import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllOfficials, getAllScoreCards } from "@/lib/data";
import { activeCountyRollout, getActiveCountyOfficials, getActiveCountyStats } from "@/lib/east-texas-rollout";
import OfficialGrid from "@/components/officials/OfficialGrid";

export const metadata: Metadata = {
  title: "East Texas Elected Officials",
  description:
    "Browse sourced RepWatchr elected-official profiles for Harrison, Marion, Upshur, Gregg, Panola, Morris, Cass, and Smith counties.",
};

export default function OfficialsPage() {
  const allOfficials = getAllOfficials();
  const officials = getActiveCountyOfficials(allOfficials);
  const scoreCards = getAllScoreCards();
  const rolloutStats = getActiveCountyStats(allOfficials);
  const levelStats = [
    { label: "Federal/state overlap", value: ((rolloutStats.levelCounts.federal ?? 0) + (rolloutStats.levelCounts.state ?? 0)).toLocaleString() },
    { label: "County records", value: (rolloutStats.levelCounts.county ?? 0).toLocaleString() },
    { label: "City records", value: (rolloutStats.levelCounts.city ?? 0).toLocaleString() },
    { label: "School-board records", value: (rolloutStats.levelCounts["school-board"] ?? 0).toLocaleString() },
  ];

  return (
    <div className="bg-[#fbfcff]">
      <section className="border-b border-blue-100 bg-[linear-gradient(135deg,#ffffff_0%,#f4f8ff_55%,#fff7ed_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="max-w-4xl">
            <p className="text-sm font-black uppercase tracking-wide text-red-700">Active county rollout</p>
            <h1 className="mt-2 text-4xl font-black leading-tight text-blue-950 sm:text-5xl">
              Every elected official in the East Texas target counties gets a public record first.
            </h1>
            <p className="mt-4 max-w-3xl text-base font-semibold leading-7 text-slate-700">
              RepWatchr is starting with Harrison, Marion, Upshur, Gregg, Panola, Morris, Cass, and Smith counties. The count below is the sourced profile count currently loaded for this county block, not a fake claim that every office is finished.
            </p>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Sourced profiles in scope", value: rolloutStats.totalLoaded.toLocaleString() },
              { label: "County block", value: `${rolloutStats.countiesLoaded}/${activeCountyRollout.length}` },
              { label: "Office lanes", value: "Federal, state, county, city, school board" },
              { label: "Publishing rule", value: "Source first" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
                <p className="text-xs font-black uppercase tracking-wide text-slate-500">{stat.label}</p>
                <p className="mt-2 text-2xl font-black text-blue-950">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-7 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {rolloutStats.countyCounts.map((county) => (
              <article key={county.county} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-black text-slate-950">{county.county} County</h2>
                    <p className="mt-1 text-xs font-black uppercase tracking-wide text-red-700">Seat: {county.seat}</p>
                  </div>
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-black text-blue-900">
                    {county.loaded} live
                  </span>
                </div>
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">
                  Priority lanes: {county.priority.join("; ")}.
                </p>
                <p className="mt-3 text-xs font-bold leading-5 text-slate-500">
                  Next records: {county.nextRecords.join(", ")}.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-5 lg:grid-cols-[1fr_0.9fr] lg:items-end">
          <div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Live Sourced Profiles In Scope
          </h2>
          <p className="mt-2 text-gray-500">
            {officials.length.toLocaleString()} profile records are live now across {activeCountyRollout.join(", ")} counties. Search, filter by government level, county, or party while the missing local offices are pulled into the source queue.
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            RepWatchr will not inflate this number with fake or empty profiles. New records should enter the site with at least a name, office, jurisdiction, source path, and review status.
          </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {levelStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-black uppercase tracking-wide text-slate-500">{stat.label}</p>
                <p className="mt-1 text-xl font-black text-blue-950">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
        <Suspense
          fallback={
            <div className="animate-pulse space-y-4">
              <div className="h-10 rounded-xl bg-gray-200" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-32 rounded-2xl bg-gray-100" />
                ))}
              </div>
            </div>
          }
        >
          <OfficialGrid officials={officials} scoreCards={scoreCards} />
        </Suspense>
      </section>
    </div>
  );
}
