"use client";

import { User } from "@repo/design/lucide";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@repo/design/shadcn";
import { Separator } from "@repo/design/shadcn";
import { cn } from "@repo/design/cn";

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

function formatDate(dateStr?: string): string {
  if (!dateStr) return "N/A";
  if (!dateStr.includes("/") && !dateStr.includes("-")) return dateStr;
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) return dateStr;
  return parsed.toLocaleDateString();
}

function parseDetails(rawContent: string): BirthDetails | null {
  try {
    return JSON.parse(rawContent.replace("[INTRO_CARD]", "")) as BirthDetails;
  } catch {
    return null;
  }
}

function detailClass(wide?: boolean): string {
  if (wide) return "flex flex-col gap-1 col-span-2";
  return "flex flex-col gap-1";
}

function Detail({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={cn(detailClass(wide))}>
      <span className="font-sans text-xs font-medium normal-case text-[#7b7b78]">{label}</span>
      <p className="truncate font-sans text-sm font-semibold text-[#111111]">{value}</p>
    </div>
  );
}

function ErrorCard() {
  return (
    <Card className="w-full min-w-[240px] rounded-xl border border-[#d3cec6] bg-[#ffffff]">
      <CardContent className="pt-6">
        <CardDescription className="font-sans text-[#626260]">Error parsing details</CardDescription>
      </CardContent>
    </Card>
  );
}

function BirthSubtitle({ data }: { data: BirthDetails }) {
  const name = data.name || "N/A";
  const gender = data.gender || "N/A";
  if (!data.name && !data.gender) return null;
  return (
    <CardDescription className="font-sans text-[#626260]">
      {name} · {gender}
    </CardDescription>
  );
}

function BirthDetailsCard({ data }: { data: BirthDetails }) {
  return (
    <Card className="w-full min-w-[240px] rounded-xl border border-[#d3cec6] bg-[#ffffff] font-sans text-[#111111]">
      <CardHeader>
        <div className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-full border border-[#d3cec6] bg-[#ffffff]">
            <User className="size-4 text-[#626260]" />
          </span>
          <CardTitle className="font-sans text-xs font-medium normal-case text-[#111111]">
            Birth details
          </CardTitle>
        </div>
        <BirthSubtitle data={data} />
      </CardHeader>
      <Separator className="bg-[#d3cec6]" />
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-4">
          <Detail label="Name" value={data.name || "N/A"} />
          <Detail label="Gender" value={data.gender || "N/A"} />
          <Detail label="Date of birth" value={formatDate(data.dob || data.dateOfBirth)} />
          <Detail label="Time of birth" value={data.tob || data.timeOfBirth || "N/A"} />
          <Detail label="Place of birth" value={data.pob || data.placeOfBirth || "N/A"} wide />
        </div>
      </CardContent>
    </Card>
  );
}

/** Waterfall: unparseable payload short-circuits to an error card. */
export default function IntroCard({ rawContent }: IntroCardProps) {
  const data = parseDetails(rawContent);

  if (!data) return <ErrorCard />;

  return <BirthDetailsCard data={data} />;
}
