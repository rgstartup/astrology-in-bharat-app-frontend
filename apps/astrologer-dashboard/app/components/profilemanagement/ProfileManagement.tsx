"use client";

import React, { useState } from "react";
import PersonalInfo from "./PersonalInfo";
import KYCVerification from "./KYCVerification";
import TodoList from "./TodoList";
import LeaveCalendar from "./LeaveCalendar";
import ExpertiseAvailability from "./ExpertiseAvailability";
import Certificates from "./Certificates";
import PayoutInfo from "./PayoutInfo";
import { Todo, LeaveDate, ProfileData } from "./types";

const ProfileManagement = () => {
  const [profile, setProfile] = useState<ProfileData>({
    name: "Astrologer Rajesh Sharma",
    bio: "Experienced Vedic Astrologer helping clients for 10+ years.It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
    specialization: ["Vedic Astrology", "Numerology"],
    experience: "12 years",
    languages: ["English", "Hindi", "Marathi"],
    availability: "Mon - Sat, 10AM - 6PM",
    certificates: ["Vedic Astrology Certification", "Tarot Reading Diploma"],
    bankDetails: "UPI: rajesh@upi",
    profilePic: "/images/profile.jpg",
    isProfileActive: true,
    kycCompleted: false,
  });

  const [editMode, setEditMode] = useState<string | null>(null);
  const [tempProfile, setTempProfile] = useState(profile);

  // Todo List State
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
  const [newTodo, setNewTodo] = useState("");

  // Leave Management State
  const [leaveDates, setLeaveDates] = useState<LeaveDate[]>([
    { id: 1, date: "2025-11-05", reason: "Personal Work" },
  ]);
  const [newLeaveDate, setNewLeaveDate] = useState("");
  const [newLeaveReason, setNewLeaveReason] = useState("");

  const handleEditClick = (section: string) => {
    setEditMode(section);
    setTempProfile(profile);
  };

  const handleSave = (section: string) => {
    setProfile(tempProfile);
    setEditMode(null);
  };

  const handleCancel = () => {
    setEditMode(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTempProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Todo Functions
  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: newTodo,
          completed: false,
          createdAt: new Date(),
        },
      ]);
      setNewTodo("");
    }
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
  const addLeaveDate = () => {
    if (newLeaveDate && newLeaveReason.trim()) {
      setLeaveDates([
        ...leaveDates,
        {
          id: Date.now(),
          date: newLeaveDate,
          reason: newLeaveReason,
        },
      ]);
      setNewLeaveDate("");
      setNewLeaveReason("");
    }
  };

  const deleteLeaveDate = (id: number) => {
    setLeaveDates(leaveDates.filter((leave) => leave.id !== id));
  };

  const handleKYCClick = () => {
    alert(
      "KYC verification process will be initiated. Please have your documents ready."
    );
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Profile Management
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Manage your personal info, expertise, availability, and payout
          details.
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Personal Info */}
        <PersonalInfo
          profile={profile}
          editMode={editMode}
          tempProfile={tempProfile}
          handleEditClick={handleEditClick}
          handleChange={handleChange}
          handleSave={handleSave}
          handleCancel={handleCancel}
        />

        {/* KYC Verification Card */}
        <KYCVerification
          kycCompleted={profile.kycCompleted}
          handleKYCClick={handleKYCClick}
        />

        {/* Todo List */}
        <TodoList
          todos={todos}
          newTodo={newTodo}
          setNewTodo={setNewTodo}
          addTodo={addTodo}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
        />

        {/* Leave Calendar */}
        <LeaveCalendar
          leaveDates={leaveDates}
          newLeaveDate={newLeaveDate}
          setNewLeaveDate={setNewLeaveDate}
          newLeaveReason={newLeaveReason}
          setNewLeaveReason={setNewLeaveReason}
          addLeaveDate={addLeaveDate}
          deleteLeaveDate={deleteLeaveDate}
        />

        {/* Expertise & Availability */}
        <ExpertiseAvailability profile={profile} />

        {/* Certificates */}
        <Certificates certificates={profile.certificates} />

        {/* Bank Details */}
        <PayoutInfo bankDetails={profile.bankDetails} />
      </div>
    </div>
  );
};

export default ProfileManagement;