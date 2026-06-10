'use client';

export default function CollegeCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm animate-pulse">
      {/* Top section with Logo + Name */}
      <div className="flex items-start gap-4">
        <div className="h-14 w-14 rounded-xl bg-gray-200 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 rounded bg-gray-200" />
          <div className="h-3 w-1/2 rounded bg-gray-200" />
        </div>
      </div>

      {/* Middle info grid */}
      <div className="my-5 grid grid-cols-2 gap-4 border-y border-gray-50 py-4">
        <div className="space-y-1">
          <div className="h-3 w-1/3 rounded bg-gray-200" />
          <div className="h-4 w-2/3 rounded bg-gray-200" />
        </div>
        <div className="space-y-1">
          <div className="h-3 w-1/3 rounded bg-gray-200" />
          <div className="h-4 w-2/3 rounded bg-gray-200" />
        </div>
        <div className="space-y-1">
          <div className="h-3 w-1/3 rounded bg-gray-200" />
          <div className="h-4 w-2/3 rounded bg-gray-200" />
        </div>
        <div className="space-y-1">
          <div className="h-3 w-1/3 rounded bg-gray-200" />
          <div className="h-4 w-2/3 rounded bg-gray-200" />
        </div>
      </div>

      {/* Bottom buttons */}
      <div className="mt-auto flex items-center justify-between gap-3 pt-2">
        <div className="h-10 w-2/5 rounded-xl bg-gray-200" />
        <div className="h-10 w-2/5 rounded-xl bg-gray-200" />
      </div>
    </div>
  );
}
