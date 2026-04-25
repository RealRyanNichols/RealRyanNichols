import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllOfficials, getAllScoreCards } from "@/lib/data";
import { getNationalCoverageStats, nationalCoverageLanes } from "@/lib/national-officials";
import OfficialGrid from "@/components/officials/OfficialGrid";

export const metadata: Metadata = {
  title: "United States Elected Officials",
  description:
    "Browse sourced RepWatchr elected-official profiles while the national buildout expands across federal, state, county, city, and school-board offices.",
};

export default function OfficialsPage() {
  const officials = getAllOfficials();
  const scoreCards = getAllScoreCards();
  const coverageStats = getNationalCoverageStats(officials.length);

  return (
    <div className="bg-[#fbfcff]">
      <section className="border-b border-blue-100 bg-[linear-gradient(135deg,#ffffff_0%,#f4f8ff_55%,#fff7ed_100%)]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="max-w-4xl">
            <p className="text-sm font-black uppercase tracking-wide text-red-700">United States profile index</p>
            <h1 className="mt-2 text-4xl font-black leading-tight text-blue-950 sm:text-5xl">
              Every elected official needs a public record people can follow.
            </h1>
            <p className="mt-4 max-w-3xl text-base font-semibold leading-7 text-slate-700">
              RepWatchr is built to cover every elected official in the United States. The number below is the sourced profile count currently loaded in the public data files, not the final national target.
            </p>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {coverageStats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm">
                <p className="text-xs font-black uppercase tracking-wide text-slate-500">{stat.label}</p>
                <p className="mt-2 text-2xl font-black text-blue-950">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-7 grid gap-3 lg:grid-cols-5">
            {nationalCoverageLanes.map((lane) => (
              <article key={lane.title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg font-black text-slate-950">{lane.title}</h2>
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-blue-800">
                    {lane.status}
                  </span>
                </div>
                <p className="mt-2 text-xs font-black uppercase tracking-wide text-red-700">{lane.scope}</p>
                <p className="mt-3 text-sm font-semibold leading-6 text-slate-600">{lane.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Live Sourced Profiles
          </h2>
          <p className="mt-2 text-gray-500">
            {officials.length.toLocaleString()} verified profile records are live now. Search, filter by government level, county, or party while the United States buildout continues.
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            RepWatchr will not inflate this number with fake or empty profiles. New national records should enter the site with at least a name, office, jurisdiction, source path, and review status.
          </p>
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
