import Link from 'next/link';
import prisma from '@/lib/prisma';
import CollegeCard from '@/components/colleges/CollegeCard';
import { CollegeType } from '@prisma/client';

export const dynamic = 'force-dynamic';

interface CollegeCardData {
  id: string;
  name: string;
  logoUrl: string;
  location: string;
  city: string;
  state: string;
  type: CollegeType;
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

export default async function HomePage() {
  // Fetch top 6 colleges by overallRating directly from the database
  let featuredColleges: CollegeCardData[] = [];
  let stats = { colleges: 0, cities: 0 };
  try {
    featuredColleges = await prisma.college.findMany({
      orderBy: {
        overallRating: 'desc',
      },
      take: 6,
      include: {
        courses: {
          select: {
            name: true,
            degree: true,
            totalFees: true,
            annualFees: true,
          },
        },
        placements: {
          select: {
            year: true,
            averagePackage: true,
            medianPackage: true,
            highestPackage: true,
          },
          orderBy: {
            year: 'desc',
          },
        },
      },
    });

    const totalCollegesCount = await prisma.college.count();
    const uniqueCities = await prisma.college.groupBy({
      by: ['city'],
    });

    stats = {
      colleges: totalCollegesCount,
      cities: uniqueCities.length,
    };
  } catch (err) {
    console.error('Failed to load featured colleges for Home Page:', err);
  }

  return (
    <div className="space-y-16 md:space-y-24 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 py-20 px-6 sm:px-12 lg:px-16 text-center shadow-xl">
        {/* Decorative background grid */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        
        {/* Gradient backdrop */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/30 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-3xl mx-auto space-y-6">
          <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3.5 py-1 text-xs font-bold text-blue-400 ring-1 ring-inset ring-blue-500/20 mb-2 uppercase tracking-wider">
            Discover Your Potential
          </span>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl leading-tight">
            Discover & Compare Your <span className="text-blue-400">Dream College</span>
          </h1>
          <p className="max-w-xl mx-auto text-base sm:text-lg text-slate-300 font-medium leading-relaxed">
            Explore placement analytics, structured fee charts, and verified student reviews across 20+ premier Indian institutes.
          </p>

          {/* Search Form */}
          <form action="/colleges" method="GET" className="max-w-lg mx-auto pt-4">
            <div className="relative flex items-center">
              <input
                type="text"
                name="search"
                required
                placeholder="Search colleges by name, city, state..."
                className="w-full rounded-2xl bg-white/10 border border-white/10 hover:border-white/20 focus:border-blue-500 focus:bg-white text-white focus:text-slate-800 placeholder-slate-400 px-5 py-4 pr-14 text-sm font-semibold shadow-inner transition-all outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="absolute right-2.5 p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md focus:outline-none"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm hover:shadow-md transition-shadow">
            <span className="block text-4xl font-extrabold text-blue-600 mb-1">
              {stats.colleges > 0 ? `${stats.colleges}+` : '20+'}
            </span>
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              Premier Colleges
            </span>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm hover:shadow-md transition-shadow">
            <span className="block text-4xl font-extrabold text-blue-600 mb-1">
              {stats.cities > 0 ? `${stats.cities}+` : '10+'}
            </span>
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              Indian Cities
            </span>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-sm hover:shadow-md transition-shadow">
            <span className="block text-4xl font-extrabold text-blue-600 mb-1">
              3 Way
            </span>
            <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">
              Compare Side-by-Side
            </span>
          </div>
        </div>
      </section>

      {/* Featured Colleges Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-gray-900">Featured Colleges</h2>
            <p className="mt-1 text-sm text-gray-500 font-semibold">
              Highest rated universities shortlisted by student reviews and achievements.
            </p>
          </div>
          <Link
            href="/colleges"
            className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-1 group shrink-0"
          >
            Explore all colleges
            <span className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        {featuredColleges.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed p-16 text-center">
            <p className="text-sm font-semibold text-gray-400">No college data loaded yet. Seed your database to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredColleges.map((college) => (
              <CollegeCard key={college.id} college={college} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
