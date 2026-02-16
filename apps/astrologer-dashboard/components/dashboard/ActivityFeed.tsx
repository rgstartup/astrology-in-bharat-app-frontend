import React, { useEffect, useState } from 'react';
import { User as UserIcon, Clock as ClockIcon } from 'lucide-react';
const User = UserIcon as any;
const Clock = ClockIcon as any;
import { getRecentSessions } from '@/lib/dashboard';
import { format, formatDistanceToNow } from 'date-fns';

interface Activity {
  name: string;
  action: string;
  time: string;
  relativeTime: string;
}

export const RecentActivity: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const sessions = await getRecentSessions();
        const recent5 = sessions.slice(0, 5).map(session => ({
          name: session.user?.name || "Client",
          action: "consultation",
          time: format(new Date(session.createdAt), 'h:mm a'),
          relativeTime: formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })
        }));
        setActivities(recent5);
      } catch (error) {
        console.error("Failed to fetch recent activities:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Clock className="w-5 h-5 text-[#fd6410]" />
        Recent Activity
      </h3>
      <div className="space-y-2">
        {loading ? (
          <div className="flex flex-col space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse flex items-center space-x-4 p-3">
                <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : activities.length > 0 ? (
          activities.map((activity, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 p-3 rounded-xl hover:bg-orange-50/50 transition border border-transparent hover:border-orange-100"
            >
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-[#fd6410]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 leading-tight">
                  <span className="font-bold text-[#fd6410]">{activity.time}</span> consult to <span className="font-semibold text-gray-900">{activity.name}</span>
                </p>
                <p className="text-[10px] font-medium text-gray-400 mt-1 flex items-center gap-1 uppercase tracking-wider">
                  {activity.relativeTime}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-gray-500">No recent activity found.</p>
          </div>
        )}
      </div>
    </div>
  );
};



