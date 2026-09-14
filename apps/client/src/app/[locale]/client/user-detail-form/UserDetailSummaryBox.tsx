"use client";

import React from "react";
import { UserDetailSummaryBoxProps } from "@/lib/types";

const UserDetailSummaryBox: React.FC<UserDetailSummaryBoxProps> = ({
  rate,
  duration,
  totalAmount,
}) => {
  return (
    <div className="w-full mt-8">
      <div className="p-4 bg-gray-50/80 rounded-xl border border-dashed border-[#732882]">
        <div className="flex justify-between items-center mb-3">
          <span className="text-gray-600">Rate:</span>
          <strong className="text-gray-900">₹{rate}/min</strong>
        </div>
        <div className="flex justify-between items-center mb-3">
          <span className="text-gray-600">Duration:</span>
          <strong className="text-gray-900">{duration} mins</strong>
        </div>
        <hr className="my-3 border-gray-200" />
        <div className="flex justify-between items-center text-green-600">
          <span className="font-bold">Total Payable:</span>
          <span className="font-bold text-xl">₹{totalAmount}</span>
        </div>
      </div>
    </div>
  );
};

export default UserDetailSummaryBox;
