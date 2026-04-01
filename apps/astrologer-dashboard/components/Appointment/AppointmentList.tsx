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

const Clock = LucideClock as any;
const Video = LucideVideo as any;
const RefreshCw = LucideRefreshCw as any;
const XCircle = LucideXCircle as any;
const MessageSquare = LucideMessageSquare as any;
const Star = LucideStar as any;

interface AppointmentListProps {
    appointments: Appointment[];
    onReschedule: (appt: Appointment) => void;
    onUpdate?: () => void;
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
            toast.error(error.message || "Failed to update status");
        } else {
            toast.success(`Puja request ${status} successfully`);
            if (onUpdate) onUpdate();
        }
        setIsUpdating(false);
        setShowDateForm(false);
    };

    if (appt.status === 'accepted') return <span className="text-emerald-600 font-bold px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100 flex items-center gap-2 shadow-sm"><Check className="w-4 h-4"/> Accepted</span>;
    if (appt.status === 'confirmed') return <span className="text-yellow-600 font-bold px-4 py-2 bg-yellow-50 rounded-xl border border-yellow-100 flex items-center gap-2 shadow-sm"><Star className="w-4 h-4 fill-yellow-600"/> Confirmed & Paid</span>;
    if (appt.status === 'rejected') return <span className="text-red-400 font-bold px-4 py-2 bg-red-50 rounded-xl border border-red-100 flex items-center gap-2 shadow-sm"><Ban className="w-4 h-4"/> Rejected</span>;
    if (appt.status === 'on_hold') return (
        <div className="flex flex-col items-center gap-2 bg-blue-50/50 p-3 rounded-2xl border border-blue-100 group shadow-sm transition-all hover:shadow-md">
            <span className="text-blue-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
                <Pause className="w-3.5 h-3.5 animate-pulse" /> Propose Sent
            </span>
            <p className="text-[9px] text-blue-400 font-medium max-w-[140px] text-center leading-tight">Waiting for user to accept proposed schedule</p>
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
        </div>
    );
}

export default function AppointmentList({
    appointments,
    onReschedule,
    onUpdate,
}: AppointmentListProps) {
    // Utility function for classnames
    const cn = (...classes: (string | undefined | null | boolean)[]) =>
        classes.filter(Boolean).join(" ");

    const statusColors: Record<Appointment["status"], string> = {
        confirmed: "bg-green-100 text-green-600",
        pending: "bg-yellow-100 text-yellow-600 border-yellow-200",
        active: "bg-blue-100 text-blue-600 border-blue-200",
        completed: "bg-gray-100 text-gray-600 border-gray-200",
        cancelled: "bg-red-100 text-red-600 border-red-200",
        expired: "bg-orange-100 text-orange-600 border-orange-200",
        on_hold: "bg-purple-100 text-purple-600 border-purple-200",
        rejected: "bg-red-50 text-red-400 border-red-100",
        accepted: "bg-emerald-100 text-emerald-600 border-emerald-200",
    };

    return (
        <section aria-labelledby="appointment-list-heading" className="space-y-4">
            <h2 id="appointment-list-heading" className="sr-only">
                Appointment List
            </h2>

            {/* Desktop Table Style Cards */}
            <div className="hidden sm:block bg-white rounded-2xl shadow-lg border border-gray-100 divide-y divide-gray-100">
                {appointments.map((appt) => (
                    <div
                        key={appt.id}
                        className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                    >
                        {/* Left Section: Client Info & Details */}
                        <div className="flex items-start lg:items-center gap-5 flex-1 min-w-0">
                            {/* Avatar */}
                            <div className="shrink-0 w-12 h-12 rounded-full bg-yellow-600 text-white flex items-center justify-center font-bold text-2xl ring-2 ring-yellow-500 overflow-hidden shadow-sm">
                                {appt.avatar ? (
                                    <img
                                        src={appt.avatar || "/images/dummy-astrologer.jpg"}
                                        alt={appt.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            // Fallback if image fails to load
                                            (e.currentTarget as any).src = "/images/dummy-astrologer.jpg";
                                        }}
                                    />
                                ) : (
                                    appt.name.charAt(0)
                                )}
                            </div>

                            {/* Text Content */}
                            <div className="flex-1 min-w-0">
                                <h3 className="text-xl md:text-xl font-bold text-gray-900 truncate">
                                    {appt.name}
                                </h3>
                                <p className="text-sm font-medium text-gray-600 truncate">
                                    {appt.service}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <span>
                                        {format(new Date(appt.date), "dd MMM yyyy 'at' hh:mm a")}
                                    </span>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 mt-3">
                                    <span
                                        className={cn(
                                            "inline-block px-3 py-1 text-xs rounded-full font-medium shadow-sm capitalize border border-current",
                                            appt.terminatedBy === 'admin' ? "bg-red-100 text-red-600 border-red-200" : statusColors[appt.status]
                                        )}
                                    >
                                        {appt.terminatedBy === 'admin' ? '🛑 Terminated by Admin' : (appt.status === 'pending' ? '⏳ Waiting for you' : appt.status === 'active' ? '🟢 Live Now' : appt.status)}
                                    </span>
                                    {appt.status === 'pending' && appt.expiresAt && (
                                        <CountdownTimer expiresAt={appt.expiresAt} />
                                    )}
                                    {appt.isFree && (
                                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border border-green-200 animate-pulse">
                                            🎁 Free Consultation ({appt.freeMinutes}m)
                                        </span>
                                    )}
                                    <span className="text-xs bg-purple-100 text-purple-600 px-3 py-1 rounded-full font-medium">
                                        {appt.type === "new" ? "🆕 New Client" : "Follow-up"}
                                    </span>
                                    {appt.reminder && (
                                        <span className="text-xs bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium border border-blue-200">
                                            🔔 Reminder Sent
                                        </span>
                                    )}
                                </div>
                                {appt.pujaId && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase border border-yellow-200 flex items-center gap-1.5 shadow-sm transition-all hover:shadow-md">
                                            <LucideVideo className="w-3.5 h-3.5" />
                                            {appt.pujaMode === 'online' ? 'Online Ritual' : (appt.pujaMode === 'home_visit_with' ? 'Home Visit (With Samagri)' : 'Home Visit (Basic)')}
                                        </span>
                                        <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg text-[10px] font-black uppercase border border-emerald-200 flex items-center gap-1 shadow-sm transition-all hover:shadow-md">
                                            ₹{appt.price}
                                        </span>
                                    </div>
                                )}
                                {appt.userMessage && (
                                    <div className="mt-4 p-4 bg-orange-50/70 rounded-2xl border border-orange-100 italic text-[13px] text-gray-700 relative group overflow-hidden shadow-sm transition-all hover:shadow-md">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-400 group-hover:w-1.5 transition-all"></div>
                                        <LucideMessageSquare className="w-4 h-4 text-orange-400 mb-2 opacity-50" />
                                        " {appt.userMessage} "
                                    </div>
                                )}
                                {appt.expertMessage && (
                                    <div className="mt-2 p-4 bg-blue-50/70 rounded-2xl border border-blue-100 italic text-[13px] text-blue-700 relative group overflow-hidden shadow-sm transition-all hover:shadow-md">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-400 group-hover:w-1.5 transition-all"></div>
                                        <span className="text-[10px] font-black uppercase tracking-wider mb-2 block opacity-60">Expert Response</span>
                                        " {appt.expertMessage} "
                                    </div>
                                )}
                                {appt.askExpertForDate && appt.status === 'pending' && (
                                    <div className="mt-3 p-3 bg-yellow-50 rounded-xl border border-dashed border-yellow-300 flex items-center gap-3">
                                        <div className="shrink-0 w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center animate-bounce">
                                            <LucideClock className="w-4 h-4 text-yellow-600" />
                                        </div>
                                        <p className="text-[11px] font-black text-yellow-800 uppercase tracking-wider leading-tight">
                                            User is requesting you to <br/> propose a date & time
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Section: Actions */}
                        <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full lg:w-auto mt-4 lg:mt-0">
                            {appt.pujaId ? (
                                <PujaActions appt={appt} />
                            ) : (
                                appt.status !== 'completed' && appt.status !== 'expired' && appt.status !== 'cancelled' && (
                                    <>
                                        <a
                                            href={appt.meetingLink}
                                            className="px-5 py-3 text-sm bg-yellow-600 text-white rounded-xl flex items-center justify-center gap-2 font-semibold hover:bg-yellow-700 shadow-sm transition-all w-full sm:w-auto"
                                        >
                                            {appt.service === "Chat Consultation" ? (
                                                <>
                                                    <MessageSquare className="w-5 h-5" /> {appt.status === 'active' ? 'Re-join Chat' : 'Join Chat'}
                                                </>
                                            ) : (
                                                <>
                                                    <Video className="w-5 h-5" /> Join Meeting
                                                </>
                                            )}
                                        </a>
                                        <Button
                                            onClick={() => onReschedule(appt)}
                                            variant="secondary"
                                            size="md"
                                            leftIcon={<RefreshCw className="w-5 h-5" />}
                                            className="w-full sm:w-auto"
                                        >
                                            Reschedule
                                        </Button>
                                        <Button
                                            variant="primary"
                                            size="md"
                                            leftIcon={<XCircle className="w-5 h-5" />}
                                            className="bg-red-600 hover:bg-red-700 shadow-red-500/20 w-full sm:w-auto"
                                        >
                                            Cancel
                                        </Button>
                                    </>
                                )
                            )}
                            {(appt.status === 'completed' || appt.status === 'expired') && (
                                <div className="flex flex-col items-end gap-2">
                                    <div className="flex items-center gap-4 bg-gray-50 px-5 py-3 rounded-xl border border-dashed border-gray-300">
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] font-black opacity-40 uppercase tracking-widest">Status</span>
                                            <span className="text-sm font-bold text-gray-700">
                                                {appt.terminatedBy === 'admin' ? '🛑 TERMINATED BY ADMIN' : (appt.status === 'completed' ? '✅ COMPLETED' : '⌛ EXPIRED')}
                                            </span>
                                        </div>
                                        {appt.status === 'completed' && appt.durationMins !== undefined && (
                                            <>
                                                <div className="w-px h-8 bg-gray-200"></div>
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[10px] font-black opacity-40 uppercase tracking-widest">Duration</span>
                                                    <span className="text-sm font-bold text-gray-700 flex items-center gap-1">
                                                        <Clock className="w-3 h-3 text-[#fd6410]" /> {appt.durationMins} min
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {appt.review && appt.review.rating > 0 && (
                                        <div className="flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100">
                                            <div className="flex items-center gap-0.5">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star
                                                        key={s}
                                                        className={`w-3 h-3 ${s <= (appt.review?.rating || 0) ? "text-yellow-500 fill-yellow-500" : "text-gray-200"}`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-[10px] font-bold text-orange-700">{appt.review.rating}/5</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Mobile Cards */}
            <div className="space-y-4 sm:hidden">
                {appointments.map((appt) => (
                    <div
                        key={appt.id}
                        className="bg-white p-5 rounded-2xl shadow-lg border border-gray-100 space-y-3 hover:shadow-xl transition-all"
                    >
                        <div>
                            <div className="flex justify-between items-start">
                                <h3 className="font-semibold text-gray-900">{appt.name}</h3>
                                <div className="flex flex-col items-end gap-1">
                                    {appt.status === 'pending' && appt.expiresAt && (
                                        <CountdownTimer expiresAt={appt.expiresAt} />
                                    )}
                                    {appt.isFree && (
                                        <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded-[4px] text-[8px] font-black uppercase tracking-widest border border-green-100">
                                            Free ({appt.freeMinutes}m)
                                        </span>
                                    )}
                                </div>
                            </div>
                            <p className="text-sm text-gray-600">{appt.service}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                                <Clock className="w-4 h-4" />
                                <span>
                                    {format(new Date(appt.date), "dd MMM yyyy, hh:mm a")}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <span
                                className={cn(
                                    "px-3 py-1 text-xs rounded-full font-medium shadow-sm",
                                    appt.terminatedBy === 'admin' ? "bg-red-100 text-red-600 border-red-200" : statusColors[appt.status]
                                )}
                            >
                                {appt.terminatedBy === 'admin' ? 'Terminated by Admin' : appt.status}
                            </span>
                            <span className="text-xs text-gray-500">
                                {appt.type === "new" ? "🆕 New" : "🔄 Follow-up"}
                            </span>
                            {appt.reminder && (
                                <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium border border-blue-200">
                                    🔔 Reminder Sent
                                </span>
                            )}
                        </div>

                        {/* Actions stacked */}
                        <div className="flex flex-col gap-2">
                            {appt.pujaId ? (
                                <PujaActions appt={appt} onUpdate={onUpdate} />
                            ) : (
                                appt.status !== 'completed' && appt.status !== 'expired' && appt.status !== 'cancelled' && (
                                    <>
                                        <a
                                            href={appt.meetingLink}
                                            className="w-full px-3 py-2.5 bg-yellow-600 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-700 shadow-sm transition-all"
                                        >
                                            {appt.service === "Chat Consultation" ? (
                                                <>
                                                    <MessageSquare className="w-4 h-4" /> {appt.status === 'active' ? 'Re-join Chat' : 'Join Chat'}
                                                </>
                                            ) : (
                                                <>
                                                    <Video className="w-4 h-4" /> Join
                                                </>
                                            )}
                                        </a>
                                        <Button
                                            onClick={() => onReschedule(appt)}
                                            variant="secondary"
                                            size="md"
                                            leftIcon={<RefreshCw className="w-4 h-4" />}
                                            className="w-full"
                                        >
                                            Reschedule
                                        </Button>
                                        <Button
                                            variant="primary"
                                            size="md"
                                            leftIcon={<XCircle className="w-4 h-4" />}
                                            className="bg-red-600 hover:bg-red-700 shadow-red-500/20 w-full"
                                        >
                                            Cancel
                                        </Button>
                                    </>
                                )
                            )}
                            {(appt.status === 'completed' || appt.status === 'expired') && (
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-xs font-bold bg-gray-50 px-4 py-3 rounded-xl border border-dashed border-gray-200">
                                        <span className="opacity-60">{appt.terminatedBy === 'admin' ? '🛑 TERMINATED BY ADMIN' : (appt.status === 'completed' ? '✅ COMPLETED' : '⌛ EXPIRED')}</span>
                                        {appt.status === 'completed' && appt.durationMins !== undefined && (
                                            <span className="text-[#fd6410]">{appt.durationMins} MINS</span>
                                        )}
                                    </div>
                                    {appt.review && appt.review.rating > 0 && (
                                        <div className="flex items-center justify-center gap-1 bg-orange-50/50 py-1.5 rounded-lg">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star
                                                    key={s}
                                                    className={`w-2.5 h-2.5 ${s <= (appt.review?.rating || 0) ? "text-yellow-500 fill-yellow-500" : "text-gray-200"}`}
                                                />
                                            ))}
                                            <span className="text-[10px] font-bold text-orange-700 ml-1">{appt.review.rating}/5</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
