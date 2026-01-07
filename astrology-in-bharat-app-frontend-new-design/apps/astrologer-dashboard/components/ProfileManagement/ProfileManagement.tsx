"use client";

import React, { useState, useEffect } from "react";
import ProfileHeader from "./ProfileHeader";
import PersonalInfo from "./PersonalInfo";
import KYCVerification from "./KYCVerification";
import TodoList from "./TodoList";
import LeaveCalendar from "./LeaveCalendar";
import ExpertiseAvailability from "./ExpertiseAvailability";
import Certificates from "./Certificates";
import PayoutInfo from "./PayoutInfo";
import AddressManagement from "./AddressManagement";
import { Todo, LeaveDate, Profile, Gender } from "./types";
import apiClient from "@/lib/apiClient";
import { useAuth } from "@/context/AuthContext";

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
  });

  const [editMode, setEditMode] = useState<string | null>(null);
  const [tempProfile, setTempProfile] = useState<Profile>(profile);
  const [loading, setLoading] = useState(true);
  const [hasProfile, setHasProfile] = useState(false);

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

  // Leave Management State (Local for now as per previous design)
  const [leaveDates, setLeaveDates] = useState<LeaveDate[]>([
    { id: 1, date: "2025-11-05", reason: "Personal Work" },
  ]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await apiClient.get('/expert/profile');
        if (res.data) {
          const data = res.data;
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
            profilePic: data.user?.profilePic || "",
            certificates: [], // Placeholder
            date_of_birth: data.date_of_birth,
          };
          setProfile(mappedProfile);
          setTempProfile(mappedProfile);
          setHasProfile(true);
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [authUser]);

  const handleEditClick = (section: string) => {
    setEditMode(section);
    setTempProfile(profile);
  };

  const handleSave = async (section: string) => {
    try {
      setLoading(true);
      const payload = {
        gender: tempProfile.gender,
        specialization: tempProfile.specialization,
        bio: tempProfile.bio,
        experience_in_years: Number(tempProfile.experience_in_years),
        languages: tempProfile.languages,
        price: Number(tempProfile.price),
        bank_details: tempProfile.bank_details,
        is_available: tempProfile.is_available,
        date_of_birth: tempProfile.date_of_birth,
        addresses: tempProfile.addresses.map(a => ({
          line1: a.line1,
          line2: a.line2,
          city: a.city,
          state: a.state,
          country: a.country,
          zipCode: a.zipCode,
          tag: a.tag
        }))
      };

      if (hasProfile) {
        await apiClient.patch('/expert/profile', payload);
      } else {
        await apiClient.post('/expert/profile', payload);
        setHasProfile(true);
      }

      setProfile(tempProfile);
      setEditMode(null);
    } catch (err) {
      console.error("Failed to save profile:", err);
      alert("Failed to save profile changes.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditMode(null);
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
      <ProfileHeader />

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <PersonalInfo
          profile={profile}
          tempProfile={tempProfile}
          isEditing={editMode === "personal"}
          onEdit={() => handleEditClick("personal")}
          onSave={() => handleSave("personal")}
          onCancel={handleCancel}
          onChange={handleChange}
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

        <AddressManagement
          profile={profile}
          tempProfile={tempProfile}
          isEditing={editMode === "address"}
          onEdit={() => handleEditClick("address")}
          onSave={() => handleSave("address")}
          onCancel={handleCancel}
          onAddressChange={(addresses) => setTempProfile(prev => ({ ...prev, addresses }))}
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

        <KYCVerification
          kycCompleted={profile.kycCompleted}
          onStartKYC={handleKYCClick}
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

        <Certificates certificates={profile.certificates || []} />
      </div>
    </div>
  );
};

export default ProfileManagement;
