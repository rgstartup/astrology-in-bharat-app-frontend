import { ExpertGridSkeleton } from "@/components/features/experts/SkeletonCard";

export default function LoadingSkeleton() {
  return (
    <section
      className="py-[100px] relative overflow-hidden"
      style={{
        backgroundColor: "#301118",
        backgroundImage: "url(/images/bg-dark.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16 w-full">
        <div className="relative mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Find Your Expert
          </h2>
          <div className="w-48 h-1 bg-orange"></div>
        </div>
        <div className="w-full">
          <ExpertGridSkeleton count={8} />
        </div>
      </div>
    </section>
  );
}
