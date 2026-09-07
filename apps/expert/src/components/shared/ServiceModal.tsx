"use client";

import React, { useEffect, useState } from "react";
import { X, Sparkles, Save } from "lucide-react";
import { toast } from "react-toastify";
import { getProfile, updateProfile, updatePricing } from "@/lib/profile";
import { Loading } from "@repo/ui";
import { getErrorMessage } from "@repo/lib/utils/error";
import { Profile, CustomService } from "@/components/profile-management/types";

// ---------- Types ----------
export interface ServiceModalService {
  key: string;           // "chat_price" | "call_price" | "video_call_price" | "custom-<id>"
  name: string;
  price: number;
  unit: string;
  description?: string;
  isCustom?: boolean;
  id?: string;           // only for custom services
}

export type ServiceModalMode = "add" | "edit";

interface ServiceModalProps {
  mode: ServiceModalMode;
  /** Required when mode === "edit" */
  service?: ServiceModalService;
  profile: Profile | null;
  onClose: () => void;
  /** Called after a successful save so parent can refresh */
  onSaved: (updatedProfile: Profile) => void;
}

const UNIT_OPTIONS = ["/ min", "/ session", "/ report", "/ hour", "/ year"];

// ---------- Component ----------
export function ServiceModal({
  mode,
  service,
  profile,
  onClose,
  onSaved,
}: ServiceModalProps) {
  const isEdit = mode === "edit";

  // Form state
  const [name, setName] = useState(isEdit ? service?.name ?? "" : "");
  const [price, setPrice] = useState<number>(isEdit ? service?.price ?? 0 : 0);
  const [unit, setUnit] = useState(isEdit ? service?.unit ?? "/ session" : "/ session");
  const [description, setDescription] = useState(isEdit ? service?.description ?? "" : "");
  const [saving, setSaving] = useState(false);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSave = async () => {
    if (!profile) return;

    if (price < 0) {
      toast.error("Price cannot be negative.");
      return;
    }

    // Add mode → always creates a custom service
    if (!isEdit) {
      if (!name.trim()) {
        toast.error("Please provide a service name.");
        return;
      }
      if (price <= 0) {
        toast.error("Please provide a valid price.");
        return;
      }
      try {
        setSaving(true);
        const newItem: CustomService = {
          id: Date.now().toString(),
          name: name.trim(),
          price,
          unit,
          description: description.trim(),
        };
        const updated = [...(profile.custom_services || []), newItem];
        const [res, error] = await updateProfile({ custom_services: updated });
        if (error) {
          toast.error(getErrorMessage(error) || "Failed to add service.");
          return;
        }
        onSaved({ ...profile, custom_services: updated });
        toast.success("Service added successfully!");
        onClose();
      } catch (err: any) {
        toast.error(getErrorMessage(err) || "Failed to add service.");
      } finally {
        setSaving(false);
      }
      return;
    }

    // Edit mode
    if (!service) return;

    try {
      setSaving(true);
      if (service.isCustom && service.id) {
        const updated = (profile.custom_services || []).map((s) =>
          s.id === service.id
            ? { ...s, name: name.trim(), price, unit, description: description.trim() }
            : s
        );
        const [_, error] = await updateProfile({ custom_services: updated });
        if (error) {
          toast.error(getErrorMessage(error) || "Failed to save service.");
          return;
        }
        onSaved({ ...profile, custom_services: updated });
      } else {
        // Standard pricing field
        const payload = { [service.key]: Number(price) };
        const [_, error] = await updatePricing(payload);
        if (error) {
          toast.error(getErrorMessage(error) || "Failed to save pricing.");
          return;
        }
        onSaved({ ...profile, ...payload } as Profile);
      }
      toast.success("Service updated successfully!");
      onClose();
    } catch (err: any) {
      toast.error(getErrorMessage(err) || "Failed to save service.");
    } finally {
      setSaving(false);
    }
  };

  const isStandard = isEdit && !service?.isCustom;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Card */}
      <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 mb-1">
          {isEdit ? "Edit Service" : "Add New Service"}
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          {isEdit
            ? isStandard
              ? "Update the price for this standard service."
              : "Update details for your custom service."
            : "Create a new custom service for your clients."}
        </p>

        <div className="space-y-4">
          {/* Name — editable for custom only */}
          {(!isStandard) && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Service Name
              </label>
              <input
                type="text"
                placeholder="e.g. Vastu Consultation"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isStandard}
              />
            </div>
          )}

          {/* Standard service — show read-only name */}
          {isStandard && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Service
              </label>
              <div className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-800 font-semibold text-sm">
                {service?.name}
              </div>
            </div>
          )}

          {/* Price + Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Price (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  min={0}
                  placeholder="0"
                  className="w-full pl-7 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-bold text-sm"
                  value={price || ""}
                  onChange={(e) => setPrice(Number(e.target.value))}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Unit
              </label>
              <select
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium text-sm"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                disabled={isStandard}
              >
                {UNIT_OPTIONS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description — custom only */}
          {!isStandard && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Describe your service…"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all text-sm resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full mt-2 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-black text-base shadow-xl active:scale-95 transition-all disabled:opacity-60"
          >
            {!saving && <Save className="w-5 h-5" />}
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Add Service"}
          </button>
        </div>
      </div>
      {saving && <Loading fullScreen />}
    </div>
  );
}
