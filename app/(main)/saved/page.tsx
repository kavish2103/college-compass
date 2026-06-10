'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import CollegeCard from '@/components/colleges/CollegeCard';
import CollegeCardSkeleton from '@/components/colleges/CollegeCardSkeleton';
import EmptyState from '@/components/colleges/EmptyState';
import { ApiResponsePayload } from '@/lib/utils';

interface SavedCollege {
  id: string;
  collegeId: string;
  college: {
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
      id: string;
      name: string;
      degree: string;
      duration: number;
      totalFees: number;
      annualFees: number;
      seats: number;
    }[];
    placements: {
      id: string;
      year: number;
      averagePackage: number;
      medianPackage: number;
      highestPackage: number;
      placementRate: number;
      topRecruiters: string[];
    }[];
  };
}

export default function SavedCollegesPage() {
  const router = useRouter();
  const { status } = useSession();

  // State
  const [savedItems, setSavedItems] = useState<SavedCollege[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch saved colleges from user/saved API
  const fetchSavedColleges = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/user/saved');
      const result: ApiResponsePayload<SavedCollege[]> = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Failed to load saved colleges');
      }
      setSavedItems(result.data || []);
    } catch (err: unknown) {
      console.error('Fetch saved error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchSavedColleges();
    }
  }, [status]);

  // Action: Remove from bookmarks list
  const handleRemoveBookmark = async (collegeId: string) => {
    try {
      const res = await fetch('/api/user/saved', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ collegeId }),
      });

      if (res.ok) {
        // Optimistically filter from state
        setSavedItems((prev) => prev.filter((item) => item.collegeId !== collegeId));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to remove college from saved list');
      }
    } catch (err) {
      console.error('Remove bookmark error:', err);
      alert('Failed to remove college');
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="py-2 md:py-6 space-y-8 animate-pulse">
        <div className="border-b border-gray-100 pb-5 mb-8">
          <div className="h-8 w-48 bg-gray-200 rounded-xl mb-2" />
          <div className="h-4 w-64 bg-gray-100 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <CollegeCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  const handleBrowseRedirect = () => {
    router.push('/colleges');
  };

  return (
    <div className="space-y-8 py-2 md:py-6">
      {/* Header */}
      <div className="border-b border-gray-100 pb-5">
        <h1 className="text-3xl font-black tracking-tight text-gray-900">Saved Shortlists</h1>
        <p className="mt-1 text-sm text-gray-500 font-semibold">
          Manage and review your saved college listings.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-5 text-sm font-semibold text-red-700">
          ⚠️ {error}
        </div>
      )}

      {savedItems.length === 0 ? (
        <EmptyState onReset={handleBrowseRedirect} />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {savedItems.map((item) => (
            <div key={item.id} className="relative group space-y-3">
              <CollegeCard college={item.college} />
              
              {/* Quick remove button */}
              <button
                onClick={() => handleRemoveBookmark(item.collegeId)}
                className="w-full py-2.5 rounded-xl border border-red-200 bg-red-50/50 hover:bg-red-50 text-xs font-bold text-red-700 shadow-sm transition-all focus:outline-none focus:ring-1 focus:ring-red-500"
              >
                ✕ Remove Shortcut
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
