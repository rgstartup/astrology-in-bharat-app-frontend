// live-sessions/config/sessionsConfig.ts
import { LiveSession } from '../live-sessions/session';

export const mockLiveSessions: LiveSession[] = [
  // ✅ ACTUAL DATA ADD HERE
  {
    id: "SESS001",
    user: {
      id: "USER001",
      name: "Rahul Sharma",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul",
      rating: 4.8
    },
    astrologer: {
      id: "AST001",
      name: "Pandit Ji",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pandit",
      specialty: "Vedic Astrology",
      experience: 15
    },
    sessionType: "video",
    status: "live",
    startTime: new Date(Date.now() - 30 * 60000), // 30 mins ago
    duration: 45,
    connectionQuality: "excellent",
    chatMessages: 42,
    recording: true,
    lastActive: new Date()
  },
  {
    id: "SESS002",
    user: {
      id: "USER002",
      name: "Priya Patel",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
      rating: 4.5
    },
    astrologer: {
      id: "AST002",
      name: "Guruji",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Guruji",
      specialty: "Numerology",
      experience: 8
    },
    sessionType: "audio",
    status: "live",
    startTime: new Date(Date.now() - 15 * 60000), // 15 mins ago
    duration: 30,
    connectionQuality: "good",
    chatMessages: 28,
    recording: false,
    lastActive: new Date()
  },
  {
    id: "SESS003",
    user: {
      id: "USER003",
      name: "Amit Kumar",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit",
      rating: 4.2
    },
    astrologer: {
      id: "AST003",
      name: "Swamiji",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Swamiji",
      specialty: "Palmistry",
      experience: 12
    },
    sessionType: "chat",
    status: "live",
    startTime: new Date(Date.now() - 5 * 60000), // 5 mins ago
    duration: 60,
    connectionQuality: "fair",
    chatMessages: 15,
    recording: true,
    lastActive: new Date()
  },
  {
    id: "SESS004",
    user: {
      id: "USER004",
      name: "Neha Gupta",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Neha",
      rating: 4.9
    },
    astrologer: {
      id: "AST004",
      name: "Acharya",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Acharya",
      specialty: "Tarot Card",
      experience: 6
    },
    sessionType: "video",
    status: "technical-issue",
    startTime: new Date(Date.now() - 40 * 60000), // 40 mins ago
    duration: 50,
    connectionQuality: "poor",
    chatMessages: 10,
    recording: false,
    lastActive: new Date(Date.now() - 5 * 60000),
    issues: ["Audio lag", "Video frozen"]
  }
];

export const filters = [
  { key: "chat_live", label: "Live Chat Sessions" },
  { key: "expired", label: "Expired Sessions" },
  { key: "admin_terminated", label: "Admin Terminated" },
];



