const NotificationSkeleton = ({ show }: { show: boolean }) => {
  if (!show) return null;

  return (
    <div className="divide-y divide-gray-100">
      {[1, 2, 3].map((i) => (
        <div key={i} className="px-4 py-4 animate-pulse">
          <div className="flex justify-between mb-2">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-2 bg-gray-100 rounded w-4"></div>
          </div>
          <div className="h-3 bg-gray-100 rounded w-full mb-1"></div>
          <div className="h-3 bg-gray-100 rounded w-3/4"></div>
          <div className="h-2 bg-orange-50 rounded w-1/4 mt-3"></div>
        </div>
      ))}
    </div>
  );
};

export default NotificationSkeleton;
