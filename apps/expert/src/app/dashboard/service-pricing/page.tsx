"use client";

import React, { useState, useEffect } from 'react';
import { Star, Edit3, Gift, Trash2, Plus, MessageSquare, Phone, Video, Sparkles } from "lucide-react";
import { getProfile, updateProfile, deletePujaApi } from "@/lib/profile";
import { Profile, PujaService } from "@/components/profile-management/types";
import { PujaModal } from "@/components/shared/PujaModal";
import { toast } from "react-toastify";
import { ServiceModal, ServiceModalService } from "@/components/shared/ServiceModal";
import { ChevronDown } from "lucide-react";
import { PricingSkeleton } from "@/components/dashboard/DashboardSkeletons";
import { getErrorMessage } from "@repo/lib";

// ---- Static suggested pujas ----
const SUGGESTED_PUJAS = [
  "Griha Pravesh Puja", "Satyanarayan Katha", "Ganesh Puja", "Laxmi-Kuber Puja",
  "Vastu Shanti Puja", "Navagraha Shanti Puja", "Maha Mrityunjaya Jaap",
  "Kaal Sarp Dosh Nivaran", "Shani Shanti Puja", "Vivah Puja", "Namkaran Sanskar",
  "Annaprashan", "Mundan Sanskar", "Bhoomi Pujan", "Saraswati Puja",
  "Durga Saptashati Path", "Rudrabhishek", "Mangal Dosh Puja", "Hanuman Chalisa Path"
];

// ---- Static standard services ----
const buildServices = (profile: Profile | null) => [
  {
    key: "chat_price",
    name: "Chat Consultation",
    price: profile?.chat_price ?? 0,
    unit: "/ min",
    description: "Quick answers through chat with expert experts.",
    offer: "",
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
    description: "Direct voice consultation with our experts.",
    offer: "",
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
    description: "Face-to-face video consultation for detailed guidance.",
    offer: "",
    icon: Video,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
    isCustom: false,
  },
  ...(profile?.custom_services || []).map(s => ({
    key: `custom-${s.id}`,
    name: s.name,
    price: s.price,
    unit: s.unit,
    description: s.description || "Custom service provided by expert.",
    offer: "",
    icon: Sparkles,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
    isCustom: true,
    id: s.id,
  }))
];

const ServiceCard = ({ service, onEdit, onDelete }: { service: any, onEdit: (s: any) => void, onDelete: (id: string) => void }) => (
  <div
    className={`relative bg-white p-6 sm:p-7 rounded-2xl shadow-lg hover:shadow-xl transition-all border ${service.isCustom ? 'border-orange-200' : 'border-gray-200'} group flex flex-col`}
  >
    {/* Icon Badge */}
    <div className={`absolute -top-4 -right-4 p-2.5 rounded-full shadow-lg group-hover:scale-110 transition-transform bg-linear-to-tr from-orange-500 to-orange-600`}>
      <service.icon className="w-4 h-4 text-white" />
    </div>

    {/* Title */}
    <h2 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h2>

    {/* Description */}
    <p className="text-gray-900 text-sm mb-4 leading-relaxed min-h-[40px]">
      {service.description}
    </p>

    {/* Price */}
    <div className="mb-4">
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-black text-orange-700">
          ₹{service.price}
        </span>
        <span className="text-gray-900 text-sm font-medium">{service.unit}</span>
      </div>
    </div>

    {/* Offer */}
    {service.offer && (
      <div className="inline-flex items-center px-3 py-1 mb-6 text-xs font-bold text-green-700 bg-green-50 rounded-full border border-green-100 w-fit">
        <Gift className="w-3.5 h-3.5 mr-1" /> {service.offer}
      </div>
    )}

    {/* Actions */}
    <div className="flex gap-2 mt-auto">
      <button
        onClick={() => onEdit(service)}
        className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-xl text-sm shadow-sm transition-all active:scale-95 cursor-pointer hover:cursor-pointer"
      >
        <Edit3 className="w-4 h-4" />
        Edit Pricing
      </button>

      {service.isCustom && (
        <button
          onClick={() => onDelete(service.id)}
          className="flex items-center justify-center px-3 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-xl transition-colors cursor-pointer hover:cursor-pointer"
          aria-label="Delete service"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  </div>
);

const ServicePricingPage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [editTarget, setEditTarget] = useState<any>();
  
  const [pujaModalMode, setPujaModalMode] = useState<"add" | "edit" | null>(null);
  const [pujaEditTarget, setPujaEditTarget] = useState<PujaService | undefined>();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const [data, error] = await getProfile();
      if (error) {
        // 404 is fine, it means the expert hasn't set up their profile yet
        if (error.status !== 404) {
          console.error("Error fetching profile:", error);
          toast.error(getErrorMessage(error) || "Failed to load pricing data.");
        }
      } else if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error(getErrorMessage(error) || "Failed to load pricing data.");
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (svc: ServiceModalService) => {
    setEditTarget(svc);
    setModalMode("edit");
  };

  const openAdd = () => {
    setEditTarget(undefined);
    setModalMode("add");
  };

  const handleSaved = (updated: Profile) => {
    setProfile(updated);
    setModalMode(null);
    setPujaModalMode(null);
  };

  const handleDeleteService = async (id: string) => {
    if (!profile) return;
    if (!window.confirm("Are you sure you want to remove this service?")) return;
    try {
      const updated = (profile.custom_services || []).filter(s => s.id !== id);
      const [_, error] = await updateProfile({ custom_services: updated });
      if (error) {
        toast.error(getErrorMessage(error) || "Failed to remove service.");
        return;
      }
      setProfile({ ...profile, custom_services: updated });
      toast.success("Service removed successfully!");
    } catch (error) {
      console.error("Failed to delete service:", error);
      toast.error(getErrorMessage(error) || "Failed to remove service.");
    }
  };

  const handleDeletePuja = async (id: string) => {
    if (!profile) return;
    if (!window.confirm("Are you sure you want to remove this Puja service?")) return;
    try {
      const [_, error] = await deletePujaApi(id);
      if (error) {
        toast.error(getErrorMessage(error) || "Failed to remove puja service.");
        return;
      }
      const updatedPujas = (profile.pujas || []).filter(p => p.id !== id);
      setProfile({ ...profile, pujas: updatedPujas });
      toast.success("Puja service removed successfully!");
    } catch (error) {
      console.error("Failed to delete puja:", error);
      toast.error(getErrorMessage(error) || "Failed to remove puja service.");
    }
  };

  const openPujaAdd = (name?: string) => {
    if (name) {
      setPujaEditTarget({ name } as any);
    } else {
      setPujaEditTarget(undefined);
    }
    setPujaModalMode("add");
    setIsDropdownOpen(false);
  };

  const openPujaEdit = (puja: PujaService) => {
    setPujaEditTarget(puja);
    setPujaModalMode("edit");
  };

  if (loading) {
    return <PricingSkeleton />;
  }

  const services = buildServices(profile);

  return (
    <div className="p-4 sm:p-8 min-h-screen">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="flex flex-col text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-orange-700 tracking-tight">
            Services &amp; Pricing
          </h1>
          <p className="text-gray-800 mt-2 text-sm sm:text-lg">
            Manage your services, set attractive pricing, and create offers for your clients.
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-full shadow-lg transition-all active:scale-95 cursor-pointer hover:cursor-pointer whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add Custom Service
        </button>
      </div>

      <div className="max-w-6xl mx-auto mb-10">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <MessageSquare className="w-5 h-5 text-orange-600" />
          Consultation Services
        </h2>
        <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.filter(s => !s.key.includes('puja') && !s.isCustom).map((service: any) => (
            <ServiceCard key={service.key} service={service} onEdit={openEdit} onDelete={handleDeleteService} />
          ))}
        </div>
      </div>

      {/* Puja Services Section */}
      <div className="max-w-6xl mx-auto mb-14">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 bg-orange-50/50 p-6 rounded-3xl border border-orange-100/50 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-2xl">
              <Sparkles className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                Puja Services
              </h2>
              <p className="text-sm text-gray-900 font-medium mt-0.5">Manage your sacred ritual offerings</p>
            </div>
          </div>
          <div className="flex flex-nowrap items-center gap-2 sm:gap-3 w-full sm:w-auto mt-2 sm:mt-0">
            <div className="relative group/dropdown flex-1 sm:flex-none" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full justify-center whitespace-nowrap flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 sm:py-2.5 bg-white border border-orange-200 text-orange-600 font-bold text-[11px] min-[375px]:text-xs sm:text-base rounded-2xl shadow-sm transition-all hover:bg-orange-50 active:scale-95 cursor-pointer hover:cursor-pointer"
              >
                Choose Suggested
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {/* Dropdown Menu */}
              <div className={`absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl transition-all z-50 max-h-80 overflow-y-auto py-2 ${isDropdownOpen ? 'opacity-100 visible' : 'opacity-0 invisible md:group-hover/dropdown:opacity-100 md:group-hover/dropdown:visible'}`}>
                <div className="px-4 py-2 text-[10px] font-black uppercase text-gray-700 border-b border-gray-50 mb-1">
                  Common Rituals
                </div>
                {SUGGESTED_PUJAS.map((p) => (
                  <button
                    key={p}
                    onClick={() => openPujaAdd(p)}
                    className="w-full text-left px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors cursor-pointer hover:cursor-pointer"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => openPujaAdd()}
              className="flex-1 sm:flex-none w-full sm:w-auto justify-center whitespace-nowrap group flex items-center gap-1 sm:gap-2 px-2 sm:px-5 py-2 sm:py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-[11px] min-[375px]:text-xs sm:text-base rounded-2xl shadow-lg transition-all active:scale-95 hover:translate-y-[-2px] cursor-pointer hover:cursor-pointer"
            >
              <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
              Add Custom Puja
            </button>
          </div>
        </div>

        {(!profile?.pujas || profile.pujas.length === 0) ? (
          <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-100">
             <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-orange-400" />
             </div>
             <h3 className="text-lg font-bold text-gray-900 mb-1">No Puja Services Added</h3>
             <p className="text-gray-700 text-sm max-w-xs mx-auto">Click the button above to add your first ritual service.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {profile.pujas.map((puja) => (
              <div 
                key={puja.id}
                className="relative bg-white overflow-hidden rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl transition-all hover:translate-y-[-4px] group flex flex-col"
              >
                {/* Puja Image */}
                <div className="relative h-44 bg-gray-100">
                  {puja.puja_image_url ? (
                    <img src={puja.puja_image_url} alt={puja.name} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-orange-50">
                      <Sparkles className="w-10 h-10 text-orange-200" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    {puja.is_online && (
                      <span className="px-2.5 py-1 bg-blue-600/90 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-wider rounded-lg border border-blue-400/30">
                        Online
                      </span>
                    )}
                    {puja.is_home_visit && (
                      <span className="px-2.5 py-1 bg-green-600/90 backdrop-blur-sm text-white text-[9px] font-black uppercase tracking-wider rounded-lg border border-green-400/30">
                        Home Visit
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6 pb-0">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{puja.name}</h3>
                  <p className="text-gray-900 text-xs line-clamp-2 leading-relaxed h-[36px] mb-4">
                    {puja.description}
                  </p>
                </div>

                <div className="px-6 space-y-3 mb-6">
                  {puja.is_online && (
                    <div className="flex justify-between items-center p-2.5 bg-blue-50/50 rounded-xl border border-blue-100/50">
                      <span className="text-xs font-semibold text-blue-700">Online Session</span>
                      <span className="text-sm font-black text-blue-800">₹{puja.online_cost}</span>
                    </div>
                  )}
                  {puja.is_home_visit && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2.5 bg-green-50/50 rounded-xl border border-green-100/50">
                        <span className="text-xs font-semibold text-green-700">Home Visit (Basic)</span>
                        <span className="text-sm font-black text-green-800">₹{puja.home_visit_without_samagri_cost}</span>
                      </div>
                      <div className="flex justify-between items-center p-2.5 bg-orange-50/50 rounded-xl border border-orange-100/50">
                        <span className="text-xs font-semibold text-orange-700">With Samagri</span>
                        <span className="text-sm font-black text-orange-800">₹{puja.home_visit_with_samagri_cost}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6 pt-0 mt-auto flex gap-2">
                  <button
                    onClick={() => openPujaEdit(puja)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-2xl transition-all active:scale-95 cursor-pointer hover:cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Manage
                  </button>
                  <button
                    onClick={() => handleDeletePuja(puja.id!)}
                    className="p-2.5 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-colors cursor-pointer hover:cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Services Section */}
      {services.some(s => s.isCustom) && (
        <div className="max-w-6xl mx-auto mb-10">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Plus className="w-5 h-5 text-orange-600" />
            Custom Services
          </h2>
          <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.filter(s => s.isCustom).map((service: any) => (
              <ServiceCard key={service.key} service={service} onEdit={openEdit} onDelete={handleDeleteService} />
            ))}
          </div>
        </div>
      )}

      {/* Shared Service Modal */}
      {modalMode && (
        <ServiceModal
          mode={modalMode}
          service={editTarget}
          profile={profile}
          onClose={() => setModalMode(null)}
          onSaved={handleSaved}
        />
      )}

      {/* Puja Modal */}
      {pujaModalMode && (
        <PujaModal
          mode={pujaModalMode}
          puja={pujaEditTarget}
          onClose={() => setPujaModalMode(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
};

export default ServicePricingPage;
