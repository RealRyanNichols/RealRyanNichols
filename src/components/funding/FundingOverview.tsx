import type { FundingSummary } from "@/types";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

interface FundingOverviewProps {
  funding: FundingSummary;
}

export default function FundingOverview({ funding }: FundingOverviewProps) {
  const stats = [
    { label: "Total Raised", value: funding.totalRaised, color: "text-green-600 dark:text-green-400" },
    { label: "Total Spent", value: funding.totalSpent, color: "text-red-600 dark:text-red-400" },
    { label: "Cash on Hand", value: funding.cashOnHand, color: "text-blue-600 dark:text-blue-400" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg border border-gray-200 bg-white p-5 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800"
        >
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {stat.label}
          </p>
          <p className={`mt-2 text-2xl font-bold ${stat.color}`}>
            {formatCurrency(stat.value)}
          </p>
        </div>
      ))}
    </div>
  );
}
