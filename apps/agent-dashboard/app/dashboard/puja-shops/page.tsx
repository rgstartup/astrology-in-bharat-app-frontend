"use client";
import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Button, SearchInput, StatsCards, NotFound } from "@repo/ui";
import type { StatConfig } from "@repo/ui";
import { Plus, MapPin, Phone, CheckCircle, Clock, XCircle, ShoppingBag } from "lucide-react";
import { toast } from "react-toastify";
import { getAgentListings, createListing } from "@/src/services/agent.service";

const STATUS = {
    active: { label: "Active", className: "bg-green-100 text-green-700", icon: CheckCircle },
    pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700", icon: Clock },
    inactive: { label: "Inactive", className: "bg-gray-100 text-gray-600", icon: XCircle },
    approved: { label: "Approved", className: "bg-blue-100 text-blue-700", icon: CheckCircle },
} as const;

const EMPTY_FORM = { name: "", items: "", location: "", phone: "" };

export default function PujaShopsPage() {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [search, setSearch] = useState("");
    const [form, setForm] = useState(EMPTY_FORM);

    const fetchListings = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getAgentListings({ type: "puja_shop", search });
            setData(res.data || []);
        } catch {
            toast.error("Failed to load puja shop listings");
        } finally {
            setLoading(false);
        }
    }, [search]);

    useEffect(() => {
        const t = setTimeout(fetchListings, 400);
        return () => clearTimeout(t);
    }, [fetchListings]);

    const stats: StatConfig[] = useMemo(() => [
        { title: "Total", value: data.length, icon: ShoppingBag, iconColor: "text-purple-600", iconBgColor: "bg-purple-100" },
        { title: "Active", value: data.filter((d) => d.status === "active" || d.status === "approved").length, icon: CheckCircle, iconColor: "text-green-600", iconBgColor: "bg-green-100" },
        { title: "Pending", value: data.filter((d) => d.status === "pending").length, icon: Clock, iconColor: "text-yellow-600", iconBgColor: "bg-yellow-100" },
        { title: "Inactive", value: data.filter((d) => d.status === "inactive").length, icon: XCircle, iconColor: "text-gray-500", iconBgColor: "bg-gray-100" },
    ], [data]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim()) return;
        try {
            setSubmitting(true);
            await createListing({
                type: "puja_shop",
                name: form.name,
                items: form.items,
                location: form.location,
                phone: form.phone,
            });
            toast.success("Puja Shop listing submitted for approval! 🪔");
            setForm(EMPTY_FORM);
            setShowForm(false);
            fetchListings();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to submit listing");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-gray-900">My Puja Shops</h2>
                    <p className="text-sm text-gray-500 mt-0.5">{data.length} listings</p>
                </div>
                <Button variant="primary" icon={Plus} onClick={() => setShowForm(!showForm)}>
                    {showForm ? "Cancel" : "Add Puja Shop"}
                </Button>
            </div>

            <StatsCards stats={stats} columns={4} />
            <SearchInput value={search} onChange={setSearch} placeholder="Search by name or location…" size="md" />

            {showForm && (
                <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
                    <h3 className="text-sm font-black text-purple-800 uppercase tracking-widest mb-4">New Puja Shop Listing</h3>
                    <form onSubmit={handleAdd} className="grid sm:grid-cols-2 gap-4">
                        {[
                            { key: "name", placeholder: "Shop name *", label: "Shop Name *" },
                            { key: "items", placeholder: "e.g. Incense, Flowers, Diyas", label: "Key Items" },
                            { key: "location", placeholder: "City, State", label: "Location" },
                            { key: "phone", placeholder: "Contact number", label: "Contact" },
                        ].map(({ key, placeholder, label }) => (
                            <div key={key}>
                                <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-1">{label}</label>
                                <input
                                    placeholder={placeholder}
                                    value={(form as any)[key]}
                                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                                    className="w-full px-4 py-2.5 rounded-xl border border-purple-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                                />
                            </div>
                        ))}
                        <div className="sm:col-span-2 flex gap-3">
                            <Button variant="primary" type="submit" disabled={submitting}>
                                {submitting ? "Submitting…" : "Submit Listing"}
                            </Button>
                            <Button variant="outline" type="button" onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }}>Cancel</Button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="flex items-center justify-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
            ) : data.length === 0 ? (
                <NotFound title="No Puja Shops Found" returnUrl="/dashboard/puja-shops" returnLabel="Clear Search" imagePath="/images/Astrologer.png" />
            ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {data.map((s) => {
                        const St = STATUS[s.status as keyof typeof STATUS] || STATUS.pending;
                        const Icon = St.icon;
                        return (
                            <div key={s.id || s._id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-purple-300 transition-all p-5">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-400 to-violet-500 flex items-center justify-center text-white text-lg shadow">🪔</div>
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${St.className}`}>
                                        <Icon className="w-3 h-3" />{St.label}
                                    </span>
                                </div>
                                <h4 className="font-black text-gray-900 text-sm">{s.name}</h4>
                                <p className="text-xs text-primary-hover font-semibold mt-0.5 line-clamp-1">{s.items || "—"}</p>
                                <div className="mt-3 space-y-1.5">
                                    {s.location && <p className="text-xs text-gray-500 flex items-center gap-1.5"><MapPin className="w-3 h-3" />{s.location}</p>}
                                    {s.phone && <p className="text-xs text-gray-500 flex items-center gap-1.5"><Phone className="w-3 h-3" />{s.phone}</p>}
                                </div>
                                <p className="text-[10px] text-gray-400 mt-3 font-medium">Listed on {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '—'}</p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
