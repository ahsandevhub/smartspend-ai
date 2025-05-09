export const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
    <div className="h-4 bg-gray-200 rounded w-full"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
  </div>
);

export const CardSkeleton = () => (
  <div className="animate-pulse bg-white rounded-lg shadow p-4 h-56">
    <div className="h-5 bg-gray-200 rounded w-1/2 mb-3"></div>
    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-4/5 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
  </div>
);
