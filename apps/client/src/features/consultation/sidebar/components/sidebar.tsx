"use client";

import { Card, CardContent } from "@/components/ui/card";
import ExpertCard from "@/components/features/experts/ExpertCard";
import { IExpert } from "@repo/lib";

type SidebarProps = {
  expertData: IExpert;
};

export default function Sidebar({ expertData }: SidebarProps) {
  return (
    <aside className="hidden w-95 shrink-0 bg-[#f5f1ec] p-4 lg:flex">
      <Card className="w-full rounded-xl border border-[#d3cec6] bg-[#ffffff] shadow-none">
        <CardContent>
          <ExpertCard expertData={expertData} />
        </CardContent>
      </Card>
    </aside>
  );
}
