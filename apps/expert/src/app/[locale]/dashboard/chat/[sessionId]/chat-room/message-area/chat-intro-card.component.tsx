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
      <Card className="w-full max-w-md border-amber-200 bg-amber-50">
        <CardContent className="p-4 text-xs text-amber-800">
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
    <Card className="w-full max-w-md border-orange-200/70 bg-gradient-to-br from-orange-50/40 via-white to-amber-50/30 shadow-xs">
      <CardHeader className="flex-row items-center justify-between pb-3 border-b border-orange-100">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
            <User className="size-4" />
          </div>
          <div>
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Birth Details
            </CardTitle>
            <p className="text-[10px] text-slate-500 font-medium">Shared Profile Info</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-orange-100/60 text-orange-700 border-orange-200 text-[10px]">
          Client Kundli
        </Badge>
      </CardHeader>
      <CardContent className="pt-3 grid grid-cols-2 gap-3 text-xs">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Name</span>
          <p className="font-semibold text-slate-900 truncate">{data.name || "N/A"}</p>
        </div>
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Gender</span>
          <p className="font-semibold text-slate-900 capitalize">{data.gender || "N/A"}</p>
        </div>
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Calendar className="size-2.5" /> Date of Birth
          </span>
          <p className="font-semibold text-slate-900">{formattedDob}</p>
        </div>
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Clock className="size-2.5" /> Time of Birth
          </span>
          <p className="font-semibold text-slate-900">{data.tob || "N/A"}</p>
        </div>
        <div className="col-span-2 pt-1 border-t border-slate-100">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <MapPin className="size-2.5" /> Place of Birth
          </span>
          <p className="font-semibold text-slate-900 truncate">{data.pob || "N/A"}</p>
        </div>
      </CardContent>
    </Card>
  );
}
