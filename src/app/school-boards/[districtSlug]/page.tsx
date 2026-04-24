import type { Metadata } from "next";
import Link from "next/link";
import {
  getCandidateFlags,
  getCandidateGaps,
  getCandidateGoodRecords,
  getDistrictInvestigationQueue,
  getDistrictSourceLinks,
  getSchoolBoardDistrict,
  getSchoolBoardDistricts,
  type SchoolBoardFeedItem,
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
  const feed = district.feed ?? [];
  const praiseItems = feed.filter((item) => item.type === "praise");
  const concernItems = feed.filter((item) => item.type === "concern" || item.type === "breaking");
  const watchItems = feed.filter((item) => item.type === "social_watch" || item.type === "public_comment" || item.type === "records_request");
  const sourceLinks = district.sourceLinks?.length ? district.sourceLinks : getDistrictSourceLinks(district.district_slug);
  const investigationQueue = district.investigationQueue?.length ? district.investigationQueue : getDistrictInvestigationQueue(district.district_slug);
  const issueCounts = district.candidates.reduce(
    (totals, candidate) => {
      totals.good += getCandidateGoodRecords(candidate).length;
      totals.flags += getCandidateFlags(candidate).length;
      totals.gaps += getCandidateGaps(candidate).length;
      return totals;
    },
    { good: 0, flags: 0, gaps: 0 }
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
            This is the district profile: board members, breaking items, praise reports, red flags, public-comment watch, social-media watch, and open records still needed.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-4">
            <ProfileStat label="Board files" value={district.candidates.length} tone="neutral" />
            <ProfileStat label="Praise items" value={issueCounts.good + praiseItems.length} tone="good" />
            <ProfileStat label="Watch items" value={watchItems.length + issueCounts.gaps} tone="watch" />
            <ProfileStat label="Red flags" value={issueCounts.flags} tone="bad" />
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 sm:px-6 lg:grid-cols-3 lg:px-8">
          <DistrictPanel
            title="Positive file"
            tone="good"
            body={praiseItems[0]?.summary ?? "No district-level praise item has been loaded yet. Positive student, staff, safety, transparency, and community records belong here when sourced."}
          />
          <DistrictPanel
            title="Watch file"
            tone="watch"
            body={watchItems[0]?.summary ?? "Public comments, board videos, parent concerns, and social posts are being tracked only when they are public, relevant, and sourceable."}
          />
          <DistrictPanel
            title="Concern file"
            tone="bad"
            body={concernItems[0]?.summary ?? "No district-level negative item has been verified yet. Allegations stay in the research queue until backed by public records."}
          />
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

      <section className="bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-red-700">District feed</p>
              <h2 className="text-3xl font-black text-gray-950">Breaking, praise, concerns, and social watch</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-gray-600">
              This feed is built like a social profile for school governance. Public claims stay labeled until records support them.
            </p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            <FeedColumn title="Breaking / Alerts" tone="bad" items={feed.filter((item) => item.type === "breaking" || item.type === "concern")} />
            <FeedColumn title="Praise Reports" tone="good" items={praiseItems} />
            <FeedColumn title="Social + Parent Watch" tone="watch" items={watchItems} />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-black uppercase tracking-wide text-red-700">Investigation queue</p>
          <h2 className="mt-2 text-3xl font-black text-gray-950">What gets checked next</h2>
          <div className="mt-6 grid gap-3">
            {investigationQueue.map((item) => (
              <div key={item} className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-bold leading-6 text-amber-950">
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-black uppercase tracking-wide text-red-700">Source stack</p>
          <h2 className="mt-2 text-3xl font-black text-gray-950">Records loaded</h2>
          <div className="mt-6 space-y-3">
            {sourceLinks.map((source) => (
              <a
                key={source.url}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm font-black text-blue-700 transition hover:bg-blue-50"
              >
                {source.title ?? source.url}
                <span className="mt-1 block text-xs font-bold text-gray-500">
                  {source.source_type ?? "source"} {source.accessed_date ? `- accessed ${source.accessed_date}` : ""}
                </span>
              </a>
            ))}
            {sourceLinks.length === 0 ? (
              <p className="text-sm leading-6 text-gray-600">No district source links have been loaded yet.</p>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}

function ProfileStat({ label, value, tone }: { label: string; value: number; tone: "neutral" | "good" | "watch" | "bad" }) {
  const toneClass = {
    neutral: "border-white/15 bg-white/10 text-white",
    good: "border-emerald-300/30 bg-emerald-300/15 text-emerald-100",
    watch: "border-amber-300/30 bg-amber-300/15 text-amber-100",
    bad: "border-red-300/30 bg-red-300/15 text-red-100",
  }[tone];

  return (
    <div className={`rounded-xl border p-4 ${toneClass}`}>
      <p className="text-3xl font-black">{value}</p>
      <p className="mt-1 text-xs font-black uppercase tracking-wide opacity-80">{label}</p>
    </div>
  );
}

function DistrictPanel({ title, body, tone }: { title: string; body: string; tone: "good" | "watch" | "bad" }) {
  const toneClass = {
    good: "border-emerald-200 bg-emerald-50 text-emerald-950",
    watch: "border-amber-200 bg-amber-50 text-amber-950",
    bad: "border-red-200 bg-red-50 text-red-950",
  }[tone];

  return (
    <div className={`rounded-xl border p-5 ${toneClass}`}>
      <h2 className="text-lg font-black">{title}</h2>
      <p className="mt-2 text-sm font-semibold leading-6">{body}</p>
    </div>
  );
}

function FeedColumn({ title, items, tone }: { title: string; items: SchoolBoardFeedItem[]; tone: "good" | "watch" | "bad" }) {
  const toneClass = {
    good: "border-emerald-200 bg-emerald-50",
    watch: "border-amber-200 bg-amber-50",
    bad: "border-red-200 bg-red-50",
  }[tone];

  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${toneClass}`}>
      <h3 className="text-xl font-black text-gray-950">{title}</h3>
      <div className="mt-4 space-y-3">
        {items.length === 0 ? (
          <p className="rounded-xl bg-white/80 p-4 text-sm font-semibold leading-6 text-gray-700">
            Nothing verified in this lane yet.
          </p>
        ) : (
          items.map((item) => (
            <article key={item.id} className="rounded-xl bg-white p-4 shadow-sm">
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black uppercase tracking-wide text-slate-700">
                  {item.status.replaceAll("_", " ")}
                </span>
                {item.event_date ? (
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-black text-gray-600">{item.event_date}</span>
                ) : null}
              </div>
              <h4 className="mt-3 text-base font-black text-gray-950">{item.title}</h4>
              <p className="mt-2 text-sm leading-6 text-gray-700">{item.summary}</p>
              {item.source_url ? (
                <a href={item.source_url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex text-sm font-black text-blue-700">
                  Source &rarr;
                </a>
              ) : null}
            </article>
          ))
        )}
      </div>
    </div>
  );
}
