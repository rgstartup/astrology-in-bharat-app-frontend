"use client";
import React, { useState } from "react";
import { Button } from "@repo/ui";
import { UserPlus, Copy, CheckCircle, Eye, EyeOff, X } from "lucide-react";
import { toast } from "react-toastify";
import { registerUserByAgent } from "@/src/services/agent.service";

type UserType = "expert" | "client";

const EMPTY_FORM = { name: "", email: "", phone: "", userType: "expert" as UserType };

export default function RegisterUserPage() {
    const [form, setForm] = useState(EMPTY_FORM);
    const [submitting, setSubmitting] = useState(false);
    const [tempPassword, setTempPassword] = useState<string | null>(null);
    const [registeredUser, setRegisteredUser] = useState<any>(null);
    const [copied, setCopied] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
            toast.error("Please fill all required fields");
            return;
        }
        try {
            setSubmitting(true);
            const res = await registerUserByAgent(form);
            setTempPassword(res.tempPassword);
            setRegisteredUser(res.user);
            setForm(EMPTY_FORM);
            toast.success(`${form.userType === "expert" ? "Expert" : "Client"} registered successfully! ✅`);
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Registration failed. Try again.");
        } finally {
            setSubmitting(false);
        }
    };

    const copyPassword = () => {
        if (tempPassword) {
            navigator.clipboard.writeText(tempPassword);
            setCopied(true);
            toast.success("Password copied!");
            setTimeout(() => setCopied(false), 3000);
        }
    };

    const closeModal = () => {
        setTempPassword(null);
        setRegisteredUser(null);
        setCopied(false);
        setShowPassword(false);
    };

    return (
        <div className="space-y-6 max-w-2xl">
            {/* Header */}
            <div>
                <h2 className="text-xl font-black text-gray-900">Register User / Expert</h2>
                <p className="text-sm text-gray-500 mt-0.5">Register a new expert or client under your agent account</p>
            </div>

            {/* Form Card */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* User Type Toggle */}
                    <div>
                        <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-2">User Type *</label>
                        <div className="flex gap-3">
                            {(["expert", "client"] as UserType[]).map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setForm((f) => ({ ...f, userType: type }))}
                                    className={`flex-1 py-2.5 rounded-xl border text-sm font-bold capitalize transition-all ${form.userType === type
                                            ? "bg-primary text-white border-primary shadow-sm"
                                            : "bg-gray-50 text-gray-600 border-gray-200 hover:border-primary hover:text-primary"
                                        }`}
                                >
                                    {type === "expert" ? "⭐ Expert (Astrologer)" : "👤 Client"}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Fields */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        {[
                            { key: "name", label: "Full Name *", placeholder: "Ramesh Kumar", type: "text" },
                            { key: "email", label: "Email *", placeholder: "ramesh@gmail.com", type: "email" },
                            { key: "phone", label: "Phone *", placeholder: "9876543210", type: "tel" },
                        ].map(({ key, label, placeholder, type }) => (
                            <div key={key} className={key === "name" ? "sm:col-span-2" : ""}>
                                <label className="block text-xs font-bold text-gray-600 uppercase tracking-widest mb-1">{label}</label>
                                <input
                                    type={type}
                                    placeholder={placeholder}
                                    value={(form as any)[key]}
                                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Info box */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-700 font-medium">
                        ℹ️ A temporary password will be generated after registration. Share it with the user — <strong>it won't be shown again.</strong>
                    </div>

                    <Button variant="primary" type="submit" icon={UserPlus} disabled={submitting} fullWidth>
                        {submitting ? "Registering…" : `Register ${form.userType === "expert" ? "Expert" : "Client"}`}
                    </Button>
                </form>
            </div>

            {/* Temp Password Modal */}
            {tempPassword && registeredUser && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
                        {/* Close */}
                        <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                        </button>

                        <div className="text-center mb-5">
                            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <CheckCircle className="w-7 h-7 text-green-600" />
                            </div>
                            <h3 className="text-lg font-black text-gray-900">Registration Successful!</h3>
                            <p className="text-sm text-gray-500 mt-1">{registeredUser.name} has been registered as <span className="font-bold text-primary capitalize">{registeredUser.role}</span></p>
                        </div>

                        {/* User Details */}
                        <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-1.5">
                            <p className="text-xs text-gray-500">Name: <span className="font-bold text-gray-800">{registeredUser.name}</span></p>
                            <p className="text-xs text-gray-500">Email: <span className="font-bold text-gray-800">{registeredUser.email}</span></p>
                            <p className="text-xs text-gray-500">Role: <span className="font-bold text-gray-800 capitalize">{registeredUser.role}</span></p>
                        </div>

                        {/* Temp Password */}
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-4">
                            <p className="text-xs font-bold text-amber-700 uppercase tracking-widest mb-2">⚠️ Temporary Password — Share Once Only!</p>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 text-lg font-black text-amber-900 tracking-widest">
                                    {showPassword ? tempPassword : "••••••••"}
                                </code>
                                <button onClick={() => setShowPassword((v) => !v)} className="text-amber-600 hover:text-amber-800 p-1">
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={copyPassword}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${copied ? "bg-green-100 text-green-700" : "bg-amber-200 text-amber-800 hover:bg-amber-300"
                                        }`}
                                >
                                    {copied ? <><CheckCircle className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                                </button>
                            </div>
                        </div>

                        <p className="text-xs text-gray-400 text-center mb-4">
                            This password will <strong>not be shown again</strong> after you close this window. The user can change it after login.
                        </p>

                        <Button variant="primary" fullWidth onClick={closeModal}>
                            Done — I've noted the password
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
