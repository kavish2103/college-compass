'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

// Static options matching our seed data
const STATES = [
  'Delhi',
  'Maharashtra',
  'Tamil Nadu',
  'Karnataka',
  'Telangana',
  'West Bengal',
  'Uttar Pradesh',
  'Rajasthan',
  'Punjab',
];

const CITIES = [
  'Mumbai',
  'New Delhi',
  'Chennai',
  'Kharagpur',
  'Kanpur',
  'Pilani',
  'Tiruchirappalli',
  'Mangaluru',
  'Vellore',
  'Manipal',
  'Bengaluru',
  'Hyderabad',
  'Patiala',
  'Noida',
  'Phagwara',
  'Kolkata',
  'Coimbatore',
];

const DEGREES = ['B.Tech', 'M.Tech', 'MBA'];

export default function Filters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Local state initialized from URL search params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [state, setState] = useState(searchParams.get('state') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [degree, setDegree] = useState(searchParams.get('degree') || '');
  const [minFees, setMinFees] = useState(searchParams.get('minFees') || '');
  const [maxFees, setMaxFees] = useState(searchParams.get('maxFees') || '');
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '');

  // Reset filters if URL filters are empty (e.g. from Clear All)
  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setType(searchParams.get('type') || '');
    setState(searchParams.get('state') || '');
    setCity(searchParams.get('city') || '');
    setDegree(searchParams.get('degree') || '');
    setMinFees(searchParams.get('minFees') || '');
    setMaxFees(searchParams.get('maxFees') || '');
    setMinRating(searchParams.get('minRating') || '');
  }, [searchParams]);

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (search.trim()) params.set('search', search.trim());
    if (type) params.set('type', type);
    if (state) params.set('state', state);
    if (city) params.set('city', city);
    if (degree) params.set('degree', degree);
    if (minFees) params.set('minFees', minFees);
    if (maxFees) params.set('maxFees', maxFees);
    if (minRating) params.set('minRating', minRating);

    // Reset pagination to page 1 when filters change
    params.set('page', '1');

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleReset = () => {
    setSearch('');
    setType('');
    setState('');
    setCity('');
    setDegree('');
    setMinFees('');
    setMaxFees('');
    setMinRating('');
    router.push(pathname);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-gray-50 pb-4">
        <h3 className="font-bold text-gray-800">Filter Colleges</h3>
        <button
          type="button"
          onClick={handleReset}
          className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
        >
          Reset All
        </button>
      </div>

      {/* Search Input */}
      <div className="space-y-2">
        <label htmlFor="search-input" className="text-xs font-bold uppercase tracking-wider text-gray-400">
          Search
        </label>
        <div className="relative">
          <input
            id="search-input"
            type="text"
            placeholder="Search by name, city, desc..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* College Type */}
      <div className="space-y-2">
        <label htmlFor="type-select" className="text-xs font-bold uppercase tracking-wider text-gray-400">
          Institution Type
        </label>
        <select
          id="type-select"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
        >
          <option value="">All Types</option>
          <option value="GOVERNMENT">Government</option>
          <option value="PRIVATE">Private</option>
          <option value="DEEMED">Deemed University</option>
        </select>
      </div>

      {/* Degree */}
      <div className="space-y-2">
        <label htmlFor="degree-select" className="text-xs font-bold uppercase tracking-wider text-gray-400">
          Degree Offered
        </label>
        <select
          id="degree-select"
          value={degree}
          onChange={(e) => setDegree(e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
        >
          <option value="">All Degrees</option>
          {DEGREES.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* State */}
      <div className="space-y-2">
        <label htmlFor="state-select" className="text-xs font-bold uppercase tracking-wider text-gray-400">
          State
        </label>
        <select
          id="state-select"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
        >
          <option value="">All States</option>
          {STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* City */}
      <div className="space-y-2">
        <label htmlFor="city-select" className="text-xs font-bold uppercase tracking-wider text-gray-400">
          City
        </label>
        <select
          id="city-select"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
        >
          <option value="">All Cities</option>
          {CITIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Fees range */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
          Total Fees (INR)
        </span>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="min-fees-input" className="sr-only">Min Fees</label>
            <input
              id="min-fees-input"
              type="number"
              placeholder="Min"
              value={minFees}
              onChange={(e) => setMinFees(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label htmlFor="max-fees-input" className="sr-only">Max Fees</label>
            <input
              id="max-fees-input"
              type="number"
              placeholder="Max"
              value={maxFees}
              onChange={(e) => setMaxFees(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3.5 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="space-y-2">
        <label htmlFor="rating-select" className="text-xs font-bold uppercase tracking-wider text-gray-400">
          Minimum Rating
        </label>
        <select
          id="rating-select"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
        >
          <option value="">Any Rating</option>
          <option value="4.5">4.5+ ★</option>
          <option value="4.0">4.0+ ★</option>
          <option value="3.5">3.5+ ★</option>
          <option value="3.0">3.0+ ★</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
      >
        Apply Filters
      </button>
    </form>
  );
}
