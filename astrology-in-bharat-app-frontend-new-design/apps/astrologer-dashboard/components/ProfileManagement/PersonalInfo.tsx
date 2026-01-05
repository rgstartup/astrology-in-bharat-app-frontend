import React from "react";
import { Edit3, Save } from "lucide-react";
import { Profile } from "./types";

interface PersonalInfoProps {
    profile: Profile;
    tempProfile: Profile;
    isEditing: boolean;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
    onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
}

export default function PersonalInfo({
    profile,
    tempProfile,
    isEditing,
    onEdit,
    onSave,
    onCancel,
    onChange,
}: PersonalInfoProps) {
    return (
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
                            <span
                                key={i}
                                className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full"
                            >
                                {spec}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                    About Me
                </h3>
                {!isEditing && (
                    <button
                        onClick={onEdit}
                        className="flex items-center space-x-1 text-sm text-yellow-600 hover:text-yellow-700"
                    >
                        <Edit3 className="w-4 h-4" />
                        <span className="hidden sm:inline">Edit</span>
                    </button>
                )}
            </div>
            {isEditing ? (
                <div className="space-y-4">
                    <textarea
                        name="bio"
                        value={tempProfile.bio}
                        onChange={onChange}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
                        rows={4}
                    />
                    <div className="flex space-x-2 justify-end">
                        <button
                            onClick={onCancel}
                            className="px-3 sm:px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onSave}
                            className="flex items-center space-x-2 bg-yellow-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-yellow-700 text-sm"
                        >
                            <Save className="w-4 h-4" />
                            <span>Save</span>
                        </button>
                    </div>
                </div>
            ) : (
                <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                    {profile.bio}
                </p>
            )}
        </div>
    );
}
