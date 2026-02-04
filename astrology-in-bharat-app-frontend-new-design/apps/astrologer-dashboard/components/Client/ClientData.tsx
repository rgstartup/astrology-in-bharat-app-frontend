"use client";

import React, { useState, useMemo, useEffect } from "react";
import ClientHeader from "./ClientHeader";
import ClientTable from "./ClientTable";
import ClientMobileList from "./ClientMobileList";
import { Client, SortConfig, SortKey } from "./types";
import { apiClient } from "@/lib/apiClient";
import { toast } from "react-toastify";
import * as LucideIcons from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getExpertReviews } from "@/lib/reviews";

const { X, MessageSquare, Clock, IndianRupee, Calendar, Star } = LucideIcons as any;

export default function ClientsPage() {
  const { user: expertUser } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "ascending",
  });

  // Chat Modal State
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [loadingChat, setLoadingChat] = useState(false);

  // Fetch Clients Data
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const [sessionsRes, reviewsRes] = await Promise.allSettled([
          apiClient.get('/chat/sessions/all'),
          expertUser?.profileId ? getExpertReviews(expertUser.profileId, 1, 50) : Promise.reject("No expert ID")
        ]);

        const sessions = sessionsRes.status === 'fulfilled' ? sessionsRes.value.data : [];
        const reviews = (reviewsRes.status === 'fulfilled' && (reviewsRes.value as any).data) ? (reviewsRes.value as any).data : [];

        // Map API response to Client interface
        const mappedClients: Client[] = sessions.map((session: any) => {
          // Fallback duration calculation
          let duration = session.durationMins || session.duration || 0;

          // If duration is very large (e.g. > 1000), it might be in seconds or ms
          if (duration > 500) {
            duration = Math.ceil(duration / 60);
          }

          if (duration === 0 && (session.status === 'completed' || session.status === 'expired')) {
            const start = session.activatedAt ? new Date(session.activatedAt).getTime() :
              (session.startTime ? new Date(session.startTime).getTime() :
                (session.createdAt ? new Date(session.createdAt).getTime() : 0));
            const end = session.endedAt ? new Date(session.endedAt).getTime() :
              (session.endTime ? new Date(session.endTime).getTime() :
                (session.updatedAt ? new Date(session.updatedAt).getTime() : 0));

            if (start > 0 && end > 0) {
              const diffMs = end - start;
              duration = Math.ceil(diffMs / (1000 * 60));
            }
          }

          // Ensure duration is never 0 for completed sessions
          if (duration === 0 && session.status === 'completed') duration = 5; // Default 5 min fallback

          // Try to find review from separate reviews API if not in session
          let sessionReview = session.review;
          if (!sessionReview || !sessionReview.comment) {
            const matchingReview = reviews.find((r: any) =>
              r.sessionId === session.id ||
              (r.user?.name === session.user?.name &&
                Math.abs(new Date(r.createdAt).getTime() - new Date(session.createdAt).getTime()) < 24 * 60 * 60 * 1000)
            );
            if (matchingReview) {
              sessionReview = {
                rating: matchingReview.rating,
                comment: matchingReview.comment
              };
            }
          }

          return {
            id: session.id, // using session ID as unique key
            name: session.user?.name || "Client",
            avatar: session.user?.avatar,
            phone: session.user?.phone || "Hidden", // Phone might not be exposed
            email: session.user?.email || "Hidden",
            lastConsultation: {
              date: new Date(session.createdAt).toISOString().split('T')[0],
              duration: `${duration} min`,
              type: "chat"
            },
            rating: sessionReview?.rating || 0,
            review: sessionReview?.comment || "No review yet",
            payment: session.totalCost || session.amount || 0,
            rawSession: {
              ...session,
              durationMins: duration,
              totalCost: session.totalCost || session.amount || 0
            }
          };
        });

        setClients(mappedClients);
      } catch (error) {
        console.error("Failed to fetch clients:", error);
        toast.error("Failed to load clients history");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [expertUser?.profileId]);

  // Fetch Chat History
  const handleViewChat = async (client: Client) => {
    // We stored the raw session in the client object during mapping
    const session = (client as any).rawSession;
    if (!session) return;

    setSelectedSession(session);
    setShowChatModal(true);
    setLoadingChat(true);

    try {
      const response = await apiClient.get(`/chat/history/${session.id}`);
      setChatMessages(response.data);
    } catch (error) {
      console.error("Failed to load chat history:", error);
      toast.error("Failed to load chat history");
    } finally {
      setLoadingChat(false);
    }
  };

  const sortedAndFilteredClients = useMemo(() => {
    let sortableItems = [...clients];

    // Filtering logic
    if (searchTerm) {
      sortableItems = sortableItems.filter(
        (client) =>
          client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          client.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sorting logic
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        let aValue, bValue;
        if (sortConfig.key === "lastConsultation.date") {
          aValue = new Date(a.lastConsultation.date).getTime();
          bValue = new Date(b.lastConsultation.date).getTime();
        } else if (sortConfig.key === "payment") {
          aValue = a.payment;
          bValue = b.payment;
        }

        if (aValue !== undefined && bValue !== undefined) {
          if (aValue < bValue) {
            return sortConfig.direction === "ascending" ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
        }
        return 0;
      });
    }

    return sortableItems;
  }, [clients, searchTerm, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: "ascending" | "descending" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen relative">
      <div className="max-w-5xl mx-auto space-y-6">
        <ClientHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {/* Clients List - New Card Design */}
        <div className="space-y-4">
          {sortedAndFilteredClients.map((client) => {
            const session = (client as any).rawSession;
            return (
              <div
                key={client.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 md:p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                {/* Left Side: Info */}
                <div className="flex gap-4 md:gap-6 w-full md:w-auto">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border-2 border-orange-100 overflow-hidden shadow-sm relative">
                      {/* You might want to use session.user.avatar here if available */}
                      <img
                        src={session?.user?.avatar || "https://avatar.iran.liara.run/public"}
                        alt={client.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = "https://avatar.iran.liara.run/public"; }}
                      />
                      {/* Online/Status Indicator Dot (Optional) */}
                      <span className={`absolute bottom-1 right-1 w-3 h-3 rounded-full border-2 border-white ${session?.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex flex-col gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 leading-tight">{client.name}</h3>
                      <p className="text-sm text-gray-500 flex items-center gap-2 mt-1 font-medium">
                        <Calendar size={14} className="text-gray-400" />
                        {new Date(session?.createdAt || Date.now()).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>

                    {/* Badges Row */}
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      {/* Status Badge */}
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold capitalize ${session?.status === 'completed' ? 'bg-green-100 text-green-700' :
                        session?.status === 'active' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                        {/* Circle Icon */}
                        <div className={`w-1.5 h-1.5 rounded-full ${session?.status === 'completed' ? 'bg-green-500' :
                          session?.status === 'active' ? 'bg-blue-500' :
                            'bg-gray-500'
                          }`}></div>
                        {session?.status || 'Completed'}
                      </span>

                      {/* Duration Badge */}
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-gray-100 text-gray-600">
                        <Clock size={12} />
                        {client.lastConsultation.duration}
                      </span>

                      {/* Cost Badge */}
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-gray-100 text-gray-700">
                        <IndianRupee size={12} />
                        {client.payment}
                      </span>
                    </div>

                    {/* Rating & Review Section */}
                    <div className="mt-4">
                      <div className={`p-4 rounded-2xl border flex gap-4 items-start transition-all ${client.review && client.review !== "No review yet"
                        ? "bg-orange-50/50 border-orange-100 shadow-sm"
                        : "bg-gray-50 border-gray-100 opacity-60"
                        }`}>
                        <div className={`p-2 rounded-full ${client.review && client.review !== "No review yet" ? "bg-orange-100 text-[#fd6410]" : "bg-gray-200 text-gray-400"}`}>
                          <MessageSquare size={16} />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-[10px] font-black text-orange-600/60 uppercase tracking-widest">Client Feedback</p>
                            {client.rating > 0 && (
                              <div className="flex items-center gap-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    size={10}
                                    className={star <= client.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 italic leading-relaxed">
                            {client.review && client.review !== "No review yet"
                              ? `"${client.review}"`
                              : "The client hasn't left a review yet. Feedback helps build trust!"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Action Button */}
                <div className="w-full md:w-auto flex-shrink-0">
                  {session?.status === 'completed' ? (
                    <button
                      onClick={() => handleViewChat(client)}
                      className="w-full md:w-auto bg-[#fd6410] hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/20 active:scale-95"
                    >
                      <MessageSquare size={18} className="fill-white/20" />
                      View Chat
                    </button>
                  ) : (
                    <div className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-400 flex items-center gap-2 italic">
                      <MessageSquare size={14} className="opacity-40" />
                      No Chat History
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat History Modal (Keep existing) */}
      {showChatModal && selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header - Styled to match dashboard theme */}
            <div className="p-6 bg-[#fd6410] text-white flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border-2 border-white/20 overflow-hidden bg-white/10 flex items-center justify-center">
                  <img
                    src={selectedSession.user?.avatar || "https://avatar.iran.liara.run/public"}
                    alt="User"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{selectedSession.user?.name || "Client"}</h3>
                  <div className="flex items-center gap-3 text-sm text-white/80 mt-0.5 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {new Date(selectedSession.createdAt).toLocaleDateString()}
                    </span>
                    <span className="w-1 h-1 bg-white/50 rounded-full"></span>
                    <span className="capitalize">
                      {selectedSession.status}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowChatModal(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-90"
              >
                <X size={24} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#fff9f5] space-y-6">
              {loadingChat ? (
                <div className="flex flex-col justify-center items-center h-64 gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#fd6410]"></div>
                  <p className="text-gray-400 text-sm font-medium">Loading conversation...</p>
                </div>
              ) : chatMessages.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare size={32} className="opacity-40" />
                  </div>
                  <p className="font-medium">No messages found in this session</p>
                </div>
              ) : (
                chatMessages.map((msg: any, idx: number) => {
                  const isExpert = msg.senderType === 'expert';
                  return (
                    <div key={idx} className={`flex w-full ${isExpert ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex flex-col ${isExpert ? 'items-end' : 'items-start'} max-w-[75%]`}>
                        <div className={`rounded-2xl p-4 shadow-sm relative ${isExpert
                          ? 'bg-[#fd6410] text-white rounded-tr-sm'
                          : 'bg-white text-gray-800 border border-gray-100 rounded-tl-sm'
                          }`}>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        </div>
                        <span className="text-[10px] mt-1.5 px-1 text-gray-400 font-medium">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-5 bg-white border-t border-gray-100 flex justify-between items-center text-sm">
              <div className="flex gap-6">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Duration</span>
                  <span className="font-bold text-gray-800 flex items-center gap-1.5 mt-0.5">
                    <Clock size={14} className="text-[#fd6410]" />
                    {selectedSession.durationMins || 0} mins
                  </span>
                </div>
                <div className="w-px h-8 bg-gray-100"></div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Total Earnings</span>
                  <span className="font-bold text-gray-800 flex items-center gap-1.5 mt-0.5">
                    <IndianRupee size={14} className="text-green-600" />
                    ₹{selectedSession.totalCost || 0}
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded">
                ID: {selectedSession.id}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}