import React from "react";
import { CloseButton } from "@repo/ui";

interface IPlatformReviewHeader {
  userName?: string;
  handleClose: () => void;
}

const PlatformReviewHeader = (props: IPlatformReviewHeader) => {
  const { userName, handleClose } = props;

  return (
    <div className="flex items-start justify-between mb-5">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center shadow-inner">
          <span className="text-xl">🌟</span>
        </div>
        <div>
          <h3 className="text-[15px] font-black text-[#301118] leading-tight">
            {userName ? `${userName},` : ""} Share Your Experience!
          </h3>
          <p className="text-[11px] text-gray-400 font-medium mt-0.5">
            Aapka feedback hamare liye bahut important hai
          </p>
        </div>
      </div>
      <div className="flex-shrink-0 ml-2 mt-1">
        <CloseButton onClick={handleClose} />
      </div>
    </div>
  );
};

export default PlatformReviewHeader;
