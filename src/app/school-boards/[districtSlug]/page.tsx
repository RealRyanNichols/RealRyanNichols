import type { Metadata } from "next";
import Link from "next/link";
import {
  getCandidateFlags,
  getCandidateGaps,
  getCandidateGoodRecords,
  getSchoolBoardDistrict,
  getSchoolBoardDistricts,
} from "@/lib/school-board-research";

export function generateStaticParams() {
  return getSchoolBoardDistricts().map((district) => ({
    districtSlug: district.district_slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ districtSlug: string }>;
}): Promise<Metadata> {
  const { districtSlug } = await params;
  const district = getSchoolBoardDistrict(districtSlug);
  if (!district) return { title: "District Not Found" };

  return {
    title: `${district.district} School Board`,
    description: `${district.district} candidate dossiers, trustee records, source links, red flags, good records, and research gaps.`,
  };
}

export default async function DistrictPage({
  params,
}: {
  params: Promise<{ districtSlug: string }>;
}) {
  const { districtSlug } = await params;
  const district = getSchoolBoardDistrict(districtSlug);

  if (!district) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <h1 className="text-2xl font-black text-gray-950">District not found</h1>
        <Link href="/school-boards" className="mt-4 inline-flex text-sm font-bold text-blue-600">
          Back to school boards
        </Link>
      </div>
    );
  }

  const ballotCandidates = district.candidates.filter(
    (candidate) => candidate.on_2026_ballot || candidate.election_date?.includes("2026")
  );

  return (
    <div>
      <section className="bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <Link href="/school-boards" className="text-sm font-bold text-slate-300 hover:text-white">
            &larr; Back to school board watch
          </Link>
          <p className="mt-8 text-sm font-black uppercase tracking-wide text-red-300">
            {district.county} County
          </p>
          <h1 className="mt-3 text-4xl font-black leading-tight text-white sm:text-6xl">
            {district.district}
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-200">
            {district.candidates.length} trustee and candidate files, {ballotCandidates.length} tied to 2026 elections.
            Profiles show the good record, voter questions, source links, and gaps still needing document review.
          </p>
        </div>
      </section>

      {district.overview ? (
        <section className="border-b border-gray-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-black text-gray-950">District quick facts</h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {district.overview.quickFacts.slice(0, 8).map((fact) => (
                <div key={`${fact.label}-${fact.value}`} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="text-xs font-black uppercase tracking-wide text-gray-500">{fact.label}</p>
                  <p className="mt-1 text-sm font-bold text-gray-950">{fact.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-red-700">Profiles</p>
            <h2 className="text-3xl font-black text-gray-950">Who voters should know</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-gray-600">
            Each file is a public-record snapshot. Complete means source review is done.
            Initial dossier means the record is useful but still being checked.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {district.candidates.map((candidate) => {
            const flags = getCandidateFlags(candidate);
            const good = getCandidateGoodRecords(candidate);
            const gaps = getCandidateGaps(candidate);

            return (
              <Link
                key={candidate.candidate_id}
                href={`/school-boards/${district.district_slug}/${candidate.candidate_id}`}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-red-200 hover:shadow-xl"
              >
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">
                    {candidate.seat ?? "Seat pending"}
                  </span>
                  {candidate.on_2026_ballot || candidate.election_date?.includes("2026") ? (
                    <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-black text-red-700">
                      2026 ballot
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-4 text-xl font-black text-gray-950">{candidate.preferred_name ?? candidate.full_name}</h3>
                <p className="mt-1 text-sm font-semibold text-gray-500">
                  {candidate.role ?? (candidate.incumbent ? "Trustee" : "Candidate")}
                </p>
                <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs font-black">
                  <span className="rounded-lg bg-emerald-50 px-2 py-2 text-emerald-700">{good.length} good</span>
                  <span className="rounded-lg bg-red-50 px-2 py-2 text-red-700">{flags.length} flags</span>
                  <span className="rounded-lg bg-amber-50 px-2 py-2 text-amber-800">{gaps.length} gaps</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
