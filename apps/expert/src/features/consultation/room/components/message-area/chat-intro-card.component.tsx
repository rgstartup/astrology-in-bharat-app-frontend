import { User, MapPin, Calendar, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { IntroCardData } from "@/types/chat";

interface ChatIntroCardProps {
  content: string;
}

export function ChatIntroCard({ content }: ChatIntroCardProps) {
  let data: IntroCardData | null = null;
  try {
    const raw = content.replace("[INTRO_CARD]", "").trim();
    data = JSON.parse(raw);
  } catch {
    return (
      <Card className="w-full max-w-md rounded-xl border border-[#d3cec6] bg-white shadow-none">
        <CardContent className="p-4 font-sans text-xs text-[#626260]">
          Invalid birth profile card data.
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const formattedDob =
    data.dob && data.dob !== "N/A"
      ? !isNaN(new Date(data.dob).getTime())
        ? new Date(data.dob).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : data.dob
      : "N/A";

  return (
    <Card className="w-full max-w-md rounded-xl border border-[#d3cec6] bg-white shadow-none">
      <CardHeader className="flex-row items-center justify-between border-b border-[#d3cec6] pb-3">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-full bg-[#111111] text-white">
            <User className="size-4" />
          </div>
          <div>
            <CardTitle className="font-sans text-sm font-semibold text-[#111111]">
              Birth details
            </CardTitle>
            <p className="font-sans text-[13px] font-medium text-[#7b7b78]">Shared profile info</p>
          </div>
        </div>
        <Badge variant="outline" className="rounded-full border border-[#d3cec6] bg-white px-3 py-1 font-sans text-[11px] font-medium text-[#626260]">
          Client kundli
        </Badge>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3 pt-3 text-xs">
        <div>
          <span className="font-sans text-[13px] font-medium text-[#7b7b78]">Name</span>
          <p className="truncate font-semibold text-[#111111]">{data.name || "N/A"}</p>
        </div>
        <div>
          <span className="font-sans text-[13px] font-medium text-[#7b7b78]">Gender</span>
          <p className="font-semibold capitalize text-[#111111]">{data.gender || "N/A"}</p>
        </div>
        <div>
          <span className="flex items-center gap-1 font-sans text-[13px] font-medium text-[#7b7b78]">
            <Calendar className="size-2.5" /> Date of birth
          </span>
          <p className="font-semibold text-[#111111]">{formattedDob}</p>
        </div>
        <div>
          <span className="flex items-center gap-1 font-sans text-[13px] font-medium text-[#7b7b78]">
            <Clock className="size-2.5" /> Time of birth
          </span>
          <p className="font-semibold text-[#111111]">{data.tob || "N/A"}</p>
        </div>
        <div className="col-span-2 border-t border-[#d3cec6] pt-1">
          <span className="flex items-center gap-1 font-sans text-[13px] font-medium text-[#7b7b78]">
            <MapPin className="size-2.5" /> Place of birth
          </span>
          <p className="truncate font-semibold text-[#111111]">{data.pob || "N/A"}</p>
        </div>
      </CardContent>
    </Card>
  );
}
