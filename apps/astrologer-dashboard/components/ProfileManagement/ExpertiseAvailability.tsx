import React from "react";
import { User, Clock, Edit3, Save, Plus, X, DollarSign, Briefcase } from "lucide-react";
import { Profile } from "./types";

interface ExpertiseAvailabilityProps {
    profile: Profile;
    tempProfile: Profile;
    isEditing: boolean;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
    onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => void;
    onLanguageChange: (languages: string[]) => void;
}

export default function ExpertiseAvailability({
    profile,
    tempProfile,
    isEditing,
    onEdit,
    onSave,
    onCancel,
    onChange,
    onLanguageChange,
}: ExpertiseAvailabilityProps) {
    const [newLang, setNewLang] = React.useState("");

    const addLanguage = () => {
        if (newLang && !tempProfile.languages.includes(newLang)) {
            onLanguageChange([...tempProfile.languages, newLang]);
            setNewLang("");
        }
    };

    const removeLanguage = (lang: string) => {
        onLanguageChange(tempProfile.languages.filter((l) => l !== lang));
    };

    return (
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="flex items-center text-lg sm:text-xl font-bold text-gray-800">
                    <Briefcase className="w-5 h-5 mr-2 text-yellow-600" /> Expertise & Pricing
                </h2>
                {!isEditing && (
                    <button
                        onClick={onEdit}
                        className="flex items-center space-x-1 text-sm text-yellow-600 hover:text-yellow-700 font-medium"
                    >
                        <Edit3 className="w-4 h-4" />
                        <span>Edit</span>
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Specialization</label>
                        <input
                            type="text"
                            name="specialization"
                            value={tempProfile.specialization}
                            onChange={onChange}
                            placeholder="e.g. Vedic Astrology, Numerology"
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm text-black"
                        />
                        <p className="text-[10px] text-gray-400 mt-1">Separate with commas for multiple.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Chat Price (per minute)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="number"
                                    name="chat_price"
                                    value={tempProfile.chat_price}
                                    onChange={onChange}
                                    min="0"
                                    className="w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm text-black"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Audio Call Price (per minute)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="number"
                                    name="call_price"
                                    value={tempProfile.call_price}
                                    onChange={onChange}
                                    min="0"
                                    className="w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm text-black"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Video Call Price (per minute)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="number"
                                    name="video_call_price"
                                    value={tempProfile.video_call_price}
                                    onChange={onChange}
                                    min="0"
                                    className="w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm text-black"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Report/Horoscope Price</label>
                            <div className="relative">
                                <DollarSign className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="number"
                                    name="price"
                                    value={tempProfile.price}
                                    onChange={onChange}
                                    min="0"
                                    className="w-full pl-8 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm text-black"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Languages</label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {tempProfile.languages.map((lang, i) => (
                                <span key={i} className="flex items-center bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-sm border border-gray-200">
                                    {lang}
                                    <button onClick={() => removeLanguage(lang)} className="ml-1.5 hover:text-red-500 transition-colors">
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={newLang}
                                onChange={(e) => setNewLang(e.target.value)}
                                placeholder="Add language..."
                                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none text-sm text-black"
                                onKeyPress={(e) => e.key === 'Enter' && addLanguage()}
                            />
                            <button
                                type="button"
                                onClick={addLanguage}
                                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 text-gray-600 transition-colors border border-gray-300"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    </div>


                    <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
                        <button
                            onClick={onCancel}
                            className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onSave}
                            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-all shadow-md text-sm font-medium"
                        >
                            <Save className="w-4 h-4" />
                            <span>Save Changes</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Experience</p>
                            <p className="text-sm font-semibold text-gray-700">{profile.experience_in_years} Years</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Chat Price</p>
                            <p className="text-sm font-semibold text-gray-700">₹{profile.chat_price}/min</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Audio Price</p>
                            <p className="text-sm font-semibold text-gray-700">₹{profile.call_price}/min</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-1">Video Price</p>
                            <p className="text-sm font-semibold text-gray-700">₹{profile.video_call_price}/min</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-2">Languages</p>
                        <div className="flex flex-wrap gap-2">
                            {profile.languages.length > 0 ? (
                                profile.languages.map((lang, i) => (
                                    <span
                                        key={i}
                                        className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full border border-gray-200"
                                    >
                                        {lang}
                                    </span>
                                ))
                            ) : (
                                <p className="text-xs text-gray-400 italic">No languages added</p>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                        <div className="flex items-center text-sm">
                            <Clock className={`w-4 h-4 mr-2 ${profile.is_available ? 'text-green-500' : 'text-gray-400'}`} />
                            <span className={profile.is_available ? 'text-green-600 font-medium' : 'text-gray-500 font-medium'}>
                                {profile.is_available ? 'Available Now' : 'Currently Away'}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


