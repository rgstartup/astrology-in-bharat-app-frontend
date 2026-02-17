"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { api } from "@/src/lib/api";
import {
    Mail,
    Phone,
    Settings,
    Save,
    X,
    Edit3,
    Headphones,
    MessageCircle,
    Smartphone,
    CheckCircle2,
    Info,
    ExternalLink,
    ChevronRight,
    ShieldCheck,
    Zap,
    Globe
} from "lucide-react";

interface SupportSettings {
    email: string;
    phone: string;
    whatsapp: string;
}

const SettingsPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [settings, setSettings] = useState<SupportSettings>({
        email: "",
        phone: "",
        whatsapp: "",
    });
    const [originalSettings, setOriginalSettings] = useState<SupportSettings>({
        email: "",
        phone: "",
        whatsapp: "",
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/v1/settings/support`);

            if (response.ok) {
                const data = await response.json();
                const loadedSettings = {
                    email: data.email || "support@astrologyinbharat.com",
                    phone: data.phone || "+91 62394 08910",
                    whatsapp: data.whatsapp || "+91 62394 08910",
                };
                setSettings(loadedSettings);
                setOriginalSettings(loadedSettings);
            }
        } catch (error) {
            console.error("Failed to load settings:", error);
            toast.error("Failed to fetch settings");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field: keyof SupportSettings, value: string) => {
        setSettings((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!settings.email.includes("@")) {
            toast.error("Invalid email format");
            return;
        }

        setSaving(true);
        try {
            const response = await api.post("/admin/settings/support", settings);

            if (response.status === 200 || response.status === 201) {
                toast.success("Synchronized successfully");
                setOriginalSettings(settings);
                setIsEditing(false);
            } else {
                toast.error("Cloud synchronization failed");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setSaving(false);
        }
    };

    const isChanged = JSON.stringify(settings) !== JSON.stringify(originalSettings);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="relative">
                    <div className="w-12 h-12 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin"></div>
                    <Zap className="w-5 h-5 text-orange-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-[1240px] mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500 pb-16">

            {/* Header Section - More Compact */}
            <div className="relative bg-gray-950 rounded-[32px] p-8 md:p-10 overflow-hidden shadow-2xl">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                                <ShieldCheck className="w-4 h-4 text-orange-500" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Infrastructure</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Support <span className="text-orange-500 font-black">Endpoints</span></h1>
                        <p className="text-gray-400 text-sm max-w-xl font-medium opacity-70 leading-relaxed">
                            Global connectivity matrix configuration.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2.5 px-6 py-3.5 bg-white text-black font-black text-sm rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl shadow-white/5 active:scale-95 group"
                            >
                                <Edit3 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                                <span>Configure</span>
                            </button>
                        ) : (
                            <div className="flex items-center gap-2 animate-in zoom-in duration-200">
                                <button
                                    onClick={() => { setIsEditing(false); setSettings(originalSettings); }}
                                    className="p-3.5 bg-white/5 border border-white/10 text-white rounded-2xl hover:bg-white/10 transition-all active:scale-95"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={saving || !isChanged}
                                    className={`flex items-center gap-2.5 px-8 py-3.5 rounded-2xl font-black text-sm transition-all duration-300 ${!isChanged
                                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                        : 'bg-orange-500 text-white hover:bg-orange-600 shadow-xl shadow-orange-500/20'
                                        }`}
                                >
                                    {saving ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    <span>Update</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-orange-500/10 to-transparent blur-3xl"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Main Matrix Column */}
                <div className="lg:col-span-8 space-y-6">

                    {/* Hotline Card - Reduced Sizing */}
                    <div className={`relative p-8 rounded-[32px] border-2 transition-all duration-500 overflow-hidden ${isEditing ? 'border-orange-500 bg-white shadow-3xl shadow-orange-100' : 'border-gray-50 bg-white shadow-xl shadow-gray-200/20'}`}>
                        <div className="relative z-10 space-y-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <div className={`p-4 rounded-2xl transition-all duration-500 ${isEditing ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/20' : 'bg-orange-50 text-orange-600'}`}>
                                        <Smartphone className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-gray-900 leading-none mb-1.5">Expert Hotline</h3>
                                        <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest opacity-60">Priority Voice Channel</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-xl">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Active</span>
                                </div>
                            </div>

                            <div className="group">
                                {!isEditing ? (
                                    <div className="flex items-center justify-between py-5 px-8 bg-gray-50 rounded-2xl border border-gray-100 group-hover:bg-white group-hover:border-gray-200 transition-all cursor-pointer" onClick={() => setIsEditing(true)}>
                                        <span className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter">
                                            {settings.phone}
                                        </span>
                                        <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 text-gray-300 group-hover:text-orange-500 transition-colors">
                                            <Edit3 className="w-5 h-5" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="animate-in slide-in-from-top-2">
                                        <input
                                            type="text"
                                            value={settings.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value)}
                                            className="w-full px-8 py-6 bg-orange-50/50 border-2 border-orange-100 focus:border-orange-500 focus:bg-white rounded-2xl text-3xl font-black tracking-tighter text-orange-950 outline-none transition-all"
                                            placeholder="+91 0000 000 000"
                                            autoFocus
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Subtle watermark */}
                        <div className="absolute right-0 bottom-0 text-[100px] font-black text-gray-500/[0.03] select-none pointer-events-none italic -mr-4 -mb-8">
                            {settings.phone.slice(-2)}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* WhatsApp - Smaller */}
                        <div className={`p-7 rounded-[32px] transition-all duration-500 border-2 ${isEditing ? 'border-emerald-500 bg-white shadow-3xl shadow-emerald-100' : 'border-gray-50 bg-white shadow-xl shadow-gray-200/20'}`}>
                            <div className="flex items-center gap-4 mb-8">
                                <div className={`p-3.5 rounded-xl ${isEditing ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-500'}`}>
                                    <MessageCircle className="w-6 h-6" />
                                </div>
                                <h4 className="text-lg font-black text-gray-950">WhatsApp</h4>
                            </div>

                            {isEditing ? (
                                <input
                                    type="text"
                                    value={settings.whatsapp}
                                    onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                                    className="w-full px-6 py-4 bg-emerald-50/50 border-2 border-emerald-100 focus:border-emerald-500 focus:bg-white rounded-xl text-base font-black text-emerald-950 outline-none"
                                />
                            ) : (
                                <div className="flex items-center justify-between py-4 px-6 bg-gray-50 rounded-xl cursor-pointer hover:bg-emerald-50 transition-colors" onClick={() => setIsEditing(true)}>
                                    <span className="text-lg font-black text-gray-900 tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">{settings.whatsapp}</span>
                                    <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0 ml-2" />
                                </div>
                            )}
                        </div>

                        {/* Email - Smaller */}
                        <div className={`p-7 rounded-[32px] transition-all duration-500 border-2 ${isEditing ? 'border-blue-500 bg-white shadow-3xl shadow-blue-100' : 'border-gray-50 bg-white shadow-xl shadow-gray-200/20'}`}>
                            <div className="flex items-center gap-4 mb-8">
                                <div className={`p-3.5 rounded-xl ${isEditing ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-500'}`}>
                                    <Mail className="w-6 h-6" />
                                </div>
                                <h4 className="text-lg font-black text-gray-950 text-nowrap">Service Mail</h4>
                            </div>

                            {isEditing ? (
                                <input
                                    type="email"
                                    value={settings.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="w-full px-6 py-4 bg-blue-50/50 border-2 border-blue-100 focus:border-blue-500 focus:bg-white rounded-xl text-base font-black text-blue-950 outline-none"
                                />
                            ) : (
                                <div className="flex items-center justify-between py-4 px-6 bg-gray-50 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors" onClick={() => setIsEditing(true)}>
                                    <span className="text-lg font-black text-gray-900 truncate">{settings.email}</span>
                                    <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0 ml-2" />
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Sidebar Space - More compact */}
                <div className="lg:col-span-4">
                    <div className="sticky top-6 space-y-6">
                        <div className="bg-white rounded-[32px] p-4 shadow-xl border border-gray-100">
                            <div className="bg-gray-950 rounded-[28px] p-6 text-white overflow-hidden relative">
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-8">
                                        <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Live Link Preview</span>
                                        <div className="flex gap-1.5 opacity-30">
                                            <div className="w-2 h-2 rounded-full bg-white"></div>
                                            <div className="w-2 h-2 rounded-full bg-white"></div>
                                            <div className="w-2 h-2 rounded-full bg-white"></div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                                                <Headphones className="w-5 h-5 text-white" />
                                            </div>
                                            <h4 className="font-black text-lg">Support</h4>
                                        </div>

                                        <div className="space-y-2.5">
                                            {[
                                                { icon: Phone, color: 'text-orange-500', val: settings.phone },
                                                { icon: MessageCircle, color: 'text-emerald-500', val: settings.whatsapp },
                                                { icon: Mail, color: 'text-blue-500', val: settings.email }
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center justify-between p-3.5 bg-white/5 border border-white/5 rounded-xl">
                                                    <div className="flex items-center gap-3 min-w-0">
                                                        <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                                                        <p className="text-[11px] font-bold text-gray-300 truncate">{item.val}</p>
                                                    </div>
                                                    <ChevronRight className="w-3 h-3 text-gray-700" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-white/5 rounded-full blur-2xl"></div>
                            </div>

                            <div className="mt-4 p-4 flex gap-3 items-center bg-gray-50 rounded-[24px]">
                                <div className="flex-shrink-0 p-2.5 bg-white rounded-xl border border-gray-100">
                                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                </div>
                                <div>
                                    <h5 className="text-[11px] font-black text-gray-900 uppercase">Audit Trait</h5>
                                    <p className="text-[10px] text-gray-400 font-bold">SHA-256 Cloud Sync Active</p>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 flex items-center justify-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest grayscale opacity-40">
                            <Globe className="w-3 h-3" />
                            Global Infrastructure
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SettingsPage;




