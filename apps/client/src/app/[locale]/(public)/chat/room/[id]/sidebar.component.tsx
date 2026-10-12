"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import ExpertCard from "@/components/features/experts/ExpertCard";
import { IExpert } from "@repo/lib";

type SidebarProps = {
  isDarkMode: boolean;
  expertData: IExpert;
};

export default function Sidebar({ expertData }: SidebarProps) {
  return (
    <aside className="hidden w-95 lg:flex">
      <Card className="w-full border-border bg-card">
        <CardContent>
          <ExpertCard expertData={expertData} />
        </CardContent>
      </Card>
    </aside>
  );
}
