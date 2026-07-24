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
import { HistorySkeleton } from "../dashboard/DashboardSkeletons";
import { Loading } from "@repo/ui";

const { X, MessageSquare, Clock, IndianRupee, Calendar, Star, Sun, ClipboardList, MapPin, Phone, Video, User, AlertCircle } = LucideIcons as any;

import { createPortal } from "react-dom";

export default function ClientsPage() {
  const { user: expertUser } = useAuthStore();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [offset, setOffset] = useState(0);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const limit = 20;

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: null,
    direction: "ascending",
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setOffset(0); // Reset to first page on new search
    }, 800); // Increased to 800ms for smoother typing experience

    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Chat Modal State
  const [showChatModal, setShowChatModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [loadingChat, setLoadingChat] = useState(false);

  // Accordion State
  const [expandedSessions, setExpandedSessions] = useState<Record<string | number, boolean>>({});

  const toggleSession = (id: string) => {
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
        // Clean debouncedSearchTerm for ID search if it has hash
        const cleanSearch = debouncedSearchTerm.replace(/^#/, "");
        
        // Unified API Call for all consultation types
        const [historyResult, historyError] = await api.get<any>(`/consultations/history?limit=${limit}&offset=${offset}&search=${encodeURIComponent(cleanSearch)}`);

        if (historyError) {
          console.error("Failed to fetch consultation history:", historyError);
          throw historyError;
        }
        
        const sessions = Array.isArray(historyResult) ? historyResult : (historyResult?.items || historyResult?.data || []);
        
        // Map API response to Client interface using top-level standardized fields
        const mappedClients: Client[] = sessions.map((session: any) => {
          const totalCost = Number(session.total_cost || session.amount || 0);
          const expertShare = Number(session.expert_earning || session.expert_share || session.payment || 0);
          const platformFee = Number(session.platform_fee || 0);
          const gst = Number(session.gst || 0);
          const agentCommission = Number(session.agent_commission || 0);

          return {
            id: session.id,
            name: session.user_name || "Client",
            avatar: session.user_image || null,
            phone: session.user_phone || "Hidden",
            email: session.user_email || "Hidden",
            lastConsultation: {
              date: session.startTime || session.createdAt || new Date().toISOString(),
              duration: session.durationString || "0s",
              type: (session.type || "interaction").toLowerCase()
            },
            rating: session.rating || 0,
            review: session.comment || "No review yet",
            payment: Number(expertShare.toFixed(2)),
            terminatedBy: session.terminatedBy,
            rawSession: { ...session, totalCost, expertShare, platformFee, gst, agentCommission }
          };
        });

        // Update total records metadata if available
        if (historyResult?.meta?.totalCount) {
          setTotalRecords(historyResult.meta.totalCount);
        } else {
          setTotalRecords(mappedClients.length);
        }

        setClients(mappedClients);
      } catch (error) {
        console.error("Failed to fetch clients:", error);
        toast.error("Failed to load clients history");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [expertUser?.profileId, debouncedSearchTerm, offset]);

  // Fetch Chat History
  const handleViewChat = async (client: Client) => {
    // We stored the raw session in the client object during mapping
    const session = (client as any).rawSession;
    if (!session) return;

    setSelectedSession(session);
    setShowChatModal(true);

    const isChat = (session.type || session.session_type || "").toLowerCase().includes("chat");
    
    if (isChat) {
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
    } else {
      // For calls, no chat history is needed
      setChatMessages([]);
      setLoadingChat(false);
    }
  };

  const sortedAndFilteredClients = useMemo(() => {
    let sortableItems = [...clients];

    // NOTE: Filtering is now handled on the server side via query params.
    // Client-side filtering is only a fallback for rapid state changes.

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

  return (
    <div className="p-0 sm:p-6 lg:p-8 min-h-screen relative">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white sm:rounded-[2rem] sm:shadow-sm border-none sm:border-solid border-gray-100 p-4 sm:p-8 relative overflow-hidden min-h-screen sm:min-h-0">
          {/* Subtle Progress Bar for background loading */}
          {loading && clients.length > 0 && (
            <div className="absolute top-0 left-0 right-0 h-1 z-10 overflow-hidden bg-orange-50">
              <div className="h-full bg-[#f25e0a] animate-pulse w-full"></div>
            </div>
          )}

          <ClientHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

          {/* Clients List area */}
          <div className={`space-y-4 max-h-[calc(100vh-320px)] overflow-y-auto pr-2 custom-scrollbar-orange pb-4 transition-opacity duration-300 ${loading && clients.length > 0 ? "opacity-60" : "opacity-100"}`}>
            {!mounted ? null : loading && clients.length === 0 ? (
               <HistorySkeleton />
            ) : sortedAndFilteredClients.length === 0 ? (
              <div className="text-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                <div className="mb-4">
                  <LucideIcons.SearchX className="w-12 h-12 text-gray-300 mx-auto" strokeWidth={1.5} />
                </div>
                <h6 className="font-bold text-gray-700">No sessions found</h6>
                <p className="text-gray-500 text-sm mt-1">
                  {debouncedSearchTerm ? `No results for "${debouncedSearchTerm}"` : "You haven't had any consultations yet."}
                </p>
                {debouncedSearchTerm && (
                  <Button variant="secondary" size="sm" className="mt-4" onClick={() => setSearchTerm("")}>
                    Clear Search
                  </Button>
                )}
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
                        <div className="flex flex-col w-[45%] sm:w-auto sm:min-w-[100px]">
                          <span className="text-gray-900 text-[11px] font-bold uppercase tracking-wider mb-1">Session ID</span>
                          <span className="font-extrabold text-gray-800">{session?.displayId || `#${session?.id || client.id}`}</span>
                        </div>
                        <div className="flex flex-col w-[45%] sm:w-auto sm:min-w-[100px]">
                          <span className="text-gray-900 text-[11px] font-bold uppercase tracking-wider mb-1">Date</span>
                          <span className="font-bold text-gray-800">
                            {new Date(session?.startTime || session?.created_at || session?.createdAt || Date.now()).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex flex-col w-[45%] sm:w-auto sm:min-w-[100px]">
                          <span className="text-gray-900 text-[11px] font-bold uppercase tracking-wider mb-1">Earnings</span>
                          <span className="font-extrabold text-[#fd6410]">₹{client.payment}</span>
                        </div>
                        <div className="flex flex-col w-[45%] sm:w-auto sm:min-w-[100px]">
                          <span className="text-gray-900 text-[11px] font-bold uppercase tracking-wider mb-1">Type</span>
                          <span className="font-bold text-gray-800 flex items-center gap-2">
                             {(session?.type === 'AUDIO_CALL' || session?.session_type === 'audio') ? (
                               <><LucideIcons.Phone size={14} className="text-blue-500" /> Audio</>
                             ) : (session?.type === 'VIDEO_CALL' || session?.session_type === 'video') ? (
                               <><LucideIcons.Video size={14} className="text-purple-500" /> Video</>
                             ) : (
                               <><LucideIcons.MessageSquare size={14} className="text-[#fd6410]" /> Chat</>
                             )}
                          </span>
                        </div>
                        <div className="flex flex-row items-center justify-between w-full sm:w-auto gap-3 mt-2 sm:mt-0">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] uppercase font-black tracking-widest shadow-sm border ${
                            (session?.status?.toLowerCase() === 'completed')
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : (session?.status?.toLowerCase() === 'missed' || session?.status?.toLowerCase() === 'rejected' || session?.status?.toLowerCase() === 'failed')
                                ? 'bg-rose-50 text-rose-700 border-rose-100'
                                : (session?.status?.toLowerCase() === 'active' || session?.status?.toLowerCase() === 'pending')
                                  ? 'bg-sky-50 text-sky-700 border-sky-100'
                                  : 'bg-slate-50 text-slate-600 border-slate-100'
                          }`}>
                            {session?.status || 'COMPLETED'}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSession(client.id);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-colors focus:outline-none cursor-pointer hover:cursor-pointer"
                          >
                            <LucideIcons.ChevronDown className={`w-4 h-4 text-gray-700 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                          </button>
                        </div>
                      </div>

                      {/* Expanded Details - Premium Professional View */}
                      {isExpanded && (
                        <div className="p-6 bg-white border-t border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
                          {/* Row 1: Profile & Earnings Summary */}
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
                            <div className="flex items-center gap-5">
                              <div className="relative group">
                                <div className="w-20 h-20 rounded-full border-4 border-orange-50 overflow-hidden shadow-md transition-transform group-hover:scale-105 duration-300 bg-white flex items-center justify-center">
                                  {((session?.user_image && session.user_image !== '/images/dummy-user.jpg') || session?.user?.profile_picture || session?.user?.avatar || (client.avatar && client.avatar !== '/images/dummy-user.jpg')) ? (
                                    <img
                                      src={(session?.user_image && session.user_image !== '/images/dummy-user.jpg') ? session.user_image : (session?.user?.profile_picture || session?.user?.avatar || client.avatar)}
                                      alt={client.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => { 
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        target.parentElement!.classList.add('bg-orange-100');
                                        target.parentElement!.innerHTML = `<span class="text-2xl font-black text-[#fd6410]">${client.name.charAt(0)}</span>`;
                                      }}
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-orange-100 flex items-center justify-center">
                                      <span className="text-2xl font-black text-[#fd6410]">{client.name.charAt(0).toUpperCase()}</span>
                                    </div>
                                  )}
                                </div>
                                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-white shadow-sm">
                                  <LucideIcons.Check size={10} className="font-black" />
                                </div>
                              </div>
                              
                              <div>
                                <h5 className="text-xl font-black text-gray-900 leading-none mb-1.5">{client.name}</h5>
                                <p className="text-sm font-bold text-gray-700 uppercase tracking-widest">Verified Client</p>
                              </div>
                            </div>

                            <div className="flex flex-col sm:items-end w-full sm:w-auto">
                              <span className="text-[10px] font-black text-gray-700 uppercase tracking-[0.2em] mb-1">Your Net Earning</span>
                              <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black text-[#fd6410]">₹{client.payment}</span>
                                {session?.rate && (
                                  <span className="text-xs font-bold text-gray-700">(@ ₹{session.rate}/min)</span>
                                )}
                              </div>
                              {client.terminatedBy && (
                                <div className="mt-2 flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
                                  <LucideIcons.Power size={10} className="text-gray-600" />
                                  <span className="text-[9px] font-bold text-gray-700 uppercase tracking-tight">
                                    Cut by: {client.terminatedBy === 'EXPERT' ? 'You' : 'Client'}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Row 2: Stats Summary Bar - Styled like Main App */}
                          <div className="bg-[#fcfcfc] rounded-[2rem] p-2 border border-gray-100 flex flex-wrap items-center gap-4 mb-4">
                             <div className="flex-1 min-w-[150px] bg-white rounded-[1.8rem] py-4 px-6 shadow-sm border border-gray-50 flex items-center justify-center gap-4">
                                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                                  (session?.type || session?.session_type || "").toLowerCase().includes('chat') ? 'bg-orange-50 text-[#fd6410]' : 'bg-blue-50 text-blue-600'
                                }`}>
                                  {(session?.type || session?.session_type || "").toLowerCase().includes('chat') ? <MessageSquare size={20} /> : <Phone size={20} />}
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Consultation</span>
                                  <span className="text-sm font-black text-gray-700 capitalize">
                                    {(session?.type || session?.session_type || "Session")} • {session.durationString || "0s"}
                                  </span>
                                </div>
                             </div>

                             <div className="flex-1 min-w-[150px] bg-white rounded-[1.8rem] py-4 px-6 shadow-sm border border-gray-50 flex items-center justify-center gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                                  <Star size={20} className="fill-current" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Client Rating</span>
                                  <span className="text-sm font-black text-gray-700">
                                    {client.rating > 0 ? `${client.rating} Stars` : 'N/A Rating'}
                                  </span>
                                </div>
                             </div>
                          </div>

                          {/* Row 3: Fare Breakdown Section (Upgraded) */}
                          <div className="mb-8 grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-3">
                            <div className="bg-gray-50/50 rounded-2xl p-3 border border-gray-100 flex flex-col">
                              <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                                <IndianRupee size={10} /> User Paid
                              </span>
                              <span className="text-base font-black text-gray-700">₹{Number(session.total_cost || session.totalCost || 0).toFixed(2)}</span>
                            </div>
                            
                            {(() => {
                              const total = Number(session.total_cost || 0);
                              let pFee = Number(session.platform_fee || 0);
                              let gstAmt = Number(session.gst || 0);
                              
                              // Legacy Fix: If GST is 0 but platform_fee exists, it's likely the old merged value
                              if (gstAmt === 0 && pFee > 0 && total > 0) {
                                // Logic: Old platform_fee included 18% GST
                                // Amount = PlatformFeeShare + (PlatformFeeShare * 0.18)
                                // Amount = PlatformFeeShare * 1.18
                                const platformShare = pFee / 1.18;
                                gstAmt = pFee - platformShare;
                                pFee = platformShare;
                              }
                              const pPercentage = total > 0 ? Math.round((pFee / total) * 100) : 0;
                              return (
                                <>
                                  <div className="bg-rose-50/30 rounded-2xl p-3 border border-rose-100/50 flex flex-col">
                                    <span className="text-[9px] font-black text-rose-700 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                                      <LucideIcons.Percent size={10} /> Platform Fee ({pPercentage}%)
                                    </span>
                                    <span className="text-base font-black text-rose-600">-₹{pFee.toFixed(2)}</span>
                                  </div>

                                  <div className="bg-rose-50/30 rounded-2xl p-3 border border-rose-100/50 flex flex-col">
                                    <span className="text-[9px] font-black text-rose-700 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                                      <LucideIcons.ShieldAlert size={10} /> GST (18%)
                                    </span>
                                    <span className="text-base font-black text-rose-600">-₹{gstAmt.toFixed(2)}</span>
                                  </div>
                                </>
                              );
                            })()}

                            {Number(session.agent_commission || session.agentCommission || 0) > 0 && (
                            <div className="bg-blue-50/30 rounded-2xl p-3 border border-blue-100/50 flex flex-col">
                              <span className="text-[9px] font-black text-blue-700 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                                <LucideIcons.Users size={10} /> Agent Share
                              </span>
                              <span className="text-base font-black text-blue-600">-₹{Number(session.agent_commission || session.agentCommission || 0).toFixed(2)}</span>
                            </div>
                            )}

                            <div className="bg-emerald-50/50 rounded-2xl p-3 border border-emerald-100 flex flex-col">
                              <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                                <LucideIcons.Wallet size={10} /> Net Payout
                              </span>
                              <span className="text-base font-black text-emerald-800">₹{Number(session.expert_earning || session.expertShare || client.payment).toFixed(2)}</span>
                            </div>
                          </div>

                          {/* Client Feedback Tray */}
                          <div className={`p-5 rounded-3xl border flex gap-4 items-start transition-all ${
                            client.review && client.review !== "No review yet"
                              ? "bg-orange-50/30 border-orange-100"
                              : "bg-gray-50/50 border-gray-100 border-dashed"
                            }`}>
                            <div className={`p-2 rounded-2xl ${
                              client.review && client.review !== "No review yet" ? "bg-[#fd6410] text-white" : "bg-gray-200 text-gray-600"
                            }`}>
                              <MessageSquare size={16} />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-gray-800 mb-2">Detailed Feedback</p>
                              <p className="text-sm text-gray-900 leading-relaxed m-0 font-medium">
                                {client.review && client.review !== "No review yet"
                                  ? `"${client.review}"`
                                  : "The client hasn't provided a written review for this session."}
                              </p>
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-6">
                            <div className="flex gap-3">
                              <button
                                onClick={() => handleViewChat(client)}
                                className="rounded-full px-6 py-2 text-sm font-bold border-2 border-[#fd6410] text-[#fd6410] bg-white hover:bg-[#fd6410]/5 flex items-center gap-2 transition-all shadow-sm active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer hover:cursor-pointer"
                                disabled={session?.status?.trim()?.toLowerCase() !== 'completed' && session?.status?.trim()?.toLowerCase() !== 'active'}
                              >
                                {((session?.type || session?.session_type || "").toLowerCase().includes("chat")) ? (
                                  <>
                                    <MessageSquare size={16} />
                                    {(session?.status?.trim()?.toLowerCase() === 'completed' || session?.status?.trim()?.toLowerCase() === 'active') ? 'View Chat History' : 'No Chat Details'}
                                  </>
                                ) : (
                                  <>
                                    <Phone size={16} />
                                    {(session?.status?.trim()?.toLowerCase() === 'completed' || session?.status?.trim()?.toLowerCase() === 'active') ? 'View Call Details' : 'No Call Details'}
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Status Indicators */}
                            {(session?.status?.trim()?.toLowerCase() === 'issue_reported' || session?.status?.trim()?.toLowerCase() === 'dispute_raised') && (
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

          {/* Pagination Controls */}
          {totalRecords > limit && (
            <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-6">
              <p className="text-sm text-gray-500">
                Showing <span className="font-bold text-gray-900">{offset + 1}</span> to{" "}
                <span className="font-bold text-gray-900">{Math.min(offset + limit, totalRecords)}</span> of{" "}
                <span className="font-bold text-gray-900">{totalRecords}</span> sessions
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={offset === 0}
                  onClick={() => setOffset(Math.max(0, offset - limit))}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={offset + limit >= totalRecords}
                  onClick={() => setOffset(offset + limit)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
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
                <div className="w-14 h-14 rounded-full border-4 border-white/20 overflow-hidden bg-white shadow-lg flex items-center justify-center text-[#fd6410]">
                  {((selectedSession.user_image && selectedSession.user_image !== '/images/dummy-user.jpg') || selectedSession?.user?.profile_picture || selectedSession?.user?.avatar) ? (
                    <img
                      src={(selectedSession.user_image && selectedSession.user_image !== '/images/dummy-user.jpg') ? selectedSession.user_image : (selectedSession?.user?.profile_picture || selectedSession?.user?.avatar)}
                      alt="User"
                      className="w-full h-full object-cover"
                      onError={(e) => { 
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        target.parentElement!.innerHTML = `<span class="text-2xl font-black">${(selectedSession.user_name || 'U').charAt(0).toUpperCase()}</span>`;
                      }}
                    />
                  ) : (
                    <span className="text-2xl font-black">{selectedSession.user_name ? selectedSession.user_name.charAt(0).toUpperCase() : 'U'}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight">{selectedSession.user_name || "Client Consultation"}</h3>
                  <div className="flex items-center gap-2 text-white/90 mt-1 font-bold text-sm">
                    <LucideIcons.Calendar size={14} className="opacity-70" />
                    {new Date(selectedSession.startTime || selectedSession.createdAt || selectedSession.created_at).toLocaleDateString('en-IN', {
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
                className="group bg-white/10 hover:bg-white/20 hover:shadow-lg text-white w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 active:scale-90 relative z-10"
                aria-label="Close modal"
              >
                <LucideIcons.X size={24} className="transition-transform duration-200 ease-in-out group-hover:rotate-90 group-active:rotate-[360deg]" />
              </button>
            </div>

            {/* Messages Area / Call Summary Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-[#fffbf9] space-y-6 custom-scrollbar-orange">
              {loadingChat ? (
                <div className="flex flex-col justify-center items-center h-64 gap-4">
                  <Loading size="lg" text="Loading Details..." />
                </div>
              ) : (selectedSession.type || selectedSession.session_type || "").toLowerCase().includes("chat") ? (
                /* Chat Messages View (Preserved but styled) */
                (chatMessages?.length || 0) === 0 ? (
                  <div className="text-center py-20">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100 shadow-inner">
                      <LucideIcons.MessageSquare size={40} className="text-gray-200" />
                    </div>
                    <p className="font-bold text-gray-400">No messages found in this session</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {chatMessages.map((msg: any, idx: number) => {
                      const content = msg.content || "";
                      const sType = (msg.senderType || msg.sender_type || "").toLowerCase();
                      const isAdmin = sType === 'admin' || sType === 'system';
                      
                      if (isAdmin) {
                          const isEnded = content.toLowerCase().includes('end') || content.toLowerCase().includes('finish') || content.toLowerCase().includes('close') || content.toLowerCase().includes('system');
                          const bgColor = isEnded ? 'bg-red-50' : 'bg-gray-50';
                          const borderColor = isEnded ? 'border-red-200' : 'border-gray-200';
                          const textColor = isEnded ? 'text-red-600' : 'text-gray-600';
                          
                          return (
                              <div key={idx} className="my-4 w-full flex justify-center">
                                  <div className="flex flex-col items-start" style={{ maxWidth: "85%" }}>
                                      <div className={`${bgColor} border ${borderColor} rounded-2xl px-6 py-4 shadow-sm text-center`} style={{ minWidth: "260px" }}>
                                          <div className={`flex items-center justify-center gap-1.5 mb-1.5 ${textColor}`}>
                                              <LucideIcons.AlertCircle className="w-3.5 h-3.5" />
                                              <span className="text-[11px] font-black uppercase tracking-widest">System Message</span>
                                          </div>
                                          <div className={`${textColor} text-[15px] font-medium`}>
                                              {content}
                                          </div>
                                      </div>
                                      <div className="mt-1.5 ml-1">
                                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                              {msg.createdAt || msg.created_at
                                                  ? new Date(msg.createdAt || msg.created_at).toLocaleTimeString('en-US', {
                                                      hour: '2-digit',
                                                      minute: '2-digit'
                                                  })
                                                  : ''
                                              }
                                          </span>
                                      </div>
                                  </div>
                              </div>
                          );
                      }

                      const isExpert = sType === 'expert' || sType === 'agent';
                      const isUserSide = !isExpert;

                      return (
                        <div key={idx} className={`flex w-full mb-2 ${isExpert ? 'justify-end' : 'justify-start'}`}>
                          <div className={`flex gap-3 max-w-[85%] ${isExpert ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`w-8 h-8 rounded-full border overflow-hidden shadow-sm flex-shrink-0 flex items-center justify-center text-xs font-bold ${isExpert ? 'border-[#fd6410]/20 bg-orange-100 text-[#fd6410]' : 'border-gray-200 bg-gray-100 text-gray-500'}`}>
                              {((isExpert && selectedSession.expert_image && selectedSession.expert_image !== '/images/dummy-astrologer.jpg' && selectedSession.expert_image !== '/images/dummy-expert.jpg') || 
                                (isExpert && (selectedSession?.expert?.profile_image || selectedSession?.expert?.avatar)) || 
                                (!isExpert && selectedSession.user_image && selectedSession.user_image !== '/images/dummy-user.jpg') ||
                                (!isExpert && (selectedSession?.user?.profile_picture || selectedSession?.user?.avatar))) ? (
                                <img
                                  src={isExpert ? (selectedSession.expert_image === '/images/dummy-astrologer.jpg' || selectedSession.expert_image === '/images/dummy-expert.jpg' ? null : selectedSession.expert_image || selectedSession?.expert?.profile_image) : (selectedSession.user_image === '/images/dummy-user.jpg' ? null : selectedSession.user_image || selectedSession?.user?.profile_picture || selectedSession?.user?.avatar)}
                                  alt="Avatar"
                                  className="w-full h-full object-cover"
                                  onError={(e) => { 
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    target.parentElement!.innerHTML = `<span>${isExpert ? (selectedSession.expert_name?.charAt(0) || 'E') : (selectedSession.user_name?.charAt(0) || 'U')}</span>`;
                                  }}
                                />
                              ) : (
                                <span>{isExpert ? (selectedSession.expert_name?.charAt(0) || 'E') : (selectedSession.user_name?.charAt(0) || 'U')}</span>
                              )}
                            </div>
                            <div className={`flex flex-col ${isExpert ? 'items-end' : 'items-start'}`}>
                                <div className={`p-4 shadow-sm relative ${isExpert
                                ? 'bg-[#fd6410] text-white rounded-[1.2rem] rounded-tr-none'
                                : (content.startsWith('[INTRO_CARD]') ? 'p-0 bg-transparent border-none'
                                  : 'bg-white text-dark border border-gray-100 rounded-[1.2rem] rounded-tl-none')
                                }`}>
                                {content.startsWith('[INTRO_CARD]') ? (
                                  <div className="bg-gradient-to-br from-[#FFD700] via-[#FFEA00] to-[#FFD700] p-1 rounded-2xl shadow-xl border-2 border-white/50 w-full min-w-[280px]">
                                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                                      <div className="flex items-center gap-3 mb-4 border-b border-black/5 pb-3">
                                        <div className="w-8 h-8 bg-black/10 rounded-full flex items-center justify-center">
                                          <User className="w-4 h-4 text-black" />
                                        </div>
                                        <div>
                                          <h3 className="text-black font-black text-[10px] uppercase tracking-widest">Birth Details</h3>
                                          <p className="text-black opacity-60 text-[8px] uppercase font-bold tracking-tighter">Shared Profile Info</p>
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-3">
                                        {(() => {
                                          try {
                                            const data = JSON.parse(content.replace('[INTRO_CARD]', ''));
                                            return (
                                              <>
                                                <div className="space-y-0.5">
                                                  <span className="text-[8px] font-black text-black/40 uppercase tracking-widest">Name</span>
                                                  <p className="text-xs font-black text-black truncate">{data.name || "N/A"}</p>
                                                </div>
                                                <div className="space-y-0.5">
                                                  <span className="text-[8px] font-black text-black/40 uppercase tracking-widest">Gender</span>
                                                  <p className="text-xs font-black text-black capitalize">{data.gender || "N/A"}</p>
                                                </div>
                                                <div className="space-y-0.5">
                                                  <span className="text-[8px] font-black text-black/40 uppercase tracking-widest">DOB</span>
                                                  <p className="text-xs font-black text-black">
                                                    {data.dob && data.dob !== "N/A" ? (
                                                      !isNaN(new Date(data.dob).getTime()) 
                                                      ? new Date(data.dob).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) 
                                                      : data.dob
                                                    ) : "N/A"}
                                                  </p>
                                                </div>
                                                <div className="space-y-0.5">
                                                  <span className="text-[8px] font-black text-black/40 uppercase tracking-widest">TOB</span>
                                                  <p className="text-xs font-black text-black">{data.tob || "N/A"}</p>
                                                </div>
                                                <div className="col-span-2 space-y-0.5">
                                                  <span className="text-[8px] font-black text-black/40 uppercase tracking-widest">POB</span>
                                                  <div className="flex items-center gap-1.5">
                                                    <MapPin className="w-2.5 h-2.5 text-black/40" />
                                                    <p className="text-xs font-black text-black truncate">{data.pob || "N/A"}</p>
                                                  </div>
                                                </div>
                                              </>
                                            );
                                          } catch (e) {
                                            return <p className="text-red-500 text-[10px]">Invalid Card Data</p>;
                                          }
                                        })()}
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <p className="text-[14px] leading-relaxed whitespace-pre-wrap m-0 font-medium">{content}</p>
                                  </>
                                )}
                              </div>
                              <span className="text-[8px] mt-1.5 px-1 text-gray-400 font-black uppercase tracking-widest">
                                {new Date(msg.created_at || msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              ) : (
                /* Call Summary View - PREMIUM OVERHAUL */
                <div className="flex flex-col items-center justify-center px-2 py-4 animate-in fade-in zoom-in-95 duration-500">
                  <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-orange-100/50 border-4 border-white">
                    <LucideIcons.CheckCircle2 className="w-10 h-10 text-[#fd6410]" />
                  </div>
                  
                  <h4 className="text-2xl font-black text-gray-900 mb-2 uppercase tracking-tight">
                    Session Summary
                  </h4>
                  <p className="text-gray-500 mb-8 max-w-xs mx-auto text-xs font-bold uppercase tracking-widest opacity-60">
                    Record ID: #{selectedSession.id}
                  </p>

                  {/* Premium Earning Grid */}
                  <div className="w-full grid grid-cols-2 gap-4 mb-6">
                    <div className="p-5 bg-white rounded-[2rem] border border-gray-100 shadow-sm transition-all hover:border-orange-100 group">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Client Paid</p>
                      <p className="text-xl font-black text-gray-900 tracking-tight">₹{Number(selectedSession.totalCost || 0).toFixed(2)}</p>
                    </div>
                    <div className="p-5 bg-orange-50/50 rounded-[2rem] border border-orange-100/30 shadow-sm">
                      <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest mb-2">Platform Fee</p>
                      <p className="text-xl font-black text-[#fd6410] tracking-tight">₹{Number(selectedSession.platformFee || 0).toFixed(2)}</p>
                    </div>
                  </div>

                  {/* Net Earning Box */}
                  <div className="w-full p-8 bg-green-50/50 rounded-[2.5rem] border-2 border-green-100 relative overflow-hidden group mb-8">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-green-100/30 rounded-full -mr-10 -mt-10 blur-xl" />
                    <div className="relative z-10 text-center">
                      <p className="text-[10px] font-black text-green-600 uppercase tracking-[0.25em] mb-2">Your Net Earning</p>
                      <p className="text-5xl font-black text-green-700 tracking-tighter mb-4">₹{Number(selectedSession.expertShare || 0).toFixed(2)}</p>
                      
                      <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-green-100/50 mt-2">
                        <div className="flex items-center gap-1.5">
                          <LucideIcons.Clock size={12} className="text-green-600/50" />
                          <span className="text-[10px] font-black text-green-900/40 uppercase tracking-widest">{selectedSession.durationString || "0s"}</span>
                        </div>
                        <div className="w-1 h-1 bg-green-200 rounded-full" />
                        <div className="flex items-center gap-1.5">
                          <LucideIcons.Zap size={12} className="text-green-600/50" />
                          <span className="text-[10px] font-black text-green-900/40 uppercase tracking-widest">₹{selectedSession.rate || 0}/min</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Termination Info Bar */}
                  {selectedSession.terminatedBy && (
                    <div className="w-full flex items-center justify-center gap-3 py-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <LucideIcons.Power size={14} className="text-gray-400" />
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        Session Ended By: <span className="text-gray-900 ml-1">{selectedSession.terminatedBy === 'EXPERT' ? 'Expert (You)' : 'Client (User)'}</span>
                      </span>
                    </div>
                  )}

                  {selectedSession.metadata?.recordingUrl && (
                    <div className="w-full mt-6 p-4 bg-blue-50/30 rounded-[2rem] border border-blue-100/50">
                      <label className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest mb-3">
                        <LucideIcons.PlayCircle size={14} />
                        Session Recording
                      </label>
                      <audio controls className="w-full h-10 accent-[#fd6410]">
                        <source src={selectedSession.metadata.recordingUrl} type="audio/mpeg" />
                      </audio>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer - Simplified Refined */}
            <div className="p-6 bg-white border-t border-gray-100 flex justify-between items-center sm:flex-row flex-col gap-4">
              <div className="flex gap-3 items-center">
                <div className="bg-gray-50 px-4 py-2.5 rounded-2xl border border-gray-100 flex flex-col min-w-[120px]">
                  <span className="text-[8px] text-gray-400 uppercase font-black tracking-[0.2em] mb-0.5">Consultation Type</span>
                  <span className="font-black text-gray-800 flex items-center gap-1.5 text-[10px] uppercase">
                    {(selectedSession.type || "").toLowerCase().includes('video') ? <LucideIcons.Video size={10} /> : <LucideIcons.Phone size={10} />}
                    {selectedSession.type || "N/A"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowChatModal(false)}
                  className="bg-neutral-900 hover:bg-black text-white px-10 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-neutral-950/20 active:scale-95 flex items-center gap-2"
                >
                  Close Records
                  <LucideIcons.ArrowRight size={14} />
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

