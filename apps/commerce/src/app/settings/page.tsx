"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  Camera, 
  Store, 
  Phone, 
  MapPin, 
  User as UserIcon, 
  Save, 
  ShieldCheck,
  ChevronRight,
  Video,
  Play,
  ShoppingBag,
  ExternalLink,
  Eye,
  Loader2,
  Clock,
  Navigation
} from "lucide-react";
import { useMerchantProfile, useUpdateProfile, useMerchantProducts } from "@/hooks/useSettings";
import { toast } from "react-toastify";
import { Skeleton, SettingsSkeleton } from "@/components/ui/Skeleton";

export default function ShopProfileSettings() {
  const { data: profileData, isLoading: isProfileLoading } = useMerchantProfile();
  const profile = profileData?.profile;
  const exists = profileData?.exists;
  const updateProfileMutation = useUpdateProfile();
  const { data: productsData, isLoading: isProductsLoading } = useMerchantProducts();

  const products = useMemo(() => {
    console.log('Raw productsData in UI:', productsData);
    if (!productsData) return [];
    if (Array.isArray(productsData)) return productsData;
    const data = (productsData as any);
    const list = data?.data || data?.products || [];
    console.log('Extracted products list:', list);
    return Array.isArray(list) ? list : [];
  }, [productsData]);
  
  const [shopImagePreview, setShopImagePreview] = useState<string | null>(null);
  const [shopVideoPreview, setShopVideoPreview] = useState<string | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-Slider Logic
  useEffect(() => {
    if (products.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScroll = scrollWidth - clientWidth;
        
        // If we are at the end (with a small buffer for subpixel rendering), reset to start
        if (scrollLeft >= maxScroll - 5) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          // Scroll by roughly one product width + gap
          scrollRef.current.scrollBy({ left: 120, behavior: 'smooth' });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [products.length, isPaused]);
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Default to editing mode if profile doesn't exist yet
  useEffect(() => {
    if (exists === false) {
      setIsEditing(true);
    }
  }, [exists]);

  // Real-time Preview State
  const [formData, setFormData] = useState({
    storeName: "",
    managerName: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    openTime: "",
    closeTime: "",
    latitude: "",
    longitude: "",
    trustScore: "",
    description: ""
  });
  const [featuresInput, setFeaturesInput] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [existingGallery, setExistingGallery] = useState<string[]>([]);
  const [selectedGalleryFiles, setSelectedGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  // Sync profile data to form on load
  useEffect(() => {
    if (profile) {
      setFormData({
        storeName: profile.name || "",
        managerName: profile.managerName || "",
        phone: profile.phone || "",
        address: profile.address || "",
        city: profile.city || "",
        pincode: profile.pincode || "",
        openTime: profile.operationalHours?.split(" - ")[0] || "10:00 AM",
        closeTime: profile.operationalHours?.split(" - ")[1] || "08:30 PM",
        latitude: profile.latitude || "",
        longitude: profile.longitude || "",
        trustScore: profile.trustScore || "",
        description: profile.description || ""
      });
      setFeatures(Array.isArray(profile.features) ? profile.features : []);
      setExistingGallery(Array.isArray(profile.gallery) ? profile.gallery : []);
      if (profile.image) setShopImagePreview(profile.image);
      if (profile.video) setShopVideoPreview(profile.video);
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prev) => ({
          ...prev,
          latitude: latitude.toFixed(7),
          longitude: longitude.toFixed(7),
        }));
        setIsDetecting(false);
      },
      (error) => {
        setIsDetecting(false);
      },
      { timeout: 10000 }
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setShopImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
       setSelectedVideo(file);
       setShopVideoPreview(URL.createObjectURL(file));
    }
  };

  const handleAddFeature = () => {
    const trimmed = featuresInput.trim();
    if (trimmed && !features.includes(trimmed)) {
      setFeatures(prev => [...prev, trimmed]);
    }
    setFeaturesInput("");
  };

  const handleRemoveFeature = (f: string) => {
    setFeatures(prev => prev.filter(x => x !== f));
  };

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedGalleryFiles(prev => [...prev, ...files]);
      const newPreviews = files.map(f => URL.createObjectURL(f));
      setGalleryPreviews(prev => [...prev, ...newPreviews]);
    }
    // reset input so same file can be selected again if needed
    e.target.value = '';
  };

  const handleRemoveExistingGalleryImage = (url: string) => {
    setExistingGallery(prev => prev.filter(x => x !== url));
  };

  const handleRemoveNewGalleryImage = (index: number) => {
    setSelectedGalleryFiles(prev => prev.filter((_, i) => i !== index));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    const data = new FormData();
    data.append('name', formData.storeName);
    data.append('managerName', formData.managerName);
    data.append('phone', formData.phone);
    data.append('address', formData.address);
    data.append('city', formData.city);
    data.append('pincode', formData.pincode);
    data.append('operationalHours', `${formData.openTime} - ${formData.closeTime}`);
    data.append('latitude', formData.latitude);
    data.append('longitude', formData.longitude);
    data.append('trustScore', formData.trustScore);
    data.append('description', formData.description);
    data.append('features', JSON.stringify(features));
    data.append('gallery', JSON.stringify(existingGallery));
    
    if (selectedImage) data.append('image', selectedImage);
    if (selectedVideo) data.append('video', selectedVideo);
    selectedGalleryFiles.forEach(file => {
      data.append('gallery', file);
    });

    const res = await updateProfileMutation.mutateAsync(data);
    if (res) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      // Revert local state to saved profile data
      setFormData({
        storeName: profile.name || "",
        managerName: profile.managerName || "",
        phone: profile.phone || "",
        address: profile.address || "",
        city: profile.city || "",
        pincode: profile.pincode || "",
        openTime: profile.operationalHours?.split(" - ")[0] || "10:00 AM",
        closeTime: profile.operationalHours?.split(" - ")[1] || "08:30 PM",
        latitude: profile.latitude || "",
        longitude: profile.longitude || "",
        trustScore: profile.trustScore || "",
        description: profile.description || ""
      });
      setFeatures(Array.isArray(profile.features) ? profile.features : []);
      setExistingGallery(Array.isArray(profile.gallery) ? profile.gallery : []);
      setSelectedGalleryFiles([]);
      setGalleryPreviews([]);
      if (profile.image) setShopImagePreview(profile.image);
      if (profile.video) setShopVideoPreview(profile.video);
      setSelectedImage(null);
      setSelectedVideo(null);
    }
    setIsEditing(false);
  };

  if (isProfileLoading && !profile) {
    return (
      <div className="pt-10">
        <SettingsSkeleton />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20 px-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-8">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-[#fd6410] uppercase tracking-widest mb-1">
            <span>Settings</span>
            <ChevronRight className="w-3 h-3" />
            <span>Shop Profile</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            {isProfileLoading ? <Skeleton className="h-9 w-64" /> : exists ? 'Shop Profile Settings' : 'Complete Your Shop Profile'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isProfileLoading ? <Skeleton className="h-4 w-96" /> : exists 
              ? "Manage your shop's identity and location details for customers."
              : "Set up your shop identity and location to start selling."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isProfileLoading ? (
            <Skeleton className="h-12 w-40 rounded-2xl" />
          ) : !isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center justify-center space-x-2 bg-[#fd6410] text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-900/20 active:scale-95 group"
            >
              <Camera className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <>
              <button 
                onClick={handleCancel}
                className="px-6 py-3.5 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={updateProfileMutation.isPending}
                className="flex items-center justify-center space-x-2 bg-[#fd6410] text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-900/20 active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateProfileMutation.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5 group-hover:animate-pulse" />
                )}
                <span>{updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {isProfileLoading ? (
        <SettingsSkeleton />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Form Controls (8 out of 12) */}
        <div className="lg:col-span-12 xl:col-span-8 space-y-8">
          
          {/* Main Info Card */}
          <div className="bg-white p-8 rounded-[2.5rem] border-2 border-[#fd6410] shadow-sm space-y-8">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
              <UserIcon className="w-4 h-4 text-[#fd6410]" />
              Branding & Media
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Image Upload */}
              <div className="space-y-4">
                <label className="text-xs font-black text-gray-700 uppercase tracking-widest pl-1">Shop Photo</label>
                <div className="relative group w-full h-48">
                  <div className="w-full h-full rounded-[2rem] bg-orange-50/20 border-2 border-dashed border-[#fd6410] flex items-center justify-center overflow-hidden transition-all group-hover:border-[#fd6410]/50">
                    {shopImagePreview ? (
                      <img src={shopImagePreview} alt="Shop Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center p-4">
                        <Store className="w-10 h-10 text-orange-400 mx-auto mb-2" />
                        <span className="text-[10px] font-black text-gray-800 uppercase tracking-wider block">Add Main Photo</span>
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-2 right-2 p-3 bg-[#fd6410] text-white rounded-xl cursor-pointer hover:bg-orange-600 transition-all shadow-lg group-hover:scale-105">
                      <Camera className="w-5 h-5" />
                      <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                    </label>
                  )}
                </div>
              </div>

              {/* Video Upload */}
              <div className="space-y-4">
                <label className="text-xs font-black text-gray-700 uppercase tracking-widest pl-1">Store Video</label>
                <div className="relative group w-full h-48">
                  <div className="w-full h-full rounded-[2rem] bg-orange-50/20 border-2 border-dashed border-[#fd6410] flex items-center justify-center overflow-hidden transition-all group-hover:border-[#fd6410]/50">
                    {shopVideoPreview ? (
                      <video src={shopVideoPreview} className="w-full h-full object-cover" autoPlay muted loop />
                    ) : (
                      <div className="text-center p-4">
                        <Video className="w-10 h-10 text-orange-400 mx-auto mb-2" />
                        <span className="text-[10px] font-black text-gray-800 uppercase tracking-wider block">Add Shop Tour Video</span>
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <label className="absolute bottom-2 right-2 p-3 bg-[#fd6410] text-white rounded-xl cursor-pointer hover:bg-orange-600 transition-all shadow-lg group-hover:scale-105">
                      <Video className="w-5 h-5" />
                      <input type="file" className="hidden" onChange={handleVideoChange} accept="video/*" />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-700 uppercase tracking-widest pl-1">Store Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                     <Store className="w-4 h-4 text-orange-400 group-focus-within:text-[#fd6410] transition-colors" />
                  </div>
                  <input 
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    type="text" 
                    className="w-full pl-11 pr-4 py-4 bg-white border-2 border-[#fd6410] rounded-[1.5rem] text-sm font-black text-gray-900 focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all disabled:text-gray-500 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-700 uppercase tracking-widest pl-1">Manager Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                     <UserIcon className="w-4 h-4 text-orange-400 group-focus-within:text-[#fd6410] transition-colors" />
                  </div>
                  <input 
                    name="managerName"
                    value={formData.managerName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    type="text" 
                    className="w-full pl-11 pr-4 py-4 bg-white border-2 border-[#fd6410] rounded-[1.5rem] text-sm font-black text-gray-900 focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all disabled:text-gray-500 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-700 uppercase tracking-widest pl-1">Mobile Number</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                     <Phone className="w-4 h-4 text-orange-400 group-focus-within:text-[#fd6410] transition-colors" />
                  </div>
                  <input 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    type="tel" 
                    className="w-full pl-11 pr-4 py-4 bg-white border-2 border-[#fd6410] rounded-[1.5rem] text-sm font-black text-gray-900 focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all font-mono disabled:text-gray-500 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-4 md:col-span-2 p-6 bg-orange-50/50 rounded-3xl border-2 border-[#fd6410]">
                <div className="flex items-center gap-2 mb-2">
                   <Clock className="w-4 h-4 text-[#fd6410]" />
                   <h4 className="text-[10px] font-black text-gray-900 uppercase tracking-widest leading-none">Operational Schedule</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-700 uppercase tracking-widest pl-1">Opening Time</label>
                    <div className="relative group">
                      <input 
                        name="openTime"
                        placeholder="e.g. 10:00 AM"
                        value={formData.openTime}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        type="text" 
                        className="w-full px-5 py-4 bg-white border-2 border-[#fd6410] rounded-[1.5rem] text-sm font-black text-gray-900 focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-gray-700 uppercase tracking-widest pl-1">Closing Time</label>
                    <div className="relative group">
                      <input 
                        name="closeTime"
                        placeholder="e.g. 08:30 PM"
                        value={formData.closeTime}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        type="text" 
                        className="w-full px-5 py-4 bg-white border-2 border-[#fd6410] rounded-[1.5rem] text-sm font-black text-gray-900 focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-700 uppercase tracking-widest pl-1">Trust Score (%)</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                     <ShieldCheck className="w-4 h-4 text-orange-400 group-focus-within:text-[#fd6410] transition-colors" />
                  </div>
                  <input 
                    name="trustScore"
                    placeholder="e.g. 99.8"
                    value={formData.trustScore}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    type="text" 
                    className="w-full pl-11 pr-4 py-4 bg-white border-2 border-[#fd6410] rounded-[1.5rem] text-sm font-black text-gray-900 focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all font-mono disabled:text-gray-500 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* About & Specializations Card */}
          <div className="bg-white p-8 rounded-[2.5rem] border-2 border-[#fd6410] shadow-sm space-y-6">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#fd6410]" />
              About Your Shop
            </h3>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-700 uppercase tracking-widest pl-1">Shop Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                disabled={!isEditing}
                rows={4}
                placeholder="Describe your shop — what makes it special, your story, and what customers can expect..."
                className="w-full px-5 py-4 bg-white border-2 border-[#fd6410] rounded-[1.5rem] text-sm font-black text-gray-900 focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all resize-none disabled:text-gray-500 disabled:cursor-not-allowed"
              />
            </div>

            {/* Features / Specializations */}
            <div className="space-y-3">
              <label className="text-xs font-black text-gray-700 uppercase tracking-widest pl-1">Specializations / Features</label>
              <p className="text-[11px] font-bold text-gray-600 pl-1">Add tags like "Rudraksha", "Gemstones", "Vastu", etc.</p>
              
              {/* Tags Display */}
              <div className="flex flex-wrap gap-2 min-h-[40px]">
                {features.map((f, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-50 border border-orange-200 text-orange-700 rounded-2xl text-xs font-bold"
                  >
                    {f}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(f)}
                        className="text-orange-400 hover:text-red-500 transition-colors ml-1 font-black leading-none"
                      >
                        ×
                      </button>
                    )}
                  </span>
                ))}
                {features.length === 0 && (
                  <span className="text-xs text-gray-300 italic">No specializations added yet</span>
                )}
              </div>

              {/* Add Tag Input */}
              {isEditing && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={featuresInput}
                    onChange={e => setFeaturesInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddFeature(); }}}
                    placeholder="Type a specialization and press Enter or Add"
                    className="flex-1 px-5 py-3 bg-white border-2 border-[#fd6410] rounded-[1.5rem] text-sm font-black text-gray-900 focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-5 py-3 bg-[#fd6410] text-white rounded-[1.5rem] text-sm font-bold hover:bg-orange-600 transition-all active:scale-95"
                  >
                    + Add
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Gallery Card */}
          <div className="bg-white p-8 rounded-[2.5rem] border-2 border-[#fd6410] shadow-sm space-y-6">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#fd6410]" />
              Shop Gallery
            </h3>
            <p className="text-[11px] font-bold text-gray-600 pl-1">Add pictures of your products, shop interior, or certificates to build trust.</p>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {/* Existing Gallery Images */}
              {existingGallery.map((url, i) => (
                <div key={`existing-${i}`} className="relative group w-full aspect-square rounded-[1.5rem] overflow-hidden border border-gray-100">
                  <img src={url} alt="Gallery" className="w-full h-full object-cover" />
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingGalleryImage(url)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg scale-90 group-hover:scale-100"
                    >
                      <span className="font-black text-sm leading-none block px-1">×</span>
                    </button>
                  )}
                </div>
              ))}

              {/* Newly Selected Previews */}
              {galleryPreviews.map((url, i) => (
                <div key={`new-${i}`} className="relative group w-full aspect-square rounded-[1.5rem] overflow-hidden border-2 border-orange-200">
                  <img src={url} alt="New Gallery" className="w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <Loader2 className="w-5 h-5 text-white animate-spin drop-shadow-md" />
                  </div>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => handleRemoveNewGalleryImage(i)}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg scale-90 group-hover:scale-100 pointer-events-auto"
                    >
                      <span className="font-black text-sm leading-none block px-1">×</span>
                    </button>
                  )}
                </div>
              ))}

              {/* Add New Button */}
              {isEditing && (
                <label className="w-full aspect-square rounded-[1.5rem] bg-orange-50/20 border-2 border-dashed border-[#fd6410] flex flex-col items-center justify-center cursor-pointer hover:border-[#fd6410]/50 hover:bg-orange-50/50 transition-all group">
                  <Camera className="w-6 h-6 text-orange-400 group-hover:text-[#fd6410] mb-2 transition-colors" />
                  <span className="text-[10px] font-bold text-gray-400 group-hover:text-[#fd6410] uppercase tracking-wider">Add Photo</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleGalleryChange} />
                </label>
              )}

              {/* Empty State */}
              {!isEditing && existingGallery.length === 0 && (
                <div className="col-span-full py-8 text-center bg-gray-50 rounded-[1.5rem] border border-gray-100 border-dashed">
                  <p className="text-sm font-bold text-gray-600">No gallery images added yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Location Card */}
          <div className="bg-white p-8 rounded-[2.5rem] border-2 border-[#fd6410] shadow-sm space-y-8">
            <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#fd6410]" />
              Store Location
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black text-gray-700 uppercase tracking-widest pl-1">Full Address</label>
                <textarea 
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={3} 
                  className="w-full px-5 py-4 bg-white border-2 border-[#fd6410] rounded-[1.5rem] text-sm font-black text-gray-900 focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all resize-none disabled:text-gray-500 disabled:cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-700 uppercase tracking-widest pl-1">City</label>
                <input 
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  type="text" 
                  className="w-full px-5 py-4 bg-white border-2 border-[#fd6410] rounded-[1.5rem] text-sm font-black text-gray-900 focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all disabled:text-gray-500 disabled:cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-700 uppercase tracking-widest pl-1">Pincode</label>
                <input 
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  type="text" 
                  className="w-full px-5 py-4 bg-white border-2 border-[#fd6410] rounded-[1.5rem] text-sm font-black text-gray-900 focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all font-mono disabled:text-gray-500 disabled:cursor-not-allowed"
                />
              </div>

              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-[#fd6410] uppercase tracking-widest pl-1 flex items-center">
                    <Navigation className="w-3 h-3 mr-1" />
                    GPS Coordinates
                  </label>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={handleDetectLocation}
                      disabled={isDetecting}
                      className="flex items-center text-[10px] font-bold bg-[#fd6410]/10 text-[#fd6410] px-3 py-1.5 rounded-full hover:bg-[#fd6410]/20 transition-all border border-[#fd6410]/20 disabled:opacity-50"
                    >
                      {isDetecting ? (
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <Navigation className="w-3 h-3 mr-1" />
                      )}
                      {isDetecting ? "Detecting..." : "Detect My Location"}
                    </button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Latitude</label>
                    <input 
                      name="latitude"
                      placeholder="e.g. 28.6139"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      type="text" 
                      className="w-full px-5 py-4 bg-white border-2 border-[#fd6410] rounded-[1.5rem] text-sm font-black text-gray-900 focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all font-mono disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-1">Longitude</label>
                    <input 
                      name="longitude"
                      placeholder="e.g. 77.2090"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      type="text" 
                      className="w-full px-5 py-4 bg-white border-2 border-[#fd6410] rounded-[1.5rem] text-sm font-black text-gray-900 focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all font-mono disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 italic pl-1">
                  * Coordinates help customers find your shop on the map.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Shop Preview (Sticky) */}
        <div className="lg:col-span-12 xl:col-span-4 self-start sticky top-24 space-y-6">
           <div className="flex items-center justify-between px-4 mb-2">
              <h3 className="text-[10px] font-black text-gray-700 uppercase tracking-[0.2em] flex items-center gap-2">
                <Eye className="w-3 h-3" /> Live Shop Preview
              </h3>
              <div className="flex items-center space-x-1.5 py-1 px-3 bg-green-50 rounded-full border border-green-100">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[9px] font-bold text-green-600 uppercase tracking-widest">Connected</span>
              </div>
           </div>

           {/* Preview Mock Frame */}
           <div className="bg-white rounded-[2.5rem] border-2 border-[#fd6410] shadow-xl overflow-hidden group">
             {/* Main Shop Header Image */}
             <div className="relative h-48 bg-gray-50 overflow-hidden">
                {shopImagePreview ? (
                  <img src={shopImagePreview} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Banner" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
                    <Store className="w-12 h-12 text-orange-200" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-bottom p-6 flex-col justify-end">
                   <h2 className="text-white font-bold text-xl drop-shadow-md truncate">{formData.storeName || "Shop Name"}</h2>
                   <div className="flex items-center text-orange-200 text-[10px] font-bold uppercase tracking-widest mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      {formData.city || "City"}
                   </div>
                </div>
                {shopVideoPreview && (
                   <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/30">
                      <Play className="w-4 h-4 text-white fill-current" />
                   </div>
                )}
             </div>

             {/* Content In Preview */}
             <div className="p-6 space-y-6">
                {/* Store Intro */}
                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                     <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">About Store</span>
                     <div className="flex flex-col items-end">
                        <div className="flex items-center text-rose-500">
                           <ShieldCheck className="w-4 h-4" />
                           <span className="text-[9px] font-bold ml-1 uppercase">Trusted • {formData.trustScore || "99.8"}%</span>
                        </div>
                        <div className="flex items-center text-slate-400 mt-1">
                           <Clock className="w-3 h-3" />
                           <span className="text-[8px] font-bold ml-1 uppercase">{formData.openTime} - {formData.closeTime}</span>
                        </div>
                     </div>
                   </div>
                   
                   <div className="flex items-start space-x-3 text-sm font-bold text-gray-900">
                      <MapPin className="w-4 h-4 text-[#fd6410] shrink-0 mt-0.5" />
                      <p className="line-clamp-2 text-xs leading-relaxed">{formData.address || "Shop Address"}{formData.pincode ? `, ${formData.pincode}` : ""}</p>
                   </div>
                   
                   <div className="flex items-center space-x-3 text-xs font-bold text-gray-900">
                      <Phone className="w-4 h-4 text-[#fd6410] shrink-0" />
                      <p className="font-mono">{formData.phone || "+91 XXXXXXXXXX"}</p>
                   </div>
                </div>

                {/* Video/Media Integration */}
                {shopVideoPreview && (
                  <div className="rounded-2xl overflow-hidden h-32 bg-gray-900 relative group/video">
                     <video src={shopVideoPreview} className="w-full h-full object-cover opacity-70 group-hover/video:opacity-100 transition-opacity" muted loop autoPlay />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/40">
                           <Play className="w-5 h-5 text-white" />
                        </div>
                     </div>
                  </div>
                )}

                {/* Mock Products Grid */}
                 <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-gray-700 uppercase tracking-widest">Popular Products</span>
                      <ShoppingBag className="w-3.5 h-3.5 text-[#fd6410]" />
                    </div>
                    {isProductsLoading ? (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-20 bg-gray-50 rounded-xl animate-pulse" />
                        <div className="h-20 bg-gray-50 rounded-xl animate-pulse" />
                      </div>
                    ) : products?.length > 0 ? (
                      <div 
                        ref={scrollRef}
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                        className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none snap-x cursor-grab active:cursor-grabbing transition-all duration-500"
                      >
                        {products.map((product: any, idx: number) => (
                          <div key={idx} className="h-20 w-24 shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 snap-start shadow-sm">
                             {product.productImage ? (
                               <img 
                                 src={product.productImage} 
                                 alt={product.productName} 
                                 className="w-full h-full object-cover transition-transform group-hover:scale-110"
                               />
                             ) : (
                               <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                 <ShoppingBag className="w-4 h-4 text-gray-300" />
                               </div>
                             )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-20 bg-gray-50 rounded-xl flex items-center justify-center border border-dashed border-[#fd6410]">
                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">No Products Found</span>
                      </div>
                    )}
                 </div>

             </div>
           </div>

           <div className="p-6 bg-orange-50 rounded-[2rem] border-2 border-[#fd6410] space-y-2">
              <p className="text-[10px] text-orange-900 font-bold uppercase tracking-widest">Developer Note</p>
              <p className="text-[11px] text-orange-800/70 leading-relaxed italic">"The changes you make on the left will reflect here instantly. This is exactly how your customer sees your shop."</p>
           </div>
        </div>
      </div>
      )}
    </div>
  );
}
