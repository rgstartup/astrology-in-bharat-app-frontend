"use client";

import { useTranslations } from "next-intl";
import { UserX } from "lucide-react";

type Props = {
  onClose: () => void;
};

const NotFoundStep = ({ onClose }: Props) => {
  const t = useTranslations("Chat.page");

  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-12">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
        <UserX className="w-10 h-10 text-red-500" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">{t("notFoundTitle")}</h2>
      <p className="text-gray-500 max-w-sm mb-6 text-sm">{t("notFoundDesc")}</p>
      <button
        onClick={onClose}
        className="px-8 py-3 bg-[#FF5500] text-white rounded-full font-bold shadow-lg hover:bg-[#E64D00] transition-all cursor-pointer"
      >
        {t("goHome")}
      </button>
    </div>
  );
};

export default NotFoundStep;
