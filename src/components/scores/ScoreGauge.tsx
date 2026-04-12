const gradeColorMap: Record<string, string> = {
  A: "text-green-500",
  B: "text-blue-500",
  C: "text-yellow-500",
  D: "text-orange-500",
  F: "text-red-500",
};

const strokeColorMap: Record<string, string> = {
  A: "stroke-green-500",
  B: "stroke-blue-500",
  C: "stroke-yellow-500",
  D: "stroke-orange-500",
  F: "stroke-red-500",
};

const sizeConfig = {
  sm: { dimension: 80, strokeWidth: 6, fontSize: "text-lg", subSize: "text-xs" },
  md: { dimension: 120, strokeWidth: 8, fontSize: "text-3xl", subSize: "text-sm" },
  lg: { dimension: 160, strokeWidth: 10, fontSize: "text-4xl", subSize: "text-base" },
};

interface ScoreGaugeProps {
  score: number;
  letterGrade: string;
  size?: "sm" | "md" | "lg";
}

export default function ScoreGauge({
  score,
  letterGrade,
  size = "md",
}: ScoreGaugeProps) {
  const config = sizeConfig[size];
  const radius = (config.dimension - config.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const offset = circumference - progress;
  const gradeKey = letterGrade.charAt(0).toUpperCase();

  return (
    <div className="relative inline-flex flex-col items-center justify-center">
      <svg
        width={config.dimension}
        height={config.dimension}
        className="-rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={config.dimension / 2}
          cy={config.dimension / 2}
          r={radius}
          fill="none"
          strokeWidth={config.strokeWidth}
          className="stroke-gray-200 dark:stroke-gray-700"
        />
        {/* Progress circle */}
        <circle
          cx={config.dimension / 2}
          cy={config.dimension / 2}
          r={radius}
          fill="none"
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={strokeColorMap[gradeKey] ?? "stroke-gray-400"}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className={`font-bold leading-none ${config.fontSize} ${gradeColorMap[gradeKey] ?? "text-gray-500"}`}
        >
          {letterGrade}
        </span>
        <span
          className={`mt-0.5 font-medium text-gray-500 dark:text-gray-400 ${config.subSize}`}
        >
          {score}
        </span>
      </div>
    </div>
  );
}
