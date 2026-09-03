import { PATHS } from "@repo/routes";
import Link from "next/link";
import React from "react";
import { INotification } from "@/lib/types/notification.type";
import { getTranslations } from "next-intl/server";

interface NotificationDropDownProps {
  //   loadingNotifications: boolean;
  showNotificationDropDown: boolean;
  setShowNotificationDropDown: React.Dispatch<React.SetStateAction<boolean>>;
  notifications: INotification[];
  handleClearAll: () => void;
  children: React.ReactNode;
}

interface ClearAllButtonProps {
  show: boolean;
  handleClearAll: () => void;
  text: string;
}

const ClearAllButton = (props: ClearAllButtonProps) => {
  if (!props.show) return null;

  return (
    <button
      onClick={props.handleClearAll}
      className="text-red-500 text-sm font-bold hover:text-red-600 hover:bg-red-50 px-2 py-1 rounded-lg transition-all flex items-center gap-1.5"
    >
      <i className="fa-solid fa-trash-can text-xs"></i>
      {/* {t.clearAll} */}
      {props.text}
    </button>
  );
};

const NotificationDropDown = async (props: NotificationDropDownProps) => {
  if (!props.showNotificationDropDown) return null;

  const t = await getTranslations("Header");

  const { notifications, handleClearAll, setShowNotificationDropDown } = props;

  return (
    <div className="fixed top-[65px] left-[5vw] w-[90vw] sm:absolute sm:top-[140%] sm:left-auto sm:-right-4 md:right-0 sm:w-[320px] md:w-[380px] bg-white shadow-lg rounded-2xl overflow-hidden z-[1001] border border-[#eee]">
      <div className="px-3 py-3 border-b bg-gray-50 flex justify-between items-center">
        <p className="mb-0 font-bold text-gray-900 text-lg">
          {t("notifications")}
        </p>
        <ClearAllButton
          show={notifications.length > 0}
          text={t("clearAll")}
          handleClearAll={handleClearAll}
        />
      </div>
      <div
        data-lenis-prevent
        className="overflow-y-auto overscroll-contain"
        style={{ maxHeight: "400px" }}
      >
        {/* <NotificationSkeleton show={props.loadingNotifications} />
        <EmptyNotification show={notifications.length === 0} t={t} />
        <NotificationList
          show={notifications.length > 0}
          notifications={notifications}
        />
        // notificationsHasMore && // notifications.length greater than 0 && //
        !loadingNotifications &&
        <LoadMoreNotification
          show={
            notificationsHasMore &&
            notifications.length > 0 &&
            !loadingNotifications
          }
        /> */}

        {props.children}
      </div>
      <div className="px-3 py-3 border-t text-center bg-gray-50">
        <Link
          href={`${PATHS.PROFILE}?tab=notifications`}
          className="no-underline text-orange-500 font-bold text-sm hover:text-orange-600"
          onClick={() => setShowNotificationDropDown(false)}
        >
          {t("viewAll")}
        </Link>
      </div>
    </div>
  );
};

export default NotificationDropDown;
