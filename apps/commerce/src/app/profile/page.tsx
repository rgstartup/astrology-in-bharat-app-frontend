"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  FileText,
  CreditCard,
  Building2,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Info,
  Loader2,
  Trash2,
  Eye,
  Lock,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMerchantProfile, useUpdateProfile } from "@/hooks/useSettings";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils/cn";
import { Skeleton, SettingsSkeleton } from "@/components/ui/Skeleton";
import { BankDetailsCard } from "./components/BankDetailsCard";

export default function MerchantProfilePage() {
  const { data: profileData, isLoading: isProfileLoading } = useMerchantProfile();
  const profile = profileData?.profile;
  const updateProfileMutation = useUpdateProfile();

  const [isEditingIdentity, setIsEditingIdentity] = useState(false);
  const [isEditingDocs, setIsEditingDocs] = useState(false);
  const [isEditingBank, setIsEditingBank] = useState(false);
  const [savingIdentity, setSavingIdentity] = useState(false);
  const [savingDocs, setSavingDocs] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    gstin: "",
    pan: "",
    bankName: "",
    accountHolder: "",
    accountNumber: "",
    ifsc: "",
  });

  // Files State
  const [files, setFiles] = useState<{
    gstCertificate: File | null;
    panFront: File | null;
    panBack: File | null;
    aadharFront: File | null;
    aadharBack: File | null;
  }>({
    gstCertificate: null,
    panFront: null,
    panBack: null,
    aadharFront: null,
    aadharBack: null,
  });

  // Previews State
  const [previews, setPreviews] = useState<{
    gstCertificate: string | null;
    panFront: string | null;
    panBack: string | null;
    aadharFront: string | null;
    aadharBack: string | null;
  }>({
    gstCertificate: null,
    panFront: null,
    panBack: null,
    aadharFront: null,
    aadharBack: null,
  });

  // Gst Exemption State
  const [isGstExempt, setIsGstExempt] = useState(false);

  // Sync data
  useEffect(() => {
    if (profile) {
      setFormData({
        gstin: profile.gstin || "",
        pan: profile.pan || "",
        bankName: profile.bankName || "",
        accountHolder: profile.accountHolder || "",
        accountNumber: profile.accountNumber || "",
        ifsc: profile.ifsc || "",
      });
      if (profile.isGstExempt) setIsGstExempt(true);
      setPreviews({
        gstCertificate: profile.gstCertificate || null,
        panFront: profile.panFront || null,
        panBack: profile.panBack || null,
        aadharFront: profile.aadharFront || null,
        aadharBack: profile.aadharBack || null,
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value.toUpperCase() }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: keyof typeof files) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      setFiles(prev => ({ ...prev, [type]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [type]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (type: keyof typeof files) => {
    setFiles(prev => ({ ...prev, [type]: null }));
    setPreviews(prev => ({ ...prev, [type]: null }));
  };

  const handleCancelIdentity = () => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        gstin: profile.gstin || "",
        pan: profile.pan || "",
      }));
      if (profile.isGstExempt) setIsGstExempt(true);
    }
    setIsEditingIdentity(false);
  };

  const handleCancelDocs = () => {
    if (profile) {
      setPreviews({
        gstCertificate: profile.gstCertificate || null,
        panFront: profile.panFront || null,
        panBack: profile.panBack || null,
        aadharFront: profile.aadharFront || null,
        aadharBack: profile.aadharBack || null,
      });
      setFiles({ gstCertificate: null, panFront: null, panBack: null, aadharFront: null, aadharBack: null });
    }
    setIsEditingDocs(false);
  };

  const handleSaveIdentity = async () => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (formData.pan && !panRegex.test(formData.pan)) {
      toast.error("Invalid PAN format (e.g. ABCDE1234F)");
      return;
    }
    if (!isGstExempt && !formData.gstin) {
      toast.error("Please provide GSTIN or mark as GST Exempt");
      return;
    }
    const data = new FormData();
    data.append('gstin', formData.gstin);
    data.append('pan', formData.pan);
    data.append('isGstExempt', String(isGstExempt));
    setSavingIdentity(true);
    updateProfileMutation.mutate(data, {
      onSuccess: () => { setIsEditingIdentity(false); setSavingIdentity(false); },
      onError: () => { setSavingIdentity(false); }
    });
  };

  const handleSaveDocs = async () => {
    const hasAnyDoc = files.gstCertificate || files.panFront || files.panBack || files.aadharFront || files.aadharBack;
    if (!hasAnyDoc) {
      toast.error("Please upload at least one document");
      return;
    }
    const data = new FormData();
    if (files.gstCertificate) data.append('gstCertificate', files.gstCertificate);
    if (files.panFront) data.append('panFront', files.panFront);
    if (files.panBack) data.append('panBack', files.panBack);
    if (files.aadharFront) data.append('aadharFront', files.aadharFront);
    if (files.aadharBack) data.append('aadharBack', files.aadharBack);
    setSavingDocs(true);
    updateProfileMutation.mutate(data, {
      onSuccess: () => { setIsEditingDocs(false); setSavingDocs(false); },
      onError: () => { setSavingDocs(false); }
    });
  };

  const onSaveBankAccounts = async (accounts: any[]) => {
    const data = new FormData();
    data.append('bank_accounts', JSON.stringify(accounts));
    
    updateProfileMutation.mutate(data, {
      onSuccess: () => {
        setIsEditingBank(false);
      }
    });
  };

  const isVerified = profile?.status === "active";

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 px-4 pt-4">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-[10px] font-black text-[#fd6410] uppercase tracking-[0.2em]">
            <span>Merchant Central</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-600 font-bold">Merchant Profile</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            Profile & Verification
            {isProfileLoading ? (
               <Skeleton className="h-8 w-32 rounded-full" />
            ) : isVerified ? (
              <div className="flex items-center bg-green-50 text-green-600 text-xs px-3 py-1 rounded-full border border-green-100 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> VERIFIED
              </div>
            ) : (
              <div className="flex items-center bg-amber-50 text-amber-600 text-xs px-3 py-1 rounded-full border border-amber-100 font-bold">
                <AlertCircle className="w-3.5 h-3.5 mr-1.5" /> PENDING VERIFICATION
              </div>
            )}
          </h1>
          <p className="text-gray-700 text-sm font-bold max-w-2xl mt-2">
            Submit your business documents to unlock professional seller tools and enable payouts.
            All documents are stored securely and encrypted.
          </p>
        </div>
      </motion.div>
      
      {isProfileLoading ? (
        <div className="pt-10">
          <SettingsSkeleton />
        </div>
      ) : (
        <>
          {/* Verification Status Alert Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "p-8 rounded-[2.5rem] border-2 border-[#fd6410]/40 hover:border-[#fd6410] shadow-sm transition-all duration-500 overflow-hidden relative group",
          isVerified ? "bg-green-50/50" : "bg-amber-50/50"
        )}
      >
        {/* Background micro-animation */}
        <div className={cn(
          "absolute -right-20 -top-20 w-64 h-64 rounded-full blur-3xl transition-colors duration-1000",
          isVerified ? "bg-green-200/20 group-hover:bg-green-200/40" : "bg-amber-200/20 group-hover:bg-amber-200/40"
        )} />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className={cn(
            "p-5 rounded-[1.5rem] shadow-inner transition-transform duration-500 group-hover:scale-110",
            isVerified ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
          )}>
            {isVerified ? (
              <CheckCircle2 className="w-8 h-8" />
            ) : (
              <div className="relative">
                <Loader2 className="w-8 h-8 animate-spin" />
                <FileText className="w-4 h-4 absolute inset-0 m-auto" />
              </div>
            )}
          </div>
          
          <div className="space-y-2 flex-1">
            <h3 className={cn(
              "text-xl font-black uppercase tracking-tight",
              isVerified ? "text-green-900" : "text-amber-900"
            )}>
              {isVerified ? "Shop Verified & Active" : "Shop Verification Pending"}
            </h3>
            <p className={cn(
              "text-sm font-bold leading-relaxed max-w-3xl",
              isVerified ? "text-green-700/70" : "text-amber-700/70"
            )}>
              {isVerified 
                ? "Congratulations! Your account is now active. You have full access to merchant tools, payouts, and your shop is visible to all users." 
                : "Our team is reviewing your shop documents. Some features may be restricted until verification is complete. Expected time: 24-48 hours."}
            </p>
            
            {!isVerified && (
              <div className="pt-2 flex flex-wrap gap-2">
                {["Reviewing GST & Pan Details", "Compliance Check", "Bank Verification"].map((tag) => (
                  <span key={tag} className="text-[9px] font-black uppercase tracking-widest text-amber-600/70 bg-amber-100/50 px-3 py-1.5 rounded-xl border border-amber-200/50">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {isVerified && (
            <div className="hidden md:block">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-green-100 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Forms */}
        <div className="lg:col-span-12 xl:col-span-8 space-y-8">

          {/* Section 1: Business Identity */}
          <SectionContainer
            title="Business Identity"
            icon={Building2}
            delay={0.1}
            isEditing={isEditingIdentity}
            saving={savingIdentity}
            onEdit={() => setIsEditingIdentity(true)}
            onCancel={handleCancelIdentity}
            onSave={handleSaveIdentity}
          >
            <div className="space-y-6">
              <div className="flex items-center space-x-3 p-4 bg-orange-50/50 rounded-2xl border border-orange-100/50">
                <input 
                  type="checkbox" 
                  id="gstExempt" 
                  checked={isGstExempt}
                  onChange={(e) => setIsGstExempt(e.target.checked)}
                  className={cn("w-5 h-5 accent-[#fd6410]", !isEditingIdentity ? "cursor-not-allowed opacity-50" : "cursor-pointer")}
                  disabled={!isEditingIdentity}
                />
                <label htmlFor="gstExempt" className="text-xs font-bold text-gray-800 cursor-pointer select-none">
                  I don't have a GSTIN / My business is GST exempt 
                  <span className="block text-[10px] text-gray-600 font-bold normal-case mt-0.5">(Only applicable for specific categories/turnovers)</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField 
                  label="GSTIN Number" 
                  name="gstin" 
                  value={formData.gstin} 
                  onChange={handleInputChange}
                  placeholder="22AAAAA0000A1Z5"
                  icon={FileText}
                  hint={isGstExempt ? "Optional" : "15-digit alphanumeric code"}
                  disabled={!isEditingIdentity || isGstExempt}
                />
                <InputField
                  label="PAN Number"
                  name="pan"
                  value={formData.pan}
                  onChange={handleInputChange}
                  placeholder="ABCDE1234F"
                  icon={CreditCard}
                  hint="10-digit alphanumeric code"
                  disabled={!isEditingIdentity}
                />
              </div>
            </div>
          </SectionContainer>

          {/* Section 2: Payout Wallet - Upgraded to Multiple Accounts */}
          <BankDetailsCard 
            profile={profile}
            isEditing={isEditingBank}
            setIsEditing={setIsEditingBank}
            onSave={onSaveBankAccounts}
            saving={updateProfileMutation.isPending}
          />

          {/* Section 3: Document Verification */}
          <SectionContainer
            title="Document Verification Files"
            icon={UploadCloud}
            delay={0.3}
            isEditing={isEditingDocs}
            saving={savingDocs}
            onEdit={() => setIsEditingDocs(true)}
            onCancel={handleCancelDocs}
            onSave={handleSaveDocs}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={cn("transition-opacity duration-500", (isGstExempt || !isEditingDocs) && "opacity-40 grayscale pointer-events-none")}>
                <FileUploadCard 
                  label={isGstExempt ? "GST (Not Required)" : "GST Certificate"} 
                  onFileChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'gstCertificate')}
                  preview={previews.gstCertificate}
                  onRemove={() => removeFile('gstCertificate')}
                  file={files.gstCertificate}
                  disabled={!isEditingDocs || isGstExempt}
                />
              </div>
              <FileUploadCard
                label="PAN (Front)"
                onFileChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'panFront')}
                preview={previews.panFront}
                onRemove={() => removeFile('panFront')}
                file={files.panFront}
                disabled={!isEditingDocs}
              />
              <FileUploadCard 
                label="PAN (Back)" 
                onFileChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'panBack')}
                preview={previews.panBack}
                onRemove={() => removeFile('panBack')}
                file={files.panBack}
                disabled={!isEditingDocs}
              />
              <FileUploadCard 
                label="Aadhar (Front)" 
                onFileChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'aadharFront')}
                preview={previews.aadharFront}
                onRemove={() => removeFile('aadharFront')}
                file={files.aadharFront}
                disabled={!isEditingDocs}
              />
              <FileUploadCard 
                label="Aadhar (Back)" 
                onFileChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, 'aadharBack')}
                preview={previews.aadharBack}
                onRemove={() => removeFile('aadharBack')}
                file={files.aadharBack}
                disabled={!isEditingDocs}
              />
            </div>
          </SectionContainer>
        </div>

        {/* Right Column: Tips & Status */}
        <div className="lg:col-span-12 xl:col-span-4 space-y-6 sticky top-8">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#301118] rounded-[2.5rem] p-8 text-white relative overflow-hidden group"
          >
            {/* Background design elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl group-hover:bg-orange-500/20 transition-all duration-700" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-maroon-500/10 rounded-full blur-3xl" />

            <div className="relative z-10 space-y-6">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white/10 rounded-2xl">
                  <Lock className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="text-lg font-black uppercase tracking-widest">Privacy First</h3>
              </div>

              <p className="text-white/60 text-xs leading-relaxed font-medium">
                Your data is encrypted using AES-256 and stored in compliant regional servers.
                Only authorized admins can access these for verification purposes.
              </p>

              <div className="space-y-4 pt-4">
                <VerificationStep step="1" title="Identity Upload" done={formData.pan.length >= 10} />
                <VerificationStep step="2" title="Bank Integration" done={(profile?.bank_accounts?.length > 0) || formData.accountNumber.length > 8} />
                <VerificationStep step="3" title="Manual Review" done={isVerified} />
              </div>

              <div className="pt-6 border-t border-white/10">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-orange-400 mb-2">
                  <span>Verification Progress</span>
                  <span>{isVerified ? "100%" : "65%"}</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: isVerified ? "100%" : "65%" }}
                    className="h-full bg-gradient-to-r from-orange-500 to-orange-400"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Help */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm space-y-4"
          >
            <div className="flex items-center gap-2 text-[#fd6410]">
              <Info className="w-4 h-4" />
              <h4 className="text-xs font-black uppercase tracking-widest">Why verify?</h4>
            </div>
            <ul className="space-y-3">
              {[
                "Enable direct bank payouts",
                "Higher search visibility",
                "Professional Seller badge",
                "Priority support access"
              ].map((tip, i) => (
                <li key={i} className="flex items-center gap-2 text-xs text-gray-500 font-bold group">
                  <ArrowRight className="w-3 h-3 text-gray-300 group-hover:text-orange-500 transition-colors" />
                  {tip}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </>
  )}
</div>
  );
}

// Sub-components

function SectionContainer({ title, icon: Icon, children, delay, isEditing, saving, onEdit, onCancel, onSave }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white rounded-[2.5rem] border-2 border-[#fd6410] p-8 shadow-sm space-y-8"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-50 rounded-xl">
            <Icon className="w-5 h-5 text-[#fd6410]" />
          </div>
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-[0.2em]">{title}</h3>
        </div>
        {/* Per-section Edit / Cancel / Save buttons */}
        {onEdit && (
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <button
                onClick={onEdit}
                className="flex items-center gap-1.5 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#fd6410] border-2 border-[#fd6410] rounded-xl hover:bg-orange-50 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" /> Edit
              </button>
            ) : (
              <>
                <button
                  onClick={onCancel}
                  className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onSave}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-white bg-[#fd6410] rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50"
                >
                  {saving && <Loader2 className="w-3 h-3 animate-spin" />}
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </>
            )}
          </div>
        )}
      </div>
      {children}
    </motion.div>
  );
}

function InputField({ label, name, value, onChange, placeholder, type = "text", icon: Icon, hint, disabled }: any) {
  return (
    <div className="space-y-2 group">
      <div className="flex items-center justify-between pl-1">
        <label className="text-xs font-black text-gray-700 uppercase tracking-widest">{label}</label>
        {hint && <span className="text-[9px] text-gray-500 font-bold uppercase">{hint}</span>}
      </div>
      <div className="relative">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
            <div className="w-10 h-10 flex items-center justify-center text-orange-400 group-focus-within:text-[#fd6410] transition-colors">
              <Icon className="w-4 h-4" />
            </div>
          </div>
        )}
        <input
          name={name}
          value={value}
          onChange={onChange}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-full pr-5 py-4 bg-white border-2 border-[#fd6410] rounded-[1.5rem] text-sm font-black text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-orange-500/20 transition-all shadow-sm",
            Icon ? "pl-11" : "pl-5",
            disabled && "opacity-60 cursor-not-allowed bg-gray-50 border-gray-200"
          )}
        />
      </div>
    </div>
  );
}

function FileUploadCard({ label, onFileChange, preview, onRemove, file, disabled }: any) {
  const isString = typeof preview === 'string';
  const isImage = isString && (preview.startsWith('data:image') || preview.match(/\.(jpeg|jpg|png|webp)$/i));
  const isPdf = isString && (preview.startsWith('data:application/pdf') || preview.match(/\.pdf$/i));

  return (
    <div className={cn("space-y-2", disabled && "opacity-70 cursor-not-allowed")}>
      <label className="text-xs font-black text-gray-700 uppercase tracking-widest pl-1">{label}</label>
      <div className="relative group aspect-square">
        <div className={cn(
          "w-full h-full rounded-3xl border-2 border-dashed flex flex-col items-center justify-center text-center p-4 transition-all duration-500 overflow-hidden",
          preview
            ? "border-[#fd6410] bg-orange-50/20"
            : "border-[#fd6410] hover:bg-orange-50/20"
        )}>
          {preview ? (
            <AnimatePresence mode="wait">
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full h-full relative"
              >
                {isImage ? (
                  <img src={preview} alt="Document" className="w-full h-full object-cover rounded-2xl" />
                ) : isPdf ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-orange-100 rounded-2xl">
                    <FileText className="w-12 h-12 text-orange-600 mb-2" />
                    <span className="text-[10px] font-black text-orange-800 uppercase px-4 truncate w-full text-center">PDF Loaded</span>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 rounded-2xl">
                    <FileText className="w-12 h-12 text-gray-400 mb-2" />
                    <span className="text-[10px] font-bold text-gray-500 uppercase px-4 truncate w-full">Document Ready</span>
                  </div>
                )}

                {/* Overlay on Hover */}
                {!disabled && (
                  <div className="absolute inset-0 bg-[#301118]/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3">
                    <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors text-white">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button onClick={onRemove} className="p-3 bg-rose-500/20 hover:bg-rose-500/40 rounded-xl transition-colors text-rose-400">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          ) : (
            <>
              <div className="p-4 bg-orange-50/50 rounded-2xl group-hover:scale-110 transition-transform duration-500 text-orange-400 group-hover:text-[#fd6410] group-hover:bg-orange-100/50">
                <UploadCloud className="w-8 h-8" />
              </div>
              <p className="mt-3 text-[10px] font-black uppercase text-gray-800 tracking-widest leading-none">Choose File</p>
              <span className="mt-1 text-[8px] font-bold text-gray-600 uppercase">Max 5MB (PDF/JPG)</span>
            </>
          )}
        </div>
        {!preview && (
          <input
            type="file"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={onFileChange}
            accept="image/*,application/pdf"
          />
        )}
      </div>
    </div>
  );
}

function VerificationStep({ step, title, done }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className={cn(
        "w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black transition-all duration-500",
        done ? "bg-orange-500 text-white" : "bg-white/10 text-white/30"
      )}>
        {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : step}
      </div>
      <span className={cn(
        "text-xs font-bold transition-all duration-500",
        done ? "text-white" : "text-white/30"
      )}>
        {title}
      </span>
    </div>
  );
}
