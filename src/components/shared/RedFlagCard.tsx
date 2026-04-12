import type { RedFlag } from "@/types";

interface RedFlagCardProps {
  flag: RedFlag;
}

export default function RedFlagCard({ flag }: RedFlagCardProps) {
  const isCritical = flag.severity === "critical";

  return (
    <div
      className={`rounded-lg border p-4 ${
        isCritical
          ? "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/30"
          : "border-yellow-300 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950/30"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Warning triangle icon */}
        <svg
          className={`mt-0.5 h-5 w-5 shrink-0 ${
            isCritical
              ? "text-red-500 dark:text-red-400"
              : "text-yellow-500 dark:text-yellow-400"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>

        <div className="min-w-0 flex-1">
          {/* Severity badge + title */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold uppercase ${
                isCritical
                  ? "bg-red-200 text-red-800 dark:bg-red-900/60 dark:text-red-300"
                  : "bg-yellow-200 text-yellow-800 dark:bg-yellow-900/60 dark:text-yellow-300"
              }`}
            >
              {flag.severity}
            </span>
            <h4
              className={`text-sm font-semibold ${
                isCritical
                  ? "text-red-900 dark:text-red-200"
                  : "text-yellow-900 dark:text-yellow-200"
              }`}
            >
              {flag.title}
            </h4>
          </div>

          {/* Description */}
          <p
            className={`mt-2 text-sm leading-relaxed ${
              isCritical
                ? "text-red-800 dark:text-red-300"
                : "text-yellow-800 dark:text-yellow-300"
            }`}
          >
            {flag.description}
          </p>

          {/* Why It Matters */}
          <div className="mt-3 rounded-md bg-white/60 p-2.5 dark:bg-black/20">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Why It Matters
            </p>
            <p
              className={`mt-1 text-sm ${
                isCritical
                  ? "text-red-700 dark:text-red-300"
                  : "text-yellow-700 dark:text-yellow-300"
              }`}
            >
              {flag.whyItMatters}
            </p>
          </div>

          {/* Footer: date + source */}
          <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span>
              {new Date(flag.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            {flag.sourceUrl && (
              <a
                href={flag.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:underline dark:text-blue-400"
              >
                View Source
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
