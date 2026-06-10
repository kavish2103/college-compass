'use client';

import Link from 'next/link';
import { useCompare } from './CompareContext';

interface CollegeCardProps {
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
  };
}

export default function CollegeCard({ college }: CollegeCardProps) {
  const { addToCompare, removeFromCompare, isCompared } = useCompare();

  const isSelected = isCompared(college.id);

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSelected) {
      removeFromCompare(college.id);
    } else {
      addToCompare({
        id: college.id,
        name: college.name,
        logoUrl: college.logoUrl,
        location: college.location,
        city: college.city,
        state: college.state,
        type: college.type,
        establishedYear: college.establishedYear,
        overallRating: college.overallRating,
      });
    }
  };

  // Find lowest B.Tech fee or general fee for preview
  const feesRange = college.courses.length > 0
    ? `${(Math.min(...college.courses.map((c) => c.annualFees)) / 100000).toFixed(1)}L - ${(Math.max(...college.courses.map((c) => c.annualFees)) / 100000).toFixed(1)}L`
    : 'N/A';

  // Find latest placements packages
  const latestPlacement = college.placements[0];

  return (
    <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-all duration-200">
      {/* College Info Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <img
            src={college.logoUrl || 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=150&h=150&fit=crop&q=80'}
            alt={`${college.name} logo`}
            className="h-14 w-14 rounded-xl object-cover border border-gray-50 bg-gray-50 shadow-sm shrink-0"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=150&h=150&fit=crop&q=80';
            }}
          />
          <div>
            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10 mb-1.5">
              {college.type.charAt(0) + college.type.slice(1).toLowerCase()}
            </span>
            <Link href={`/colleges/${college.id}`} className="hover:underline">
              <h3 className="font-bold text-gray-800 line-clamp-2 leading-tight">
                {college.name}
              </h3>
            </Link>
            <p className="mt-1 text-xs text-gray-500 font-medium">
              {college.city}, {college.state} &middot; Estd. {college.establishedYear}
            </p>
          </div>
        </div>
      </div>

      {/* Ratings and Grades */}
      <div className="mt-3 flex items-center gap-3">
        <div className="flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.5 text-xs font-bold text-amber-700">
          <span>★</span>
          <span>{college.overallRating}</span>
        </div>
        <span className="text-xs text-gray-500 font-medium">
          ({college.totalReviews} reviews)
        </span>
        {college.naacGrade && (
          <span className="text-xs font-semibold bg-green-50 text-green-700 rounded px-1.5 py-0.5">
            NAAC {college.naacGrade}
          </span>
        )}
      </div>

      {/* Stats Board */}
      <div className="my-5 grid grid-cols-2 gap-4 border-y border-gray-50 py-4 text-xs font-medium">
        <div className="space-y-1">
          <span className="text-gray-400 font-semibold uppercase tracking-wider block">
            Annual Fees
          </span>
          <span className="text-sm font-bold text-gray-700">
            {feesRange}
          </span>
        </div>
        <div className="space-y-1">
          <span className="text-gray-400 font-semibold uppercase tracking-wider block">
            Avg Package
          </span>
          <span className="text-sm font-bold text-gray-700">
            {latestPlacement ? `${latestPlacement.averagePackage} LPA` : 'N/A'}
          </span>
        </div>
        <div className="space-y-1 col-span-2">
          <span className="text-gray-400 font-semibold uppercase tracking-wider block">
            Highest Package ({latestPlacement?.year || 'Last Placement'})
          </span>
          <span className="text-sm font-bold text-gray-700">
            {latestPlacement ? `${latestPlacement.highestPackage} LPA` : 'N/A'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-auto flex items-center justify-between gap-3 pt-2">
        <button
          onClick={handleCompareToggle}
          className={`flex-1 rounded-xl px-4 py-2.5 text-xs font-bold transition-colors border ${
            isSelected
              ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {isSelected ? '✓ Selected' : '+ Compare'}
        </button>
        <Link
          href={`/colleges/${college.id}`}
          className="flex-1 inline-flex justify-center items-center rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
