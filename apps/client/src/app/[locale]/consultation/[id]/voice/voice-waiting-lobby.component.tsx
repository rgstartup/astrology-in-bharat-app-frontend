"use client";

import { Phone, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type VoiceWaitingLobbyProps = {
  expertName: string;
  peerActorType: "client" | "expert" | null;
  bothReady: boolean;
  peerReady: boolean;
  localReady: boolean;
  onMicConfirmed: () => void;
  micConfirmed: boolean;
  onCancel: () => void;
  voiceRate?: number;
};

/**
 * Waiting lobby shown while establishing the Agora voice connection.
 * Renders only while `bothReady` is false. Once the peer reports media_ready
 * (or both sides are ready), the parent retires this lobby and shows the live
 * stage. Includes a mic-access confirmation gate before the local side reports
 * readiness, so the connection is only established after the user allows the
 * microphone.
 *
 * @param props - Expert identity, peer readiness state, mic gate state, cancel handler.
 * @returns Lobby element.
 */
export function VoiceWaitingLobby(props: VoiceWaitingLobbyProps) {
  const {
    expertName,
    peerActorType,
    bothReady,
    peerReady,
    localReady,
    onMicConfirmed,
    micConfirmed,
    onCancel,
    voiceRate,
  } = props;

  if (bothReady) return null;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f5f1ec]">
      <VoiceSecureStrip />
      {micConfirmed ? (
        <VoiceMicConfirmedBody peerActorType={peerActorType} peerReady={peerReady} voiceRate={voiceRate} />
      ) : (
        <VoiceMicGateBody onMicConfirmed={onMicConfirmed} />
      )}
      <VoiceCancelButton onCancel={onCancel} />
    </div>
  );
}

/** Secure-strip line shown above the waiting lobby. */
function VoiceSecureStrip() {
  return (
    <div className="flex items-center justify-center gap-1.5 border-b border-[#d3cec6] bg-white px-4 py-2">
      <span className="size-2 rounded-full bg-[#0bdf50]" />
      <Phone className="size-3 text-[#7b7b78]" />
      <span className="text-xs font-medium text-[#626260]">Voice secured end to end</span>
    </div>
  );
}

/** Body shown before the user grants microphone access. */
function VoiceMicGateBody({ onMicConfirmed }: { onMicConfirmed: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 gap-4 text-center">
      <div className="flex items-center justify-center gap-2">
        <span className="size-8 rounded-full border-4 border-slate-200 border-t-[#ff4f00] animate-spin" />
        <span className="font-medium text-[#111111]">Establishing voice connection</span>
      </div>
      <div className="flex flex-col items-center justify-center gap-3">
        <span className="text-sm text-[#626260]">Allow microphone access to connect</span>
        <button
          type="button"
          onClick={onMicConfirmed}
          className="h-11 rounded-full bg-[#111111] px-6 text-sm font-medium text-white hover:bg-black"
        >
          Allow microphone
        </button>
      </div>
    </div>
  );
}

/** Body shown after mic access is granted, waiting for the peer to connect. */
function VoiceMicConfirmedBody({
  peerActorType,
  peerReady,
  voiceRate,
}: {
  peerActorType: "client" | "expert" | null;
  peerReady: boolean;
  voiceRate?: number;
}) {
  if (peerReady) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 gap-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <span className="size-8 rounded-full border-4 border-slate-200 border-t-[#ff4f00] animate-spin" />
          <span className="font-medium text-[#111111]">Connecting voice…</span>
        </div>
        <div className="flex flex-col items-center justify-center gap-3">
          <span className="flex items-center gap-1.5 text-xs font-medium text-[#0bdf50]">
            <span className="size-2 rounded-full bg-[#0bdf50]" />
            <span>{peerLabel(peerActorType)} connected</span>
          </span>
        </div>
        {voiceRate && (
          <p className="text-xs text-[#626260]">
            Voice rate Rs.{voiceRate} per min · Billing starts when both sides connect
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 gap-4 text-center">
      <div className="flex items-center justify-center gap-2">
        <span className="size-8 rounded-full border-4 border-slate-200 border-t-[#ff4f00] animate-spin" />
        <span className="font-medium text-[#111111]">Establishing voice connection</span>
      </div>
      <div className="flex flex-col items-center justify-center gap-3">
        <span className="text-sm text-[#626260]">
          Waiting for {peerLabel(peerActorType)} to connect
        </span>
      </div>
      {voiceRate && (
        <p className="text-xs text-[#626260]">
          Voice rate Rs.{voiceRate} per min · Billing starts when both sides connect
        </p>
      )}
    </div>
  );
}

/** Cancel button anchored below the lobby body. */
function VoiceCancelButton({ onCancel }: { onCancel: () => void }) {
  return (
    <button
      type="button"
      onClick={onCancel}
      className="mt-4 h-10 rounded-full border border-[#d3cec6] bg-white px-6 text-sm font-medium text-[#111111] hover:bg-[#f5f1ec]"
    >
      <X className="size-4 mr-2" />
      Cancel
    </button>
  );
}

function peerLabel(actorType: "client" | "expert" | null): string {
  if (actorType === "expert") return "the astrologer";
  return "the client";
}
