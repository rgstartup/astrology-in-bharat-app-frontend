export default function ManageServicesLoading() {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-500 flex flex-col gap-4">
      <div className="h-20 bg-gray-200 rounded animate-pulse" />
      <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4" />
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-200 rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
}
