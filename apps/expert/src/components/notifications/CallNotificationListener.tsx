"use client";

import React, { useEffect, useCallback } from "react";
import { Phone, Video } from "lucide-react";
import {
  callSocket,
  connectCallSocket,
  SOCKET_EMIT_EVENTS,
  SOCKET_LISTEN_EVENTS,
} from "@/lib/socket";
import { useAuthStore } from "@/store/auth.store";
import { getSocketTokenAction } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import api from "@/actions/api";
import { getErrorMessage } from "@repo/lib";

export const CallNotificationListener: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();

  const handleReject = async (sessionId: string) => {
    toast.dismiss();
    const result = await api.post(`/consultations/reject/${sessionId}`);
    if (!result.ok) {
      console.error(
        "[CallNotification] Failed to reject session:",
        result.error.message,
      );
    }
  };

  const registerExpert = useCallback(() => {
    if (!user) return;
    const expertId = user.profileId || user.id;
    if (!expertId) return;
    console.log(
      "[CallNotification] Registering expert with callSocket:",
      expertId,
    );
    callSocket.emit(SOCKET_EMIT_EVENTS.REGISTER_EXPERT, { expert_id: expertId });
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    let isSubscribed = true;
    const expertId = user.profileId || user.id;

    const onConnect = () => {
      console.log(
        "[CallNotification] callSocket Connected! Registering expert...",
      );
      registerExpert();
    };

    const onReconnect = (attempt: number) => {
      console.log(
        "[CallNotification] callSocket Reconnected! Attempt:",
        attempt,
      );
      registerExpert();
    };

    const onConnectError = (err: any) => {
      console.error("[CallSocket] ❌ Connection error:", getErrorMessage(err));
    };

    const handleNewCall = (data: any) => {
      console.log("[CallNotification] Received new_call_request!", data);
      const session = data.session || data;
      if (!session) {
        console.warn(
          "[CallNotification] No session found in new_call_request data.",
        );
        return;
      }
      const callerName =
        session.client?.user?.name || session.user?.name || "A Client";
      const callType = session.type || "audio";
      const callerAvatar =
        session.client?.profile_picture ||
        session.client?.user?.avatar ||
        session.user?.avatar ||
        session.user?.image ||
        session.user?.profile_client?.profile_picture ||
        session.user_image;

      toast.info(
        <div className="p-2">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden border-2 border-orange-500/20">
                {callerAvatar ? (
                  <img
                    src={callerAvatar}
                    alt="Caller"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-black text-xl">
                    {callerName.charAt(0)}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-lg">
                {callType === "video" ? (
                  <Video className="w-3.5 h-3.5 text-orange-600" />
                ) : (
                  <Phone className="w-3.5 h-3.5 text-orange-600" />
                )}
              </div>
              {/* Pulsing ring */}
              <div className="absolute inset-0 rounded-full border-2 border-orange-500 animate-ping opacity-40" />
            </div>
            <div className="flex-1">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 mb-0.5">
                Incoming {callType} Call
              </h4>
              <p className="text-sm font-black text-neutral-900 leading-tight">
                {callerName}
              </p>
              <p className="text-[10px] font-bold text-neutral-400 mt-0.5 italic">
                Astro-Secure Line Connected...
              </p>
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <button
              onClick={() => {
                toast.dismiss();
                const route =
                  callType === "video"
                    ? `/dashboard/video/${session.id}`
                    : `/dashboard/call/${session.id}`;
                router.push(route);
              }}
              className="flex-[2] bg-[#fd6410] text-white py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-orange-500/30 hover:bg-[#e55a0e] transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Accept & Join
            </button>
            <button
              onClick={() => handleReject(session.id)}
              className="flex-1 bg-neutral-100 text-neutral-400 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-neutral-200 transition-all border border-neutral-200/50"
            >
              Ignore
            </button>
          </div>
        </div>,
        {
          containerId: "notification",
          position: "bottom-center",
          autoClose: false,
          closeOnClick: false,
          draggable: false,
          className:
            "rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-white/20 p-2 bg-white/95 backdrop-blur-md overflow-hidden max-w-[95vw] mx-auto sm:min-w-[320px] !mb-2 mt-2",
        },
      );

      const audio = new Audio("/sounds/ringtone.mp3");
      audio.play().catch(() => {});
    };

    const handleAutoDismiss = (data: any) => {
      toast.dismiss();

      if (data && data.split) {
        const expertShare = data.split.expertShare || 0;
        const terminatedBy = data.terminatedBy === "EXPERT" ? "You" : "User";
        toast.success(
          `Session Ended. Your Earning: ₹${expertShare.toFixed(2)} (By: ${terminatedBy})`,
          {
            position: "bottom-right",
            autoClose: 5000,
          },
        );
      }
    };

    callSocket.on(SOCKET_LISTEN_EVENTS.CONNECT, onConnect);
    callSocket.on(SOCKET_LISTEN_EVENTS.RECONNECT, onReconnect);
    callSocket.on(SOCKET_LISTEN_EVENTS.CONNECT_ERROR, onConnectError);
    callSocket.on(SOCKET_LISTEN_EVENTS.NEW_CALL_REQUEST, handleNewCall);
    callSocket.on(SOCKET_LISTEN_EVENTS.CALL_ACCEPTED, handleAutoDismiss);
    callSocket.on(SOCKET_LISTEN_EVENTS.CALL_ENDED, handleAutoDismiss);

    const initCall = async () => {
      try {
        const token = await getSocketTokenAction();
        if (!isSubscribed) return;
        connectCallSocket(token, expertId);
      } catch (err) {
        console.error(
          "[CallNotificationListener] Failed to initialize call socket auth:",
          err,
        );
      }
    };

    initCall();

    return () => {
      isSubscribed = false;
      callSocket.off(SOCKET_LISTEN_EVENTS.CONNECT, onConnect);
      callSocket.off(SOCKET_LISTEN_EVENTS.RECONNECT, onReconnect);
      callSocket.off(SOCKET_LISTEN_EVENTS.CONNECT_ERROR, onConnectError);
      callSocket.off(SOCKET_LISTEN_EVENTS.NEW_CALL_REQUEST, handleNewCall);
      callSocket.off(SOCKET_LISTEN_EVENTS.CALL_ACCEPTED, handleAutoDismiss);
      callSocket.off(SOCKET_LISTEN_EVENTS.CALL_ENDED, handleAutoDismiss);
    };
  }, [isAuthenticated, user, router, registerExpert]);

  return null;
};
