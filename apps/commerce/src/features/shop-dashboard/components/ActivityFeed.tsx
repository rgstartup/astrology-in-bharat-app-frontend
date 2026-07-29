"use client";

import React from 'react';
import { ShoppingCart, Package, Star, MessageSquare, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { MerchantActivity } from "@/types/dashboard";
import { Skeleton } from "@/components/ui/Skeleton";

export interface Activity {
  id: string;
  type: 'order' | 'stock' | 'review' | 'message';
  title: string;
  description: string;
  time: string;
  relativeTime?: string;
}

interface ActivityFeedProps {
  activities?: readonly MerchantActivity[];
  isLoading?: boolean;
}

const iconMap = {
  order: { icon: ShoppingCart, bg: 'bg-green-100', text: 'text-green-600' },
  stock: { icon: Package, bg: 'bg-rose-100', text: 'text-rose-600' },
  review: { icon: Star, bg: 'bg-yellow-100', text: 'text-yellow-600' },
  message: { icon: MessageSquare, bg: 'bg-blue-100', text: 'text-blue-600' },
};

const SkeletonItem = () => (
  <div className="flex items-start space-x-5 p-4">
    <Skeleton className="w-12 h-12 rounded-2xl shrink-0" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  </div>
);

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities = [], isLoading = false }) => {
  return (
    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 h-full hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
          <div className="p-2 bg-orange-50 rounded-xl">
            <Clock className="w-5 h-5 text-[#fd6410]" />
          </div>
          Live Activity
        </h3>
        <button className="text-[10px] font-bold text-gray-400 hover:text-[#fd6410] transition-colors">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          [...Array(4)].map((_, i) => <SkeletonItem key={i} />)
        ) : activities.length > 0 ? (
          activities.map((activity, index) => {
            const { icon: Icon, bg, text } = (iconMap as any)[activity.type] || iconMap.message;
            return (
              <motion.div
                key={activity.id || `activity-${index}`}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group flex items-start space-x-5 p-4 rounded-2xl hover:bg-orange-50/40 transition-all border border-transparent hover:border-orange-100/50 cursor-pointer"
              >
                <div className={`w-12 h-12 ${bg} ${text} rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-gray-900 truncate tracking-tight">{activity.title}</p>
                    <span className="text-[10px] font-bold text-[#fd6410] bg-orange-100 px-2 py-0.5 rounded-full shrink-0 group-hover:bg-[#fd6410] group-hover:text-white transition-colors">
                      {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 font-medium italic opacity-80 group-hover:opacity-100 transition-opacity">
                    {activity.description}
                  </p>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-10">
            <p className="text-sm font-bold text-gray-300 italic">No activity yet</p>
          </div>
        )}
      </div>
    </div>
  );
};
