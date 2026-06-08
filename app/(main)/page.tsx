import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-20 text-center">
      <div className="max-w-3xl px-4">
        <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-6">
          Internship Evaluation Project
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
          Discover and Compare Your Dream College
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          A clean, high-performance portal built for searching, comparing, and bookmarking Indian colleges (IITs, NITs, and other premier institutes). Explore placements, courses, and verified reviews.
        </p>
        
        {/* Quick actions */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
          <Link
            href="/colleges"
            className="rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
          >
            Explore Colleges
          </Link>
          <Link
            href="/compare"
            className="rounded-md border border-gray-300 bg-white px-6 py-3 text-base font-semibold text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
          >
            Compare side-by-side
          </Link>
        </div>
      </div>

      {/* Feature Section Preview */}
      <div className="mx-auto mt-20 max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">Features Built in this Platform</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need to find the right path
          </p>
        </div>
        <div className="mx-auto mt-12 max-w-2xl sm:mt-16 lg:mt-20 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                1. College Listing + Filters
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  Search through 20+ realistic Indian universities. Apply precise filters on course fees, locations, NAAC grade, and ratings with server-side pagination.
                </p>
                <p className="mt-6">
                  <Link href="/colleges" className="text-sm font-semibold leading-6 text-blue-600 hover:text-blue-500">
                    Go to Listings <span aria-hidden="true">&rarr;</span>
                  </Link>
                </p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                2. Side-by-side Comparisons
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  Compare up to 3 colleges side-by-side on metrics that matter: annual fees, average/median packages, established year, and rating scores.
                </p>
                <p className="mt-6">
                  <Link href="/compare" className="text-sm font-semibold leading-6 text-blue-600 hover:text-blue-500">
                    Compare now <span aria-hidden="true">&rarr;</span>
                  </Link>
                </p>
              </dd>
            </div>
            <div className="flex flex-col">
              <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                3. Bookmarks & Auth
              </dt>
              <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                <p className="flex-auto">
                  Sign up via credentials or Google OAuth to save your shortlist. Saved colleges persist to your personal user account.
                </p>
                <p className="mt-6">
                  <Link href="/saved" className="text-sm font-semibold leading-6 text-blue-600 hover:text-blue-500">
                    View Shortlist <span aria-hidden="true">&rarr;</span>
                  </Link>
                </p>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
