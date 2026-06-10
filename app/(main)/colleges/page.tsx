'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Filters from '@/components/colleges/Filters';
import CollegeCard from '@/components/colleges/CollegeCard';
import CollegeCardSkeleton from '@/components/colleges/CollegeCardSkeleton';
import EmptyState from '@/components/colleges/EmptyState';
import { ApiResponsePayload } from '@/lib/utils';

interface College {
  id: string;
  name: string;
  logoUrl: string;
  location: string;
  city: string;
  state: string;
  type: string;
  establishedYear: number;
  overallRating: number;
  totalReviews: number;
  naacGrade?: string | null;
  courses: {
    name: string;
    degree: string;
    totalFees: number;
    annualFees: number;
  }[];
  placements: {
    year: number;
    averagePackage: number;
    medianPackage: number;
    highestPackage: number;
  }[];
}

interface PaginationMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

function CollegeListingContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State
  const [colleges, setColleges] = useState<College[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch colleges whenever URL search parameters change
  useEffect(() => {
    async function fetchColleges() {
      setLoading(true);
      setError('');
      try {
        const queryStr = searchParams.toString();
        const res = await fetch(`/api/colleges${queryStr ? `?${queryStr}` : ''}`);
        const result: ApiResponsePayload<College[]> = await res.json();

        if (!res.ok) {
          throw new Error(result.error || 'Failed to fetch colleges');
        }

        setColleges(result.data || []);
        setMeta(result.meta || null);
      } catch (err: unknown) {
        console.error('Fetch colleges error:', err);
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }

    fetchColleges();
  }, [searchParams]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  // Reset all filters
  const handleResetFilters = () => {
    router.push(pathname);
  };

  const currentPage = meta?.page || 1;
  const totalPages = meta?.totalPages || 1;
  const totalColleges = meta?.total || 0;

  return (
    <div className="py-2 md:py-6">
      {/* Header */}
      <div className="border-b border-gray-100 pb-5 mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
          Search Colleges
        </h1>
        <p className="mt-2 text-sm text-gray-500 font-medium">
          Found {totalColleges} colleges matching your preferences.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <Filters />
        </div>

        {/* Catalog Grid */}
        <div className="lg:col-span-3 space-y-8">
          {error && (
            <div className="rounded-2xl bg-red-50 p-5 text-sm font-semibold text-red-700">
              ⚠️ Error loading colleges: {error}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <CollegeCardSkeleton key={i} />
              ))}
            </div>
          ) : colleges.length === 0 ? (
            <EmptyState onReset={handleResetFilters} />
          ) : (
            <>
              {/* College cards list */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {colleges.map((college) => (
                  <CollegeCard key={college.id} college={college} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                  <div className="flex flex-1 justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                      className="relative inline-flex items-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className="relative ml-3 inline-flex items-center rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">
                        Showing page <span className="font-bold text-gray-700">{currentPage}</span> of{' '}
                        <span className="font-bold text-gray-700">{totalPages}</span>
                      </p>
                    </div>
                    <div>
                      <nav className="inline-flex -space-x-px rounded-xl shadow-sm gap-1" aria-label="Pagination">
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage <= 1}
                          className="relative inline-flex items-center rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          Previous
                        </button>
                        
                        {Array.from({ length: totalPages }).map((_, idx) => {
                          const pageNum = idx + 1;
                          const isCurrent = pageNum === currentPage;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`relative inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                                isCurrent
                                  ? 'bg-blue-600 text-white shadow-sm hover:bg-blue-700'
                                  : 'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          );
                        })}

                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage >= totalPages}
                          className="relative inline-flex items-center rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CollegeListingPage() {
  return (
    <Suspense fallback={
      <div className="py-2 md:py-6 space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="border-b border-gray-100 pb-5 mb-8">
          <div className="h-8 w-48 bg-gray-200 rounded-xl mb-2" />
          <div className="h-4 w-64 bg-gray-100 rounded-xl" />
        </div>
        {/* Main Skeleton Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <div className="h-96 bg-gray-100 rounded-2xl" />
          <div className="lg:col-span-3 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 bg-gray-100 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    }>
      <CollegeListingContent />
    </Suspense>
  );
}
