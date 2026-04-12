const badgeColorMap: Record<string, string> = {
  A: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  B: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  C: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
  D: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
  F: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
};

const sizeClasses = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
};

interface LetterGradeBadgeProps {
  grade: string;
  size?: "sm" | "md";
}

export default function LetterGradeBadge({
  grade,
  size = "md",
}: LetterGradeBadgeProps) {
  const gradeKey = grade.charAt(0).toUpperCase();
  const colorClasses =
    badgeColorMap[gradeKey] ??
    "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full font-bold ${sizeClasses[size]} ${colorClasses}`}
    >
      {grade}
    </span>
  );
}
