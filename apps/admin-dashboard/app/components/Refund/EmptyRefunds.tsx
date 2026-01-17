// refund-management/components/EmptyRefunds.tsx
import React from "react";
import { Receipt, RefreshCw } from "lucide-react";
import { Button } from "@/app/components/admin/Button";

export function EmptyRefunds() {
  return (
    <div className="col-span-2 text-center py-12">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Receipt className="w-8 h-8 text-gray-400" />
        </div>
        
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          No Refund Requests
        </h3>
        
        <p className="text-gray-500 mb-6">
          There are currently no refund requests to display. 
          All refunds have been processed or no new requests have been submitted.
        </p>
        
        <div className="flex items-center justify-center gap-3">
          <Button variant="outline" icon={RefreshCw}>
            Refresh
          </Button>
          
          <Button variant="primary">
            View Processed Refunds
          </Button>
        </div>
      </div>
    </div>
  );
}