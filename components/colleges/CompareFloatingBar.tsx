'use client';

import Link from 'next/link';
import { useCompare } from './CompareContext';

export default function CompareFloatingBar() {
  const { selectedColleges, removeFromCompare, clearCompare } = useCompare();

  if (selectedColleges.length === 0) {
    return null;
  }

  const queryParam = selectedColleges.map((c) => c.id).join(',');

  return (
    <div className="fixed bottom-6 left-1/2 z-40 w-[90%] max-w-3xl -translate-x-1/2 rounded-2xl border border-blue-100 bg-white/95 p-4 shadow-2xl backdrop-blur-md transition-all duration-300 md:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-4">
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-800">
              Comparing ({selectedColleges.length}/3)
            </span>
            <span className="text-xs text-gray-500">
              {selectedColleges.length === 1
                ? 'Select 1 or 2 more colleges'
                : 'Ready to compare'}
            </span>
          </div>

          <div className="flex flex-1 items-center gap-3 overflow-x-auto pb-1 sm:pb-0">
            {selectedColleges.map((college) => (
              <div
                key={college.id}
                className="flex items-center gap-2 rounded-full bg-blue-50/70 border border-blue-100 px-3 py-1 text-sm text-blue-900 shadow-sm"
              >
                {college.logoUrl && (
                  <img
                    src={college.logoUrl}
                    alt={college.name}
                    className="h-5 w-5 rounded-full object-cover"
                  />
                )}
                <span className="max-w-[100px] truncate font-medium md:max-w-[150px]">
                  {college.name}
                </span>
                <button
                  onClick={() => removeFromCompare(college.id)}
                  className="ml-1 rounded-full p-0.5 text-blue-400 hover:bg-blue-100 hover:text-blue-800 transition-colors"
                  aria-label={`Remove ${college.name} from comparison`}
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t pt-3 sm:border-t-0 sm:pt-0">
          <button
            onClick={clearCompare}
            className="text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors px-3 py-2"
          >
            Clear All
          </button>
          <Link
            href={selectedColleges.length >= 2 ? `/compare?collegeIds=${queryParam}` : '#'}
            onClick={(e) => {
              if (selectedColleges.length < 2) {
                e.preventDefault();
                alert('Please select at least 2 colleges to compare.');
              }
            }}
            className={`inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold shadow-sm transition-all ${
              selectedColleges.length >= 2
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Compare Now
          </Link>
        </div>
      </div>
    </div>
  );
}
