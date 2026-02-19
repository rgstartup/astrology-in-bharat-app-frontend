"use client";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Button, SearchInput, StatsCards, NotFound } from "@repo/ui";
import type { StatConfig } from "@repo/ui";
import { Plus, MapPin, Phone, CheckCircle, Clock, XCircle, Building2 } from "lucide-react";
import { toast } from "react-toastify";

import { getAgentListings, createListing } from "@/src/services/agent.service";

const STATUS = {
    active: { label: "Active", className: "bg-green-100 text-green-700", icon: CheckCircle },
    pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700", icon: Clock },
    inactive: { label: "Inactive", className: "bg-gray-100 text-gray-600", icon: XCircle },
    approved: { label: "Approved", className: "bg-blue-100 text-blue-700", icon: CheckCircle },
} as const;

export default function MandirstPage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState("");
    const [form, setForm] = useState({ name: "", deity: "", location: "", phone: "" });

    const fetchListings = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getAgentListings({ type: "mandir", search });
            setData(res.data || []);
        } catch (error) {
            console.error("Failed to fetch listings", error);
        } finally {
            setLoading(false);
        }
    }, [search]);

    useEffect(() => {
        const t = setTimeout(fetchListings, 400);
        return () => clearTimeout(t);
    }, [fetchListings]);

    const stats: StatConfig[] = useMemo(() => [
        { title: "Total", value: data.length, icon: Building2, iconColor: "text-orange-600", iconBgColor: "bg-orange-100" },
        { title: "Active", value: data.filter((d) => d.status === "active" || d.status === "approved").length, icon: CheckCircle, iconColor: "text-green-600", iconBgColor: "bg-green-100" },
        { title: "Pending", value: data.filter((d) => d.status === "pending").length, icon: Clock, iconColor: "text-yellow-600", iconBgColor: "bg-yellow-100" },
        { title: "Inactive", value: data.filter((d) => d.status === "inactive").length, icon: XCircle, iconColor: "text-gray-500", iconBgColor: "bg-gray-100" },
    ], [data]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim()) return;

        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("type", "mandir");
            formData.append("deity", form.deity);
            formData.append("location", form.location);
            formData.append("phone", form.phone);

            await createListing(formData);
            toast.success("Mandir listing submitted for approval! 🛕");
            setForm({ name: "", deity: "", location: "", phone: "" });
            setShowForm(false);
            fetchListings();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to submit listing");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-gray-900">My Mandirs</h2>
                    <p className="text-sm text-gray-500 mt-0.5">{data.length} listings</p>
                </div>
                <Button variant="primary" icon={Plus} onClick={() => setShowForm(!showForm)}>
                    Add Mandir
                </Button>
            </div>

            <StatsCards stats={stats} columns={4} />

            <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search by name or location…"
                size="md"
            />

            {showForm && (
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
                    <h3 className="text-sm font-black text-orange-800 uppercase tracking-widest mb-4">New Mandir Listing</h3>
                    <form onSubmit={handleAdd} className="grid sm:grid-cols-2 gap-4">
                        {[
                            { key: "name", placeholder: "Mandir name", label: "Mandir Name *" },
                            { key: "deity", placeholder: "e.g. Lord Shiva", label: "Main Deity" },
                            { key: "location", placeholder: "City, State", label: "Location" },
                            { key: "phone", placeholder: "Contact number", label: "Contact" },
                        ].map(({ key, placeholder, label }) => (
                            <div key={key}>
                                <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-1">{label}</label>
                                <input
                                    placeholder={placeholder}
                                    value={(form as any)[key]}
                                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                                    className="w-full px-4 py-2.5 rounded-xl border border-orange-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-hover"
                                />
                            </div>
                        ))}
                        <div className="sm:col-span-2 flex gap-3">
                            <Button variant="primary" type="submit">Submit Listing</Button>
                            <Button variant="outline" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="flex items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : data.length === 0 ? (
                <NotFound title="No Mandirs Found" returnUrl="/dashboard/mandirs" returnLabel="Clear Search" imagePath="/images/Astrologer.png" />
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {data.map((m) => {
                        const St = STATUS[m.status as keyof typeof STATUS] || STATUS.pending;
                        const Icon = St.icon;
                        return (
                            <div key={m.id || m._id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-yellow-400 transition-all p-5">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-lg shadow">🛕</div>
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${St.className}`}>
                                        <Icon className="w-3 h-3" />{St.label}
                                    </span>
                                </div>
                                <h4 className="font-black text-gray-900 text-sm">{m.name}</h4>
                                <p className="text-xs text-primary-hover font-semibold mt-0.5">{m.deity || "—"}</p>
                                <div className="mt-3 space-y-1.5">
                                    {m.location && <p className="text-xs text-gray-500 flex items-center gap-1.5"><MapPin className="w-3 h-3" />{m.location}</p>}
                                    {m.phone && <p className="text-xs text-gray-500 flex items-center gap-1.5"><Phone className="w-3 h-3" />{m.phone}</p>}
                                </div>
                                <p className="text-[10px] text-gray-400 mt-3 font-medium">Listed on {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : '—'}</p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
