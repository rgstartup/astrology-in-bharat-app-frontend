"use client";

import React, { useState, useEffect } from 'react';
import { Star, Edit3, Gift, Save, X, Loader2, Trash2 } from "lucide-react";
import { getProfile, updateProfile } from "@/lib/profile";
import { Profile } from "@/components/ProfileManagement/types";
import { toast } from "react-toastify";

const ServicePricingPage = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newService, setNewService] = useState({ name: "", price: 0, unit: "/ session", description: "" });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      if (data) {
        setProfile(data);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Failed to load pricing data.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (serviceKey: string, currentPrice: number) => {
    setEditMode(serviceKey);
    setTempPrice(currentPrice);
  };

  const handleSave = async (serviceKey: string) => {
    if (!profile) return;

    if (tempPrice < 0) {
      toast.error("Price cannot be negative.");
      return;
    }

    try {
      setSaving(serviceKey);

      // Check if it's a custom service
      if (serviceKey.startsWith('custom-')) {
        const serviceId = serviceKey.replace('custom-', '');
        const updatedCustomServices = (profile.custom_services || []).map(s =>
          s.id === serviceId ? { ...s, price: Number(tempPrice) } : s
        );
        await updateProfile({ custom_services: updatedCustomServices });
        setProfile({ ...profile, custom_services: updatedCustomServices });
      } else {
        const payload = {
          [serviceKey]: Number(tempPrice)
        };
        await updateProfile(payload);
        setProfile({
          ...profile,
          ...payload
        });
      }

      setEditMode(null);
      toast.success("Price updated successfully!");
    } catch (error) {
      console.error("Failed to update price:", error);
      toast.error("Failed to save price.");
    } finally {
      setSaving(null);
    }
  };

  const handleAddNewService = async () => {
    if (!profile || !newService.name || newService.price <= 0) {
      toast.error("Please provide valid service name and price.");
      return;
    }

    try {
      setSaving("new");
      const newItem = {
        id: Date.now().toString(),
        ...newService
      };
      const updatedCustomServices = [...(profile.custom_services || []), newItem];

      await updateProfile({ custom_services: updatedCustomServices });

      setProfile({ ...profile, custom_services: updatedCustomServices });
      setIsAddingNew(false);
      setNewService({ name: "", price: 0, unit: "/ session", description: "" });
      toast.success("New service added successfully!");
    } catch (error) {
      console.error("Failed to add service:", error);
      toast.error("Failed to add new service.");
    } finally {
      setSaving(null);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!profile) return;
    if (!window.confirm("Are you sure you want to remove this service?")) return;

    try {
      const updatedCustomServices = (profile.custom_services || []).filter(s => s.id !== id);
      await updateProfile({ custom_services: updatedCustomServices });
      setProfile({ ...profile, custom_services: updatedCustomServices });
      toast.success("Service removed successfully!");
    } catch (error) {
      console.error("Failed to delete service:", error);
      toast.error("Failed to remove service.");
    }
  };

  const services = [
    {
      name: "Chat Consultation",
      key: "chat_price",
      price: profile?.chat_price || 0,
      unit: "/ min",
      description: "Quick answers through chat with expert astrologers.",
      offer: "10% off first session",
    },
    {
      name: "Call Consultation",
      key: "call_price",
      price: profile?.call_price || 0,
      unit: "/ min",
      description: "Direct voice consultation with Our astrologers.",
      offer: "15% off first session",
    },
    {
      name: "Video Consultation",
      key: "video_call_price",
      price: profile?.video_call_price || 0,
      unit: "/ min",
      description: "Face-to-face video consultation for detailed guidance.",
      offer: "25% off weekends",
    },


    ...(profile?.custom_services || []).map(s => ({
      name: s.name,
      key: `custom-${s.id}`,
      price: s.price,
      unit: s.unit,
      description: s.description || "Custom service provided by expert.",
      offer: "",
      isCustom: true,
      id: s.id
    }))
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-yellow-600" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="max-w-3xl mx-auto text-center mb-12 flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-yellow-700 tracking-tight">
          Services & Pricing
        </h1>
        <p className="text-gray-600 mt-3 text-sm sm:text-lg">
          Manage your services, set attractive pricing, and create offers for your clients.
        </p>
        <button
          onClick={() => setIsAddingNew(true)}
          className="mt-6 bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2.5 rounded-full font-bold shadow-lg transition-all flex items-center gap-2"
        >
          <Star className="w-4 h-4 fill-white" />
          Add Custom Service
        </button>
      </div>

      {/* Add New Service Modal/Form */}
      {isAddingNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsAddingNew(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Add New Service</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Service Name</label>
                <input
                  type="text"
                  placeholder="e.g. Vastu Consultation"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all font-medium"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    placeholder="500"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all font-bold"
                    value={newService.price || ''}
                    onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Unit</label>
                  <select
                    className="w-full px-4 py-[13px] bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all font-medium"
                    value={newService.unit}
                    onChange={(e) => setNewService({ ...newService, unit: e.target.value })}
                  >
                    <option value="/ session">/ session</option>
                    <option value="/ report">/ report</option>
                    <option value="/ hour">/ hour</option>
                    <option value="/ min">/ min</option>
                    <option value="/ year">/ year</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe your service..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-500 transition-all text-sm"
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                />
              </div>

              <button
                onClick={handleAddNewService}
                disabled={saving === "new"}
                className="w-full mt-4 bg-yellow-600 hover:bg-yellow-700 text-white py-4 rounded-2xl font-black text-lg shadow-xl shadow-yellow-600/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {saving === "new" ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "Save Service"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cards Grid */}
      <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
        {services.map((service: any) => (
          <div
            key={service.key}
            className={`relative bg-white p-6 sm:p-7 rounded-2xl shadow-lg hover:shadow-xl transition-all border ${service.isCustom ? 'border-yellow-200' : 'border-gray-200'} group`}
          >
            {/* Floating Star Icon */}
            <div className="absolute -top-4 -right-4 bg-gradient-to-tr from-yellow-500 to-yellow-600 p-2.5 rounded-full shadow-lg group-hover:scale-110 transition-transform">
              <Star className="w-4 h-4 text-white" />
            </div>

            {/* Service Title */}
            <h2 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h2>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-4 leading-relaxed min-h-[40px]">{service.description}</p>

            {/* Price Section */}
            <div className="mb-4">
              {editMode === service.key ? (
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
                    <input
                      type="number"
                      className="w-full pl-7 pr-3 py-2 border-2 border-yellow-500 rounded-lg focus:outline-none font-bold text-lg"
                      value={tempPrice}
                      onChange={(e) => setTempPrice(Number(e.target.value))}
                      autoFocus
                    />
                  </div>
                  <span className="text-gray-500 text-sm font-medium">{service.unit}</span>
                </div>
              ) : (
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-yellow-700">₹{service.price}</span>
                  <span className="text-gray-500 text-sm font-medium">{service.unit}</span>
                </div>
              )}
            </div>

            {/* Offer Tag */}
            {service.offer && (
              <div className="inline-flex items-center px-3 py-1 mb-6 text-xs font-bold text-green-700 bg-green-50 rounded-full border border-green-100">
                <Gift className="w-3.5 h-3.5 mr-1" /> {service.offer}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              {editMode === service.key ? (
                <>
                  <button
                    onClick={() => handleSave(service.key)}
                    disabled={saving === service.key}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl flex items-center justify-center gap-2 font-bold shadow-md transition-all disabled:opacity-50"
                  >
                    {saving === service.key ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Save
                  </button>
                  <button
                    onClick={() => setEditMode(null)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2.5 rounded-xl transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <div className="flex w-full gap-2">
                  <button
                    onClick={() => handleEdit(service.key, service.price)}
                    className="flex-1 bg-yellow-50 hover:bg-yellow-100 text-yellow-700 py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all border border-yellow-100"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit Pricing
                  </button>
                  {service.isCustom && (
                    <button
                      onClick={() => handleDeleteService(service.id)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 p-2.5 rounded-xl transition-all border border-red-100"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicePricingPage;