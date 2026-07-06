import React from "react";
import { useLanguageStore } from "@repo/store";
import { profileTranslations } from "@/lib/translations/profile";
import Skeleton from "@/components/ui/Skeleton";

interface NotificationsTabProps {
    loadingNotifications: boolean;
    notifications: any[];
    onMarkAsRead: (id: string) => void;
    onClearAll: () => void;
    hasMore?: boolean;
    loadingMore?: boolean;
    onLoadMore?: () => void;
}

const NotificationsTab: React.FC<NotificationsTabProps> = ({
    loadingNotifications,
    notifications,
    onMarkAsRead,
    onClearAll,
    hasMore,
    loadingMore,
    onLoadMore
}) => {
    const { lang } = useLanguageStore();
    const t = (profileTranslations[lang as keyof typeof profileTranslations] || profileTranslations.en).notifications;
    const fontStyle = lang === "hi" ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {};

  return (
    <div className="bg-white border-0 shadow-premium rounded-2xl mb-6 overflow-hidden">
      <div className="px-4 sm:px-6 py-4 sm:py-5 bg-white border-b border-gray-100 flex flex-row justify-between items-center gap-2 sm:gap-4">
        <h5
          className="text-base sm:text-lg font-bold text-gray-900 mb-0 flex items-center"
          style={fontStyle}
        >
          <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange/5 text-orange flex items-center justify-center mr-2 sm:mr-3 flex-shrink-0">
            <i className="fa-solid fa-bell text-sm sm:text-base"></i>
          </span>
          {t.title}
        </h5>
        {notifications.length > 0 && (
          <button
            onClick={onClearAll}
            className="px-3 sm:px-4 py-1.5 sm:py-2 text-red-500 hover:text-red-600 font-bold text-xs sm:text-sm bg-red-50 hover:bg-red-100 rounded-xl transition-all flex items-center gap-1.5 sm:gap-2 border-0 shrink-0"
            style={fontStyle}
          >
            <i className="fa-solid fa-trash-can"></i>
            {t.clearAll}
          </button>
        )}
      </div>
      <div className="p-4 sm:p-6 md:p-8">
        {loadingNotifications ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-5 rounded-2xl border border-gray-100 bg-white">
                <div className="flex gap-4">
                  <Skeleton width={48} height={48} className="rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton width={150} height={18} />
                    <Skeleton width="100%" height={14} />
                    <Skeleton width={100} height={12} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mb-6 border border-gray-100 shadow-inner">
              <i className="fa-solid fa-bell-slash text-3xl text-gray-300"></i>
            </div>
            <h6 className="font-bold text-gray-900 text-lg mb-2" style={fontStyle}>
              {t.noNotifications}
            </h6>
            <p className="text-gray-500 text-sm max-w-xs m-0" style={fontStyle}>
              {t.noNotificationsHint}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.filter(Boolean).map((notif: any) => (
              <div
                key={notif.id}
                className={`p-4 md:p-5 border-y sm:border sm:rounded-2xl transition-all duration-300 cursor-pointer group -mx-4 sm:mx-0 ${
                  notif.isRead
                    ? "bg-white border-gray-100 opacity-70 hover:opacity-100"
                    : "bg-orange/5 border-orange/10 sm:shadow-sm hover:shadow-md hover:bg-orange/10"
                }`}
                onClick={() => !notif.isRead && onMarkAsRead(notif.id)}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex gap-4">
                    <div
                      className={`w-10 h-10 md:w-12 md:h-12 shrink-0 flex items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${
                        notif.isRead
                          ? "bg-gray-100 text-gray-400"
                          : "bg-orange text-white"
                      }`}
                    >
                      <i
                        className={`fa-solid ${
                          notif.isRead ? "fa-envelope-open" : "fa-envelope"
                        } text-lg`}
                      ></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h6
                        className={`text-sm md:text-base mb-1 truncate ${
                          notif.isRead ? "text-gray-600" : "text-gray-900 font-bold"
                        }`}
                        style={fontStyle}
                      >
                        {notif.title}
                      </h6>
                      <p
                        className="text-xs md:text-sm text-gray-500 mb-2 md:mb-3 leading-relaxed line-clamp-2"
                        style={{ ...fontStyle, lineHeight: "1.5" }}
                      >
                        {notif.message}
                      </p>
                      <span className="flex items-center gap-2 text-[10px] text-orange font-bold uppercase tracking-widest" style={fontStyle}>
                        <i className="fa-regular fa-clock text-[10px]"></i>
                        {notif.createdAt || notif.created_at
                          ? new Date(
                              notif.createdAt || notif.created_at
                            ).toLocaleString(lang === "hi" ? "hi-IN" : "en-IN", {
                              day: "numeric",
                              month: "short",
                              hour: "numeric",
                              minute: "numeric",
                            })
                          : t.na || "N/A"}
                      </span>
                    </div>
                  </div>
                  {!notif.isRead && (
                    <div className="relative flex items-center justify-center">
                      <span className="absolute w-3 h-3 rounded-full bg-orange animate-ping opacity-75"></span>
                      <span className="relative w-2.5 h-2.5 rounded-full bg-orange shadow-lg shadow-orange/50"></span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Load More Button */}
            {hasMore ? (
              <div className="flex justify-center mt-10">
                <button
                  onClick={onLoadMore}
                  disabled={loadingMore}
                  className="px-6 py-3 md:px-10 md:py-4 bg-white border-2 border-gray-100 text-gray-600 font-bold rounded-2xl hover:border-orange-200 hover:text-orange hover:bg-orange-50/30 transition-all duration-300 flex items-center gap-3 shadow-sm active:scale-95 disabled:opacity-50"
                  style={fontStyle}
                >
                  {loadingMore ? (
                    <>
                      <i className="fa-solid fa-circle-notch fa-spin"></i>
                      <span>{lang === "hi" ? "और लोड हो रहा है..." : "Loading More..."}</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-arrow-down-long"></i>
                      <span>{lang === "hi" ? "और नोटिफिकेशन लोड करें" : "Load More Notifications"}</span>
                    </>
                  )}
                </button>
              </div>
            ) : notifications.length > 0 && (
              <div className="flex flex-col items-center justify-center mt-12 py-8 border-t border-dashed border-gray-100">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mb-3 text-gray-300">
                  <i className="fa-solid fa-check"></i>
                </div>
                <p className="text-gray-400 text-sm font-medium" style={fontStyle}>
                  {lang === "hi" ? "आपने सभी नोटिफिकेशन देख लिए हैं" : "You've viewed all notifications"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsTab;


