import Link from "next/link";
import { getAllOfficials, getScoreCard, getIssueCategories, getAllNews } from "@/lib/data";
import { activeCountyRollout, getActiveCountyOfficials, getActiveCountyStats } from "@/lib/east-texas-rollout";
import { getSchoolBoardStats } from "@/lib/school-board-research";
import type { GovernmentLevel } from "@/types";
import OfficialCard from "@/components/officials/OfficialCard";
import SearchBar from "@/components/shared/SearchBar";

const levelCards: {
  level: GovernmentLevel;
  title: string;
  description: string;
  href: string;
  examples: string;
}[] = [
  {
    level: "federal",
    title: "Federal",
    description: "U.S. House and Senate overlap",
    href: "/officials?level=federal",
    examples: "Congressional districts, senators, federal delegation",
  },
  {
    level: "state",
    title: "State",
    description: "Texas House and Senate",
    href: "/officials?level=state",
    examples: "State representatives, state senators",
  },
  {
    level: "county",
    title: "County",
    description: "County courts and law enforcement",
    href: "/officials?level=county",
    examples: "Judges, sheriffs, district attorneys, commissioners",
  },
  {
    level: "city",
    title: "City",
    description: "Mayors and city offices",
    href: "/officials?level=city",
    examples: "Mayors, council seats, local city leadership",
  },
  {
    level: "school-board",
    title: "School Boards",
    description: "ISD trustees and candidates",
    href: "/officials?level=school-board",
    examples: "Trustees, board presidents, candidate files",
  },
];

export default function HomePage() {
  const allOfficials = getAllOfficials();
  const officials = getActiveCountyOfficials(allOfficials);
  const rolloutStats = getActiveCountyStats(allOfficials);
  const issueCategories = getIssueCategories();
  const schoolBoardStats = getSchoolBoardStats();

  const stats: {
    label: string;
    value: string;
    body: string;
    href: string;
    tone: "blue" | "red" | "amber" | "emerald";
  }[] = [
    {
      label: "Officials Tracked",
      value: String(rolloutStats.totalLoaded),
      body: "Open the full filtered list for the active county rollout.",
      href: "/officials",
      tone: "blue",
    },
    {
      label: "Issue Categories",
      value: String(issueCategories.length),
      body: "See the scoring lanes and what each one measures.",
      href: "#issue-categories",
      tone: "red",
    },
    {
      label: "Counties Covered",
      value: String(rolloutStats.countiesLoaded),
      body: "Jump into Harrison, Marion, Upshur, Gregg, Panola, Morris, Cass, or Smith County.",
      href: "#counties-covered",
      tone: "amber",
    },
    {
      label: "School Board Profiles",
      value: String(rolloutStats.levelCounts["school-board"] ?? schoolBoardStats.candidates),
      body: "Open trustee and school-board records in the active rollout.",
      href: "/officials?level=school-board",
      tone: "emerald",
    },
  ];

  const featuredOfficials = officials
    .filter((o) => o.level === "federal" || o.level === "state")
    .slice(0, 6);

  const latestNews = getAllNews().slice(0, 3);
  const officialsByLevel = levelCards.reduce(
    (counts, card) => {
      counts[card.level] = officials.filter((official) => official.level === card.level).length;
      return counts;
    },
    {} as Record<GovernmentLevel, number>,
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-blue-100 bg-[linear-gradient(135deg,#ffffff_0%,#f4f8ff_52%,#fff7ed_100%)]">
        <div className="grid h-2 grid-cols-3">
          <div className="bg-red-700" />
          <div className="bg-white" />
          <div className="bg-blue-900" />
        </div>
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-24 lg:grid-cols-[1fr_0.85fr] lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-5 flex flex-wrap gap-2">
              {["God", "Family", "Country"].map((value) => (
                <span key={value} className="rounded-full border border-blue-100 bg-white px-3 py-1 text-xs font-black uppercase tracking-wide text-blue-950 shadow-sm">
                  {value}
                </span>
              ))}
            </div>
            <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-blue-950 sm:mb-6 sm:text-6xl">
              Know Your Reps.
              <br />
              <span className="text-red-700">
                Hold Them Accountable.
              </span>
            </h1>
            <p className="mb-8 max-w-2xl text-base font-semibold leading-relaxed text-blue-950/75 sm:mb-10 sm:text-lg">
              Scorecards, voting records, campaign funding, and red flags for
              elected officials across the East Texas county rollout. Verified Texans
              can vote, ask questions, and comment publicly.
            </p>
            <div className="mb-8 max-w-xl">
              <SearchBar />
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/officials"
                className="rounded-xl bg-blue-900 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-xl"
              >
                Browse Active Officials
              </Link>
              <Link
                href="/auth/signup"
                className="rounded-xl border border-red-200 bg-white px-6 py-3 text-sm font-bold text-red-700 shadow-lg transition-all hover:-translate-y-0.5 hover:border-red-400 hover:shadow-xl"
              >
                Sign Up to Vote
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-blue-100 bg-white p-5 shadow-xl shadow-blue-100/70">
            <p className="text-sm font-black uppercase tracking-wide text-red-700">East Texas accountability map</p>
            <h2 className="mt-2 text-2xl font-black text-blue-950 sm:text-3xl">Every number should open a path.</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
              These are drilldowns, not decoration. Click a stat to see the list, the counties, the issue lanes, or school-board records behind it.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {stats.map((stat) => (
                <StatDrilldownCard key={stat.label} stat={stat} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Level */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Browse by Government Level
          </h2>
          <p className="text-gray-500 mt-2">
            Start by office lane, then narrow by county, party, or name.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {levelCards.map((card) => (
            <Link
              key={card.level}
              href={card.href}
              className="group flex min-h-[210px] flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-black text-gray-900 transition-colors group-hover:text-blue-700">
                  {card.title}
                </h3>
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-black text-blue-900">
                  {(officialsByLevel[card.level] ?? 0).toLocaleString()}
                </span>
              </div>
              <p className="mt-2 text-sm font-semibold text-gray-600">{card.description}</p>
              <p className="mt-4 flex-1 text-xs font-bold leading-5 text-gray-500">{card.examples}</p>
              <span className="mt-4 inline-block text-xs font-black text-blue-700 transition-transform group-hover:translate-x-1">
                View Officials &rarr;
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Counties Covered */}
      <section id="counties-covered" className="border-y border-blue-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-red-700">Counties covered</p>
              <h2 className="text-3xl font-extrabold text-gray-900">The active county block</h2>
            </div>
            <p className="max-w-2xl text-sm font-semibold leading-6 text-gray-600">
              County cards open the officials page already filtered to that county. The next-record line shows what still needs to be loaded before the county is complete.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {rolloutStats.countyCounts.map((county) => (
              <Link
                key={county.county}
                href={`/officials?county=${encodeURIComponent(county.county)}`}
                className="group rounded-2xl border border-gray-200 bg-[#fbfcff] p-5 transition-all hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-black text-blue-950 group-hover:text-red-700">{county.county} County</h3>
                    <p className="mt-1 text-xs font-black uppercase tracking-wide text-slate-500">Seat: {county.seat}</p>
                  </div>
                  <span className="rounded-full bg-blue-900 px-2.5 py-1 text-xs font-black text-white">
                    {county.loaded} live
                  </span>
                </div>
                <p className="mt-4 text-sm font-semibold leading-6 text-gray-600">
                  {formatCountyLevels(county.byLevel)}
                </p>
                <p className="mt-3 text-xs font-bold leading-5 text-gray-500">
                  Next: {county.nextRecords.slice(0, 3).join(", ")}.
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Issue Categories */}
      <section id="issue-categories" className="bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Scored on Texas Issues
            </h2>
            <p className="text-gray-500 mt-2">
              Every score links back to a specific vote -- fully transparent
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {issueCategories.map((issue) => (
              <Link
                key={issue.id}
                href={`/scorecards/${issue.id}`}
                className="group flex min-h-[210px] flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div
                  className="w-10 h-1 rounded-full mb-4"
                  style={{ backgroundColor: issue.color }}
                />
                <h3 className="text-sm font-black text-gray-900 transition-colors group-hover:text-blue-700">
                  {issue.name}
                </h3>
                <p className="mt-2 flex-1 text-xs font-semibold leading-5 text-gray-500">
                  {issue.description}
                </p>
                <p
                  className="mt-3 text-xs font-black"
                  style={{ color: issue.color }}
                >
                  {issue.weight}% of overall score
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Officials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              Featured Officials
            </h2>
            <p className="text-gray-500 mt-1">
              Federal and state representatives
            </p>
          </div>
          <Link
            href="/officials"
            className="text-blue-600 hover:text-blue-800 text-sm font-bold"
          >
            View All &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featuredOfficials.map((official) => (
            <OfficialCard
              key={official.id}
              official={official}
              scoreCard={getScoreCard(official.id)}
            />
          ))}
        </div>
      </section>

      {/* Latest News */}
      {latestNews.length > 0 && (
        <section className="bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-3xl font-extrabold text-gray-900">
                  Latest News
                </h2>
                <p className="text-gray-500 mt-1">
                  Breaking stories and accountability reports
                </p>
              </div>
              <Link
                href="/news"
                className="text-blue-600 hover:text-blue-800 text-sm font-bold"
              >
                All News &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {latestNews.map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${article.id}`}
                  className="group block rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {article.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
                    {article.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                    {article.summary}
                  </p>
                  <span className="inline-block mt-4 text-xs text-gray-400">
                    {new Date(article.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Cards */}
      <section className="border-y border-blue-100 bg-[#f4f8ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Link
              href="/funding"
              className="group rounded-2xl border border-blue-100 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg"
            >
              <h3 className="font-extrabold text-xl text-blue-950 mb-3">
                Who Funds Them?
              </h3>
              <p className="text-blue-950/70 text-sm leading-relaxed mb-4">
                Follow the money. See who is funding your elected officials and
                where their campaign dollars come from.
              </p>
              <span className="text-blue-700 text-sm font-bold group-hover:translate-x-1 inline-block transition-transform">
                View Funding Data &rarr;
              </span>
            </Link>
            <Link
              href="/red-flags"
              className="group rounded-2xl border border-red-100 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-red-300 hover:shadow-lg"
            >
              <h3 className="font-extrabold text-xl text-red-700 mb-3">
                Red Flags
              </h3>
              <p className="text-blue-950/70 text-sm leading-relaxed mb-4">
                Conflicts of interest, broken promises, and issues voters should
                know about but may have missed.
              </p>
              <span className="text-red-700 text-sm font-bold group-hover:translate-x-1 inline-block transition-transform">
                View Red Flags &rarr;
              </span>
            </Link>
            <Link
              href="/methodology"
              className="group rounded-2xl border border-emerald-100 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"
            >
              <h3 className="font-extrabold text-xl text-emerald-800 mb-3">
                How We Score
              </h3>
              <p className="text-blue-950/70 text-sm leading-relaxed mb-4">
                Every score is traceable to specific votes. Transparent
                methodology focused on Texas interests.
              </p>
              <span className="text-emerald-700 text-sm font-bold group-hover:translate-x-1 inline-block transition-transform">
                View Methodology &rarr;
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="mx-auto mb-6 h-1.5 max-w-xs rounded-full bg-[linear-gradient(90deg,#bf0d3e_0%,#bf0d3e_35%,#ffffff_35%,#ffffff_65%,#002868_65%,#002868_100%)] shadow-sm" />
          <h2 className="text-3xl font-extrabold text-blue-950 mb-4">
            Your Voice Matters
          </h2>
          <p className="text-blue-950/70 text-lg mb-8 max-w-2xl mx-auto">
            Sign up, verify your Texas identity, and start voting on officials.
            Share your opinions publicly. Real data from verified residents.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="rounded-xl bg-blue-900 px-8 py-3.5 text-sm font-bold text-white shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 hover:bg-red-700"
            >
              Create Free Account
            </Link>
            <Link
              href="/methodology"
              className="rounded-xl border-2 border-red-200 px-8 py-3.5 text-sm font-bold text-red-700 hover:bg-red-50 transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatDrilldownCard({
  stat,
}: {
  stat: {
    label: string;
    value: string;
    body: string;
    href: string;
    tone: "blue" | "red" | "amber" | "emerald";
  };
}) {
  const toneClasses = {
    blue: "border-blue-100 bg-blue-50 text-blue-950 group-hover:border-blue-300",
    red: "border-red-100 bg-red-50 text-red-950 group-hover:border-red-300",
    amber: "border-amber-100 bg-amber-50 text-amber-950 group-hover:border-amber-300",
    emerald: "border-emerald-100 bg-emerald-50 text-emerald-950 group-hover:border-emerald-300",
  };

  return (
    <Link
      href={stat.href}
      className={`group rounded-xl border p-4 transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-md ${toneClasses[stat.tone]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-sm font-black">{stat.label}</span>
        <span className="text-2xl font-black text-red-700">{stat.value}</span>
      </div>
      <p className="mt-2 text-xs font-semibold leading-5 text-slate-600">{stat.body}</p>
      <span className="mt-3 inline-block text-xs font-black text-blue-700">Open &rarr;</span>
    </Link>
  );
}

function formatCountyLevels(byLevel: Partial<Record<GovernmentLevel, number>>) {
  const parts: string[] = [];
  if (byLevel.county) parts.push(`${byLevel.county} county`);
  if (byLevel.city) parts.push(`${byLevel.city} city`);
  if (byLevel["school-board"]) parts.push(`${byLevel["school-board"]} school board`);
  if (byLevel.state || byLevel.federal) parts.push(`${(byLevel.state ?? 0) + (byLevel.federal ?? 0)} state/federal`);
  return parts.join(" / ");
}
