'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense, useCallback, useMemo } from 'react';
import { useCompare } from '@/components/colleges/CompareContext';
import { ApiResponsePayload } from '@/lib/utils';
import Link from 'next/link';

interface Course {
  id: string;
  name: string;
  degree: string;
  totalFees: number;
  annualFees: number;
}

interface Placement {
  id: string;
  year: number;
  averagePackage: number;
  medianPackage: number;
  highestPackage: number;
  placementRate: number;
  topRecruiters: string[];
}

interface CollegeComparedDetail {
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
  courses: Course[];
  placements: Placement[];
}

function CompareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedColleges: contextColleges, removeFromCompare, clearCompare } = useCompare();

  // Selected college IDs from query parameters or context fallback
  const queryIds = useMemo(() => {
    return searchParams.get('collegeIds')?.split(',').filter(Boolean) || [];
  }, [searchParams]);

  const activeIds = useMemo(() => {
    return queryIds.length > 0 ? queryIds : contextColleges.map((c) => c.id);
  }, [queryIds, contextColleges]);

  // Component State
  const [colleges, setColleges] = useState<CollegeComparedDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch full details of the compared colleges
  const fetchComparedColleges = useCallback(async (ids: string[]) => {
    if (ids.length < 2) {
      setColleges([]);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/colleges/compare?collegeIds=${ids.join(',')}`);
      const result: ApiResponsePayload<CollegeComparedDetail[]> = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to compare colleges');
      }
      setColleges(result.data || []);
    } catch (err: unknown) {
      console.error('Fetch compare error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComparedColleges(activeIds);
  }, [activeIds, fetchComparedColleges]);

  // Sync route query parameters with context selections if URL is empty
  useEffect(() => {
    if (queryIds.length === 0 && contextColleges.length >= 2) {
      const ids = contextColleges.map((c) => c.id).join(',');
      router.replace(`/compare?collegeIds=${ids}`);
    }
  }, [queryIds, contextColleges, router]);

  // Action: Remove college from comparison
  const handleRemove = (id: string) => {
    removeFromCompare(id);
    const updatedIds = activeIds.filter((cid) => cid !== id);
    if (updatedIds.length > 0) {
      router.push(`/compare?collegeIds=${updatedIds.join(',')}`);
    } else {
      router.push('/compare');
    }
  };

  // Action: Clear all comparisons
  const handleClearAll = () => {
    clearCompare();
    router.push('/compare');
  };

  // Helper getters to evaluate winners dynamically
  const getWinnerId = (evaluator: (c: CollegeComparedDetail) => number, mode: 'min' | 'max' = 'max') => {
    if (colleges.length < 2) return null;
    let winner = colleges[0];
    let bestValue = evaluator(colleges[0]);

    for (let i = 1; i < colleges.length; i++) {
      const value = evaluator(colleges[i]);
      if (mode === 'max' && value > bestValue) {
        winner = colleges[i];
        bestValue = value;
      } else if (mode === 'min' && value < bestValue && value > 0) {
        winner = colleges[i];
        bestValue = value;
      }
    }
    return winner.id;
  };

  // Evaluators
  const ratingWinnerId = getWinnerId((c) => c.overallRating);
  const minFeesWinnerId = getWinnerId((c) => {
    const fees = c.courses.map((course) => course.annualFees);
    return fees.length > 0 ? Math.min(...fees) : Infinity;
  }, 'min');
  const avgPlacementWinnerId = getWinnerId((c) => c.placements[0]?.averagePackage || 0);
  const maxPlacementWinnerId = getWinnerId((c) => c.placements[0]?.highestPackage || 0);
  const placementRateWinnerId = getWinnerId((c) => c.placements[0]?.placementRate || 0);

  // Render Loader
  if (loading) {
    return (
      <div className="space-y-8 py-2 md:py-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-5 gap-4">
          <div>
            <div className="h-8 w-48 bg-gray-200 rounded-xl mb-2" />
            <div className="h-4 w-64 bg-gray-100 rounded-xl" />
          </div>
        </div>
        {/* Table Skeleton */}
        <div className="overflow-x-auto rounded-2xl border border-gray-150 shadow-sm bg-white">
          <div className="p-6 space-y-6">
            <div className="flex gap-6">
              <div className="h-12 w-48 bg-gray-100 rounded-xl" />
              <div className="h-12 w-64 bg-gray-200 rounded-xl" />
              <div className="h-12 w-64 bg-gray-200 rounded-xl" />
            </div>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex gap-6 border-t border-gray-50 pt-4">
                <div className="h-6 w-48 bg-gray-100 rounded-xl" />
                <div className="h-6 w-64 bg-gray-200 rounded-xl" />
                <div className="h-6 w-64 bg-gray-200 rounded-xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Render Empty State
  if (activeIds.length < 2) {
    return (
      <div className="py-12 text-center max-w-lg mx-auto space-y-6">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-sm text-3xl">
          ⚖️
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-gray-900">Compare Colleges</h2>
          <p className="text-sm font-medium text-gray-500 leading-relaxed">
            Select at least 2 colleges (maximum of 3) from the search list to compare their fees, reviews, packages, and rating structures side-by-side.
          </p>
        </div>
        <Link
          href="/colleges"
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          Browse Colleges
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-2 md:py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-5 gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">College Comparison</h1>
          <p className="mt-1 text-sm text-gray-500 font-semibold">
            Comparing {colleges.length} selected institutes side-by-side.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleClearAll}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Clear Comparison
          </button>
          <Link
            href="/colleges"
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            + Add Colleges
          </Link>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-5 text-sm font-semibold text-red-700">
          ⚠️ Error retrieving comparison: {error}
        </div>
      )}

      {/* Comparison Matrix Table */}
      {colleges.length >= 2 && (
        <div className="overflow-x-auto rounded-2xl border border-gray-150 shadow-sm bg-white">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="p-4 sm:p-5 font-extrabold text-gray-500 uppercase tracking-wider text-xs w-48 bg-gray-50/20">Metric</th>
                {colleges.map((college) => (
                  <th key={college.id} className="p-4 sm:p-5 font-bold text-gray-900 border-l border-gray-100 min-w-[240px]">
                    <div className="flex flex-col space-y-4">
                      <div className="flex items-start justify-between gap-2">
                        <img
                          src={college.logoUrl}
                          alt={college.name}
                          className="h-12 w-12 rounded-xl object-cover border border-gray-100 shadow-sm shrink-0"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=150&h=150&fit=crop&q=80';
                          }}
                        />
                        <button
                          onClick={() => handleRemove(college.id)}
                          className="text-gray-400 hover:text-red-600 p-1 rounded-lg hover:bg-red-50 transition-all text-xs font-bold"
                          title="Remove from comparison"
                        >
                          ✕ Remove
                        </button>
                      </div>
                      <div>
                        <h3 className="font-extrabold text-gray-900 text-base leading-snug line-clamp-2">{college.name}</h3>
                        <span className="text-xs text-gray-400 font-semibold">{college.city}, {college.state}</span>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-semibold text-gray-700">
              {/* Row: Overview */}
              <tr>
                <td className="p-4 sm:p-5 bg-gray-50/20 font-bold uppercase tracking-wider text-xs text-gray-400">Type</td>
                {colleges.map((c) => (
                  <td key={c.id} className="p-4 sm:p-5 border-l border-gray-100">
                    {c.type.charAt(0) + c.type.slice(1).toLowerCase()}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="p-4 sm:p-5 bg-gray-50/20 font-bold uppercase tracking-wider text-xs text-gray-400">Established</td>
                {colleges.map((c) => (
                  <td key={c.id} className="p-4 sm:p-5 border-l border-gray-100">{c.establishedYear}</td>
                ))}
              </tr>

              {/* Row: NAAC Grade */}
              <tr>
                <td className="p-4 sm:p-5 bg-gray-50/20 font-bold uppercase tracking-wider text-xs text-gray-400">NAAC Grade</td>
                {colleges.map((c) => (
                  <td key={c.id} className="p-4 sm:p-5 border-l border-gray-100">
                    {c.naacGrade ? (
                      <span className="inline-flex items-center rounded-md bg-green-50 px-2.5 py-0.5 text-xs font-bold text-green-700 ring-1 ring-inset ring-green-600/10">
                        {c.naacGrade}
                      </span>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Row: Overall Rating */}
              <tr>
                <td className="p-4 sm:p-5 bg-gray-50/20 font-bold uppercase tracking-wider text-xs text-gray-400">Overall Rating</td>
                {colleges.map((c) => {
                  const isWinner = c.id === ratingWinnerId;
                  return (
                    <td key={c.id} className={`p-4 sm:p-5 border-l border-gray-100 transition-colors ${isWinner ? 'bg-green-50/40 text-green-800' : ''}`}>
                      <div className="flex items-center gap-1.5">
                        <span className="text-amber-500 font-extrabold">★</span>
                        <span>{c.overallRating}</span>
                        {isWinner && <span className="ml-1.5 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-800">✓ Best</span>}
                      </div>
                    </td>
                  );
                })}
              </tr>

              {/* Row: Annual Fees */}
              <tr>
                <td className="p-4 sm:p-5 bg-gray-50/20 font-bold uppercase tracking-wider text-xs text-gray-400">Min Annual Fee</td>
                {colleges.map((c) => {
                  const fees = c.courses.map((course) => course.annualFees);
                  const minFee = fees.length > 0 ? Math.min(...fees) : null;
                  const isWinner = c.id === minFeesWinnerId;
                  return (
                    <td key={c.id} className={`p-4 sm:p-5 border-l border-gray-100 transition-colors ${isWinner ? 'bg-green-50/40 text-green-800' : ''}`}>
                      <span>{minFee ? `₹${minFee.toLocaleString()}` : 'N/A'}</span>
                      {isWinner && minFee && <span className="ml-1.5 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-800">✓ Lowest</span>}
                    </td>
                  );
                })}
              </tr>

              {/* Row: Average Placement Package */}
              <tr>
                <td className="p-4 sm:p-5 bg-gray-50/20 font-bold uppercase tracking-wider text-xs text-gray-400">Avg Placement</td>
                {colleges.map((c) => {
                  const packageLpa = c.placements[0]?.averagePackage;
                  const isWinner = c.id === avgPlacementWinnerId;
                  return (
                    <td key={c.id} className={`p-4 sm:p-5 border-l border-gray-100 transition-colors ${isWinner ? 'bg-green-50/40 text-green-800' : ''}`}>
                      <span>{packageLpa ? `${packageLpa} LPA` : 'N/A'}</span>
                      {isWinner && packageLpa && <span className="ml-1.5 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-800">✓ Best</span>}
                    </td>
                  );
                })}
              </tr>

              {/* Row: Highest Placement Package */}
              <tr>
                <td className="p-4 sm:p-5 bg-gray-50/20 font-bold uppercase tracking-wider text-xs text-gray-400">Highest Package</td>
                {colleges.map((c) => {
                  const packageLpa = c.placements[0]?.highestPackage;
                  const isWinner = c.id === maxPlacementWinnerId;
                  return (
                    <td key={c.id} className={`p-4 sm:p-5 border-l border-gray-100 transition-colors ${isWinner ? 'bg-green-50/40 text-green-800' : ''}`}>
                      <span>{packageLpa ? `${packageLpa} LPA` : 'N/A'}</span>
                      {isWinner && packageLpa && <span className="ml-1.5 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-800">✓ Best</span>}
                    </td>
                  );
                })}
              </tr>

              {/* Row: Placement Rate */}
              <tr>
                <td className="p-4 sm:p-5 bg-gray-50/20 font-bold uppercase tracking-wider text-xs text-gray-400">Placement Rate</td>
                {colleges.map((c) => {
                  const rate = c.placements[0]?.placementRate;
                  const isWinner = c.id === placementRateWinnerId;
                  return (
                    <td key={c.id} className={`p-4 sm:p-5 border-l border-gray-100 transition-colors ${isWinner ? 'bg-green-50/40 text-green-800' : ''}`}>
                      <span>{rate ? `${rate}%` : 'N/A'}</span>
                      {isWinner && rate && <span className="ml-1.5 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-800">✓ Best</span>}
                    </td>
                  );
                })}
              </tr>

              {/* Row: Top Recruiters */}
              <tr>
                <td className="p-4 sm:p-5 bg-gray-50/20 font-bold uppercase tracking-wider text-xs text-gray-400">Top Recruiters</td>
                {colleges.map((c) => {
                  const recruiters = c.placements[0]?.topRecruiters || [];
                  return (
                    <td key={c.id} className="p-4 sm:p-5 border-l border-gray-100">
                      {recruiters.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {recruiters.map((r, index) => (
                            <span key={index} className="inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-800">
                              {r}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                  );
                })}
              </tr>

              {/* Row: Actions */}
              <tr>
                <td className="p-4 sm:p-5 bg-gray-50/20 font-bold uppercase tracking-wider text-xs text-gray-400">Profiles</td>
                {colleges.map((c) => (
                  <td key={c.id} className="p-4 sm:p-5 border-l border-gray-100">
                    <Link
                      href={`/colleges/${c.id}`}
                      className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors w-full"
                    >
                      View Details
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="flex h-96 flex-col items-center justify-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        <p className="text-sm font-semibold text-gray-500">Loading Comparison Board...</p>
      </div>
    }>
      <CompareContent />
    </Suspense>
  );
}
