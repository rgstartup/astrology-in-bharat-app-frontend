import React from "react";
import {
    Clock as LucideClock,
    Video as LucideVideo,
    RefreshCw as LucideRefreshCw,
    XCircle as LucideXCircle,
    MessageSquare as LucideMessageSquare,
    Star as LucideStar,
    Check,
    Ban,
    Pause,
} from "lucide-react";
import { format } from "date-fns";
import { Appointment } from "./types";
import Button from "../ui/Button";
import { api } from "@/lib/api";
import { toast } from "react-toastify";
import { getErrorMessage } from "@repo/lib/utils/error";
import { Loading } from "@repo/ui";

const Clock = LucideClock as any;
const Video = LucideVideo as any;
const RefreshCw = LucideRefreshCw as any;
const XCircle = LucideXCircle as any;
const MessageSquare = LucideMessageSquare as any;
const Star = LucideStar as any;

interface AppointmentListProps {
    appointments: Appointment[];
    onReschedule: (appt: Appointment) => void;
    onUpdate?: (id?: string, status?: string) => void;
}

// Countdown Timer Component
function CountdownTimer({ expiresAt }: { expiresAt: string }) {
    const [timeLeft, setTimeLeft] = React.useState<string>("");

    React.useEffect(() => {
        const calculateTime = () => {
            const difference = +new Date(expiresAt) - +new Date();
            if (difference > 0) {
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);
                setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
            } else {
                setTimeLeft("Expired");
            }
        };

        calculateTime();
        const timer = setInterval(calculateTime, 1000);
        return () => clearInterval(timer);
    }, [expiresAt]);

    if (timeLeft === "Expired") return <span className="text-red-500 font-bold ml-2">Timed Out!</span>;
    if (!timeLeft) return null;

    return (
        <span className="text-red-600 font-bold ml-2 animate-pulse bg-red-50 px-2 py-0.5 rounded border border-red-100 flex items-center gap-1 shadow-sm">
            <Clock className="w-3 h-3" /> Expires in {timeLeft}
        </span>
    );
}

// Puja Actions Component
function PujaActions({ appt, onUpdate }: { appt: Appointment, onUpdate?: () => void }) {
    const [isUpdating, setIsUpdating] = React.useState(false);
    const [showDateForm, setShowDateForm] = React.useState(false);
    const [newDate, setNewDate] = React.useState("");
    const [newTime, setNewTime] = React.useState("");
    const [message, setMessage] = React.useState("");

    const updateStatus = async (status: string, extra: any = {}) => {
        setIsUpdating(true);
        const [res, error] = await api.patch(`/puja-appointments/${appt.id}/status`, {
            status,
            expert_message: message || undefined,
            ...extra
        });

        if (error) {
            toast.error(getErrorMessage(error) || "Failed to update status");
        } else {
            toast.success(`Puja request ${status} successfully`);
            if (onUpdate) onUpdate(appt.id, status);
        }
        setIsUpdating(false);
        setShowDateForm(false);
    };

    if (appt.status === 'accepted') return <span className="text-emerald-600 font-bold px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2 shadow-sm animate-in fade-in transition-all"><Check className="w-4 h-4"/> It is accepted</span>;
    if (appt.status === 'confirmed') return <span className="text-orange-600 font-bold px-4 py-2 bg-orange-50 rounded-xl border border-orange-100 flex items-center gap-2 shadow-sm"><Star className="w-4 h-4 fill-orange-600"/> Confirmed & Paid</span>;
    if (appt.status === 'rejected') return <span className="text-red-400 font-bold px-4 py-2 bg-red-50 rounded-xl border border-red-100 flex items-center gap-2 shadow-sm animate-in fade-in transition-all"><Ban className="w-4 h-4"/> You rejected this</span>;
    if (appt.status === 'on_hold') return (
        <div className="flex flex-col items-center gap-2 bg-orange-50/50 p-3 rounded-2xl border border-orange-100 group shadow-sm transition-all hover:shadow-md animate-in fade-in transition-all">
            <span className="text-orange-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" /> Rescheduled
            </span>
            <p className="text-[9px] text-orange-400 font-medium max-w-[140px] text-center leading-tight">Waiting for user to accept proposed reschedule</p>
            <div className="flex gap-2 w-full mt-1">
                <Button size="sm" variant="secondary" className="flex-1 text-[10px] h-8" onClick={() => setShowDateForm(true)}>Modify</Button>
                <Button size="sm" className="flex-1 text-[10px] h-8" onClick={() => updateStatus('accepted')}>Force Accept</Button>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col gap-3">
            {showDateForm ? (
                <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 space-y-3 w-full sm:w-64 shadow-xl">
                    <p className="text-[10px] font-black text-orange-800 uppercase tracking-widest flex items-center gap-2">
                        <LucideRefreshCw className="w-3.5 h-3.5" />
                        Reschedule Ritual
                    </p>
                    <div className="space-y-1">
                        <label className="text-[9px] font-bold text-orange-400 uppercase ml-1">Proposed Date</label>
                        <input 
                            type="date" 
                            value={newDate} 
                            onChange={(e) => setNewDate(e.target.value)}
                            className="w-full text-xs p-2 border rounded-lg focus:ring-2 focus:ring-orange-200 outline-none"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-bold text-orange-400 uppercase ml-1">Proposed Time</label>
                        <input 
                            type="time" 
                            value={newTime} 
                            onChange={(e) => setNewTime(e.target.value)}
                            className="w-full text-xs p-2 border rounded-lg focus:ring-2 focus:ring-orange-200 outline-none"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[9px] font-bold text-orange-400 uppercase ml-1">Note to User</label>
                        <textarea 
                            placeholder="Why are you rescheduling? (e.g. Busy on original date)" 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full text-[11px] p-2 border rounded-lg h-20 focus:ring-2 focus:ring-orange-200 outline-none resize-none"
                        />
                    </div>
                    <div className="flex gap-2 pt-1">
                        <Button 
                            size="md" 
                            className="flex-1 bg-orange-600 hover:bg-orange-700" 
                            onClick={() => updateStatus(appt.askExpertForDate ? 'accepted' : 'on_hold', { scheduled_date: newDate, scheduled_time: newTime })}
                        >
                            {appt.askExpertForDate ? 'Send & Accept' : 'Propose'}
                        </Button>
                        <Button size="md" variant="secondary" className="flex-1" onClick={() => setShowDateForm(false)}>Back</Button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-wrap lg:flex-nowrap gap-2">
                    <Button 
                        size="md" 
                        className="bg-emerald-600 hover:bg-emerald-700 h-11 flex-1 lg:flex-none lg:px-6"
                        leftIcon={<Check className="w-4 h-4" />}
                        disabled={isUpdating}
                        onClick={() => {
                            if (appt.askExpertForDate) setShowDateForm(true);
                            else updateStatus('accepted');
                        }}
                    >
                        Accept
                    </Button>
                    <Button 
                        size="md" 
                        variant="secondary"
                        className="text-orange-600 border-orange-200 h-11 flex-1 lg:flex-none lg:px-6"
                        leftIcon={<LucideRefreshCw className="w-4 h-4" />}
                        disabled={isUpdating}
                        onClick={() => setShowDateForm(true)}
                    >
                        Reschedule
                    </Button>
                    <Button 
                        size="md" 
                        className="bg-red-500 hover:bg-red-600 h-11 flex-1 lg:flex-none lg:px-6"
                        leftIcon={<Ban className="w-4 h-4" />}
                        disabled={isUpdating}
                        onClick={() => updateStatus('rejected')}
                    >
                        Reject
                    </Button>
                </div>
            )}
            {isUpdating && <Loading fullScreen />}
        </div>
    );
}

// Standard Actions Component for Chat/Call
function StandardActions({ appt, onUpdate, onReschedule }: { appt: Appointment, onUpdate?: () => void, onReschedule: (appt: Appointment) => void }) {
    const [isUpdating, setIsUpdating] = React.useState(false);

    const updateStatus = async (status: string) => {
        setIsUpdating(true);
        // Map UI actions to chat/call endpoints if necessary, 
        // but for now we follow the user requirement by using common status updates if possible
        // Standard sessions usually handle status via specialized endpoints
        const endpoint = appt.service.includes("Chat") ? `/chat/session/${appt.id}/status` : `/call/session/${appt.id}/status`;
        
        const [res, error] = await api.patch(endpoint, {
            status
        });

        if (error) {
            toast.error(getErrorMessage(error) || "Failed to update status");
        } else {
            toast.success(`Request ${status} successfully`);
            if (onUpdate) onUpdate(appt.id, status);
        }
        setIsUpdating(false);
    };

    if (appt.status === 'accepted') return <span className="text-emerald-600 font-bold px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2 shadow-sm animate-in fade-in transition-all"><Check className="w-4 h-4"/> It is accepted</span>;
    if (appt.status === 'rejected' || appt.status === 'cancelled') return <span className="text-red-400 font-bold px-4 py-2 bg-red-50 rounded-xl border border-red-100 flex items-center gap-2 shadow-sm animate-in fade-in transition-all"><Ban className="w-4 h-4"/> You rejected this</span>;
    if (appt.status === 'on_hold') return <span className="text-orange-600 font-bold px-4 py-2 bg-orange-50 rounded-xl border border-orange-100 flex items-center gap-2 shadow-sm animate-in fade-in transition-all"><RefreshCw className="w-4 h-4 animate-spin-slow"/> Rescheduled</span>;

    return (
        <div className="flex flex-wrap lg:flex-nowrap gap-2">
            {appt.status !== 'completed' && appt.status !== 'expired' && appt.status !== 'active' && (
                <>
                    <Button 
                        size="md" 
                        className="bg-emerald-600 hover:bg-emerald-700 h-11 flex-1 lg:flex-none lg:px-6"
                        leftIcon={<Check className="w-4 h-4" />}
                        disabled={isUpdating}
                        onClick={() => updateStatus('accepted')}
                    >
                        Accept
                    </Button>
                    <Button 
                        size="md" 
                        variant="secondary"
                        className="text-orange-600 border-orange-200 h-11 flex-1 lg:flex-none lg:px-6"
                        leftIcon={<LucideRefreshCw className="w-4 h-4" />}
                        disabled={isUpdating}
                        onClick={() => onReschedule(appt)}
                    >
                        Reschedule
                    </Button>
                    <Button 
                        size="md" 
                        className="bg-red-500 hover:bg-red-600 h-11 flex-1 lg:flex-none lg:px-6"
                        leftIcon={<Ban className="w-4 h-4" />}
                        disabled={isUpdating}
                        onClick={() => updateStatus('rejected')}
                    >
                        Reject
                    </Button>
                </>
            )}
            {appt.status === 'active' && (
                <a
                    href={appt.meetingLink}
                    className="px-5 py-3 text-sm bg-orange-600 text-white rounded-xl flex items-center justify-center gap-2 font-semibold hover:bg-orange-700 shadow-sm transition-all w-full"
                >
                    {appt.service.includes("Chat") ? (
                        <>
                            <MessageSquare className="w-5 h-5" /> Re-join Chat
                        </>
                    ) : (
                        <>
                            <Video className="w-5 h-5" /> Join Meeting
                        </>
                    )}
                </a>
            )}
            {/* If pending but it's a join link case */}
            {appt.status === 'pending' && !appt.pujaId && (
                <a
                    href={appt.meetingLink}
                    className="px-5 py-3 text-sm bg-emerald-600 text-white rounded-xl flex items-center justify-center gap-2 font-semibold hover:bg-emerald-700 shadow-sm transition-all w-full mt-2"
                    onClick={() => updateStatus('accepted')}
                >
                    <Video className="w-5 h-5" /> Join & Accept
                </a>
            )}
            {isUpdating && <Loading fullScreen />}
        </div>
    );
}

export default function AppointmentList({
    appointments,
    onReschedule,
    onUpdate,
}: AppointmentListProps) {
    const cn = (...classes: (string | undefined | null | boolean)[]) =>
        classes.filter(Boolean).join(" ");

    if (appointments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center mb-4">
                    <Clock className="w-9 h-9 text-orange-300" />
                </div>
                <p className="text-gray-400 text-sm font-medium">No appointments found</p>
            </div>
        );
    }

    const getStatusStyle = (status: string, terminatedBy?: string) => {
        if (terminatedBy === 'admin') return { label: 'Terminated', bg: 'bg-red-100', text: 'text-red-600', dot: 'bg-red-500' };
        const map: Record<string, any> = {
            pending:   { label: 'Waiting',   bg: 'bg-amber-100',   text: 'text-amber-700',  dot: 'bg-amber-500' },
            active:    { label: 'Live Now', bg: 'bg-green-100',  text: 'text-green-700',  dot: 'bg-green-500 animate-pulse' },
            completed: { label: 'Completed', bg: 'bg-blue-50',     text: 'text-blue-600',   dot: 'bg-blue-400' },
            expired:   { label: 'Expired',   bg: 'bg-gray-100',    text: 'text-gray-500',   dot: 'bg-gray-400' },
            cancelled: { label: 'Cancelled', bg: 'bg-red-50',      text: 'text-red-500',    dot: 'bg-red-400' },
            rejected:  { label: 'Rejected',  bg: 'bg-red-50',      text: 'text-red-400',    dot: 'bg-red-300' },
            accepted:  { label: 'Accepted',  bg: 'bg-emerald-100', text: 'text-emerald-700',dot: 'bg-emerald-500' },
            confirmed: { label: 'Confirmed', bg: 'bg-green-100',   text: 'text-green-700',  dot: 'bg-green-500' },
            on_hold:   { label: 'On Hold',   bg: 'bg-purple-100',  text: 'text-purple-600', dot: 'bg-purple-500' },
        };
        return map[status] || { label: status, bg: 'bg-gray-100', text: 'text-gray-500', dot: 'bg-gray-400' };
    };

    const getServiceIcon = (service: string) => {
        if (service.toLowerCase().includes('chat')) return <MessageSquare className="w-4 h-4" />;
        if (service.toLowerCase().includes('video')) return <Video className="w-4 h-4" />;
        if (service.toLowerCase().includes('voice') || service.toLowerCase().includes('call')) return <RefreshCw className="w-4 h-4" />;
        return <Star className="w-4 h-4" />;
    };

    return (
        <section className="space-y-4">
            {/* Desktop Table View (Hidden on mobile) */}
            <div className="hidden lg:block bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 text-gray-900 text-xs font-bold">
                            <th className="px-6 py-4 font-bold border-b border-gray-100">Client</th>
                            <th className="px-6 py-4 font-bold border-b border-gray-100">Service Details</th>
                            <th className="px-6 py-4 font-bold border-b border-gray-100 text-right">Status & Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {appointments.map((appt) => {
                            const st = getStatusStyle(appt.status, appt.terminatedBy);
                            const isPending = appt.status === 'pending';
                            const isActive = appt.status === 'active';
                            const isCompleted = appt.status === 'completed';

                            return (
                                <tr key={appt.id} className="hover:bg-gray-50/50 transition-colors group">
                                    {/* Client Column */}
                                    <td className="px-6 py-5 align-top">
                                        <div className="flex items-center gap-4">
                                            <div className="relative shrink-0">
                                                <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-sm ring-1 ring-gray-900/5">
                                                    {appt.avatar ? (
                                                        <img src={appt.avatar} alt={appt.name} className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as any).src = "/images/dummy-expert.jpg"; }} />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-[#fd6410] to-orange-400 flex items-center justify-center text-white font-bold text-lg">
                                                            {appt.name.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-bold text-gray-900 text-base">{appt.name}</p>
                                                    {appt.type === "new" && (
                                                        <span className="bg-blue-100 text-blue-700 text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full">New</span>
                                                    )}
                                                </div>
                                                {appt.isFree && (
                                                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                                                        ?? Free ({appt.freeMinutes}m)
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Service Details Column */}
                                    <td className="px-6 py-5 align-top">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="flex items-center gap-2 text-[#fd6410] font-semibold text-sm">
                                                {getServiceIcon(appt.service)}
                                                {appt.service}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-gray-700 text-xs">
                                                <Clock className="w-3.5 h-3.5 opacity-70" />
                                                {format(new Date(appt.date), "dd MMM yyyy, hh:mm a")}
                                            </div>
                                            
                                            {/* Extra details (Puja / Messages) */}
                                            {appt.pujaId && (
                                                <div className="flex gap-2 mt-2">
                                                    <span className="text-[10px] font-semibold text-orange-700 bg-orange-50 border border-orange-100 px-2 py-1 rounded-md flex items-center gap-1">
                                                        <LucideVideo className="w-3 h-3" />
                                                        {appt.pujaMode === 'online' ? 'Online Ritual' : 'Home Visit'}
                                                    </span>
                                                    {appt.price && (
                                                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-md">
                                                            ?{appt.price}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                            {appt.userMessage && (
                                                <div className="mt-2 text-xs text-gray-500 italic border-l-2 border-orange-200 pl-2">
                                                    "{appt.userMessage}"
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    {/* Status & Actions Column */}
                                    <td className="px-6 py-5 align-top text-right">
                                        <div className="flex flex-col items-end gap-3">
                                            {/* Status Badge */}
                                            <div className="flex items-center justify-end gap-3">
                                                {isPending && appt.expiresAt && (
                                                    <div className="scale-90 origin-right"><CountdownTimer expiresAt={appt.expiresAt} /></div>
                                                )}
                                                <span className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold", st.bg, st.text)}>
                                                    <span className={cn("w-1.5 h-1.5 rounded-full", st.dot)} />
                                                    {st.label}
                                                </span>
                                            </div>

                                            {/* Duration & Rating (If Completed) */}
                                            {isCompleted && (
                                                <div className="flex items-center gap-3">
                                                    {appt.durationMins !== undefined && appt.durationMins > 0 && (
                                                        <span className="flex items-center gap-1 text-gray-600 font-semibold text-xs bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                                                            <Clock className="w-3 h-3" />
                                                            {appt.durationMins} min
                                                        </span>
                                                    )}
                                                    {appt.review && appt.review.rating > 0 && (
                                                        <span className="flex items-center gap-1 text-xs font-bold text-yellow-700 bg-yellow-50 border border-yellow-100 px-2 py-1 rounded-lg">
                                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                            {appt.review.rating}/5
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {/* Actions */}
                                            {!(isCompleted || appt.status === 'expired' || appt.status === 'cancelled' || appt.status === 'rejected') && (
                                                <div className="mt-1">
                                                    {appt.pujaId ? (
                                                        <PujaActions appt={appt} onUpdate={onUpdate} />
                                                    ) : (
                                                        <StandardActions appt={appt} onUpdate={onUpdate} onReschedule={onReschedule} />
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Mobile Stacked View (Visible only on mobile/tablet) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
                {appointments.map((appt) => {
                    const st = getStatusStyle(appt.status, appt.terminatedBy);
                    const isPending = appt.status === 'pending';
                    const isActive = appt.status === 'active';
                    const isCompleted = appt.status === 'completed';

                    return (
                        <div key={appt.id} className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 flex flex-col gap-4 relative overflow-hidden">
                            {/* Accent Line */}
                            <div className={cn("absolute top-0 left-0 right-0 h-1", st.dot.replace(' rounded-full', '').replace(' animate-pulse', ''))} />
                            
                            {/* Header: Avatar & Name */}
                            <div className="flex justify-between items-start pt-1">
                                <div className="flex gap-3 items-center">
                                    <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-sm">
                                        {appt.avatar ? (
                                            <img src={appt.avatar} alt={appt.name} className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as any).src = "/images/dummy-expert.jpg"; }} />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-[#fd6410] to-orange-400 flex items-center justify-center text-white font-bold text-lg">
                                                {appt.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">{appt.name}</h3>
                                        <span className={cn("inline-flex items-center gap-1 mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold", st.bg, st.text)}>
                                            <span className={cn("w-1.5 h-1.5 rounded-full", st.dot)} />
                                            {st.label}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="bg-gray-50 rounded-2xl p-4 flex flex-col gap-2">
                                <div className="flex items-center gap-2 text-[#fd6410] font-bold text-sm">
                                    {getServiceIcon(appt.service)}
                                    {appt.service}
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1.5 text-gray-500 text-xs font-medium">
                                        <Clock className="w-3.5 h-3.5 opacity-70" />
                                        {format(new Date(appt.date), "dd MMM, hh:mm a")}
                                    </span>
                                    {isCompleted && appt.durationMins !== undefined && appt.durationMins > 0 && (
                                        <span className="font-bold text-gray-700 text-xs">{appt.durationMins} min</span>
                                    )}
                                </div>
                                {isPending && appt.expiresAt && (
                                    <div className="mt-1"><CountdownTimer expiresAt={appt.expiresAt} /></div>
                                )}
                            </div>

                            {/* Actions */}
                            {!(isCompleted || appt.status === 'expired' || appt.status === 'cancelled' || appt.status === 'rejected') && (
                                <div className="mt-auto pt-2 border-t border-gray-100">
                                    {appt.pujaId ? (
                                        <PujaActions appt={appt} onUpdate={onUpdate} />
                                    ) : (
                                        <StandardActions appt={appt} onUpdate={onUpdate} onReschedule={onReschedule} />
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
