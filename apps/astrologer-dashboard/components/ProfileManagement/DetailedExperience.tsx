import React, { useState } from "react";
import { Briefcase, Plus, Trash2, Calendar, Building } from "lucide-react";
import { ExperienceItem } from "./types";

interface DetailedExperienceProps {
    experiences: ExperienceItem[];
    onAdd: (exp: ExperienceItem) => void;
    onRemove: (id: number) => void;
}

export default function DetailedExperience({ experiences, onAdd, onRemove }: DetailedExperienceProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [newExp, setNewExp] = useState<Partial<ExperienceItem> & { role?: string; company?: string }>({
        role: "",
        company: "",
        startDate: "",
        endDate: "",
        description: "",
        isCurrent: false
    });

    const handleAdd = () => {
        if (newExp.role && newExp.company) {
            const experienceData = {
                id: Date.now(),
                // Strategy: Send EVERYTHING to see what sticks in the backend
                title: newExp.role!,           // Mapped from Field
                organization: newExp.company!, // Mapped from Years
                role: newExp.role!,            // Mapped from Field
                company: newExp.company!,      // Mapped from Years
                duration: newExp.company!,     // Mapped from Years (e.g. "5 Years")
                location: "Remote",            // Dummy
                startDate: new Date().toISOString(),
                endDate: new Date().toISOString(),
                description: newExp.description || "",
                isCurrent: false
            };

            onAdd(experienceData as any);
            setNewExp({
                role: "",
                company: "",
                startDate: "",
                endDate: "",
                description: "",
                isCurrent: false
            });
            setIsAdding(false);
        } else {
            alert("Please fill in Field of Experience and Years of Experience");
        }
    };

    return (
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-red-500"></div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="flex items-center text-lg sm:text-xl font-bold text-gray-800">
                    <span className="bg-orange-100 p-2 rounded-lg mr-3">
                        {/* @ts-ignore */}
                        <Briefcase className="w-5 h-5 text-orange-600" />
                    </span>
                    Professional Experience
                </h2>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="group flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                    >
                        {/* @ts-ignore */}
                        <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-300" />
                        Add New
                    </button>
                )}
            </div>

            {isAdding && (
                <div className="mb-8 p-6 bg-gradient-to-br from-orange-50 to-white rounded-2xl border border-orange-100 shadow-inner animate-in fade-in slide-in-from-top-4">
                    <h3 className="text-sm font-bold text-orange-800 uppercase tracking-wide mb-4">Add New Experience</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Title / Role *</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-400"
                                    value={newExp.role}
                                    onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
                                    placeholder="e.g. Vedic Astrologer"
                                />
                                {/* @ts-ignore */}
                                <Briefcase className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Years of Experience *</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-400"
                                    value={newExp.company}
                                    onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                                    placeholder="e.g. 5 Years"
                                />
                                {/* @ts-ignore */}
                                <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">Description</label>
                            <textarea
                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-gray-400 resize-none"
                                rows={3}
                                value={newExp.description}
                                onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                                placeholder="Highlight your key achievements and responsibilities..."
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setIsAdding(false)}
                            className="px-5 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAdd}
                            className="bg-gray-900 text-white px-6 py-2 rounded-lg text-sm font-semibold shadow-md hover:bg-black hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
                        >
                            Save Experience
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {experiences.map((exp) => (
                    <div key={exp.id} className="relative bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-300 group">
                        <div className="flex items-start gap-5">
                            <div className="bg-orange-50 p-3 rounded-2xl border border-orange-100 group-hover:scale-105 transition-transform duration-300 shrink-0">
                                {/* @ts-ignore */}
                                <Briefcase className="w-6 h-6 text-orange-500" />
                            </div>
                            <div className="flex-1 mt-0.5">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                    <h4 className="text-lg font-bold text-gray-900 leading-tight">{exp.role || exp.title}</h4>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                                        {/* @ts-ignore */}
                                        <Building className="w-3 h-3 mr-1" />
                                        {exp.company || exp.organization}
                                    </span>
                                </div>
                                {exp.description && (
                                    <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">{exp.description}</p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => onRemove(exp.id)}
                            className="absolute top-4 right-4 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                            title="Delete"
                        >
                            {/* @ts-ignore */}
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}

                {experiences.length === 0 && !isAdding && (
                    <div className="text-center py-12 bg-gray-50 border border-dashed border-gray-200 rounded-xl">
                        <div className="bg-white p-4 rounded-full inline-block shadow-sm mb-3">
                            {/* @ts-ignore */}
                            <Briefcase className="w-8 h-8 text-gray-300" />
                        </div>
                        <h4 className="text-gray-900 font-semibold mb-1">No Experience Added</h4>
                        <p className="text-sm text-gray-500 max-w-xs mx-auto mb-4">Add your professional journey to build trust with your clients.</p>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="text-orange-600 font-semibold text-sm hover:text-orange-700 hover:underline"
                        >
                            + Add First Role
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
