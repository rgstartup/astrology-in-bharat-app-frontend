import { HeaderTranslations } from "@repo/store";
import { getTranslations } from "next-intl/server";

interface EmptyNotificationProps {
  show: boolean;
}

const EmptyNotification = async (props: EmptyNotificationProps) => {
  if (!props.show) return null;

  const t = await getTranslations("Header");

  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="w-16 h-16 bg-orange/5 rounded-full flex items-center justify-center mb-4 border border-orange/10 shadow-inner">
        <i className="fa-solid fa-bell-slash text-2xl text-orange/60"></i>
      </div>
      <h6 className="font-bold text-gray-900 text-base mb-2">
        {t("noNotificationsYet")}
      </h6>
      <p className="text-gray-500 text-sm max-w-[250px] m-0 mx-auto leading-relaxed">
        {t("noNotificationsDesc")}
      </p>
    </div>
  );
};

export default EmptyNotification;
