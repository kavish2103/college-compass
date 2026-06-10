import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-12 text-center">
      <div className="max-w-md w-full rounded-3xl border border-gray-150 bg-white p-8 shadow-lg space-y-6">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 text-3xl shadow-sm">
          🔍
        </div>

        <div className="space-y-2">
          <span className="text-sm font-extrabold text-blue-600 uppercase tracking-widest block">
            404 Error
          </span>
          <h2 className="text-2xl font-black text-gray-900">Page Not Found</h2>
          <p className="text-sm font-semibold text-gray-500 leading-relaxed">
            The page you are looking for does not exist or has been moved to a different location.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            Return Home
          </Link>
          <Link
            href="/colleges"
            className="flex-1 inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Browse Colleges
          </Link>
        </div>
      </div>
    </div>
  );
}
