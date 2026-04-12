// ============================================================
// East Texas Official Tracker - Formatting Utilities
// ============================================================

import type { Party, GovernmentLevel } from "@/types";

/**
 * Format a number as US currency (no decimals).
 * e.g. 1234567 -> "$1,234,567"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format an ISO date string as a long-form date.
 * e.g. "2025-01-15" -> "January 15, 2025"
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Format an ISO date string as an abbreviated date.
 * e.g. "2025-01-15" -> "Jan 15, 2025"
 */
export function formatShortDate(dateString: string): string {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Format a decimal value as a percentage string.
 * e.g. 45.2 -> "45.2%"
 */
export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Expand a party abbreviation to its full name.
 */
export function formatPartyName(party: Party): string {
  const names: Record<Party, string> = {
    R: "Republican",
    D: "Democrat",
    I: "Independent",
    NP: "Non-Partisan",
  };
  return names[party];
}

/**
 * Convert a GovernmentLevel slug to a display-friendly label.
 */
export function formatLevelName(level: GovernmentLevel): string {
  const labels: Record<GovernmentLevel, string> = {
    federal: "Federal",
    state: "State",
    county: "County",
    city: "City",
    "school-board": "School Board",
  };
  return labels[level];
}

/**
 * Return a hex color value for a political party.
 */
export function getPartyColor(party: Party): string {
  const colors: Record<Party, string> = {
    R: "#E81B23",
    D: "#0015BC",
    I: "#808080",
    NP: "#999999",
  };
  return colors[party];
}
