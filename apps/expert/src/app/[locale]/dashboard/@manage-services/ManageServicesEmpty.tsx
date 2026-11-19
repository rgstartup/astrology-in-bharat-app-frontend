"use client";
import { Plus } from "@repo/design/lucide";

interface ManageServicesEmptyProps {
  onAdd?: () => void;
}

export default function ManageServicesEmpty({ onAdd }: ManageServicesEmptyProps) {
  return (
    <div
      onClick={onAdd}
      className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-yellow-300 hover:bg-yellow-50/30 transition-colors col-span-full sm:col-span-1 min-h-[100px]"
    >
      <Plus className="w-5 h-5 text-gray-500" />
      <p className="text-xs text-gray-700 font-medium text-center">
        Add a custom service
      </p>
    </div>
  );
}
