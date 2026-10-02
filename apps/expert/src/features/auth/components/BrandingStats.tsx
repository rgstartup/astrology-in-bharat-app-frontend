import api from "@/actions/api";

export interface BrandingStatsData {
  totalExperts: string;
  totalServices: string;
}

export const BrandingStatsSkeleton: React.FC = () => {
  return (
    <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-xs animate-pulse">
      <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
        <div className="h-7 bg-white/20 rounded-md w-16 mb-2"></div>
        <div className="h-2.5 bg-white/20 rounded w-20"></div>
      </div>
      <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
        <div className="h-7 bg-white/20 rounded-md w-16 mb-2"></div>
        <div className="h-2.5 bg-white/20 rounded w-20"></div>
      </div>
    </div>
  );
};

export const BrandingStatsView: React.FC<{ stats: BrandingStatsData }> = ({ stats }) => {
  return (
    <div className="mt-12 grid grid-cols-2 gap-4 w-full max-w-xs">
      <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-default group">
        <p className="text-2xl font-black">{stats.totalExperts}</p>
        <p className="text-[10px] uppercase font-bold tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
          Total Experts
        </p>
      </div>
      <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10 hover:bg-white/20 hover:scale-105 transition-all duration-300 cursor-default group">
        <p className="text-2xl font-black">{stats.totalServices}</p>
        <p className="text-[10px] uppercase font-bold tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
          Services Given
        </p>
      </div>
    </div>
  );
};

async function getExpertHubStats(): Promise<BrandingStatsData> {
  const res = await api.get<{ total_experts: number; totalServices: number; totalExperts: number }>(
    `/public/stats/expert-hub`,
    {
      next: { revalidate: 60 },
    },
  );
  if (!res.ok) {
    return { totalExperts: "0+", totalServices: "0+" };
  }

  const experts = res.data.total_experts ?? res.data.totalExperts ?? 0;
  const services = res.data.totalServices ?? 0;

  return {
    totalExperts: `${experts}+`,
    totalServices: `${services}+`,
  };
}

export async function BrandingStats() {
  const stats = await getExpertHubStats();
  return <BrandingStatsView stats={stats} />;
}
