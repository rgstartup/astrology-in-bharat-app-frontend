"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";
import PersonalInfo from "./PersonalInfo";
import TodoList from "./TodoList";

import PayoutInfo from "./PayoutInfo";
import PortfolioGallery from "./PortfolioGallery";
import VerificationAndDocuments from "./VerificationAndDocuments";
import ExpertiseAvailability from "./ExpertiseAvailability";
import { Todo, LeaveDate, Profile, Gender, DocumentItem, ExperienceItem } from "./types";
import { useAuthStore } from "@/store/useAuthStore";
import {
  getProfile,
  updateProfile,
  createProfile,
  uploadDocument,
  updatePersonalInfo,
  updatePricing,
  updateBankDetails,
  updatePortfolio,
  updateCertificates,
  updateDocuments,
  updateExperience,
  getTodos,
  createTodo,
  updateTodo,
  deleteTodoApi
} from "@/lib/profile";

const ProfileManagement = () => {
  const { user: authUser } = useAuthStore();
  const [profile, setProfile] = useState<Profile>({
    name: authUser?.name || "",
    email: authUser?.email || "",
    gender: Gender.OTHER,
    bio: "",
    specialization: "",
    experience_in_years: 0,
    languages: [],
    price: 0,
    chat_price: 0,
    call_price: 0,
    video_call_price: 0,
    report_price: 0,
    horoscope_price: 0,
    bank_details: "",
    is_available: false,
    kycCompleted: false,
    addresses: [],
    profilePic: "",
    certificates: [],
    gallery: [],
    videos: [],
    video: "",
    detailed_experience: [],
    phoneNumber: "",
    houseNo: "",
    state: "",
    district: "",
    country: "",
    pincode: ""
  });


  const [editMode, setEditMode] = useState<string | null>(null);
  const [tempProfile, setTempProfile] = useState<Profile>(profile);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [pendingProfilePicFile, setPendingProfilePicFile] = useState<File | null>(null);

  // Todo List State - Now synced with backend
  const [todos, setTodos] = useState<Todo[]>([]);

  // Documents State (Local for now)
  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: 1,
      name: "Aadhar Card.pdf",
      type: "application/pdf",
      size: "2.5 MB",
      url: "#",
      uploadedAt: new Date("2025-01-01"),
    },
  ]);



  useEffect(() => {
    if (!authUser?.email) return;

    // Type assertion to access potential profile fields on authUser
    const fullUser = authUser as any;
    console.log("Full User from AuthContext:", fullUser);

    // Check if authUser already has profile data.
    // We check for fields that suggest a profile record exists (beyond basic user info)
    // is_available is a boolean, so check for undefined. price is number.
    if (fullUser && (fullUser.is_available !== undefined || fullUser.price !== undefined || fullUser.bio !== undefined || fullUser.specialization !== undefined)) {
      console.log("Using cached profile data from AuthContext. key fields found.");

      // Extract address from addresses array
      const firstAddress = fullUser.addresses?.[0];

      const mappedProfile: Profile = {
        name: fullUser.name || "",
        email: fullUser.email || "",
        gender: fullUser.gender || Gender.OTHER,
        bio: fullUser.bio || "",
        specialization: fullUser.specialization || "",
        experience_in_years: fullUser.experience_in_years || fullUser.experienceInYears || 0,
        languages: typeof fullUser.languages === 'string' ? fullUser.languages.split(',').map((l: string) => l.trim()) : (fullUser.languages || []),
        price: fullUser.price || 0,
        chat_price: fullUser.chat_price || 0,
        call_price: fullUser.call_price || 0,
        video_call_price: fullUser.video_call_price || 0,
        report_price: fullUser.report_price || 0,
        horoscope_price: fullUser.horoscope_price || 0,
        phoneNumber: fullUser.phoneNumber || fullUser.phone_number || "",
        // Extract address fields from addresses array
        houseNo: firstAddress?.house_no || firstAddress?.houseNo || firstAddress?.line1 || firstAddress?.street || "",
        state: firstAddress?.state || "",
        district: firstAddress?.district || firstAddress?.city || "",
        country: firstAddress?.country || "",
        pincode: firstAddress?.pincode || firstAddress?.zip_code || firstAddress?.zipCode || "",
        bank_details: fullUser.bank_details || fullUser.bankDetails || "",
        is_available: fullUser.is_available ?? fullUser.isAvailable ?? false,
        kycStatus: fullUser.kyc_status || fullUser.kycStatus || fullUser.status || "pending",
        kycCompleted: (fullUser.kyc_status || fullUser.kycStatus || fullUser.status) === 'approved' || (fullUser.kyc_status || fullUser.kycStatus || fullUser.status) === 'active',
        addresses: fullUser.addresses?.map((a: any) => ({
          line1: a.line1 || a.street,
          line2: a.line2,
          city: a.city,
          state: a.state,
          country: a.country,
          zipCode: a.zip_code || a.zipCode,
          pincode: a.pincode,
          houseNo: a.house_no || a.houseNo,
          tag: a.tag
        })) || [],
        profilePic: fullUser.avatar || fullUser.user?.avatar || fullUser.profilePic || fullUser.user?.profilePic || "",
        certificates: fullUser.certificates || [],
        gallery: fullUser.gallery || [],
        videos: fullUser.videos || [],
        video: fullUser.video || "",
        detailed_experience: fullUser.detailed_experience || fullUser.detailedExperience || [],
        date_of_birth: fullUser.date_of_birth || fullUser.dateOfBirth,
        documents: fullUser.documents || [],
      };
      setProfile(mappedProfile);
      setTempProfile(mappedProfile);
      setDocuments(mappedProfile.documents || []);
      setHasProfile(true);
      setLoading(false);
    } else {
      console.warn("AuthContext user missing profile fields. Fallback to fetch.");
      const fetchProfile = async () => {
        try {
          const data = await getProfile();
          console.log("Fetched profile data:", data);
          if (data) {
            const mappedProfile: Profile = {
              name: authUser?.name || data.user?.name || "",
              email: authUser?.email || data.user?.email || "",
              gender: data.gender || Gender.OTHER,
              bio: data.bio || "",
              specialization: data.specialization || "",
              experience_in_years: data.experience_in_years || 0,
              languages: typeof data.languages === 'string' ? data.languages.split(',').map((l: string) => l.trim()) : (data.languages || []),
              price: data.price || 0,
              chat_price: data.chat_price || 0,
              call_price: data.call_price || 0,
              video_call_price: data.video_call_price || 0,
              report_price: data.report_price || 0,
              horoscope_price: data.horoscope_price || 0,
              bank_details: data.bank_details || "",
              is_available: data.is_available || false,
              kycCompleted: false, // Placeholder
              addresses: data.addresses?.map((a: any) => ({
                line1: a.line1,
                line2: a.line2,
                city: a.city,
                state: a.state,
                country: a.country,
                zipCode: a.zipCode,
                tag: a.tag
              })) || [],
              profilePic: data.user?.avatar || data.avatar || data.user?.profilePic || "",
              certificates: data.certificates || [],
              gallery: data.gallery || [],
              videos: data.videos || [],
              video: data.video || "",
              detailed_experience: data.detailed_experience || [],
              date_of_birth: data.date_of_birth,
              documents: data.documents || [],
            };
            setProfile(mappedProfile);
            setTempProfile(mappedProfile);
            setDocuments(mappedProfile.documents || []);
            setHasProfile(true);
          }
        } catch (err: any) {
          // Ignore 404 (Profile not found) as it means new user
          if (err.response?.status !== 404) {
            console.error("Failed to fetch profile:", err);
            setFetchError("Unable to load profile. Please refresh or try again later.");
          } else {
            console.log("Profile not found (404), ensuring hasProfile is false.");
            setHasProfile(false);
          }
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }

    // Always fetch Todos separately to ensure they are loaded regardless of profile cache
    const fetchTodosList = async () => {
      try {
        const todoData = await getTodos();
        setTodos(todoData);
      } catch (todoErr) {
        console.error("Failed to fetch todos:", todoErr);
      }
    };
    fetchTodosList();
  }, [authUser]);

  const handleEditClick = (section: string) => {
    if (fetchError) {
      toast.error(fetchError);
      return;
    }
    setEditMode(section);
    setTempProfile(profile);
  };

  const constructProfilePayload = (dataToSave: Profile) => {
    // Build address object from individual fields
    const addressObject = {
      line1: dataToSave.houseNo || "",
      houseNo: dataToSave.houseNo || "",
      city: dataToSave.district || "",
      district: dataToSave.district || "",
      state: dataToSave.state || "",
      country: dataToSave.country || "",
      zipCode: dataToSave.pincode || "",
      pincode: dataToSave.pincode || ""
    };

    // Only add address to array if at least one field is filled
    const hasAddressData = dataToSave.houseNo || dataToSave.district || dataToSave.state || dataToSave.country || dataToSave.pincode;
    const addressesArray = hasAddressData ? [addressObject] : [];

    return {
      gender: dataToSave.gender,
      specialization: dataToSave.specialization,
      bio: dataToSave.bio,
      experience_in_years: Number(dataToSave.experience_in_years),
      languages: Array.isArray(dataToSave.languages)
        ? dataToSave.languages.map(l => l.trim()).filter(l => l.length > 0)
        : [],
      price: Number(dataToSave.price),
      chat_price: Number(dataToSave.chat_price),
      call_price: Number(dataToSave.call_price),
      video_call_price: Number(dataToSave.video_call_price),
      report_price: Number(dataToSave.report_price),
      horoscope_price: Number(dataToSave.horoscope_price),
      bank_details: dataToSave.bank_details,
      is_available: dataToSave.is_available,
      date_of_birth: dataToSave.date_of_birth,
      phone_number: dataToSave.phoneNumber,
      addresses: addressesArray,
      avatar: dataToSave.profilePic,
      gallery: dataToSave.gallery,
      videos: dataToSave.videos,
      video: dataToSave.video,
      detailed_experience: dataToSave.detailed_experience
        .filter((exp: any) => exp && !Array.isArray(exp) && typeof exp === 'object')
        .map((exp: any) => ({
          id: exp.id || 0,
          role: exp.role || exp.title || "Astrologer",
          company: exp.company || exp.organization || "Freelance",
          description: exp.description || "",
          startDate: exp.startDate || new Date().toISOString(),
          endDate: exp.endDate || new Date().toISOString(),
          isCurrent: exp.isCurrent || false,
          location: exp.location || "Remote"
        })),
      certificates: dataToSave.certificates,
      documents: (dataToSave.documents || []).map(doc => ({
        id: doc.id,
        name: doc.name,
        url: doc.url,
        type: doc.type,
        category: doc.category,
        side: doc.side
      }))
    };
  };

  const handleSave = async (section: string, updatedData?: Partial<Profile>) => {
    if (fetchError) {
      toast.error(fetchError);
      return;
    }
    try {
      setLoading(true);
      const dataToSave = updatedData ? { ...tempProfile, ...updatedData } : tempProfile;
      console.log("DEBUG: detailed_experience being saved:", JSON.stringify(dataToSave.detailed_experience, null, 2));
      const payload: any = constructProfilePayload(dataToSave);
      console.log("DEBUG: Final Payload being sent:", JSON.stringify(payload.detailed_experience, null, 2));

      if (Array.isArray(payload.languages)) {
      }

      // If there's a pending profile pic, upload it first
      if (section === 'personal' && pendingProfilePicFile) {
        toast.info("Uploading profile picture...");
        const uploadedUrl = await uploadFile(pendingProfilePicFile);
        if (uploadedUrl) {
          payload.avatar = uploadedUrl;
          dataToSave.profilePic = uploadedUrl;
          setPendingProfilePicFile(null);
        } else {
          setLoading(false);
          return;
        }
      }

      if (!hasProfile) {
        const res = await createProfile(payload);
        console.log("DEBUG: API Response after Create:", JSON.stringify(res, null, 2));
        setHasProfile(true);
      } else {
        // Segmented Updates based on section
        switch (section) {
          case 'personal':
            await updatePersonalInfo({
              name: payload.name,
              gender: payload.gender,
              bio: payload.bio,
              specialization: payload.specialization,
              experience_in_years: payload.experience_in_years,
              languages: payload.languages,
              date_of_birth: payload.date_of_birth,
              phone_number: payload.phone_number,
              addresses: payload.addresses,
              avatar: payload.avatar
            });
            break;
          case 'pricing':
            await updatePricing({
              price: payload.price,
              chat_price: payload.chat_price,
              call_price: payload.call_price,
              video_call_price: payload.video_call_price,
              report_price: payload.report_price,
              horoscope_price: payload.horoscope_price
            });
            break;
          case 'gallery':
          case 'videos':
          case 'video':
            await updatePortfolio({
              gallery: payload.gallery,
              videos: payload.videos,
              video: payload.video
            });
            break;
          case 'certificates':
            await updateCertificates(payload.certificates);
            break;
          case 'documents':
            await updateDocuments(payload.documents);
            break;
          case 'detailed_experience':
            await updateExperience(payload.detailed_experience);
            break;
          default:
            // Fallback for any other sections
            await updateProfile(payload);
        }
      }

      setProfile(dataToSave);
      setTempProfile(dataToSave);
      setEditMode(null);
      toast.success(`${section.charAt(0).toUpperCase() + section.slice(1).replace('_', ' ')} updated successfully!`);
    } catch (err: any) {
      console.error("Failed to save profile:", err);
      if (err.response?.status === 429) {
        toast.warning("Too many requests. Please wait a moment before saving again.");
      } else {
        const errorData = err.response?.data;
        let errorMessage = "Failed to save profile changes.";
        let fullErrorMessageString = "";

        if (errorData?.message) {
          if (typeof errorData.message === 'string') {
            errorMessage = errorData.message;
            fullErrorMessageString = errorMessage;
          } else if (Array.isArray(errorData.message)) {
            errorMessage = errorData.message.join(", ");
            fullErrorMessageString = errorMessage;
          } else if (typeof errorData.message === 'object') {
            fullErrorMessageString = JSON.stringify(errorData.message);
            errorMessage = "An error occurred (details in console)";
          }
        }

        const isThrottled = fullErrorMessageString.toLowerCase().includes('too many requests');

        if (isThrottled) {
          toast.warning("Too many requests. Please wait a moment.");
        } else {
          toast.error(errorMessage);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditMode(null);
    // Revoke any pending object URL to avoid memory leaks
    if (tempProfile.profilePic && tempProfile.profilePic.startsWith('blob:')) {
      URL.revokeObjectURL(tempProfile.profilePic);
    }
    setPendingProfilePicFile(null);
    setTempProfile(profile);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setTempProfile((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setTempProfile((prev) => ({
      ...prev,
      languages: value.split(',')
    }));
  };

  // File Upload Helper
  const uploadFile = async (file: File): Promise<string | null> => {
    const toastId = toast.loading("Uploading file...");
    try {
      const data = await uploadDocument(file);
      if (data && (data.fileUrl || data.url || data.path)) {
        toast.update(toastId, { render: "Upload successful!", type: "success", isLoading: false, autoClose: 3000 });
        return data.fileUrl || data.url || data.path;
      }
      toast.update(toastId, { render: "Upload failed: No URL returned", type: "error", isLoading: false, autoClose: 5000 });
      return null;
    } catch (err: any) {
      console.error("File upload failed:", err);

      // ApiError from safeFetch uses err.body, not err.response.data
      const errorData = err.body || err.response?.data;
      let errorMessage = "Failed to upload file. Please try again.";

      if (err.message && err.message !== "Network error") {
        errorMessage = err.message;
      }

      if (errorData) {
        if (typeof errorData.message === 'string') {
          errorMessage = errorData.message;
        } else if (typeof errorData.message === 'object' && errorData.message.message) {
          errorMessage = errorData.message.message;
          if (Array.isArray(errorMessage)) {
            errorMessage = errorMessage.join(", ");
          }
        }
      }

      toast.update(toastId, { render: `Upload Error: ${errorMessage}`, type: "error", isLoading: false, autoClose: 5000 });
      return null;
    }
  };

  const handleProfilePicUpdate = (file: File) => {
    // Create a local preview URL
    const previewUrl = URL.createObjectURL(file);

    // If there was a previous pending preview, revoke it
    if (tempProfile.profilePic && tempProfile.profilePic.startsWith('blob:')) {
      URL.revokeObjectURL(tempProfile.profilePic);
    }

    setTempProfile((prev) => ({ ...prev, profilePic: previewUrl }));
    setPendingProfilePicFile(file);
    toast.info("Image preview updated. Click 'Save Changes' to confirm.");
  };

  // Gallery Handlers
  const handleAddImage = async (file: File) => {
    setLoading(true);
    const url = await uploadFile(file);
    setLoading(false);

    if (url) {
      const newGallery = [...profile.gallery, url];
      handleSave("gallery", { gallery: newGallery });
    }
  };

  const handleRemoveImage = (index: number) => {
    const newGallery = profile.gallery.filter((_, i) => i !== index);
    handleSave("gallery", { gallery: newGallery });
  };

  // Video Handlers
  const handleAddVideo = (url: string) => {
    const newVideos = [...profile.videos, url];
    handleSave("videos", { videos: newVideos });
  };

  const handleRemoveVideo = (index: number) => {
    const newVideos = profile.videos.filter((_, i) => i !== index);
    handleSave("videos", { videos: newVideos });
  };

  const handleAddVideoFile = async (file: File) => {
    setLoading(true);
    const url = await uploadFile(file);
    setLoading(false);

    if (url) {
      const newVideos = [...profile.videos, url];
      handleSave("videos", { videos: newVideos });
    }
  };

  const handleUploadIntroVideo = async (file: File) => {
    setLoading(true);
    const url = await uploadFile(file);
    setLoading(false);

    if (url) {
      setTempProfile(prev => ({ ...prev, video: url }));
      handleSave("video", { video: url });
    }
  };

  const handleRemoveIntro = () => {
    if (confirm("Are you sure you want to remove the introduction video?")) {
      handleSave("video", { video: "" });
    }
  };

  // Detailed Experience Handlers
  const handleAddExperience = (exp: ExperienceItem) => {
    const newExp = [...profile.detailed_experience, exp];
    handleSave("detailed_experience", { detailed_experience: newExp });
  };

  const handleRemoveExperience = (id: number) => {
    const newExp = profile.detailed_experience.filter(e => e.id !== id);
    handleSave("detailed_experience", { detailed_experience: newExp });
  };

  // Todo Functions - Now calling backend APIs
  const addTodo = async (text: string) => {
    try {
      const newTodo = await createTodo(text);
      setTodos([...todos, newTodo]);
    } catch (error) {
      toast.error("Failed to add task");
    }
  };

  const toggleTodo = async (id: number) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    try {
      const updatedTodo = await updateTodo(id, { completed: !todo.completed });
      setTodos(todos.map(t => t.id === id ? updatedTodo : t));
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  const deleteTodo = async (id: number) => {
    try {
      await deleteTodoApi(id);
      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };



  // Document Functions - Now handles certificates too via separate handler or same? 
  // Wait, I need a handler for certificates. VerificationAndDocuments calls onUploadCertificate? 
  // Currently VerificationAndDocuments takes onUploadDocument (for doc items) and has a button for certificate upload but no prop for it in the interface I defined previously?
  // Let's check VerificationAndDocuments props again. 
  // It takes: documents, onUploadDocument, onDeleteDocument, certificates.
  // It has a button "Upload Certificate" but does it use onUploadDocument? No, onUploadDocument is for the "KYC Documents" section.
  // I need to add onUploadCertificate to VerificationAndDocuments props and ProfileManagement handlers.

  const handleUploadDocument = async (file: File, category?: 'aadhar' | 'pan' | 'other', side?: 'front' | 'back') => {
    setLoading(true);
    const url = await uploadFile(file);
    setLoading(false);

    if (url) {
      const newDoc: DocumentItem = {
        id: Date.now(),
        name: file.name,
        type: file.type,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        uploadedAt: new Date(),
        url: url,
        category: category,
        side: side
      };

      const updatedDocuments = [...documents, newDoc];
      setDocuments(updatedDocuments);

      // Save to backend
      handleSave("documents", { documents: updatedDocuments });
    }
  };

  const handleUploadCertificate = async (file: File) => {
    setLoading(true);
    const url = await uploadFile(file);
    setLoading(false);

    if (url) {
      const newCertificates = [...(profile.certificates || []), url];
      handleSave("certificates", { certificates: newCertificates });
    }
  };

  const handleDeleteDocument = (id: number) => {
    const updatedDocuments = documents.filter((doc) => doc.id !== id);
    setDocuments(updatedDocuments);

    // Save to backend
    handleSave("documents", { documents: updatedDocuments });
  };

  const handleKYCClick = () => {
    toast.info(
      "KYC verification process will be initiated. Please have your documents ready."
    );
  };

  if (loading && !profile.name) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      {/* Inlined Profile Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Profile Management
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Manage your personal info, expertise, availability, and payout details.
        </p>
      </div>

      {(() => {
        const kycStatus = (authUser?.kycStatus || authUser?.status || "").toString().toLowerCase();
        const reason = authUser?.rejectionReason || authUser?.profile_expert?.rejectionReason || authUser?.kyc_details?.rejectionReason;

        const isApproved = kycStatus === 'active' || kycStatus === 'approved';
        const isRejected = kycStatus === 'rejected' || (kycStatus === 'pending' && !!reason);

        if (isApproved) return null;

        if (isRejected) {
          const displayReason = reason || "Please verify your documents and profile information and try again.";

          return (
            <div className="mb-6 bg-rose-50 border-2 border-rose-100 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start gap-3 sm:gap-4 shadow-sm">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-rose-500 flex items-center justify-center text-white shrink-0">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-base sm:text-lg font-bold text-rose-900 mb-1">Update Required: Profile Rejected</h4>
                <p className="text-xs sm:text-sm text-rose-700 leading-relaxed italic break-words">
                  &quot;{displayReason}&quot;
                </p>
                <p className="mt-3 text-xs font-semibold text-rose-500 uppercase tracking-wider bg-white/50 w-fit px-3 py-1 rounded-full border border-rose-100">
                  Please correct these issues and we&apos;ll re-review your profile
                </p>
              </div>
            </div>
          );
        }

        return (
          <div className="mb-6 bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start sm:items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5 sm:mt-0" />
            <p className="text-orange-800 font-medium text-sm sm:text-base">
              Your account is currently inactive and not visible to users. Please complete your profile and KYC verification for review.
            </p>
          </div>
        );
      })()}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <PersonalInfo
          profile={profile}
          tempProfile={tempProfile}
          isEditing={editMode === "personal"}
          onEdit={() => handleEditClick("personal")}
          onSave={() => handleSave("personal")}
          onCancel={handleCancel}
          onChange={handleChange}
          onProfilePicUpdate={handleProfilePicUpdate}
          onLanguageChange={handleLanguageChange}
        />

        <ExpertiseAvailability
          profile={profile}
          tempProfile={tempProfile}
          isEditing={editMode === "pricing"}
          onEdit={() => handleEditClick("pricing")}
          onSave={() => handleSave("pricing")}
          onCancel={handleCancel}
          onChange={handleChange}
          onLanguageChange={(langs) => setTempProfile(prev => ({ ...prev, languages: langs }))}
        />




        {/* New Portfolio Gallery Component */}
        <PortfolioGallery
          images={profile.gallery}
          videos={profile.videos}
          introVideo={profile.video || ""}
          tempIntroVideo={tempProfile.video || ""}
          isEditingIntro={editMode === "video"}
          onEditIntro={() => handleEditClick("video")}
          onSaveIntro={() => handleSave("video")}
          onCancelIntro={handleCancel}
          onIntroVideoChange={handleChange}
          onUploadIntroVideo={handleUploadIntroVideo}
          onRemoveIntro={handleRemoveIntro}
          onAddImage={handleAddImage}
          onRemoveImage={handleRemoveImage}
          onAddVideo={handleAddVideo}
          onRemoveVideo={handleRemoveVideo}
          onUploadVideoFile={handleAddVideoFile}
        />

        <PayoutInfo />

        {/* New Verification And Documents Component */}
        <VerificationAndDocuments
          kycCompleted={profile.kycCompleted}
          onStartKYC={handleKYCClick}
          documents={documents}
          onUploadDocument={handleUploadDocument}
          onDeleteDocument={handleDeleteDocument}
          certificates={profile.certificates || []}
          onUploadCertificate={handleUploadCertificate}
        />

        <TodoList
          todos={todos}
          onAdd={addTodo}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />

      </div>
    </div>
  );
};

export default ProfileManagement;


