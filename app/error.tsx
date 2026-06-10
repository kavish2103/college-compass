'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Unhandled Application Error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-12 text-center">
      <div className="max-w-md w-full rounded-3xl border border-gray-100 bg-white p-8 shadow-lg space-y-6">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-600 text-3xl shadow-sm">
          ⚠️
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-black text-gray-900">Something went wrong!</h2>
          <p className="text-sm font-semibold text-gray-500 leading-relaxed">
            An unexpected error occurred while rendering this page.
          </p>
          {error.message && (
            <div className="mt-4 rounded-xl bg-red-50 p-4 text-xs font-mono text-red-800 break-words text-left">
              {error.message}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="flex-1 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
