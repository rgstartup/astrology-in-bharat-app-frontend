// live-sessions/components/LiveSessionCard.tsx
import React, { useState, useEffect } from "react";
import { Video, Mic, MessageSquare, Clock, VideoOff, AlertCircle, Eye, PhoneOff } from "lucide-react";
import { Button } from "../../../../shared/components/Button";
import { ParticipantCard } from "./ParticipantCard";

import { StatusBadge } from "./StatusBadge";
import type { LiveSession } from "../live-sessions/session";

interface LiveSessionCardProps {
  session: LiveSession;
  onJoinSession: (session: LiveSession) => void;
  onEndSession: (sessionId: string) => void;
  onToggleRecording: (sessionId: string) => void;
}

export function LiveSessionCard({
  session,
  onJoinSession,
  onEndSession,
  onToggleRecording,
}: LiveSessionCardProps) {

  // SessionTypeIcon component
  const SessionTypeIcon = ({ type }: { type: string }) => {
    switch (type) {
      case "video": return <Video className="w-5 h-5 text-blue-600" />;
      case "audio": return <Mic className="w-5 h-5 text-green-600" />;
      case "chat": return <MessageSquare className="w-5 h-5 text-purple-600" />;
      default: return null;
    }
  };

  const [elapsed, setElapsed] = useState(
    session.status === 'live'
      ? Math.floor((Date.now() - session.startTime.getTime()) / 60000)
      : session.duration
  );

  useEffect(() => {
    if (session.status === 'live') {
      const updateTimer = () => {
        setElapsed(Math.floor((Date.now() - session.startTime.getTime()) / 60000));
      };

      updateTimer();
      const timer = setInterval(updateTimer, 30000); // Update every 30s
      return () => clearInterval(timer);
    } else {
      setElapsed(session.duration);
    }
  }, [session.status, session.startTime, session.duration]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Session Header */}
      <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <SessionTypeIcon type={session.sessionType} />
            <div>
              <h3 className="font-semibold text-gray-900">Session #{session.id}</h3>
              <p className="text-sm text-gray-600 capitalize">
                {session.sessionType} Session • {elapsed} mins
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={session.status} />

          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        {/* Participants */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <ParticipantCard user={session.user} type="user" />
          <ParticipantCard
            user={session.astrologer}
            type="astrologer"
            experience={session.astrologer.experience}
            specialty={session.astrologer.specialty}
          />
        </div>

        {/* Session Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">

          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Duration</span>
              <Clock className="w-4 h-4 text-gray-500" />
            </div>
            <p className="text-lg font-semibold text-gray-900 mt-1">
              {elapsed} min
            </p>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Chat Messages</span>
              <MessageSquare className="w-4 h-4 text-gray-500" />
            </div>
            <p className="text-lg font-semibold text-gray-900 mt-1">
              {session.chatMessages}
            </p>
          </div>
        </div>

        {/* Connection & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">

          <div>
            {/* <span className="text-sm text-gray-600">Connection Quality:</span> */}
            {/* <div className="mt-1">
              <QualityIndicator quality={session.connectionQuality} />
            </div> */}
          </div>


        </div>

        {/* Issues Alert */}
        {session.issues && session.issues.length > 0 && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h4 className="font-medium text-red-700">Technical Issues</h4>
            </div>
            <ul className="text-sm text-red-600 space-y-1">
              {session.issues.map((issue, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-red-600 rounded-full" />
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {session.sessionType === 'chat' ? (
            <Button
              variant="primary"
              size="sm"
              icon={Eye}
              fullWidth
              onClick={() => onJoinSession(session)}
            >
              View Conversation
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              icon={VideoOff}
              fullWidth
              disabled
            >
              Join Restricted
            </Button>
          )}

          <Button
            variant="danger"
            size="sm"
            icon={PhoneOff}
            onClick={() => onEndSession(session.id)}
          >
            End
          </Button>
        </div>
      </div>
    </div>
  );
}