import React from "react";
import { Calendar, Clock, MessageSquare, Star, User, ShoppingBag, ShieldCheck, CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { RefundStatusBadge } from "./RefundStatusBadge";
import type { RefundRequest } from "./types";

interface RefundCardProps {
  refund: RefundRequest;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onPending: (id: string) => void;
  onViewDetails: (refund: RefundRequest) => void;
}

export function RefundCard({
  refund,
  onApprove,
  onReject,
  onPending,
  onViewDetails,
}: RefundCardProps) {
  const isConsultation = refund.consultation.realType === "consultation";
  const isOrder = refund.consultation.realType === "order";
  const isPuja = refund.consultation.realType === "puja";

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:6543";
  const userAvatar = refund.user.avatar?.startsWith('http') ? refund.user.avatar : `${baseUrl}${refund.user.avatar || ''}`;
  const expertAvatar = refund.expert.avatar?.startsWith('http') ? refund.expert.avatar : `${baseUrl}${refund.expert.avatar || ''}`;

  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 p-4 sm:p-6 flex flex-col xl:flex-row gap-4 sm:gap-8 shadow-sm hover:shadow-xl transition-all duration-300 group">
      
      {/* Left: Content Area */}
      <div className="flex-1 flex gap-5">
        {/* Dual Avatars (User & expert) */}
        <div className="relative flex h-fit">
          {/* User Large Avatar */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 flex-shrink-0 z-10">
            <img 
              src={userAvatar} 
              alt={refund.user.name}
              onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${refund.user.name}`}}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Expert Secondary Avatar */}
          <div className="w-12 h-12 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-50 flex-shrink-0 -ml-8 mt-8 z-20">
            <img 
              src={expertAvatar} 
              alt={refund.expert.name}
              onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${refund.expert.name}`}}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex-1">
          {/* Main Info */}
          <div className="flex flex-wrap items-center gap-x-2 text-sm sm:text-base mb-2">
            <span className="font-bold text-gray-900">{refund.user.name}</span>
            <span className="text-gray-400">reported an issue with</span>
            <span className="font-bold text-orange-600 underline decoration-orange-200 underline-offset-4">{refund.consultation.type}</span>
            <span className="text-xs font-medium text-gray-400">({refund.expert.name})</span>
          </div>

          {/* Rating Stars (Aesthetic Only) */}
          <div className="flex gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-4 h-4 fill-orange-400 text-orange-400" />
            ))}
          </div>

          {/* Reason Description */}
          <div className="bg-gray-50/50 rounded-2xl p-4 mb-5 border border-gray-100/50">
            <p className="text-gray-700 text-sm leading-relaxed italic">
              "{refund.reason}"
            </p>
          </div>

          {/* Footnotes / Meta */}
          <div className="flex flex-wrap items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-semibold text-gray-600">
                <Calendar className="w-3.5 h-3.5" />
                {refund.requestedAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
             </div>
             
             <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold ring-1 ring-indigo-200">
                {isConsultation && <MessageSquare className="w-3.5 h-3.5" />}
                {isOrder && <ShoppingBag className="w-3.5 h-3.5" />}
                {isPuja && <Star className="w-3.5 h-3.5" />}
                #{refund.consultation.id}
             </div>

             <RefundStatusBadge status={refund.status} />
          </div>
        </div>
      </div>

      {/* Right: Management Center */}
      <div className="w-full xl:w-72 bg-gray-50/80 rounded-[1.5rem] p-4 sm:p-5 flex flex-col border border-gray-200/50">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
          <ShieldCheck className="w-3 h-3" />
          Management Center
        </h4>

        <div className="flex-1 grid grid-cols-2 gap-3 min-h-[120px]">
           <button 
             disabled={refund.status === 'pending'}
             onClick={() => onPending(refund.id)}
             className={`p-3 rounded-xl flex flex-col items-center justify-center gap-2 transition-all border-2 border-transparent ${
               refund.status === 'pending' ? 'bg-amber-100 text-amber-700 border-amber-200 shadow-inner' : 'bg-white hover:bg-amber-50 text-gray-400 hover:text-gray-600 shadow-sm'
             }`}
           >
              <Clock className={`w-5 h-5 ${refund.status === 'pending' ? 'text-amber-500' : 'text-gray-300'}`} />
              <span className="text-[10px] font-bold uppercase">Pending</span>
           </button>

           <button 
             disabled={refund.status === 'approved'}
             onClick={() => onApprove(refund.id)}
             className={`p-3 rounded-xl flex flex-col items-center justify-center gap-2 transition-all border-2 border-transparent ${
               refund.status === 'approved' ? 'bg-emerald-100 text-emerald-700 border-emerald-200 shadow-inner' : 'bg-white hover:bg-emerald-50 text-gray-400 hover:text-gray-600 shadow-sm'
             }`}
           >
              <CheckCircle className={`w-5 h-5 ${refund.status === 'approved' ? 'text-emerald-500' : 'text-gray-300'}`} />
              <span className="text-[10px] font-bold uppercase">Approve</span>
           </button>

           <button 
             disabled={refund.status === 'rejected'}
             onClick={() => onReject(refund.id)}
             className={`p-3 rounded-xl flex flex-col items-center justify-center gap-2 transition-all border-2 border-transparent ${
               refund.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-200 shadow-inner' : 'bg-white hover:bg-red-50 text-gray-400 hover:text-gray-600 shadow-sm'
             }`}
           >
              <XCircle className={`w-5 h-5 ${refund.status === 'rejected' ? 'text-red-500' : 'text-gray-300'}`} />
              <span className="text-[10px] font-bold uppercase">Reject</span>
           </button>

           <button 
             onClick={() => onViewDetails(refund)}
             className="p-3 bg-indigo-600 text-white rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95"
           >
              <ArrowRight className="w-5 h-5" />
              <span className="text-[10px] font-bold uppercase">View Chat</span>
           </button>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200/50 flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Service Price:</span>
            <span className="text-sm font-black text-gray-900 tracking-tighter">₹{(refund.consultation.amount || 0).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}




