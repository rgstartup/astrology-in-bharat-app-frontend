"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "@repo/ui";
import {
    UserPlus, CheckCircle, X,
    Star, Building2, ShoppingBag,
    MapPin, Phone, Clock, Flame,
    Plus, Sparkles, ChevronRight
} from "lucide-react";
import { toast } from "react-toastify";
import { registerUserByAgent, createListing } from "@/services/agent.service";
import { cn } from "@/lib/cn";
import { RegistrationSkeleton } from "../../components/Skeleton";
import { getErrorMessage } from "@repo/lib/utils/error";

// ── Tab types ────────────────────────────────────────────────────────────────

type TabId = "expert" | "mandir" | "puja_shop";

interface TabConfig {
    id: TabId;
    label: string;
    description: string;
    icon: React.ElementType;
    infoText: string;
}

const TABS: TabConfig[] = [
    {
        id: "expert",
        label: "Expert",
        description: "Astrologers & Gurus",
        icon: Star,
        infoText: "Register an expert and earn recurring commission on their platform activity.",
    },
    {
        id: "mandir",
        label: "Mandir",
        description: "Temples & Shrines",
        icon: Building2,
        infoText: "Add a mandir listing and earn commission on every puja service booked there.",
    },
    {
        id: "puja_shop",
        label: "Puja Shop",
        description: "Merchants & Items",
        icon: ShoppingBag,
        infoText: "Register a puja shop merchant and earn commission on their total product sales.",
    },
];

// ── Shared UI Components ─────────────────────────────────────────────────────

const INPUT_CLS =
    "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/50 backdrop-blur-sm text-sm focus:outline-none focus:ring-2 focus:ring-brand-orange/20 focus:border-brand-orange transition-all duration-200 placeholder:text-gray-1000 shadow-sm";

function FieldLabel({ children }: { children: React.ReactNode }) {
    return (
        <label className="block text-[11px] font-black text-gray-1000 uppercase tracking-[0.15em] mb-1.5 ml-1">
            {children}
        </label>
    );
}

// ── Modals ───────────────────────────────────────────────────────────────────

function SuccessModal({ registeredUser, onClose }: { registeredUser: any; onClose: () => void }) {
    const roleString = registeredUser.roles?.[0]?.name || registeredUser.role || registeredUser.userType || "user";

    const content = (
        <div className="fixed inset-0 bg-[#301118]/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-8 relative animate-in zoom-in-95 duration-300 border border-white/20">
                <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-1000">
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg shadow-green-200/50">
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 leading-tight">Registration<br />Successful!</h3>
                    <p className="text-sm text-gray-1000 mt-2 font-medium">
                        <span className="font-bold text-gray-900">{registeredUser.name}</span> is now a verified 
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-orange/10 text-brand-orange ml-1.5 capitalize">
                            {roleString}
                        </span>
                    </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-100 space-y-3">
                    <div className="flex justify-between items-center border-b border-gray-200/50 pb-2">
                        <span className="text-[10px] font-black text-gray-1000 uppercase tracking-widest">Login Email</span>
                        <span className="text-xs font-bold text-gray-800">{registeredUser.email}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                        <span className="text-[10px] font-black text-gray-1000 uppercase tracking-widest">Platform Role</span>
                        <span className="text-xs font-bold text-gray-800 capitalize">{roleString}</span>
                    </div>
                </div>

                <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 mb-8 text-center">
                    <div className="flex items-center justify-center gap-2 text-brand-orange mb-2">
                        <Sparkles className="w-4 h-4 fill-brand-orange" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Credentials Sent</span>
                    </div>
                    <p className="text-sm text-orange-900 font-bold leading-relaxed">
                        Login details sent to the registered email address.
                    </p>
                </div>

                <Button 
                    onClick={onClose}
                    className="!bg-brand-orange hover:!bg-primary-hover !text-white !rounded-2xl !py-4 !text-sm !font-black !shadow-xl !shadow-brand-orange/20 transition-all hover:scale-[1.02] active:scale-[0.98]" 
                    fullWidth
                >
                    Return to Dashboard
                </Button>
            </div>
        </div>
    );
    return typeof document !== "undefined" ? createPortal(content, document.body) : null;
}

function ListingSuccessModal({ name, type, onClose }: { name: string; type: string; onClose: () => void }) {
    const content = (
        <div className="fixed inset-0 bg-[#301118]/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-8 relative animate-in zoom-in-95 duration-300 border border-white/20 text-center">
                <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-1000">
                    <X className="w-5 h-5" />
                </button>
                
                <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg shadow-orange-200/50">
                    <Building2 className="w-10 h-10 text-brand-orange" />
                </div>
                
                <h3 className="text-2xl font-black text-gray-900 leading-tight">Listing<br />Submitted!</h3>
                <p className="text-sm text-gray-1000 mt-2 font-medium px-4">
                    <span className="font-bold text-gray-900">{name}</span> has been added as a 
                    <span className="text-brand-orange font-bold"> {type === "puja_shop" ? "Puja Shop" : "Mandir"}</span>.
                </p>
                
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 my-8 text-sm text-gray-1000 font-medium">
                    Our team will verify the details within 24-48 hours.
                </div>

                <Button 
                    onClick={onClose}
                    className="!bg-brand-orange hover:!bg-primary-hover !text-white !rounded-2xl !py-4 !text-sm !font-black !shadow-xl !shadow-brand-orange/20 transition-all hover:scale-[1.02] active:scale-[0.98]" 
                    fullWidth
                >
                    Got it, Thanks
                </Button>
            </div>
        </div>
    );
    return typeof document !== "undefined" ? createPortal(content, document.body) : null;
}

// ── Expert / Merchant Form ───────────────────────────────────────────────────

function UserForm({ userType }: { userType: "expert" | "merchant" }) {
    const [form, setForm] = useState({ name: "", email: "", phone: "" });
    const [submitting, setSubmitting] = useState(false);
    const [registeredUser, setRegisteredUser] = useState<any>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
            toast.error("Please fill all required fields");
            return;
        }
        setSubmitting(true);
        const [res, error] = await registerUserByAgent({ ...form, userType });
        
        if (error) {
            toast.error(getErrorMessage(error) || "Registration failed. Try again.");
        } else if (res) {
            setRegisteredUser({ ...res.user, userType });
            setForm({ name: "", email: "", phone: "" });
        }
        setSubmitting(false);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-5">
                    <div className="sm:col-span-2">
                        <FieldLabel>{userType === "merchant" ? "Shop / Owner Name" : "Full Name"}</FieldLabel>
                        <input
                            type="text"
                            placeholder={userType === "expert" ? "e.g. Pt. Ramesh Sharma" : "e.g. Shiv Puja Bhandar"}
                            value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            className={INPUT_CLS}
                            required
                        />
                    </div>
                    <div>
                        <FieldLabel>Email Address</FieldLabel>
                        <input
                            type="email"
                            placeholder="example@gmail.com"
                            value={form.email}
                            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                            className={INPUT_CLS}
                            required
                        />
                    </div>
                    <div>
                        <FieldLabel>Phone / Contact</FieldLabel>
                        <input
                            type="tel"
                            placeholder="9876543210"
                            value={form.phone}
                            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                            className={INPUT_CLS}
                            required
                        />
                    </div>
                </div>

                <Button 
                    type="submit" 
                    disabled={submitting} 
                    fullWidth
                    className="!bg-brand-orange hover:!bg-primary-hover !text-white !rounded-2xl !py-4 !text-sm !font-black !shadow-xl !shadow-brand-orange/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                    {submitting ? "Processing..." : (
                        <span className="flex items-center justify-center gap-2">
                            {userType === 'expert' ? <UserPlus className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                            Register {userType === "expert" ? "Expert" : "Merchant"}
                        </span>
                    )}
                </Button>
            </form>

            {registeredUser && (
                <SuccessModal
                    registeredUser={registeredUser}
                    onClose={() => { setRegisteredUser(null); }}
                />
            )}
        </div>
    );
}

// ── Mandir Form ──────────────────────────────────────────────────────────────

function MandirForm() {
    const [form, setForm] = useState({ name: "", location: "", mainDeity: "", contact: "", openingTime: "", closingTime: "" });
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim() || !form.location.trim()) {
            toast.error("Please fill Mandir name and location");
            return;
        }
        setSubmitting(true);
        const [res, error] = await createListing({
            type: "mandir",
            name: form.name,
            location: form.location,
            phone: form.contact,
            deity: form.mainDeity,
            items: `Opening: ${form.openingTime} | Closing: ${form.closingTime}`,
        });

        if (error) {
            toast.error(getErrorMessage(error) || "Failed to submit listing");
        } else {
            setSuccess(true);
            setForm({ name: "", location: "", mainDeity: "", contact: "", openingTime: "", closingTime: "" });
        }
        setSubmitting(false);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-5">
                    <div>
                        <FieldLabel>Mandir Name</FieldLabel>
                        <input
                            type="text"
                            placeholder="e.g. Shri Kashi Vishwanath Mandir"
                            value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            className={INPUT_CLS}
                            required
                        />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                            <FieldLabel>Location</FieldLabel>
                            <div className="relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-1000" />
                                <input
                                    type="text"
                                    placeholder="City, State"
                                    value={form.location}
                                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                                    className={cn(INPUT_CLS, "pl-11")}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <FieldLabel>Main Deity</FieldLabel>
                            <div className="relative">
                                <Flame className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-1000" />
                                <input
                                    type="text"
                                    placeholder="e.g. Lord Shiva"
                                    value={form.mainDeity}
                                    onChange={(e) => setForm((f) => ({ ...f, mainDeity: e.target.value }))}
                                    className={cn(INPUT_CLS, "pl-11")}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-5">
                        <div>
                            <FieldLabel>Contact</FieldLabel>
                            <input
                                type="tel"
                                placeholder="9876543210"
                                value={form.contact}
                                onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
                                className={INPUT_CLS}
                            />
                        </div>
                        <div>
                            <FieldLabel>Opening Time</FieldLabel>
                            <input
                                type="time"
                                value={form.openingTime}
                                onChange={(e) => setForm((f) => ({ ...f, openingTime: e.target.value }))}
                                className={INPUT_CLS}
                            />
                        </div>
                        <div>
                            <FieldLabel>Closing Time</FieldLabel>
                            <input
                                type="time"
                                value={form.closingTime}
                                onChange={(e) => setForm((f) => ({ ...f, closingTime: e.target.value }))}
                                className={INPUT_CLS}
                            />
                        </div>
                    </div>
                </div>

                <Button 
                    type="submit" 
                    disabled={submitting} 
                    fullWidth
                    className="!bg-brand-orange hover:!bg-primary-hover !text-white !rounded-2xl !py-4 !text-sm !font-black !shadow-xl !shadow-brand-orange/20 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                    {submitting ? "Submitting..." : (
                        <span className="flex items-center justify-center gap-2">
                            <Plus className="w-4 h-4" />
                            Submit Mandir Listing
                        </span>
                    )}
                </Button>
            </form>

            {success && (
                <ListingSuccessModal
                    name={form.name || "Mandir"}
                    type="mandir"
                    onClose={() => setSuccess(false)}
                />
            )}
        </div>
    );
}

// ── Main Page ────────────────────────────────────────────────────────────────

export default function RegisterUserPage() {
    const [activeTab, setActiveTab] = useState<TabId>("expert");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <RegistrationSkeleton />;

    const currentTab = TABS.find((t) => t.id === activeTab)!;

    return (
        <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Header Section */}
            <div className="text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/10 text-brand-orange mb-3">
                    <Sparkles className="w-3.5 h-3.5 fill-brand-orange" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Agent Portal</span>
                </div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Onboarding <span className="text-brand-orange">Hub</span></h2>
                <p className="text-sm text-gray-1000 mt-1.5 font-medium">
                    Expand the network by adding verified Experts, Mandirs, or Puja Shops.
                </p>
            </div>

            {/* Premium Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {TABS.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "relative group flex items-start gap-4 p-5 rounded-[2rem] border-2 transition-all duration-300 text-left overflow-hidden",
                                isActive 
                                    ? "bg-white border-[#F25E0A] shadow-xl shadow-orange-200/50 -translate-y-1" 
                                    : "bg-gray-50/50 border-[#F25E0A] hover:bg-white hover:shadow-xl hover:shadow-orange-200/50 hover:-translate-y-1"
                            )}
                        >
                            <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110",
                                isActive ? "bg-brand-orange text-white shadow-lg shadow-brand-orange/30" : "bg-white shadow-sm text-gray-1000 group-hover:text-brand-orange"
                            )}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <p className={cn("text-xs font-black uppercase tracking-widest leading-none", isActive ? "text-brand-orange" : "text-gray-1000")}>
                                    {tab.label}
                                </p>
                                <p className={cn("text-sm font-bold mt-1", isActive ? "text-gray-900" : "text-gray-1000")}>
                                    {tab.description}
                                </p>
                            </div>
                            
                            <div className={cn(
                                "absolute bottom-0 left-0 h-1.5 w-full bg-[#F25E0A] transform transition-transform duration-500 origin-center",
                                isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                            )} />
                        </button>
                    );
                })}
            </div>

            {/* Form Container */}
            <div className="relative group">
                {/* Decorative Elements */}
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-orange to-primary-hover rounded-[2.5rem] blur opacity-[0.03] group-hover:opacity-[0.05] transition-opacity duration-500" />
                
                <div className="relative bg-white/70 backdrop-blur-xl border-2 border-[#F25E0A] rounded-[2.5rem] shadow-sm overflow-hidden min-h-[400px]">
                    {/* Inner Header */}
                    <div className="px-8 pt-8 pb-2 flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                                {currentTab.label === "Expert" ? "Expert Onboarding" : 
                                 currentTab.label === "Mandir" ? "Mandir Listing" : "Puja Shop Onboarding"}
                                <ChevronRight className="w-5 h-5 text-gray-300" />
                            </h3>
                            <p className="text-xs text-gray-1000 mt-1 font-medium">{currentTab.infoText}</p>
                        </div>
                        <div className="hidden sm:flex w-12 h-12 bg-gray-50 rounded-2xl items-center justify-center text-gray-300 border border-gray-100">
                            <currentTab.icon className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="p-8">
                        {activeTab === "expert" && <UserForm key="expert" userType="expert" />}
                        {activeTab === "mandir" && <MandirForm key="mandir" />}
                        {activeTab === "puja_shop" && <UserForm key="puja_shop" userType="merchant" />}
                    </div>
                </div>
            </div>

            {/* Footer Tip */}
            <p className="text-center text-[10px] text-gray-1000 font-bold uppercase tracking-[0.2em] px-8">
                All data is securely processed according to platform guidelines
            </p>
        </div>
    );
}
