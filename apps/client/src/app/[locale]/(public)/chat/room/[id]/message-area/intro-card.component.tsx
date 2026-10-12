"use client";

import React from "react";
import { User } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type IntroCardProps = {
  rawContent: string;
};

type BirthDetails = {
  name?: string;
  gender?: string;
  dob?: string;
  dateOfBirth?: string;
  tob?: string;
  timeOfBirth?: string;
  pob?: string;
  placeOfBirth?: string;
};

const formatDate = (dateStr?: string): string => {
  if (!dateStr) return "N/A";
  if (!dateStr.includes("/") && !dateStr.includes("-")) return dateStr;
  const parsed = new Date(dateStr);
  if (isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleDateString();
};

const parseDetails = (rawContent: string): BirthDetails | null => {
  try {
    return JSON.parse(rawContent.replace("[INTRO_CARD]", "")) as BirthDetails;
  } catch {
    return null;
  }
};

const Detail = ({ label, value, wide }: { label: string; value: string; wide?: boolean }) => (
  <div className={cn("flex flex-col gap-1", wide && "col-span-2")}>
    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
      {label}
    </span>
    <p className="truncate text-sm font-semibold text-card-foreground">{value}</p>
  </div>
);

function ErrorCard() {
  return (
    <Card className="w-full min-w-[240px]">
      <CardContent className="pt-6">
        <CardDescription>Error parsing details</CardDescription>
      </CardContent>
    </Card>
  );
}

function BirthDetailsCard({ data }: { data: BirthDetails }) {
  const subtitle = data.name || data.gender ? `${data.name || "N/A"} · ${data.gender || "N/A"}` : undefined;
  return (
    <Card className="w-full min-w-[240px] bg-card text-card-foreground">
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full bg-muted">
            <User className="size-4 text-muted-foreground" />
          </span>
          <CardTitle className="text-xs font-bold uppercase tracking-widest">
            Birth Details
          </CardTitle>
        </div>
        {subtitle ? <CardDescription>{subtitle}</CardDescription> : null}
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-4">
          <Detail label="Name" value={data.name || "N/A"} />
          <Detail label="Gender" value={data.gender || "N/A"} />
          <Detail label="DOB" value={formatDate(data.dob || data.dateOfBirth)} />
          <Detail label="Time" value={data.tob || data.timeOfBirth || "N/A"} />
          <Detail label="Place" value={data.pob || data.placeOfBirth || "N/A"} wide />
        </div>
      </CardContent>
    </Card>
  );
}

/** Waterfall: unparseable payload short-circuits to an error card. */
export default function IntroCard({ rawContent }: IntroCardProps) {
  const data = parseDetails(rawContent);

  if (!data) {
    return <ErrorCard />;
  }

  return <BirthDetailsCard data={data} />;
}
