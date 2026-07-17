"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle, User, Briefcase, Image as ImageIcon, CreditCard, Shield, ListTodo, Award, ChevronRight } from "lucide-react";
import { toast } from "react-toastify";
import { getErrorMessage } from "@repo/lib";
import PersonalInfo from "./PersonalInfo";
import TodoList from "./TodoList";
import PayoutInfo from "./PayoutInfo";
import PortfolioGallery from "./PortfolioGallery";
import VerificationAndDocuments from "./VerificationAndDocuments";
import ExpertiseAvailability from "./ExpertiseAvailability";
import { 
    Profile, 
    Todo, 
    DocumentItem, 
    ExperienceItem, 
    Gender 
} from "@/types/profile";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfile, constructProfilePayload } from "@/hooks/useProfile";
import { uploadDocument } from "@/lib/profile";
import { ProfileSkeleton } from "../dashboard/DashboardSkeletons";
import { Loading } from "@repo/ui";

const ProfileManagement = () => {
    const { user: authUser } = useAuthStore();
    const { 
        profile: fetchedProfile, 
        isLoading, 
        hasProfile, 
        todos, 
        updateSection, 
        todoActions 
    } = useProfile();

    const [editMode, setEditMode] = useState<string | null>(null);
    const [tempProfile, setTempProfile] = useState<Profile | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [loadingText, setLoadingText] = useState("Please wait...");
    const [pendingProfilePicFile, setPendingProfilePicFile] = useState<File | null>(null);
    const [activeTab, setActiveTab] = useState("about-expert");

    const navigationItems = [
        { id: "about-expert", label: "About Expert", icon: User },
        { id: "expertise-pricing", label: "Expertise & Pricing", icon: Briefcase },
        { id: "portfolio-media", label: "Portfolio & Media", icon: ImageIcon },
        { id: "payout-bank", label: "Payout & Bank Info", icon: CreditCard },
        { id: "kyc-documents", label: "KYC & Documents", icon: Shield },
        { id: "certificates", label: "Certificates", icon: Award },
        { id: "todo-list", label: "My Todo List", icon: ListTodo },
    ];

    // ScrollSpy Effect using IntersectionObserver
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: "-145px 0px -50% 0px", // offset for sticky main header + stepper + breathing room
            threshold: 0,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveTab(entry.target.id);
                }
            });
        }, observerOptions);

        navigationItems.forEach((item) => {
            const el = document.getElementById(item.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    // Sync tempProfile when fetchedProfile arrives
    useEffect(() => {
        if (fetchedProfile && !tempProfile) {
            setTempProfile(fetchedProfile);
        }
    }, [fetchedProfile, tempProfile]);

    const handleEditClick = (section: string) => {
        setEditMode(section);
        setTempProfile(fetchedProfile || null);
    };

    const handleCancel = () => {
        setEditMode(null);
        if (tempProfile?.profilePic?.startsWith('blob:')) {
            URL.revokeObjectURL(tempProfile.profilePic);
        }
        setPendingProfilePicFile(null);
        setTempProfile(fetchedProfile || null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setTempProfile((prev) => prev ? ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }) : null);
    };

    const handleSave = async (section: string, updatedData?: Partial<Profile>) => {
        if (!tempProfile) return;
        setLoadingText("Please wait, saving your changes...");
        setIsSaving(true);
        
        try {
            const dataToSave = updatedData ? { ...tempProfile, ...updatedData } : tempProfile;
            let finalProfilePic = dataToSave.profilePic;

            // Handle pending profile pic upload
            if (section === 'personal' && pendingProfilePicFile) {
                const [uploadRes, uploadError] = await uploadDocument(pendingProfilePicFile);
                if (uploadError) throw uploadError;
                finalProfilePic = uploadRes.fileUrl || uploadRes.url || uploadRes.path;
                setPendingProfilePicFile(null);
            }

            const payload = constructProfilePayload({ ...dataToSave, profilePic: finalProfilePic || "" });
            
            if (payload.name === fetchedProfile?.name) {
                delete (payload as any).name;
            }
            
            await updateSection({ 
                section, 
                data: payload, 
                isNew: !hasProfile 
            });
            
            setEditMode(null);
        } catch (error: any) {
            toast.error(getErrorMessage(error) || "Failed to save profile");
        } finally {
            setIsSaving(false);
        }
    };

    // File Handlers
    const handleUploadDoc = async (file: File, category?: 'aadhar' | 'pan' | 'other', side?: 'front' | 'back') => {
        setLoadingText("Please wait, uploading document...");
        setIsSaving(true);
        const [data, error] = await uploadDocument(file);
        if (error) { 
            toast.error(getErrorMessage(error) || "Upload failed"); 
            setIsSaving(false);
            return; 
        }
        
        const newDoc: DocumentItem = {
            id: Date.now(),
            name: file.name,
            type: file.type,
            url: data.fileUrl || data.url || data.path,
            category,
            side
        };
        const updatedDocs = [...(fetchedProfile?.documents || []), newDoc];
        handleSave("documents", { documents: updatedDocs });
    };

    const handleProfilePicUpdate = (file: File) => {
        const previewUrl = URL.createObjectURL(file);
        setTempProfile(prev => prev ? ({ ...prev, profilePic: previewUrl }) : null);
        setPendingProfilePicFile(file);
        toast.info("Preview updated. Click 'Save' to upload.");
    };

    if (isLoading || !fetchedProfile || !tempProfile) {
        return <ProfileSkeleton />;
    }

    return (
        <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
            {/* Embedded styles to hide scrollbars */}
            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Profile Management</h1>
                <p className="text-gray-600 text-sm sm:text-base">Manage your personal info, expertise, availability, and payout details.</p>
            </div>

            {/* Stepper / Dynamic Navigation Bar */}
            <div className="sticky top-[64px] sm:top-[72px] z-30 bg-gray-50/90 backdrop-blur-md border-b border-gray-200/80 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8 mb-6 py-2 transition-all duration-300">
                <div className="max-w-7xl mx-auto overflow-x-auto scrollbar-hide py-2 flex items-center space-x-3 md:space-x-4 whitespace-nowrap scroll-smooth">
                    {navigationItems.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                            <React.Fragment key={item.id}>
                                <button
                                    onClick={() => {
                                        setActiveTab(item.id);
                                        const el = document.getElementById(item.id);
                                        if (el) {
                                            const yOffset = -140; // Offset for both main header and sticky tab bar + breathing room
                                            const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
                                            window.scrollTo({ top: y, behavior: 'smooth' });
                                        }
                                    }}
                                    className={`flex items-center space-x-2 pb-2 border-b-2 transition-all duration-300 outline-none shrink-0 cursor-pointer hover:cursor-pointer ${
                                        isActive
                                            ? "border-orange-500 text-orange-600 font-bold"
                                            : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200"
                                    }`}
                                >
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                            isActive
                                                ? "bg-orange-500 text-white scale-110 shadow-md shadow-orange-500/20"
                                                : "bg-gray-100 text-gray-400"
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs sm:text-sm font-semibold tracking-wide">{item.label}</span>
                                </button>
                                {index < navigationItems.length - 1 && (
                                    <ChevronRight className="w-4 h-4 text-gray-300 shrink-0" />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            {(() => {
                const kycStatus = (fetchedProfile?.kycStatus || authUser?.kyc_status || authUser?.status || "").toString().toLowerCase();
                const reason = authUser?.rejection_reason || authUser?.rejectionReason || "";
                const isApproved = kycStatus === 'active' || kycStatus === 'approved';
                const isRejected = kycStatus === 'rejected' || (kycStatus === 'pending' && !!reason);

                if (isApproved) return null;
                if (isRejected) {
                    return (
                        <div className="mb-6 bg-rose-50 border-2 border-rose-100 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start gap-4 shadow-sm">
                            <div className="w-12 h-12 rounded-xl bg-rose-500 flex items-center justify-center text-white shrink-0">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-lg font-bold text-rose-900 mb-1">Update Required: Profile Rejected</h4>
                                <p className="text-sm text-rose-700 leading-relaxed italic">&quot;{reason || "Please verify your information and try again."}&quot;</p>
                            </div>
                        </div>
                    );
                }
                return (
                    <div className="mb-6 bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center space-x-3">
                        <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0" />
                        <p className="text-orange-800 font-medium text-sm">Your account is currently inactive. Complete profile and KYC for review.</p>
                    </div>
                );
            })()}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div id="about-expert" className={`w-full h-fit scroll-mt-24 transition-all duration-500 ${activeTab === 'about-expert' ? 'scale-[1.01]' : 'scale-100'}`}>
                    <PersonalInfo
                        profile={fetchedProfile}
                        tempProfile={tempProfile}
                        isEditing={editMode === "personal"}
                        onEdit={() => handleEditClick("personal")}
                        onSave={() => handleSave("personal")}
                        onCancel={handleCancel}
                        onChange={handleChange}
                        onProfilePicUpdate={handleProfilePicUpdate}
                        onLanguageChange={(e) => setTempProfile(p => p ? ({ ...p, languages: e.target.value.split(',') }) : null)}
                        isActive={activeTab === "about-expert"}
                    />
                </div>

                <div id="expertise-pricing" className={`w-full h-fit scroll-mt-24 transition-all duration-500 ${activeTab === 'expertise-pricing' ? 'scale-[1.01]' : 'scale-100'}`}>
                    <ExpertiseAvailability
                        profile={fetchedProfile}
                        tempProfile={tempProfile}
                        isEditing={editMode === "pricing"}
                        onEdit={() => handleEditClick("pricing")}
                        onSave={() => handleSave("pricing")}
                        onCancel={handleCancel}
                        onChange={handleChange}
                        onLanguageChange={(langs) => setTempProfile(p => p ? ({ ...p, languages: langs }) : null)}
                        isActive={activeTab === "expertise-pricing"}
                    />
                </div>

                <div id="portfolio-media" className={`w-full h-fit scroll-mt-24 transition-all duration-500 ${activeTab === 'portfolio-media' ? 'scale-[1.01]' : 'scale-100'}`}>
                    <PortfolioGallery
                        images={fetchedProfile.gallery}
                        videos={fetchedProfile.videos}
                        introVideo={fetchedProfile.video || ""}
                        tempIntroVideo={tempProfile.video || ""}
                        isEditingIntro={editMode === "video"}
                        onEditIntro={() => handleEditClick("video")}
                        onSaveIntro={() => handleSave("portfolio")}
                        onCancelIntro={handleCancel}
                        onIntroVideoChange={handleChange}
                        onUploadIntroVideo={async (f) => {
                            setLoadingText("Please wait, uploading your video...");
                            setIsSaving(true);
                            const [d, e] = await uploadDocument(f);
                            if (!e) await handleSave("portfolio", { video: d.fileUrl || d.url });
                            else {
                                toast.error(getErrorMessage(e) || "Video upload failed");
                                setIsSaving(false);
                            }
                        }}
                        onRemoveIntro={() => handleSave("portfolio", { video: "" })}
                        onAddImage={async (f) => {
                            setLoadingText("Please wait, uploading image...");
                            setIsSaving(true);
                            const [d, e] = await uploadDocument(f);
                            if (!e) await handleSave("portfolio", { gallery: [...fetchedProfile.gallery, d.fileUrl || d.url] });
                            else {
                                toast.error(getErrorMessage(e) || "Image upload failed");
                                setIsSaving(false);
                            }
                        }}
                        onRemoveImage={(idx) => handleSave("portfolio", { gallery: fetchedProfile.gallery.filter((_, i) => i !== idx) })}
                        onAddVideo={(url) => handleSave("portfolio", { videos: [...fetchedProfile.videos, url] })}
                        onRemoveVideo={(idx) => handleSave("portfolio", { videos: fetchedProfile.videos.filter((_, i) => i !== idx) })}
                        onUploadVideoFile={async (f) => {
                            setLoadingText("Please wait, uploading your video...");
                            setIsSaving(true);
                            const [d, e] = await uploadDocument(f);
                            if (!e) await handleSave("portfolio", { videos: [...fetchedProfile.videos, d.fileUrl || d.url] });
                            else {
                                toast.error(getErrorMessage(e) || "Video upload failed");
                                setIsSaving(false);
                            }
                        }}
                        isActive={activeTab === "portfolio-media"}
                    />
                </div>

                <div id="payout-bank" className={`w-full h-fit scroll-mt-24 transition-all duration-500 ${activeTab === 'payout-bank' ? 'scale-[1.01]' : 'scale-100'}`}>
                    <PayoutInfo isActive={activeTab === "payout-bank"} />
                </div>

                <div className={`w-full h-fit lg:col-span-2 transition-all duration-500 ${(activeTab === 'kyc-documents' || activeTab === 'certificates') ? 'scale-[1.005]' : 'scale-100'}`}>
                    <VerificationAndDocuments
                        kycCompleted={fetchedProfile.kycCompleted}
                        onStartKYC={() => toast.info("KYC verification process initiated.")}
                        documents={fetchedProfile.documents || []}
                        onUploadDocument={handleUploadDoc}
                        onDeleteDocument={(id) => handleSave("documents", { documents: fetchedProfile.documents?.filter(d => d.id !== id) })}
                        certificates={fetchedProfile.certificates || []}
                        onUploadCertificate={async (f) => {
                            setLoadingText("Please wait, uploading certificate...");
                            setIsSaving(true);
                            const [d, e] = await uploadDocument(f);
                            if (!e) await handleSave("certificates", { certificates: [...(fetchedProfile.certificates || []), d.fileUrl || d.url] });
                            else {
                                toast.error(getErrorMessage(e) || "Certificate upload failed");
                                setIsSaving(false);
                            }
                        }}
                        activeSection={activeTab}
                    />
                </div>

                <div id="todo-list" className={`w-full h-fit lg:col-span-2 scroll-mt-24 transition-all duration-500 ${activeTab === 'todo-list' ? 'scale-[1.005]' : 'scale-100'}`}>
                    <TodoList
                        todos={todos}
                        onAdd={(t: string) => { todoActions.add(t); }}
                        onToggle={(id: string) => { 
                            const todo = todos.find(t => t.id === id);
                            if (todo) todoActions.toggle({ id, completed: !todo.completed }); 
                        }}
                        onDelete={(id: string) => { todoActions.remove(id); }}
                        isActive={activeTab === "todo-list"}
                    />
                </div>
            </div>
            {isSaving && <Loading fullScreen />}
        </div>
    );
};

export default ProfileManagement;


