'use client';

interface EmptyStateProps {
  title?: string;
  message?: string;
  onReset?: () => void;
}

export default function EmptyState({
  title = 'No Colleges Found',
  message = 'We could not find any colleges matching your search criteria. Try removing some filters or search queries.',
  onReset,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm py-16">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-5">
        <svg
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <p className="mt-2 text-sm text-gray-500 max-w-md">{message}</p>
      {onReset && (
        <button
          onClick={onReset}
          className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
}
