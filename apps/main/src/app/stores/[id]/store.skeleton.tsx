const StoreSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 md:px-6 mt-10 animate-pulse">
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <div className="w-full lg:w-[360px] xl:w-[400px] shrink-0 space-y-6">
        <div className="h-[500px] bg-[#1A1A1A] rounded-[40px] border border-slate-100 shadow-sm"></div>
      </div>
      <div className="w-full flex-1 space-y-6">
        <div className="h-20 bg-[#1A1A1A] rounded-[32px] border border-orange/10"></div>
        <div className="h-[600px] bg-[#1A1A1A] rounded-[32px] border border-orange/10"></div>
      </div>
    </div>
  </div>
);

export default StoreSkeleton;
