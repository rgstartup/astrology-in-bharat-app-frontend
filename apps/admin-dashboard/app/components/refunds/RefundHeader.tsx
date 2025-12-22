import React from "react";
import { Download } from "lucide-react";

interface RefundHeaderProps {
  onExport: () => void;
}

export default function RefundHeader({ onExport }: RefundHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Refund Management</h1>
        <p className="text-gray-600 mt-1">Manage and process refund requests</p>
      </div>
      <button
        onClick={onExport}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
      >
        <Download size={20} />
        Export Report
      </button>
    </div>
  );
}