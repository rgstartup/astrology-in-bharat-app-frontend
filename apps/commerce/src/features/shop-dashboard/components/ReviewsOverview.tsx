"use client";

import React from 'react';
import { Star, MessageSquare, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { Skeleton } from "@/components/ui/Skeleton";

export interface PerformanceData {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { 1: number; 2: number; 3: number; 4: number; 5: number };
  weeklyTargetProgress?: number;
  currentTier?: string;
  latestReview?: {
    text: string;
    rating: number;
    userName: string;
  };
}

interface ReviewsOverviewProps {
  data?: PerformanceData;
  isLoading?: boolean;
}

export const ReviewsOverview: React.FC<ReviewsOverviewProps> = ({ data, isLoading = false }) => {
  const distribution = data
    ? [5, 4, 3, 2, 1].map((stars) => {
        const count = data.ratingDistribution[stars as keyof typeof data.ratingDistribution] || 0;
        const total = data.totalReviews || 1;
        return { stars, count, percentage: Math.round((count / total) * 100) };
      })
    : [
        { stars: 5, count: 124, percentage: 85 },
        { stars: 4, count: 42, percentage: 65 },
        { stars: 3, count: 12, percentage: 25 },
        { stars: 2, count: 5, percentage: 10 },
        { stars: 1, count: 2, percentage: 5 },
      ];

  const avgRating = data?.averageRating ?? 4.8;
  const totalReviews = data?.totalReviews ?? 185;

  if (isLoading) {
    return (
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
        <Skeleton className="h-6 w-1/3 mb-10" />
        <div className="grid grid-cols-2 gap-10">
          <div className="space-y-3">
            <Skeleton className="h-16 w-1/2 rounded-2xl" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-3 w-full" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 h-full hover:shadow-lg transition-all duration-500">
      <div className="flex items-center justify-between mb-10">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
          <div className="p-2 bg-yellow-50 rounded-xl">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          </div>
          Customer Satisfaction
        </h3>
        <div className="bg-green-50 px-3 py-1 rounded-full flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-green-600" />
          <span className="text-[10px] font-bold text-green-600">Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="text-center md:text-left space-y-2">
          <div className="relative inline-block">
            <span className="text-6xl font-bold text-gray-900 tracking-tighter">{avgRating.toFixed(1)}</span>
            <span className="absolute -top-1 -right-8 text-lg font-bold text-[#fd6410]">/ 5</span>
          </div>
          <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`w-5 h-5 ${s <= Math.round(avgRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}`} />
            ))}
          </div>
          <p className="text-sm font-bold text-gray-400 italic">Based on {totalReviews} reviews</p>
        </div>

        <div className="space-y-3">
          {distribution.map((r, index) => (
            <div key={r.stars} className="flex items-center gap-3 group">
              <span className="text-xs font-bold text-gray-400 w-3">{r.stars}</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${r.percentage}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                  className={`absolute inset-0 rounded-full ${r.stars >= 4 ? 'bg-[#fd6410]' : 'bg-gray-300'} group-hover:brightness-110 transition-all shadow-sm`}
                />
              </div>
              <span className="text-[10px] font-bold text-gray-400 w-8 text-right italic group-hover:text-gray-900 transition-colors">{r.count}</span>
            </div>
          ))}
        </div>
      </div>

      {data?.latestReview ? (
        <div className="mt-10 pt-8 border-t border-gray-50">
          <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100/50 flex gap-4 hover:bg-orange-50/30 transition-colors group cursor-pointer">
            <div className="w-10 h-10 bg-[#fd6410]/10 rounded-full flex items-center justify-center text-[#fd6410] shrink-0 group-hover:bg-[#fd6410] group-hover:text-white transition-all">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800 leading-relaxed italic">"{data.latestReview.text}"</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] font-bold text-[#fd6410]">Review by {data.latestReview.userName}</span>
                <div className="h-1 w-1 bg-gray-300 rounded-full" />
                <span className="text-[10px] font-bold text-gray-400">Live</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-10 pt-8 border-t border-gray-50">
          <div className="bg-orange-50/30 p-5 rounded-2xl border border-dashed border-orange-200 flex items-center justify-center gap-3">
             <MessageSquare className="w-5 h-5 text-orange-200" />
             <p className="text-[10px] font-bold text-orange-300">No reviews yet for your shop</p>
          </div>
        </div>
      )}
    </div>
  );
};
