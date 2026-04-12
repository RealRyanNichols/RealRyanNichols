// ============================================================
// East Texas Official Tracker - Score Calculation Utilities
// ============================================================

/**
 * Convert a numeric score (0-100) to a letter grade.
 *
 * Scale:
 *   A+  97-100
 *   A   93-96
 *   A-  90-92
 *   B+  87-89
 *   B   83-86
 *   B-  80-82
 *   C+  77-79
 *   C   73-76
 *   C-  70-72
 *   D+  67-69
 *   D   63-66
 *   D-  60-62
 *   F    0-59
 */
export function calculateLetterGrade(score: number): string {
  if (score >= 97) return "A+";
  if (score >= 93) return "A";
  if (score >= 90) return "A-";
  if (score >= 87) return "B+";
  if (score >= 83) return "B";
  if (score >= 80) return "B-";
  if (score >= 77) return "C+";
  if (score >= 73) return "C";
  if (score >= 70) return "C-";
  if (score >= 67) return "D+";
  if (score >= 63) return "D";
  if (score >= 60) return "D-";
  return "F";
}

/**
 * Return a Tailwind CSS color class appropriate for the given letter grade.
 *
 *   A range  -> green
 *   B range  -> blue
 *   C range  -> yellow
 *   D range  -> orange
 *   F        -> red
 */
export function getGradeColor(letterGrade: string): string {
  const base = letterGrade.charAt(0).toUpperCase();

  switch (base) {
    case "A":
      return "text-green-600";
    case "B":
      return "text-blue-600";
    case "C":
      return "text-yellow-600";
    case "D":
      return "text-orange-600";
    case "F":
      return "text-red-600";
    default:
      return "text-gray-600";
  }
}

/**
 * Return a human-readable descriptor for a numeric score.
 */
export function getScoreDescription(score: number): string {
  if (score >= 90) return "Excellent";
  if (score >= 80) return "Good";
  if (score >= 70) return "Average";
  if (score >= 60) return "Below Average";
  return "Poor";
}
