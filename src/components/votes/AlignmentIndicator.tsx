interface AlignmentIndicatorProps {
  aligned: boolean;
  vote: string;
}

export default function AlignmentIndicator({
  aligned,
  vote,
}: AlignmentIndicatorProps) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {aligned ? (
        <>
          <svg
            className="h-4 w-4 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
          <span className="text-sm font-medium text-green-700 dark:text-green-400">
            Aligned
          </span>
        </>
      ) : (
        <>
          <svg
            className="h-4 w-4 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          <span className="text-sm font-medium text-red-700 dark:text-red-400">
            Not Aligned
          </span>
        </>
      )}
      <span className="text-xs text-gray-500 dark:text-gray-400">
        (voted {vote})
      </span>
    </span>
  );
}
