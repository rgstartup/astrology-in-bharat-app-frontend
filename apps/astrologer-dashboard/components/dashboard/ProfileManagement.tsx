"use client";

import React, { useState } from "react";
import { 
  User, 
  Clock, 
  Award, 
  Upload, 
  CreditCard, 
  Edit3, 
  Save, 
  ChevronRight,
  ListTodo,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Calendar as CalendarIcon,
  Shield,
  X
} from "lucide-react";

// Types
interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: Date;
}

interface LeaveDate {
  id: number;
  date: string;
  reason: string;
}

const ProfileManagement = () => {
  const [profile, setProfile] = useState({
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
    { id: 1, text: "Update profile bio", completed: false, createdAt: new Date() },
    { id: 2, text: "Upload certificates", completed: true, createdAt: new Date() },
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
    console.log(`Saving changes for ${section}...`, tempProfile);
  };

  const handleCancel = () => {
    setEditMode(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    setTodos(todos.map((todo) => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
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
    // Navigate to KYC page or open KYC modal
    console.log("Navigating to KYC completion...");
    alert("KYC verification process will be initiated. Please have your documents ready.");
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Profile Management</h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Manage your personal info, expertise, availability, and payout details.
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Personal Info */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-4">
            <div className="relative w-20 h-20 rounded-full bg-gray-200">
              <img
                src={profile.profilePic}
                alt="Profile"
                className="w-full h-full object-cover rounded-full border-2 border-yellow-500 shadow-md"
              />
            </div>
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold">{profile.name}</h2>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                {profile.isProfileActive ? (
                  <span className="bg-green-100 text-green-700 text-xs font-semibold px-2 py-1 rounded-full">
                    Active
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded-full">
                    Inactive
                  </span>
                )}
                {profile.specialization.map((spec, i) => (
                  <span key={i} className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full">
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800">About Me</h3>
            {editMode !== "personal" && (
              <button
                onClick={() => handleEditClick("personal")}
                className="flex items-center space-x-1 text-sm text-yellow-600 hover:text-yellow-700"
              >
                <Edit3 className="w-4 h-4" />
                <span className="hidden sm:inline">Edit</span>
              </button>
            )}
          </div>
          {editMode === "personal" ? (
            <div className="space-y-4">
              <textarea
                name="bio"
                value={tempProfile.bio}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                rows={4}
              />
              <div className="flex space-x-2 justify-end">
                <button
                  onClick={handleCancel}
                  className="px-3 sm:px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSave("personal")}
                  className="flex items-center space-x-2 bg-yellow-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-yellow-700 text-sm"
                >
                  <Save className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{profile.bio}</p>
          )}
        </div>

        {/* KYC Verification Card */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-50 p-4 sm:p-6 rounded-2xl shadow-lg border-2 border-dashed border-yellow-300">
          <div className="flex items-start space-x-3 mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Shield className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">KYC Verification</h2>
              <p className="text-xs sm:text-sm text-gray-600">
                Complete your KYC to unlock all features and build trust with clients
              </p>
            </div>
          </div>
          
          {profile.kycCompleted ? (
            <div className="bg-green-100 border border-green-300 rounded-lg p-3 sm:p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="text-sm sm:text-base font-semibold text-green-800">KYC Verified</span>
              </div>
              <p className="text-xs sm:text-sm text-green-700 mt-1">Your account is fully verified</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs sm:text-sm text-yellow-800 font-medium">⚠️ KYC Pending</p>
                <p className="text-xs text-yellow-700 mt-1">Complete verification to accept consultations</p>
              </div>
              <button
                onClick={handleKYCClick}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-white px-4 py-3 rounded-lg font-semibold shadow-md transition-all duration-200 text-sm sm:text-base"
              >
                <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Complete KYC Verification</span>
              </button>
            </div>
          )}
        </div>

        {/* Todo List */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center text-base sm:text-lg font-semibold">
              <ListTodo className="w-5 h-5 mr-2 text-yellow-600" /> My Todo List
            </h2>
            <span className="text-xs sm:text-sm text-gray-500">
              {todos.filter(t => !t.completed).length} pending
            </span>
          </div>

          {/* Add Todo Input */}
          <div className="flex space-x-2 mb-4">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addTodo()}
              placeholder="Add a new task..."
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <button
              onClick={addTodo}
              className="p-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {/* Todo List */}
          <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar-yellow">
            {todos.length === 0 ? (
              <p className="text-center text-gray-400 py-8 text-sm">No tasks yet. Add one above!</p>
            ) : (
              todos.map((todo) => (
                <div
                  key={todo.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                    todo.completed
                      ? "bg-gray-50 border-gray-200"
                      : "bg-yellow-50 border-yellow-200"
                  }`}
                >
                  <button
                    onClick={() => toggleTodo(todo.id)}
                    className="flex-shrink-0"
                  >
                    {todo.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400 hover:text-yellow-600" />
                    )}
                  </button>
                  <span
                    className={`flex-1 text-sm ${
                      todo.completed
                        ? "line-through text-gray-500"
                        : "text-gray-800"
                    }`}
                  >
                    {todo.text}
                  </span>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="flex-shrink-0 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Leave Calendar */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center text-base sm:text-lg font-semibold">
              <CalendarIcon className="w-5 h-5 mr-2 text-yellow-600" /> Leave Calendar
            </h2>
            <span className="text-xs sm:text-sm text-gray-500">
              {leaveDates.length} scheduled
            </span>
          </div>

          {/* Add Leave Date */}
          <div className="space-y-2 mb-4">
            <input
              type="date"
              value={newLeaveDate}
              onChange={(e) => setNewLeaveDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <div className="flex space-x-2">
              <input
                type="text"
                value={newLeaveReason}
                onChange={(e) => setNewLeaveReason(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addLeaveDate()}
                placeholder="Reason for leave..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <button
                onClick={addLeaveDate}
                className="p-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Leave Dates List */}
          <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar-yellow">
            {leaveDates.length === 0 ? (
              <p className="text-center text-gray-400 py-8 text-sm">No leaves scheduled</p>
            ) : (
              leaveDates
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((leave) => {
                  const leaveDate = new Date(leave.date);
                  const isPast = leaveDate < new Date();
                  return (
                    <div
                      key={leave.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        isPast
                          ? "bg-gray-50 border-gray-200 opacity-60"
                          : "bg-red-50 border-red-200"
                      }`}
                    >
                      <div className="flex-1">
                        <p className={`font-semibold text-sm ${isPast ? "text-gray-600" : "text-gray-800"}`}>
                          {leaveDate.toLocaleDateString("en-US", {
                            weekday: "short",
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        <p className={`text-xs ${isPast ? "text-gray-500" : "text-gray-600"}`}>
                          {leave.reason}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteLeaveDate(leave.id)}
                        className="flex-shrink-0 text-red-500 hover:text-red-700 ml-2"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
            )}
          </div>
        </div>

        {/* Expertise & Availability */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="flex items-center text-base sm:text-lg font-semibold mb-4">
            <User className="w-5 h-5 mr-2 text-yellow-600" /> Expertise
          </h2>
          <div className="mb-4">
            <p className="font-semibold text-gray-700 text-sm">Experience</p>
            <p className="text-gray-600 text-sm">{profile.experience}</p>
          </div>
          <div className="mb-4">
            <p className="font-semibold text-gray-700 text-sm">Languages</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {profile.languages.map((lang, i) => (
                <span key={i} className="bg-gray-200 text-gray-800 text-xs sm:text-sm px-3 py-1 rounded-full">
                  {lang}
                </span>
              ))}
            </div>
          </div>
          <h2 className="flex items-center text-base sm:text-lg font-semibold mb-4 mt-6">
            <Clock className="w-5 h-5 mr-2 text-yellow-600" /> Availability
          </h2>
          <p className="text-gray-600 mb-3 text-sm">{profile.availability}</p>
          <button className="w-full sm:w-auto flex items-center justify-center space-x-2 mt-4 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            <Edit3 className="w-4 h-4" />
            <span>Set Availability</span>
          </button>
        </div>

        {/* Certificates */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="flex items-center text-base sm:text-lg font-semibold mb-4">
            <Award className="w-5 h-5 mr-2 text-yellow-600" /> Certificates
          </h2>
          <ul className="space-y-2 text-gray-700 mb-4">
            {profile.certificates.map((cert, i) => (
              <li key={i} className="flex items-center justify-between bg-gray-100 p-2 sm:p-3 rounded-lg">
                <span className="text-xs sm:text-sm">{cert}</span>
                <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-center space-x-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-300 transition-colors text-sm">
            <Upload className="w-4 h-4" />
            <span>Upload Certificate</span>
          </div>
        </div>

        {/* Bank Details */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="flex items-center text-base sm:text-lg font-semibold mb-4">
            <CreditCard className="w-5 h-5 mr-2 text-yellow-600" /> Payout Info
          </h2>
          <p className="text-gray-700 mb-3 font-mono bg-gray-100 p-3 rounded-md text-xs sm:text-sm break-all">
            {profile.bankDetails}
          </p>
          <button className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            <Edit3 className="w-4 h-4" />
            <span>Update Payout Info</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileManagement;