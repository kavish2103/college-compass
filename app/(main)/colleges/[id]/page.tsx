'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import ReviewForm from '@/components/colleges/ReviewForm';
import { ApiResponsePayload } from '@/lib/utils';

interface PaginationMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

interface SavedCollegeItem {
  id: string;
  userId: string;
  collegeId: string;
  createdAt: string;
}

interface Course {
  id: string;
  name: string;
  degree: string;
  duration: number;
  totalFees: number;
  annualFees: number;
  seats: number;
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

interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  pros?: string | null;
  cons?: string | null;
  authorName: string;
  batch: string;
  course: string;
  isVerified: boolean;
  createdAt: string;
}

interface CollegeDetails {
  id: string;
  name: string;
  location: string;
  city: string;
  state: string;
  type: string;
  establishedYear: number;
  description: string;
  website: string;
  logoUrl: string;
  overallRating: number;
  totalReviews: number;
  naacGrade?: string | null;
  courses: Course[];
  placements: Placement[];
}

export default function CollegeDetailPage() {
  const { id: collegeId } = useParams() as { id: string };
  const { data: session, status: sessionStatus } = useSession();

  // Active Tab: 'overview' | 'courses' | 'placements' | 'reviews'
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'placements' | 'reviews'>('overview');

  // State
  const [college, setCollege] = useState<CollegeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Bookmarks State
  const [isSaved, setIsSaved] = useState(false);
  const [savingBookmark, setSavingBookmark] = useState(false);

  // Paginated Reviews State
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [reviewsMeta, setReviewsMeta] = useState<PaginationMeta | null>(null);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  // Fetch base college data
  useEffect(() => {
    async function fetchCollegeDetails() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`/api/colleges/${collegeId}`);
        const result: ApiResponsePayload<CollegeDetails> = await res.json();

        if (!res.ok) {
          throw new Error(result.error || 'Failed to load college details');
        }

        setCollege(result.data || null);
      } catch (err: unknown) {
        console.error('Fetch detail error:', err);
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    }

    if (collegeId) {
      fetchCollegeDetails();
    }
  }, [collegeId]);

  // Fetch bookmarks status if logged in
  useEffect(() => {
    async function checkBookmarkStatus() {
      if (!session) return;
      try {
        const res = await fetch('/api/user/saved');
        const result: ApiResponsePayload<SavedCollegeItem[]> = await res.json();
        if (res.ok && result.data) {
          const alreadySaved = result.data.some((item) => item.collegeId === collegeId);
          setIsSaved(alreadySaved);
        }
      } catch (err) {
        console.error('Error checking bookmark status:', err);
      }
    }

    if (sessionStatus === 'authenticated' && collegeId) {
      checkBookmarkStatus();
    }
  }, [sessionStatus, session, collegeId]);

  // Fetch paginated reviews whenever reviewsPage changes
  const fetchPaginatedReviews = useCallback(async (page: number) => {
    setReviewsLoading(true);
    try {
      const res = await fetch(`/api/colleges/${collegeId}/reviews?page=${page}&limit=5`);
      const result: ApiResponsePayload<Review[]> = await res.json();

      if (res.ok) {
        setReviews(result.data || []);
        setReviewsMeta(result.meta || null);
        setReviewsPage(page);
      }
    } catch (err) {
      console.error('Error fetching paginated reviews:', err);
    } finally {
      setReviewsLoading(false);
    }
  }, [collegeId]);

  useEffect(() => {
    if (activeTab === 'reviews' && collegeId) {
      fetchPaginatedReviews(1);
    }
  }, [activeTab, collegeId, fetchPaginatedReviews]);

  // Toggle Bookmark
  const handleToggleBookmark = async () => {
    if (!session) {
      alert('Please sign in to save colleges.');
      return;
    }

    setSavingBookmark(true);
    try {
      const res = await fetch('/api/user/saved', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ collegeId }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Failed to update bookmark');
      }

      setIsSaved(result.data.saved);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to save college');
    } finally {
      setSavingBookmark(false);
    }
  };

  // Callback when review is submitted successfully
  const handleReviewSuccess = () => {
    // Refresh college details to update overall rating & reviews count
    fetch(`/api/colleges/${collegeId}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.success && result.data) {
          setCollege(result.data);
        }
      });

    // Reset page to 1 and re-fetch reviews list
    fetchPaginatedReviews(1);
  };

  if (loading) {
    return (
      <div className="flex h-96 flex-col items-center justify-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
        <p className="text-sm font-semibold text-gray-500">Loading College Profile...</p>
      </div>
    );
  }

  if (error || !college) {
    return (
      <div className="rounded-2xl bg-red-50 p-6 text-center shadow-sm py-16">
        <span className="text-3xl block mb-4">⚠️</span>
        <h3 className="text-lg font-bold text-red-700">Failed to Load Profile</h3>
        <p className="mt-2 text-sm text-red-600">{error || 'College profile not found.'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-2 md:py-6">
      {/* Hero Header Card */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <img
              src={college.logoUrl}
              alt={`${college.name} logo`}
              className="h-20 w-20 rounded-2xl object-cover border border-gray-50 shadow-sm shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=150&h=150&fit=crop&q=80';
              }}
            />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">
                  {college.type.charAt(0) + college.type.slice(1).toLowerCase()}
                </span>
                {college.naacGrade && (
                  <span className="inline-flex items-center rounded-md bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-700/10">
                    NAAC {college.naacGrade}
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-black text-gray-900 sm:text-3xl leading-tight">
                {college.name}
              </h1>
              <p className="mt-1.5 text-sm text-gray-500 font-medium">
                {college.location} &middot; Estd. {college.establishedYear}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleToggleBookmark}
              disabled={savingBookmark}
              className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold shadow-sm transition-all border ${
                isSaved
                  ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span>{isSaved ? '★ Bookmarked' : '☆ Save College'}</span>
            </button>
            <a
              href={college.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              Visit Website
            </a>
          </div>
        </div>

        {/* Aggregate Ratings Panel */}
        <div className="mt-6 flex flex-wrap items-center gap-6 border-t border-gray-50 pt-5 text-sm font-medium">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded bg-amber-50 px-2.5 py-1 font-bold text-amber-700">
              <span>★</span>
              <span>{college.overallRating}</span>
            </div>
            <span className="text-gray-500">({college.totalReviews} Student Reviews)</span>
          </div>
          <span className="hidden sm:inline text-gray-200">|</span>
          <div className="text-gray-600">
            Avg Package: <span className="font-bold text-gray-800">{college.placements[0]?.averagePackage || 'N/A'} LPA</span>
          </div>
          <span className="hidden sm:inline text-gray-200">|</span>
          <div className="text-gray-600">
            Courses: <span className="font-bold text-gray-800">{college.courses.length} Degrees</span>
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="space-y-6">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-6" aria-label="Tabs">
            {(['overview', 'courses', 'placements', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`border-b-2 py-4 px-1 text-sm font-bold capitalize transition-all outline-none ${
                  activeTab === tab
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Panels */}
        <div className="min-h-[300px]">
          {/* Overview Panel */}
          {activeTab === 'overview' && (
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-base font-extrabold text-gray-800 mb-3">About {college.name}</h3>
                <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-wrap">{college.description}</p>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 border-t border-gray-50 pt-6 text-sm">
                <div>
                  <span className="text-gray-400 font-bold block mb-1">CITY</span>
                  <span className="font-bold text-gray-700">{college.city}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold block mb-1">STATE</span>
                  <span className="font-bold text-gray-700">{college.state}</span>
                </div>
                <div>
                  <span className="text-gray-400 font-bold block mb-1">ESTABLISHED</span>
                  <span className="font-bold text-gray-700">{college.establishedYear}</span>
                </div>
              </div>
            </div>
          )}

          {/* Courses Panel */}
          {activeTab === 'courses' && (
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm overflow-hidden">
              <h3 className="text-base font-extrabold text-gray-800 mb-4">Offered Degrees & Courses</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-xs">
                      <th className="py-3 px-4">Course Name</th>
                      <th className="py-3 px-4">Degree</th>
                      <th className="py-3 px-4 text-center">Duration</th>
                      <th className="py-3 px-4 text-center">Seats</th>
                      <th className="py-3 px-4 text-right">Annual Fees</th>
                      <th className="py-3 px-4 text-right">Total Fees</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
                    {college.courses.map((course) => (
                      <tr key={course.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-4 font-bold text-gray-800">{course.name}</td>
                        <td className="py-4 px-4">{course.degree}</td>
                        <td className="py-4 px-4 text-center">{course.duration} Years</td>
                        <td className="py-4 px-4 text-center">{course.seats}</td>
                        <td className="py-4 px-4 text-right">₹{(course.annualFees).toLocaleString()}</td>
                        <td className="py-4 px-4 text-right font-bold text-gray-900">₹{(course.totalFees).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Placements Panel */}
          {activeTab === 'placements' && (
            <div className="space-y-6">
              {/* Placement Package Trends */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <h3 className="text-base font-extrabold text-gray-800 mb-4">Placement Statistics (Last 3 Years)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-xs">
                        <th className="py-3 px-4">Year</th>
                        <th className="py-3 px-4 text-right">Average Package</th>
                        <th className="py-3 px-4 text-right">Median Package</th>
                        <th className="py-3 px-4 text-right">Highest Package</th>
                        <th className="py-3 px-4 text-right">Placement Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
                      {college.placements.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="py-4 px-4 font-bold text-gray-800">{p.year}</td>
                          <td className="py-4 px-4 text-right font-bold text-blue-600">{p.averagePackage} LPA</td>
                          <td className="py-4 px-4 text-right">{p.medianPackage} LPA</td>
                          <td className="py-4 px-4 text-right font-bold text-green-600">{p.highestPackage} LPA</td>
                          <td className="py-4 px-4 text-right">{p.placementRate}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top Recruiters */}
              {college.placements[0] && (
                <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                  <h3 className="text-base font-extrabold text-gray-800 mb-4">Top Hiring Partners</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {college.placements[0].topRecruiters.map((rec, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center rounded-xl bg-gray-50 border border-gray-150 px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm"
                      >
                        {rec}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reviews Panel */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {/* Student Review List */}
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                  <h3 className="text-base font-extrabold text-gray-800">Reviews & Ratings</h3>
                  <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                    Total {reviewsMeta?.total || 0} reviews
                  </span>
                </div>

                {reviewsLoading ? (
                  <div className="py-12 text-center text-sm font-semibold text-gray-400 animate-pulse">
                    Loading student reviews...
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="py-12 text-center text-sm font-medium text-gray-500">
                    No student reviews have been posted for this college yet. Be the first to share your experience!
                  </div>
                ) : (
                  <div className="space-y-6 divide-y divide-gray-50">
                    {reviews.map((rev, idx) => (
                      <div key={rev.id} className={`space-y-3 ${idx > 0 ? 'pt-6' : ''}`}>
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-gray-800">{rev.authorName}</span>
                              <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                                Batch {rev.batch} ({rev.course})
                              </span>
                              {rev.isVerified && (
                                <span className="inline-flex items-center gap-0.5 rounded bg-green-50 px-1.5 py-0.2 text-[10px] font-bold text-green-700 ring-1 ring-inset ring-green-700/10">
                                  ✓ Verified Review
                                </span>
                              )}
                            </div>
                            <h4 className="mt-1 font-bold text-gray-800 leading-snug">{rev.title}</h4>
                          </div>

                          <div className="flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-xs font-bold text-amber-700">
                            <span>★</span>
                            <span>{rev.rating}</span>
                          </div>
                        </div>

                        <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-wrap">{rev.content}</p>

                        {(rev.pros || rev.cons) && (
                          <div className="grid grid-cols-1 gap-4 pt-1 sm:grid-cols-2 text-xs font-medium">
                            {rev.pros && (
                              <div className="rounded-xl bg-green-50/40 border border-green-100/30 p-3 space-y-1">
                                <span className="text-green-700 font-bold uppercase tracking-wider">PROS</span>
                                <p className="text-gray-600 leading-relaxed">{rev.pros}</p>
                              </div>
                            )}
                            {rev.cons && (
                              <div className="rounded-xl bg-red-50/40 border border-red-100/30 p-3 space-y-1">
                                <span className="text-red-700 font-bold uppercase tracking-wider">CONS</span>
                                <p className="text-gray-600 leading-relaxed">{rev.cons}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Reviews Pagination */}
                    {(() => {
                      const totalPages = reviewsMeta?.totalPages || 1;
                      return reviewsMeta && totalPages > 1 ? (
                        <div className="flex items-center justify-between border-t border-gray-50 pt-5 text-sm font-medium">
                          <button
                            onClick={() => fetchPaginatedReviews(reviewsPage - 1)}
                            disabled={reviewsPage <= 1 || reviewsLoading}
                            className="rounded-xl border px-4 py-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            Previous Reviews
                          </button>
                          <span className="text-gray-500 font-semibold">
                            Page {reviewsPage} of {totalPages}
                          </span>
                          <button
                            onClick={() => fetchPaginatedReviews(reviewsPage + 1)}
                            disabled={reviewsPage >= totalPages || reviewsLoading}
                            className="rounded-xl border px-4 py-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                          >
                            Next Reviews
                          </button>
                        </div>
                      ) : null;
                    })()}
                  </div>
                )}
              </div>

              {/* Review Input Box */}
              <ReviewForm collegeId={collegeId} onSuccess={handleReviewSuccess} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
