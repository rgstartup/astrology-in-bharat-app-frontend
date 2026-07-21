"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { api } from "@/lib/api";
import { toast } from "react-toastify";
import {
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  Check,
  Shield,
  User,
  X,
  Loader2,
  RefreshCw,
} from "lucide-react";

// Saare available permissions — backend enum ke saath match karna chahiye
const ALL_PERMISSIONS = [
  { key: "dashboard", label: "Dashboard", category: "Management" },
  { key: "user_management", label: "User Management", category: "Management" },
  { key: "expert_management", label: "Expert Management", category: "Management" },
  { key: "agent_management", label: "Agent Management", category: "Management" },
  { key: "mandir_management", label: "Mandir Management", category: "Management" },
  { key: "shop_management", label: "Shop Management", category: "Management" },
  { key: "order_management", label: "Order Management", category: "Management" },
  { key: "payout_requests", label: "Payout Requests", category: "Finance" },
  { key: "refund_management", label: "Refund Management", category: "Finance" },
  { key: "live_sessions", label: "Live Sessions Monitor", category: "Monitoring" },
  { key: "reviews_moderation", label: "Reviews Moderation", category: "Monitoring" },
  { key: "coupons_offers", label: "Coupons / Offers", category: "Commerce" },
  { key: "products", label: "Products", category: "Commerce" },
  { key: "analytics_dashboard", label: "Analytics Dashboard", category: "Analytics" },
  { key: "settings", label: "Settings", category: "System" },
];

const CATEGORIES = [...new Set(ALL_PERMISSIONS.map((p) => p.category))];

// Random strong password generate karo
function generatePassword(length = 12) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$!";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

interface SubAdmin {
  id: string;
  name: string | null;
  email: string;
  admin_permissions: string[];
  is_blocked: boolean;
  created_at: string;
}

interface DrawerState {
  open: boolean;
  mode: "create" | "edit";
  target: SubAdmin | null;
}

export default function SubAdminsPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  // Sirf SUPER_ADMIN aur ADMIN hi yahan aa sakte hain
  const isSuperAdmin = user?.roles?.some((r: string) =>
    ["admin", "super_admin"].includes(r.toLowerCase())
  );

  const [subAdmins, setSubAdmins] = useState<SubAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [drawer, setDrawer] = useState<DrawerState>({ open: false, mode: "create", target: null });
  const [deleting, setDeleting] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    permissions: [] as string[],
  });
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  // Sub-admins fetch karo
  const fetchSubAdmins = useCallback(async () => {
    setLoading(true);
    const [data, err] = await api.get("/admin/sub-admins");
    if (err) {
      toast.error("Sub-admins load karne mein error");
    } else {
      setSubAdmins(Array.isArray(data) ? data : data?.data ?? []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isSuperAdmin) {
      router.push("/admin/dashboard");
      return;
    }
    fetchSubAdmins();
  }, [isSuperAdmin, fetchSubAdmins, router]);

  // Drawer open karo — create mode
  const openCreate = () => {
    const pwd = generatePassword();
    setForm({ name: "", email: "", password: pwd, permissions: [] });
    setShowPassword(true);
    setDrawer({ open: true, mode: "create", target: null });
  };

  // Drawer open karo — edit mode
  const openEdit = (sa: SubAdmin) => {
    setForm({
      name: sa.name ?? "",
      email: sa.email,
      password: "",
      permissions: sa.admin_permissions ?? [],
    });
    setShowPassword(false);
    setDrawer({ open: true, mode: "edit", target: sa });
  };

  const closeDrawer = () => {
    setDrawer({ open: false, mode: "create", target: null });
  };

  // Permission toggle
  const togglePermission = (key: string) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(key)
        ? prev.permissions.filter((p) => p !== key)
        : [...prev.permissions, key],
    }));
  };

  // Select All / Deselect All
  const toggleAll = () => {
    const allKeys = ALL_PERMISSIONS.map((p) => p.key);
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.length === allKeys.length ? [] : allKeys,
    }));
  };

  // Password copy
  const copyPassword = async () => {
    await navigator.clipboard.writeText(form.password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.permissions.length === 0) {
      toast.error("You must grant access to at least one page");
      return;
    }

    setSaving(true);
    if (drawer.mode === "create") {
      const [, err] = await api.post("/admin/sub-admins", {
        name: form.name,
        email: form.email,
        password: form.password,
        permissions: form.permissions,
      });
      if (err) {
        toast.error(err?.message ?? "Error creating sub-admin");
      } else {
        toast.success("Sub-admin created successfully!");
        closeDrawer();
        fetchSubAdmins();
      }
    } else if (drawer.target) {
      const payload: any = { permissions: form.permissions, name: form.name };
      if (form.password) payload.password = form.password;

      const [, err] = await api.put(`/admin/sub-admins/${drawer.target.id}`, payload);
      if (err) {
        toast.error(err?.message ?? "Error updating sub-admin");
      } else {
        toast.success("Sub-admin updated successfully!");
        closeDrawer();
        fetchSubAdmins();
      }
    }
    setSaving(false);
  };

  // Delete
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name || "Sub-Admin"}"?`)) return;
    setDeleting(id);
    const [, err] = await api.delete(`/admin/sub-admins/${id}`);
    if (err) {
      toast.error("Error deleting sub-admin");
    } else {
      toast.success("Sub-admin deleted successfully");
      fetchSubAdmins();
    }
    setDeleting(null);
  };

  if (!isSuperAdmin) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Shield className="w-7 h-7 text-primary" />
            Sub-Admin Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Create sub-admins and control their page access
          </p>
        </div>
        <div className="flex justify-between sm:justify-end gap-2 w-full sm:w-auto mt-2 sm:mt-0">
          <button
            onClick={fetchSubAdmins}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 bg-[#f97316] text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Sub-Admin
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : subAdmins.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <User className="w-12 h-12 mb-3 opacity-30" />
            <p className="font-medium">No sub-admins found</p>
            <p className="text-sm mt-1">Click the button above to create a new sub-admin</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Name / Email</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Pages Access</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Created At</th>
                  <th className="text-right px-6 py-4 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {subAdmins.map((sa) => (
                  <tr key={sa.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">{sa.name || "—"}</p>
                      <p className="text-gray-400 text-xs mt-0.5">{sa.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(sa.admin_permissions ?? []).length === 0 ? (
                          <span className="text-gray-400 text-xs italic">No access</span>
                        ) : (
                          <>
                            {/* Always show first permission */}
                            {sa.admin_permissions && sa.admin_permissions.length > 0 && (
                              <span className="bg-primary/10 text-primary text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap">
                                {ALL_PERMISSIONS.find((p) => p.key === sa.admin_permissions![0])?.label ?? sa.admin_permissions![0]}
                              </span>
                            )}
                            
                            {/* Show 2nd and 3rd only on sm and above */}
                            {(sa.admin_permissions ?? []).slice(1, 3).map((perm) => (
                              <span
                                key={perm}
                                className="hidden sm:inline-flex bg-primary/10 text-primary text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap"
                              >
                                {ALL_PERMISSIONS.find((p) => p.key === perm)?.label ?? perm}
                              </span>
                            ))}

                            {/* Mobile "+ X more" (if > 1) */}
                            {(sa.admin_permissions ?? []).length > 1 && (
                              <span className="sm:hidden bg-gray-100 text-gray-500 text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap">
                                +{(sa.admin_permissions ?? []).length - 1} more
                              </span>
                            )}

                            {/* Desktop "+ Y more" (if > 3) */}
                            {(sa.admin_permissions ?? []).length > 3 && (
                              <span className="hidden sm:inline-flex bg-gray-100 text-gray-500 text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap">
                                +{(sa.admin_permissions ?? []).length - 3} more
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {new Date(sa.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(sa)}
                          className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(sa.id, sa.name ?? sa.email)}
                          disabled={deleting === sa.id}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition-colors disabled:opacity-50"
                          title="Delete"
                        >
                          {deleting === sa.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Centered Modal */}
      {drawer.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeDrawer}
          />
          {/* Modal Panel */}
          <div className="w-full max-w-lg bg-white max-h-[90vh] rounded-2xl flex flex-col shadow-2xl overflow-y-auto relative z-10">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
               <div>
                 <h3 className="text-lg font-bold text-gray-800">
                   {drawer.mode === "create" ? "Create New Sub-Admin" : "Edit Sub-Admin"}
                 </h3>
                 <p className="text-xs text-gray-400 mt-0.5">
                   {drawer.mode === "create"
                     ? "Fill details and grant page access"
                     : `Update settings for ${drawer.target?.email}`}
                 </p>
               </div>
              <button
                onClick={closeDrawer}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Drawer Body */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
              <div className="px-6 py-5 space-y-5 flex-1">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="e.g., John Payments Manager"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>

                {/* Email — Edit mode mein disabled */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    placeholder="subadmin@example.com"
                    required={drawer.mode === "create"}
                    disabled={drawer.mode === "edit"}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all disabled:bg-gray-50 disabled:text-gray-400"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Password{drawer.mode === "edit" && <span className="text-gray-400 font-normal"> (Leave blank to keep unchanged)</span>}
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                        placeholder={drawer.mode === "create" ? "Password" : "New password (optional)"}
                        required={drawer.mode === "create"}
                        minLength={8}
                        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={copyPassword}
                      disabled={!form.password}
                      className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-40"
                      title="Copy password"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-500" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, password: generatePassword() }))}
                      className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                      title="Generate new password"
                    >
                      <RefreshCw className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Permissions */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-gray-700">
                      Grant Page Access
                    </label>
                    <button
                      type="button"
                      onClick={toggleAll}
                      className="text-xs text-primary hover:underline font-medium"
                    >
                      {form.permissions.length === ALL_PERMISSIONS.length ? "Deselect All" : "Select All"}
                    </button>
                  </div>

                  <div className="space-y-4">
                    {CATEGORIES.map((category) => (
                      <div key={category}>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                          {category}
                        </p>
                        <div className="space-y-2">
                          {ALL_PERMISSIONS.filter((p) => p.category === category).map((perm) => (
                            <label
                              key={perm.key}
                              className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-primary/5 cursor-pointer transition-all"
                            >
                              <input
                                type="checkbox"
                                checked={form.permissions.includes(perm.key)}
                                onChange={() => togglePermission(perm.key)}
                                className="w-4 h-4 accent-primary rounded"
                              />
                              <span className="text-sm text-gray-700 font-medium">{perm.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {form.permissions.length === 0 && (
                    <p className="text-xs text-red-500 mt-2">
                      ⚠️ You must grant access to at least one page
                    </p>
                  )}
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex gap-3 sticky bottom-0">
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || form.permissions.length === 0}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {drawer.mode === "create" ? "Create Sub-Admin" : "Update Sub-Admin"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
