"use client";
import React, { useEffect, useState } from "react";
import {
  MessageSquare,
  Phone,
  Video,
  Sparkles,
  Plus,
  Edit3,
  Trash2,
} from "@repo/design/lucide";
import { useManageServicesStore } from "@/features/dashboard/store/manage-services.store";
import { cn } from "@repo/design/cn";
import { ServiceModal, ServiceModalService } from "@/components/shared/ServiceModal";
import { toast } from "react-toastify";
import { Loading } from "@repo/ui";
import ManageServicesEmpty from "@/app/[locale]/dashboard/@manage-services/ManageServicesEmpty";

const STANDARD_SERVICES = (profile: any | null) => [
  {
    key: "chat_price",
    name: "Chat Consultation",
    price: profile?.chat_price ?? 0,
    unit: "/ min",
    description: "Quick answers through text chat.",
    icon: MessageSquare,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
    isCustom: false,
  },
  {
    key: "call_price",
    name: "Voice Call",
    price: profile?.call_price ?? 0,
    unit: "/ min",
    description: "Direct voice consultation.",
    icon: Phone,
    iconBg: "bg-green-50",
    iconColor: "text-green-500",
    isCustom: false,
  },
  {
    key: "video_call_price",
    name: "Video Call",
    price: profile?.video_call_price ?? 0,
    unit: "/ min",
    description: "Face-to-face video guidance.",
    icon: Video,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
    isCustom: false,
  },
];

interface ManageConsultationsClientProps {
  initialProfile: any | null;
}

export function ManageConsultationsClient({
  initialProfile,
}: ManageConsultationsClientProps) {
  const { profile, loading, error, fetch, updateService } = useManageServicesStore();
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [editTarget, setEditTarget] = useState<ServiceModalService | undefined>();

  // Hydrate store from server-provided initial data
  useEffect(() => {
    if (initialProfile) {
      useManageServicesStore.setState({ profile: initialProfile });
    } else {
      fetch();
    }
  }, [initialProfile, fetch]);

  const openAdd = () => {
    setEditTarget(undefined);
    setModalMode("add");
  };

  const openEdit = (svc: ServiceModalService) => {
    setEditTarget(svc);
    setModalMode("edit");
  };

  const handleSaved = async (updated: any) => {
    const result = await updateService(updated);
    if (result) {
      setModalMode(null);
      toast.success("Service updated.");
    } else {
      toast.error("Failed to update service.");
    }
  };

  const handleDeleteCustom = async (id: string) => {
    if (!profile) return;
    if (!window.confirm("Remove this service?")) return;
    try {
      const updated = (profile.custom_services || []).filter((s: any) => s.id !== id);
      await updateService({ custom_services: updated });
      useManageServicesStore.setState({
        profile: { ...profile, custom_services: updated },
      });
      toast.success("Service removed.");
    } catch {
      toast.error("Failed to remove service.");
    }
  };

  const standardServices = STANDARD_SERVICES(profile);
  const customServices = (profile?.custom_services || []).map((s: any) => ({
    key: `custom-${s.id}`,
    name: s.name,
    price: s.price,
    unit: s.unit,
    description: s.description || "",
    icon: Sparkles,
    iconBg: "bg-yellow-50",
    iconColor: "text-yellow-500",
    isCustom: true,
    id: s.id,
  }));

  const allServices = [...standardServices, ...customServices];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-orange-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Manage Services</h3>
          <p className="text-xs text-gray-700 mt-0.5">
            Chat · Call · Video · Custom
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>
      {loading && !profile ? (
        <div className="flex items-center justify-center py-10 text-gray-400 gap-2">
          <Loading size="md" text="Loading services..." />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {allServices.map((svc) => (
            <div
              key={svc.key}
              className={cn(
                "relative border rounded-xl p-4 flex flex-col gap-3 hover:shadow-md transition-shadow",
                svc.isCustom ? "border-yellow-200 bg-yellow-50/30" : "border-orange-500 bg-white",
              )}
            >
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${svc.iconBg}`}>
                  <svc.icon className={`w-4 h-4 ${svc.iconColor}`} />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 text-sm leading-tight truncate">
                    {svc.name}
                  </p>
                  {svc.description && (
                    <p className="text-xs text-gray-700 mt-0.5 line-clamp-1">
                      {svc.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-yellow-700">
                  ₹{svc.price}
                </span>
                <span className="text-xs text-gray-700 font-medium">{svc.unit}</span>
              </div>
              <div className="flex items-center gap-2 mt-auto">
                <span
                  className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide",
                    svc.price > 0 ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700",
                  )}
                >
                  {svc.price > 0 ? "Active" : "Not Set"}
                </span>
                <button
                  onClick={() =>
                    openEdit({
                      key: svc.key,
                      name: svc.name,
                      price: svc.price,
                      unit: svc.unit,
                      description: svc.description,
                      isCustom: svc.isCustom,
                      id: (svc as any).id,
                    })
                  }
                  className="ml-auto flex items-center gap-1 text-xs font-semibold text-orange-600 hover:text-orange-800 hover:bg-orange-50 px-2.5 py-1 rounded-lg transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit
                </button>
                {svc.isCustom && (
                  <button
                    onClick={() => handleDeleteCustom((svc as any).id)}
                    className="flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                    aria-label="Delete service"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
          {customServices.length === 0 && (
            <ManageServicesEmpty onAdd={openAdd} />
          )}
        </div>
      )}
      {modalMode && (
        <ServiceModal
          mode={modalMode}
          service={editTarget}
          profile={profile}
          onClose={() => setModalMode(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}
