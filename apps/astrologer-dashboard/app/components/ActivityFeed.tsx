import React from 'react';
import { User } from 'lucide-react';

export const RecentActivity: React.FC = () => {
  const activities = [
    { name: "Avni Pandit", action: "Booked a consultation", time: "2h ago" },
    { name: "Mahesh Joshi", action: "Completed a session", time: "5h ago" },
    { name: "Vijay Sharma", action: "Rescheduled consultation", time: "6h ago" },
    // { name: "Yash Bhagat", action: "Cancelled session", time: "8h ago" },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
      <div className="space-y-2">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-start space-x-4 p-3 rounded-xl hover:bg-gray-50 transition"
          >
            <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-yellow-100" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                <span className="font-semibold">{activity.name}</span> {activity.action}
              </p>
              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
