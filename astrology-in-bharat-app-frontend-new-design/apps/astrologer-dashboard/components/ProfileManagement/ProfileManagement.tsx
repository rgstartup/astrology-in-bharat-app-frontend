"use client";

import React, { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { toast } from "react-toastify";
import PersonalInfo from "./PersonalInfo";
import TodoList from "./TodoList";
import LeaveCalendar from "./LeaveCalendar";
import ExpertiseAvailability from "./ExpertiseAvailability";
import PayoutInfo from "./PayoutInfo";
import AddressManagement from "./AddressManagement";
import DetailedExperience from "./DetailedExperience";
import PortfolioGallery from "./PortfolioGallery";
import VerificationAndDocuments from "./VerificationAndDocuments";
import { Todo, LeaveDate, Profile, Gender, DocumentItem, ExperienceItem } from "./types";
import { useAuth } from "@/context/AuthContext";
import { getProfile, updateProfile, createProfile, uploadDocument } from "@/lib/profile";

const ProfileManagement = () => {
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<Profile>({
    name: authUser?.name || "",
    email: authUser?.email || "",
    gender: Gender.OTHER,
    bio: "",
    specialization: "",
    experience_in_years: 0,
    languages: [],
    price: 0,
    bank_details: "",
    is_available: false,
    kycCompleted: false,
    addresses: [],
    profilePic: "",
    certificates: [],
    gallery: [],
    videos: [],
    detailed_experience: [],
  });

  const [editMode, setEditMode] = useState<string | null>(null);
  const [tempProfile, setTempProfile] = useState<Profile>(profile);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Todo List State (Local for now as per previous design)
  const [todos, setTodos] = useState<Todo[]>([
    {
      id: 1,
      text: "Update profile bio",
      completed: false,
      createdAt: new Date(),
    },
    {
      id: 2,
      text: "Upload certificates",
      completed: true,
      createdAt: new Date(),
    },
  ]);

  // Documents State (Local for now)
  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: 1,
      name: "Aadhar Card.pdf",
      type: "application/pdf",
      size: "2.5 MB",
      uploadedAt: new Date("2025-01-01"),
    },
  ]);

  // Leave Management State (Local for now as per previous design)
  const [leaveDates, setLeaveDates] = useState<LeaveDate[]>([
    { id: 1, date: "2025-11-05", reason: "Personal Work" },
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
      const mappedProfile: Profile = {
        name: fullUser.name || "",
        email: fullUser.email || "",
        gender: fullUser.gender || Gender.OTHER,
        bio: fullUser.bio || "",
        specialization: fullUser.specialization || "",
        experience_in_years: fullUser.experience_in_years || 0,
        languages: typeof fullUser.languages === 'string' ? fullUser.languages.split(',').map((l: string) => l.trim()) : (fullUser.languages || []),
        price: fullUser.price || 0,
        bank_details: fullUser.bank_details || "",
        is_available: fullUser.is_available || false,
        kycCompleted: false, // Placeholder
        addresses: fullUser.addresses?.map((a: any) => ({
          line1: a.line1,
          line2: a.line2,
          city: a.city,
          state: a.state,
          country: a.country,
          zipCode: a.zipCode,
          tag: a.tag
        })) || [],
        profilePic: fullUser.avatar || fullUser.user?.avatar || fullUser.profilePic || fullUser.user?.profilePic || "",
        certificates: fullUser.certificates || [],
        gallery: fullUser.gallery || [],
        videos: fullUser.videos || [],
        detailed_experience: fullUser.detailed_experience || [],
        date_of_birth: fullUser.date_of_birth,
      };
      setProfile(mappedProfile);
      setTempProfile(mappedProfile);
      setHasProfile(true);
      setLoading(false);
      return;
    } else {
      console.warn("AuthContext user missing profile fields. Fallback to fetch.");
    }

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
            detailed_experience: data.detailed_experience || [],
            date_of_birth: data.date_of_birth,
          };
          setProfile(mappedProfile);
          setTempProfile(mappedProfile);
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
  }, [authUser]);

  const handleEditClick = (section: string) => {
    if (fetchError) {
      alert(fetchError);
      return;
    }
    setEditMode(section);
    setTempProfile(profile);
  };

  const constructProfilePayload = (dataToSave: Profile) => {
    return {
      gender: dataToSave.gender,
      specialization: dataToSave.specialization,
      bio: dataToSave.bio,
      experience_in_years: Number(dataToSave.experience_in_years),
      languages: dataToSave.languages,
      price: Number(dataToSave.price),
      bank_details: dataToSave.bank_details,
      is_available: dataToSave.is_available,
      date_of_birth: dataToSave.date_of_birth,
      addresses: dataToSave.addresses.map(a => ({
        line1: a.line1,
        line2: a.line2,
        city: a.city,
        state: a.state,
        country: a.country,
        zipCode: a.zipCode,
        tag: a.tag
      })),
      avatar: dataToSave.profilePic,
      gallery: dataToSave.gallery,
      videos: dataToSave.videos,
      detailed_experience: dataToSave.detailed_experience
        .filter((exp: any) => exp && !Array.isArray(exp) && typeof exp === 'object')
        .map((exp: any) => ({
          role: exp.role || exp.title || "Astrologer",
          company: exp.company || exp.organization || "Freelance",
          description: exp.description || "",
          startDate: exp.startDate || new Date().toISOString(),
          endDate: exp.endDate || new Date().toISOString(),
          isCurrent: exp.isCurrent || false,
          location: exp.location || "Remote"
        })),
      certificates: dataToSave.certificates
    };
  };

  const handleSave = async (section: string, updatedData?: Partial<Profile>) => {
    if (fetchError) {
      alert(fetchError);
      return;
    }
    try {
      setLoading(true);
      const dataToSave = updatedData ? { ...tempProfile, ...updatedData } : tempProfile;
      console.log("DEBUG: detailed_experience being saved:", JSON.stringify(dataToSave.detailed_experience, null, 2));
      const payload: any = constructProfilePayload(dataToSave);
      console.log("DEBUG: Final Payload being sent:", JSON.stringify(payload.detailed_experience, null, 2));

      if (Array.isArray(payload.languages)) {
        // If backend returns string, it might expect string.
        // Let's try sending string if it was an array.
        // payload.languages = payload.languages.join(',');
        // Actually, let's keep it as array if TypeScript expects it, 
        // BUT check if backend complains. 
        // User didn't say input must be string.
      }

      if (hasProfile) {
        const res = await updateProfile(payload);
        console.log("DEBUG: API Response after Save:", JSON.stringify(res, null, 2));
      } else {
        const res = await createProfile(payload);
        console.log("DEBUG: API Response after Create:", JSON.stringify(res, null, 2));
        setHasProfile(true);
      }

      setProfile(dataToSave);
      setTempProfile(dataToSave);
      setEditMode(null);
    } catch (err: any) {
      console.error("Failed to save profile:", err);
      if (err.response?.status === 429) {
        alert("Too many requests. Please wait a moment before saving again.");
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
          alert("Too many requests. Please wait a moment.");
        } else {
          alert(`Error: ${errorMessage}`);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditMode(null);
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

      const errorData = err.response?.data;
      let errorMessage = "Failed to upload file. Please try again.";

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

  const handleProfilePicUpdate = async (file: File) => {
    setLoading(true);
    const url = await uploadFile(file);

    if (url) {
      // Update profile immediately
      const updatedProfile = { ...profile, profilePic: url };
      setProfile(updatedProfile);
      setTempProfile(updatedProfile); // Also update temp to prevent reversion

      // Save to backend with FULL payload
      try {
        const payload = constructProfilePayload(updatedProfile);
        await updateProfile(payload);
        toast.success("Profile picture updated successfully!");
      } catch (error) {
        console.error("Failed to save profile picture:", error);
        toast.error("Failed to save profile picture.");
      }
    }
    setLoading(false);
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

  // Detailed Experience Handlers
  const handleAddExperience = (exp: ExperienceItem) => {
    const newExp = [...profile.detailed_experience, exp];
    handleSave("detailed_experience", { detailed_experience: newExp });
  };

  const handleRemoveExperience = (id: number) => {
    const newExp = profile.detailed_experience.filter(e => e.id !== id);
    handleSave("detailed_experience", { detailed_experience: newExp });
  };

  // Todo Functions
  const addTodo = (text: string) => {
    setTodos([
      ...todos,
      {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date(),
      },
    ]);
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Leave Management Functions
  const addLeaveDate = (date: string, reason: string) => {
    setLeaveDates([
      ...leaveDates,
      {
        id: Date.now(),
        date: date,
        reason: reason,
      },
    ]);
  };

  const deleteLeaveDate = (id: number) => {
    setLeaveDates(leaveDates.filter((leave) => leave.id !== id));
  };

  // Document Functions - Now handles certificates too via separate handler or same? 
  // Wait, I need a handler for certificates. VerificationAndDocuments calls onUploadCertificate? 
  // Currently VerificationAndDocuments takes onUploadDocument (for doc items) and has a button for certificate upload but no prop for it in the interface I defined previously?
  // Let's check VerificationAndDocuments props again. 
  // It takes: documents, onUploadDocument, onDeleteDocument, certificates.
  // It has a button "Upload Certificate" but does it use onUploadDocument? No, onUploadDocument is for the "KYC Documents" section.
  // I need to add onUploadCertificate to VerificationAndDocuments props and ProfileManagement handlers.

  const handleUploadDocument = async (file: File) => {
    setLoading(true);
    const url = await uploadFile(file);
    setLoading(false);

    if (url) {
      // For now, documents are local state or server state? 
      // The profile interface has specific fields. 
      // The current "documents" state is local in ProfileManagement (lines 62-70).
      // If the backend has a way to store "documents" (KYC docs) separately, I should use that.
      // The user request mentioned "certificates" specifically.
      // Let's assume onUploadDocument is for "KYC Documents" which might just be stored in 'documents' list for now (mocked or real).
      // Since I don't have a specific field in Profile for "kycDocuments" other than "certificates", I will assume 'documents' need to be stored somewhere.
      // But the previous code had `documents` as local state.

      const newDoc: DocumentItem = {
        id: Date.now(),
        name: file.name,
        type: file.type,
        size: (file.size / (1024 * 1024)).toFixed(2) + " MB",
        uploadedAt: new Date(),
        url: url
      };
      setDocuments([...documents, newDoc]);
      // In a real app we'd save this association to backend. 
      // For now, I will just leave it as local state but with real URL.
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
    setDocuments(documents.filter((doc) => doc.id !== id));
  };

  const handleKYCClick = () => {
    alert(
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

      {!profile.kycCompleted && (
        <div className="mb-6 bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start sm:items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-orange-800 font-medium text-sm sm:text-base">
            Your account is currently inactive and not visible to users. Please complete your KYC verification to activate your profile.
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <PersonalInfo
          profile={profile}
          tempProfile={tempProfile}
          isEditing={editMode === "personal"}
          onEdit={() => handleEditClick("personal")}
          onSave={() => handleSave("personal")}
          onCancel={handleCancel}
          onChange={handleChange}
          onProfilePicUpdate={handleProfilePicUpdate}
        />

        <ExpertiseAvailability
          profile={profile}
          tempProfile={tempProfile}
          isEditing={editMode === "expertise"}
          onEdit={() => handleEditClick("expertise")}
          onSave={() => handleSave("expertise")}
          onCancel={handleCancel}
          onChange={handleChange}
          onLanguageChange={(langs) => setTempProfile(prev => ({ ...prev, languages: langs }))}
        />

        <DetailedExperience
          experiences={profile.detailed_experience}
          onAdd={handleAddExperience}
          onRemove={handleRemoveExperience}
        />

        <AddressManagement
          profile={profile}
          tempProfile={tempProfile}
          isEditing={editMode === "address"}
          onEdit={() => handleEditClick("address")}
          onSave={() => handleSave("address")}
          onCancel={handleCancel}
          onAddressChange={(addresses) => setTempProfile(prev => ({ ...prev, addresses }))}
        />

        {/* New Portfolio Gallery Component */}
        <PortfolioGallery
          images={profile.gallery}
          videos={profile.videos}
          onAddImage={handleAddImage}
          onRemoveImage={handleRemoveImage}
          onAddVideo={handleAddVideo}
          onRemoveVideo={handleRemoveVideo}
          onUploadVideoFile={handleAddVideoFile}
        />

        <PayoutInfo
          bankDetails={profile.bank_details}
          tempBankDetails={tempProfile.bank_details}
          isEditing={editMode === "payout"}
          onEdit={() => handleEditClick("payout")}
          onSave={() => handleSave("payout")}
          onCancel={handleCancel}
          onChange={handleChange}
        />

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

        <LeaveCalendar
          leaveDates={leaveDates}
          onAdd={addLeaveDate}
          onDelete={deleteLeaveDate}
        />
      </div>
    </div>
  );
};

export default ProfileManagement;
