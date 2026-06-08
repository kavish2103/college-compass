export default function CollegeDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="py-6">
      <div className="border-b pb-5 mb-8">
        <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          College Details
        </h2>
        <p className="mt-1 text-sm text-gray-500">ID: {params.id}</p>
      </div>
      <div className="rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
        <h3 className="text-sm font-semibold text-gray-900">College Details Board</h3>
        <p className="mt-1 text-sm text-gray-500">Under construction — will be implemented in Part 2.</p>
      </div>
    </div>
  );
}
