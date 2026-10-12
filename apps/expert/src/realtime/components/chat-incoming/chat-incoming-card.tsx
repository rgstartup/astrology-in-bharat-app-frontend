"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Check, Clock, MessageCircle, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/cn";
import type { ChatIncomingPayload } from "@/realtime/types/chat";

/** Fallback when the payload carries no explicit expiry (backend default). */
export const CHAT_REQUEST_TTL_SEC = 120;

interface ChatIncomingCardProps {
  request: ChatIncomingPayload;
  ttlSec?: number;
  onAccept: (consultationId: number, sessionId: number | null) => Promise<void>;
  onReject: (consultationId: number) => Promise<void>;
  onExpire: (consultationId: number) => void;
}

/** One floating incoming-chat card: client identity, countdown, accept/reject. */
export function ChatIncomingCard({
  request,
  ttlSec = CHAT_REQUEST_TTL_SEC,
  onAccept,
  onReject,
  onExpire,
}: ChatIncomingCardProps) {
  const [busy, setBusy] = useState<"idle" | "accepting" | "rejecting">("idle");
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  const expiresAt =
    new Date(request.timestamp).getTime() + ttlSec * 1000;
  const remainingSec = Math.max(0, Math.round((expiresAt - now) / 1000));

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (remainingSec <= 0) {
      onExpire(request.consultationId);
      return;
    }
    const timer = setTimeout(() => setNow(Date.now()), 1000);
    return () => clearTimeout(timer);
  }, [remainingSec, request.consultationId, onExpire]);

  const run = async (action: "accepting" | "rejecting") => {
    if (busy !== "idle") return;
    setBusy(action);
    try {
      if (action === "accepting") {
        await onAccept(request.consultationId, request.sessionId ?? null);
      } else {
        await onReject(request.consultationId);
      }
    } catch {
      toast.error("Could not reach the server. Please try again.");
      setBusy("idle");
    }
  };

  const urgent = remainingSec <= 15;
  const progress = Math.min(100, (remainingSec / ttlSec) * 100);

  return (
    <Card
      role="alertdialog"
      aria-label={`Incoming chat request for consultation ${request.consultationId}`}
      aria-describedby={`chat-req-${request.consultationId}-desc`}
      className={cn(
        "w-80 shadow-xl transition-all duration-200 motion-reduce:transition-none",
        mounted
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0",
      )}
    >
      <CardHeader className="flex-row items-center gap-3">
        <Avatar aria-hidden="true">
          <AvatarFallback>
            {(request.clientName ?? String(request.clientId)).slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <CardTitle className="flex items-center gap-2 text-sm">
            <MessageCircle aria-hidden="true" />
            <span className="truncate">New chat request</span>
          </CardTitle>
          <CardDescription id={`chat-req-${request.consultationId}-desc`} className="truncate">
            Consultation #{request.consultationId} · {request.clientName ?? `Client ${String(request.clientId)}`}
          </CardDescription>
        </div>
        <Badge
          variant="secondary"
          className={cn(urgent && "bg-red-50 text-red-700")}
          aria-label={`${remainingSec} seconds left to respond`}
        >
          <Clock aria-hidden="true" />
          {remainingSec}s
        </Badge>
      </CardHeader>
      <CardContent>
        <div
          className="h-1 overflow-hidden rounded-full bg-slate-100"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={ttlSec}
          aria-valuenow={remainingSec}
          aria-label="Time left to respond"
        >
          <div
            className={cn(
              "h-full rounded-full transition-[width] duration-1000",
              urgent ? "bg-red-500" : "bg-orange-600",
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="flex-1"
          disabled={busy !== "idle"}
          isLoading={busy === "rejecting"}
          onClick={() => run("rejecting")}
          aria-label={`Reject chat request for consultation ${request.consultationId}`}
        >
          {busy !== "rejecting" && <X data-icon="inline-start" aria-hidden="true" />}
          Reject        </Button>
        <Button
          type="button"
          size="lg"
          className="flex-1"
          disabled={busy !== "idle"}
          isLoading={busy === "accepting"}
          onClick={() => run("accepting")}
          aria-label={`Accept chat request for consultation ${request.consultationId}`}
        >
          {busy !== "accepting" && <Check data-icon="inline-start" aria-hidden="true" />}
          Accept
        </Button>
      </CardFooter>
    </Card>
  );
}
