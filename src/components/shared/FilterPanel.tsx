"use client";

interface FilterState {
  level?: string;
  county?: string;
  party?: string;
}

interface FilterPanelProps {
  levels: string[];
  counties: string[];
  parties: string[];
  onFilterChange: (filters: FilterState) => void;
  activeFilters?: FilterState;
}

export default function FilterPanel({
  levels,
  counties,
  parties,
  onFilterChange,
  activeFilters = {},
}: FilterPanelProps) {
  function handleToggle(key: keyof FilterState, value: string) {
    const newFilters = { ...activeFilters };
    if (newFilters[key] === value) {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    onFilterChange(newFilters);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Level filters */}
      {levels.map((level) => (
        <button
          key={`level-${level}`}
          type="button"
          onClick={() => handleToggle("level", level)}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            activeFilters.level === level
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          {level}
        </button>
      ))}

      {/* Divider */}
      {levels.length > 0 && parties.length > 0 && (
        <span className="mx-1 h-5 w-px bg-gray-300 dark:bg-gray-600" />
      )}

      {/* Party filters */}
      {parties.map((party) => (
        <button
          key={`party-${party}`}
          type="button"
          onClick={() => handleToggle("party", party)}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            activeFilters.party === party
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          {party}
        </button>
      ))}

      {/* Divider */}
      {parties.length > 0 && counties.length > 0 && (
        <span className="mx-1 h-5 w-px bg-gray-300 dark:bg-gray-600" />
      )}

      {/* County filters */}
      {counties.map((county) => (
        <button
          key={`county-${county}`}
          type="button"
          onClick={() => handleToggle("county", county)}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            activeFilters.county === county
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          {county}
        </button>
      ))}

      {/* Clear all */}
      {(activeFilters.level ||
        activeFilters.party ||
        activeFilters.county) && (
        <button
          type="button"
          onClick={() => onFilterChange({})}
          className="ml-2 rounded-full px-3 py-1.5 text-xs font-medium text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
