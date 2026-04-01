"use client";

import React, { useState, useMemo, useEffect } from "react";
import ClientHeader from "./ClientHeader";
import ClientTable from "./ClientTable";
import ClientMobileList from "./ClientMobileList";
import { Client, SortConfig, SortKey } from "./types";
import { api } from "@/lib/api";
import { toast } from "react-toastify";
import * as LucideIcons from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { getReviews } from "@/lib/reviews";
import Button from "../ui/Button";

const { X, MessageSquare, Clock, IndianRupee, Calendar, Star, Sun, ClipboardList, MapPin } = LucideIcons as any;

import { createPortal } from "react-dom";

export default function ClientsPage() {
  const { user: expertUser } = useAuthStore();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  // Accordion State
  const [expandedSessions, setExpandedSessions] = useState<Record<string | number, boolean>>({});

  const toggleSession = (id: string | number) => {
    setExpandedSessions((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Fetch Clients Data
  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const [sessionsResult, reviewsResult] = await Promise.all([
          api.get<any>('/chat/sessions/all'),
          expertUser?.profileId ? getReviews(expertUser.profileId, 1, 50) : Promise.resolve([null, null] as [any, any])
        ]);

        const [sessionsData, sessionsError] = sessionsResult;
        const [reviewsData, reviewsError] = reviewsResult;

        if (sessionsError) {
            console.error("Failed to fetch sessions:", sessionsError);
        }
        
        const sessions = (sessionsData as any)?.data || sessionsData || [];
        const reviews = (reviewsData as any)?.reviews || (reviewsData as any)?.data || reviewsData || [];

        // Map API response to Client interface
        const mappedClients: Client[] = sessions.map((session: any) => {
          // Precise duration calculation
          let durationSecs = session.duration_seconds || session.durationSeconds || 0;

          // If we only have mins, convert to secs for base calculation
          if (durationSecs === 0) {
            const dMins = session.duration_mins || session.durationMins || session.duration || 0;
            if (dMins > 0) {
              // If dMins is suspiciously large, it might already be seconds
              durationSecs = dMins > 500 ? dMins : dMins * 60;
            }
          }

          if (durationSecs === 0 && (session.status === 'completed' || session.status === 'expired')) {
            const start = (session.activated_at || session.activatedAt) ? new Date(session.activated_at || session.activatedAt).getTime() :
              (session.start_time || session.startTime ? new Date(session.start_time || session.startTime).getTime() :
                (session.created_at || session.createdAt ? new Date(session.created_at || session.createdAt).getTime() : 0));
            const end = (session.ended_at || session.endedAt) ? new Date(session.ended_at || session.endedAt).getTime() :
              (session.end_time || session.endTime ? new Date(session.end_time || session.endTime).getTime() :
                (session.updated_at || session.updatedAt ? new Date(session.updated_at || session.updatedAt).getTime() : 0));

            if (start > 0 && end > 0) {
              const diffMs = end - start;
              durationSecs = Math.floor(diffMs / 1000);
            }
          }

          // Ensure at least some duration for completed sessions
          if (durationSecs === 0 && session.status === 'completed') durationSecs = 300; // 5 min default

          const mins = Math.floor(durationSecs / 60);
          const secs = durationSecs % 60;
          const preciseDurationStr = mins > 0
            ? (secs > 0 ? `${mins}m ${secs}s` : `${mins} min`)
            : `${secs}s`;

          // Try to find review from separate reviews API if not in session
          let sessionReview = session.review;
          if (!sessionReview || !sessionReview.comment) {
            const matchingReview = reviews.find((r: any) => (r.session_id || r.sessionId) === session.id);
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
            avatar: session.user?.profile_picture || session.user?.avatar || session.user?.profilePicture,
            phone: session.user?.phone || session.user?.phone_number || "Hidden",
            email: session.user?.email || "Hidden",
            lastConsultation: {
              date: (() => {
                const d = new Date(session.created_at || session.createdAt);
                return isNaN(d.getTime()) ? new Date().toISOString().split('T')[0] : d.toISOString().split('T')[0];
              })(),
              duration: preciseDurationStr,
              type: "chat"
            },
            rating: sessionReview?.rating || 0,
            review: sessionReview?.comment || "No review yet",
            payment: session.total_cost || session.totalCost || session.amount || 0,
            rawSession: {
              ...session,
              durationMins: mins,
              durationSeconds: durationSecs,
              durationString: session.durationString || preciseDurationStr,
              totalCost: session.total_cost || session.totalCost || session.amount || 0
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
      const [res, error] = await api.get<any>(`/chat/history/${session.id}`);
      if (error) throw error;
      const messages = (res as any)?.data || res || [];
      setChatMessages(messages);
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
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen relative">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 sm:p-8">
          <ClientHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          {/* Clients List - New Card Design */}
          <div className="space-y-4">
            {sortedAndFilteredClients.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="mb-4">
                  <Calendar className="w-12 h-12 text-gray-300 mx-auto" strokeWidth={1.5} />
                </div>
                <h6 className="font-bold text-gray-700">No Consultation History</h6>
                <p className="text-gray-500 text-sm mt-1">You have no past consultations matching your search.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedAndFilteredClients.map((client) => {
                  const session = (client as any).rawSession;
                  const isExpanded = expandedSessions[client.id];

                  return (
                    <div key={client.id} className="bg-white rounded-2xl border border-gray-200 p-0 overflow-hidden shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
                      {/* Collapsed Strip */}
                      <div className={`p-4 sm:p-5 flex justify-between items-center flex-wrap gap-4 ${isExpanded ? 'bg-gray-50/50 border-b border-gray-100' : 'bg-white'}`}>
                        <div className="flex flex-col min-w-[100px]">
                          <span className="text-gray-500 text-[11px] font-bold uppercase tracking-wider mb-1">Session ID</span>
                          <span className="font-extrabold text-gray-800">#{session?.id || client.id}</span>
                        </div>
                        <div className="flex flex-col min-w-[120px]">
                          <span className="text-gray-500 text-[11px] font-bold uppercase tracking-wider mb-1">Date</span>
                          <span className="font-bold text-gray-800">
                            {new Date(session?.created_at || session?.createdAt || Date.now()).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex flex-col min-w-[100px]">
                          <span className="text-gray-500 text-[11px] font-bold uppercase tracking-wider mb-1">Earnings</span>
                          <span className="font-extrabold text-[#fd6410]">₹{client.payment}</span>
                        </div>
                        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 ml-auto">
                          <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wide ${session?.terminated_by === 'admin' || session?.terminatedBy === 'admin'
                            ? 'bg-red-100 text-red-700'
                            : session?.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : session?.status === 'active'
                                ? 'bg-blue-100 text-blue-700'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                            {(session?.terminated_by === 'admin' || session?.terminatedBy === 'admin') ? 'Terminated by Admin' : (session?.status || 'Completed')}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSession(client.id);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors focus:outline-none"
                          >
                            <LucideIcons.ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                      </div>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="p-5 bg-white">
                          <div className="flex items-center gap-5 mb-5">
                            <div className="w-20 h-20 rounded-full border-2 border-orange-100 overflow-hidden shadow-sm flex-shrink-0">
                              <img
                                src={session?.user?.profile_picture || session?.user?.avatar || "/images/dummy-astrologer.jpg"}
                                alt={client.name}
                                className="w-full h-full object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).src = "/images/dummy-astrologer.jpg"; }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h5 className="text-lg font-bold text-gray-900 m-0 leading-tight">{client.name}</h5>
                                  <p className="text-sm text-gray-500 m-0 mt-1">Client</p>
                                </div>
                                <div className="text-right">
                                  <span className="font-bold text-gray-900 block">₹{client.payment}</span>
                                  <span className="text-xs text-gray-500">Earnings</span>
                                </div>
                              </div>
                              <div className="flex gap-4 text-sm text-gray-500 mt-2">
                                <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1 rounded-md">
                                  <Clock size={14} className="text-gray-400" />
                                  {client.lastConsultation.duration}
                                </span>
                                <span className="flex items-center gap-1.5 bg-yellow-50 px-2.5 py-1 rounded-md text-yellow-700 pb-1">
                                  <Star size={14} className="fill-yellow-500 text-yellow-500" />
                                  <span className="mt-0.5">{client.rating > 0 ? client.rating : 'N/A'} Rating</span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Client Feedback Box */}
                          <div className={`mt-2 mb-5 p-4 rounded-xl border flex gap-3 items-start transition-all ${client.review && client.review !== "No review yet"
                            ? "bg-orange-50/50 border-orange-100"
                            : "bg-gray-50/80 border-gray-100"
                            }`}>
                            <div className={`mt-0.5 p-1.5 rounded-full ${client.review && client.review !== "No review yet" ? "bg-orange-100 text-[#fd6410]" : "bg-gray-200 text-gray-400"}`}>
                              <MessageSquare size={14} />
                            </div>
                            <div className="flex-1">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Client Feedback</p>
                              <p className="text-sm text-gray-700 italic leading-relaxed m-0">
                                {client.review && client.review !== "No review yet"
                                  ? `"${client.review}"`
                                  : "The client hasn't left a review yet. Feedback helps build trust!"}
                              </p>
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleViewChat(client)}
                                className="rounded-full px-6 py-2 text-sm font-bold border-2 border-[#007bff] text-[#007bff] bg-white hover:bg-[#007bff0a] flex items-center gap-2 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                                disabled={session?.status !== 'completed'}
                              >
                                <MessageSquare size={16} />
                                {session?.status === 'completed' ? 'View Chat History' : 'No Chat Details'}
                              </button>
                            </div>

                            {/* Placeholder for report issue if needed for Astrologer */}
                            {(session?.status === 'issue_reported' || session?.status === 'dispute_raised') && (
                              <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-bold border border-red-100">
                                <LucideIcons.AlertTriangle size={16} />
                                Issue Reported
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat History Modal (Upgraded Design) */}
      {mounted && showChatModal && selectedSession && createPortal(
        <div
          className="fixed inset-0 z-[100000] flex items-center justify-center p-4"
          style={{
            backgroundColor: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)"
          }}
          onClick={() => setShowChatModal(false)}
        >
          <div
            className="bg-white w-full max-w-2xl rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300"
            style={{ zIndex: 1000001 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header - Orange theme */}
            <div className="p-5 sm:p-6 bg-[#fd6410] text-white flex justify-between items-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <MessageSquare size={120} />
              </div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 rounded-full border-4 border-white/20 overflow-hidden bg-white shadow-lg">
                  <img
                    src={selectedSession.user?.profile_picture || selectedSession.user?.avatar || "/images/dummy-astrologer.jpg"}
                    alt="User"
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/images/dummy-astrologer.jpg"; }}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight">{selectedSession.user?.name || "Client Consultation"}</h3>
                  <div className="flex items-center gap-2 text-white/90 mt-1 font-bold text-sm">
                    <Calendar size={14} className="opacity-70" />
                    {new Date(selectedSession.created_at || selectedSession.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowChatModal(false)}
                className="bg-white/10 hover:bg-white/20 text-white w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-90 relative z-10"
                aria-label="Close modal"
              >
                <X size={24} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#fffbf9] space-y-6 custom-scrollbar-yellow">
              {loadingChat ? (
                <div className="flex flex-col justify-center items-center h-64 gap-4">
                  <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#fd6410] border-t-transparent"></div>
                  <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Loading Conversation...</p>
                </div>
              ) : (chatMessages?.length || 0) === 0 ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 shadow-inner">
                    <MessageSquare size={40} className="text-gray-200" />
                  </div>
                  <p className="font-bold text-gray-400">No messages found in this session</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {chatMessages.map((msg: any, idx: number) => {
                    const content = msg.content || "";
                    const sType = (msg.senderType || msg.sender_type || "").toLowerCase();
                    const isExpert = sType === 'expert';
                    const isStatusMsg = content.includes("Expert has ended") || content.includes("Consultation started") || sType === 'system';

                    // 1. Status Messages (Centered Badges)
                    if (isStatusMsg) {
                      const isEnded = content.toLowerCase().includes('end') || content.toLowerCase().includes('finish');
                      return (
                        <div key={idx} className="flex justify-center my-4 w-full text-center px-4">
                          <div className={`px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-[0.1em] border shadow-sm inline-block ${isEnded ? 'bg-red-50 text-red-600 border-red-100' : 'bg-gray-100/80 text-gray-500 border-gray-200'
                            }`}>
                            {content}
                          </div>
                        </div>
                      );
                    }

                    // 2. Intro Card (Birth Details Shared)
                    if (content.startsWith("[INTRO_CARD]")) {
                      try {
                        const details = JSON.parse(content.replace("[INTRO_CARD]", ""));
                        return (
                          <div key={idx} className="my-4 w-full px-2">
                            <div className="relative overflow-hidden rounded-[1.5rem] p-5 shadow-md border-0"
                              style={{ background: "linear-gradient(135deg, #fff9c4 0%, #fff176 100%)", border: "1px solid #fdd835" }}>
                              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                                <Sun size={80} />
                              </div>
                              <h6 className="font-black mb-4 text-orange-900 flex items-center gap-2 border-b border-orange-900/10 pb-3 text-sm uppercase tracking-wider">
                                <ClipboardList size={20} className="text-orange-600" />
                                Birth Details Shared
                              </h6>
                              <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                                <div>
                                  <label className="text-[9px] uppercase font-black text-orange-800/50 tracking-widest block mb-0.5">Name</label>
                                  <p className="text-sm font-bold text-gray-900 m-0">{details.name}</p>
                                </div>
                                <div>
                                  <label className="text-[9px] uppercase font-black text-orange-800/50 tracking-widest block mb-0.5">Gender</label>
                                  <p className="text-sm font-bold text-gray-900 m-0 capitalize">{details.gender || 'N/A'}</p>
                                </div>
                                <div>
                                  <label className="text-[9px] uppercase font-black text-orange-800/50 tracking-widest block mb-0.5">Date of Birth</label>
                                  <p className="text-sm font-bold text-gray-900 m-0">{details.dob}</p>
                                </div>
                                <div>
                                  <label className="text-[9px] uppercase font-black text-orange-800/50 tracking-widest block mb-0.5">Time</label>
                                  <p className="text-sm font-bold text-gray-900 m-0">{details.tob || 'N/A'}</p>
                                </div>
                                <div className="col-span-2 mt-1 border-t border-orange-900/10 pt-3">
                                  <label className="text-[9px] uppercase font-black text-orange-800/50 tracking-widest block mb-0.5">Place of Birth</label>
                                  <p className="text-sm font-bold text-gray-900 m-0 flex items-center gap-1.5 font-medium">
                                    <MapPin size={14} className="text-red-500 opacity-60" />
                                    {details.pob || 'N/A'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      } catch (e) { return <div key={idx} className="text-center italic text-gray-400 py-2">Invalid data card</div>; }
                    }

                    // 3. Chat Bubbles (MATCH MAIN APP: Expert=Left, User=Right)
                    const isUserSide = !isExpert; // User always on Right to match Main App

                    return (
                      <div key={idx} className={`flex w-full mb-2 ${isUserSide ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex gap-3 max-w-[85%] ${isUserSide ? 'flex-row-reverse' : 'flex-row'}`}>
                          {/* Avatar in Chat */}
                          <div className={`w-10 h-10 rounded-full border-2 overflow-hidden shadow-sm flex-shrink-0 bg-white ${isExpert ? 'border-gray-200' : 'border-[#fd6410]/20'}`}>
                            <img
                              src={isExpert
                                ? (expertUser?.profile_picture || expertUser?.avatar || "/images/dummy-astrologer.jpg")
                                : (selectedSession.user?.profile_picture || selectedSession.user?.avatar || "/images/dummy-astrologer.jpg")
                              }
                              alt="Avatar"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className={`flex flex-col ${isUserSide ? 'items-end' : 'items-start'}`}>
                            <div className={`p-4 shadow-sm relative ${isUserSide
                              ? 'bg-[#fd6410] text-white rounded-[1.2rem] rounded-tr-none'
                              : 'bg-white text-dark border border-gray-100 rounded-[1.2rem] rounded-tl-none'
                              }`}>
                              <p className="text-[14px] leading-relaxed whitespace-pre-wrap m-0 font-medium">{content}</p>
                            </div>
                            <span className="text-[10px] mt-2 px-1 text-gray-400 font-black uppercase tracking-widest">
                              {new Date(msg.created_at || msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer - Styled like Main App */}
            <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center sm:flex-row flex-col gap-4">
              <div className="flex gap-3 items-center">
                <div className="bg-white px-4 py-2 rounded-2xl border border-gray-200 shadow-sm flex flex-col min-w-[100px]">
                  <span className="text-[8px] text-gray-400 uppercase font-black tracking-[0.2em] mb-0.5">Duration</span>
                  <span className="font-black text-gray-800 flex items-center gap-1.5 text-xs">
                    <Clock size={12} className="text-[#fd6410]" />
                    {selectedSession.durationString || `${selectedSession.durationMins || 0} mins`}
                  </span>
                </div>
                <div className="bg-white px-4 py-2 rounded-2xl border border-gray-200 shadow-sm flex flex-col min-w-[100px]">
                  <span className="text-[8px] text-gray-400 uppercase font-black tracking-[0.2em] mb-0.5">Earnings</span>
                  <span className="font-black text-emerald-600 flex items-center gap-1.5 text-xs">
                    <IndianRupee size={12} />
                    ₹{selectedSession.total_cost || selectedSession.totalCost || 0}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-[10px] text-slate-600 font-bold font-mono tracking-tighter">
                  ID: {selectedSession.id}
                </div>
                <button
                  onClick={() => setShowChatModal(false)}
                  className="bg-slate-600 hover:bg-slate-700 text-white px-8 py-2.5 rounded-xl font-black text-sm transition-all shadow-md active:scale-95"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

