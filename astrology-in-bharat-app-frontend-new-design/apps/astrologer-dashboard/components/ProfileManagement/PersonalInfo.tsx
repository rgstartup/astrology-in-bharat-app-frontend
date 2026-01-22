import React from "react";
import { Edit3, Save } from "lucide-react";
import { Profile, Gender } from "./types";

interface PersonalInfoProps {
    profile: Profile;
    tempProfile: Profile;
    isEditing: boolean;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
    onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => void;
    onProfilePicUpdate?: (file: File) => void;
}

export default function PersonalInfo({
    profile,
    tempProfile,
    isEditing,
    onEdit,
    onSave,
    onCancel,
    onChange,
    onProfilePicUpdate
}: PersonalInfoProps) {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const specs = profile.specialization ? profile.specialization.split(',').map(s => s.trim()).filter(s => s) : [];

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && onProfilePicUpdate) {
            onProfilePicUpdate(file);
        }
        if (e.target) e.target.value = "";
    };
    console.log("mere phto", profile.profilePic)
    return (
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100 h-full">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-4">
                <div className="relative w-24 h-24 rounded-full bg-gray-200 group">
                    <img
                        src={profile.profilePic}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full border-2 border-yellow-500 shadow-md"
                    />
                    {onProfilePicUpdate && (
                        <>
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                                {/* @ts-ignore */}
                                <Edit3 className="w-6 h-6 text-white" />
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                        </>
                    )}
                </div>
                <div className="flex-1">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{profile.name}</h2>
                    <p className="text-sm text-gray-500 mb-2">{profile.email}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${profile.is_available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {profile.is_available ? 'Available' : 'Unavailable'}
                        </span>
                        {specs.map((spec, i) => (
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

            <div className="flex justify-between items-center mb-4 mt-6">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">
                    About Expert
                </h3>
                {!isEditing && (
                    <button
                        onClick={onEdit}
                        className="flex items-center space-x-1 text-sm text-yellow-600 hover:text-yellow-700 font-medium"
                    >
                        {/* @ts-ignore */}
                        <Edit3 className="w-4 h-4" />
                        <span>Edit Profile</span>
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Gender</label>
                            <select
                                name="gender"
                                value={tempProfile.gender!}
                                onChange={onChange}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm text-black"
                            >
                                <option value={Gender.MALE}>Male</option>
                                <option value={Gender.FEMALE}>Female</option>
                                <option value={Gender.OTHER}>Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Date of Birth</label>
                            <input
                                type="date"
                                name="date_of_birth"
                                value={tempProfile.date_of_birth ? tempProfile.date_of_birth.split('T')[0] : ""}
                                onChange={onChange}
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm text-black"
                            />
                        </div>
                        {/* Mobile Number Field */}
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Mobile Number</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={tempProfile.phoneNumber || ""}
                                onChange={onChange}
                                placeholder="e.g. +91 9876543210"
                                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm text-black"
                            />
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className="border-t border-gray-200 pt-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Address</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">House/Office No</label>
                                <input
                                    type="text"
                                    name="houseNo"
                                    value={tempProfile.houseNo || ""}
                                    onChange={onChange}
                                    placeholder="Enter house/office number"
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm text-black"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">District</label>
                                <input
                                    type="text"
                                    name="district"
                                    value={tempProfile.district || ""}
                                    onChange={onChange}
                                    placeholder="Enter district"
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm text-black"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={tempProfile.state || ""}
                                    onChange={onChange}
                                    placeholder="Enter state"
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm text-black"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    value={tempProfile.country || ""}
                                    onChange={onChange}
                                    placeholder="Enter country"
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm text-black"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Pincode</label>
                                <input
                                    type="text"
                                    name="pincode"
                                    value={tempProfile.pincode || ""}
                                    onChange={onChange}
                                    placeholder="Enter pincode"
                                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm text-black"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Bio</label>
                        <textarea
                            name="bio"
                            value={tempProfile.bio}
                            onChange={onChange}
                            placeholder="Tell us about yourself..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm min-h-[120px] text-black"
                        />
                    </div>

                    <div className="flex space-x-2 justify-end pt-2">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onSave}
                            className="flex items-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-all shadow-md text-sm font-medium"
                        >
                            {/* @ts-ignore */}
                            <Save className="w-4 h-4" />
                            <span>Save Changes</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500">Gender</p>
                            <p className="font-medium capitalize text-black">{profile.gender}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Date of Birth</p>
                            <p className="font-medium text-black">{profile.date_of_birth ? new Date(profile.date_of_birth).toLocaleDateString() : "Not specified"}</p>
                        </div>
                        <div className="sm:col-span-2">
                            <p className="text-gray-500">Mobile Number</p>
                            <p className="font-medium text-black">{profile.phoneNumber || "Not added"}</p>
                        </div>
                    </div>

                    {/* Address Section in View Mode */}
                    <div className="border-t border-gray-200 pt-4 mt-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Address</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500">House/Office No</p>
                                <p className="font-medium text-black">{profile.houseNo || "Not added"}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">District</p>
                                <p className="font-medium text-black">{profile.district || "Not added"}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">State</p>
                                <p className="font-medium text-black">{profile.state || "Not added"}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Country</p>
                                <p className="font-medium text-black">{profile.country || "Not added"}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Pincode</p>
                                <p className="font-medium text-black">{profile.pincode || "Not added"}</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm mb-1">Bio</p>
                        <p className="text-gray-700 leading-relaxed text-sm">
                            {profile.bio || "No bio added yet."}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
