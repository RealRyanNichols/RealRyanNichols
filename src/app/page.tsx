import Link from "next/link";
import { getAllOfficials, getScoreCard, getIssueCategories } from "@/lib/data";
import OfficialCard from "@/components/officials/OfficialCard";
import SearchBar from "@/components/shared/SearchBar";

const levelCards = [
  {
    level: "federal",
    title: "Federal",
    description: "US House (TX-1) & Senate",
    icon: "🏛",
    href: "/officials?level=federal",
  },
  {
    level: "state",
    title: "State",
    description: "TX House (HD-7) & Senate",
    icon: "⭐",
    href: "/officials?level=state",
  },
  {
    level: "county",
    title: "County",
    description: "Smith & Gregg Counties",
    icon: "🏢",
    href: "/officials?level=county",
  },
  {
    level: "city",
    title: "City",
    description: "Tyler & Longview",
    icon: "🏙",
    href: "/officials?level=city",
  },
  {
    level: "school-board",
    title: "School Boards",
    description: "Tyler ISD & Longview ISD",
    icon: "🏫",
    href: "/school-boards",
  },
];

export default function HomePage() {
  const officials = getAllOfficials();
  const issueCategories = getIssueCategories();

  const featuredOfficials = officials
    .filter((o) => o.level === "federal" || o.level === "state")
    .slice(0, 6);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-red-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
              East Texas Official Tracker
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 mb-4">
              Know Your Representatives. Hold Them Accountable.
            </p>
            <p className="text-lg text-blue-200 mb-8">
              Tracking elected officials in HD-7 and TX-1. Scorecards on East
              Texas issues, voting records, campaign funding, and red flags.
            </p>
            <div className="max-w-xl mx-auto">
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Level */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Browse by Government Level
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {levelCards.map((card) => (
            <Link
              key={card.level}
              href={card.href}
              className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all"
            >
              <div className="text-3xl mb-3">{card.icon}</div>
              <h3 className="font-semibold text-gray-900">{card.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{card.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Issue Categories */}
      <section className="bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Scored on East Texas Issues
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {issueCategories.map((issue) => (
              <Link
                key={issue.id}
                href={`/scorecards/${issue.id}`}
                className="block rounded-lg border border-gray-200 p-5 hover:shadow-md transition-all"
              >
                <div
                  className="w-3 h-3 rounded-full mb-3"
                  style={{ backgroundColor: issue.color }}
                />
                <h3 className="font-semibold text-gray-900 text-sm">
                  {issue.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {issue.description}
                </p>
                <p className="text-xs font-medium mt-2" style={{ color: issue.color }}>
                  {issue.weight}% of overall score
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Officials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Featured Officials
          </h2>
          <Link
            href="/officials"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredOfficials.map((official) => (
            <OfficialCard
              key={official.id}
              official={official}
              scoreCard={getScoreCard(official.id)}
            />
          ))}
        </div>
      </section>

      {/* Quick Links */}
      <section className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-3">Who Funds Them?</h3>
              <p className="text-gray-400 text-sm mb-4">
                Follow the money. See who is funding your elected officials and
                where their campaign dollars come from.
              </p>
              <Link
                href="/funding"
                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                View Funding Data →
              </Link>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">Red Flags</h3>
              <p className="text-gray-400 text-sm mb-4">
                Conflicts of interest, broken promises, and issues voters should
                know about but may have missed.
              </p>
              <Link
                href="/red-flags"
                className="text-red-400 hover:text-red-300 text-sm font-medium"
              >
                View Red Flags →
              </Link>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-3">How We Score</h3>
              <p className="text-gray-400 text-sm mb-4">
                Every score is traceable to specific votes. Transparent
                methodology focused on East Texas interests.
              </p>
              <Link
                href="/methodology"
                className="text-green-400 hover:text-green-300 text-sm font-medium"
              >
                View Methodology →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
