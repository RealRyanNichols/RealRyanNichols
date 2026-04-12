// ============================================================
// East Texas Official Tracker - Search Utilities
// ============================================================
// Fuzzy search over officials using Fuse.js.

import Fuse from "fuse.js";
import type { Official } from "@/types";

/**
 * Create a Fuse.js search index over an array of officials.
 *
 * Searchable fields (with weights):
 *   - name          (highest priority)
 *   - position
 *   - jurisdiction
 *   - district
 *   - county
 *
 * The threshold is set to 0.4 for a reasonable balance between precision and
 * recall in fuzzy matching.
 */
export function createSearchIndex(officials: Official[]): Fuse<Official> {
  return new Fuse(officials, {
    keys: [
      { name: "name", weight: 2.0 },
      { name: "position", weight: 1.5 },
      { name: "jurisdiction", weight: 1.0 },
      { name: "district", weight: 1.0 },
      { name: "county", weight: 1.0 },
    ],
    threshold: 0.4,
    includeScore: true,
    ignoreLocation: true,
    minMatchCharLength: 2,
  });
}
