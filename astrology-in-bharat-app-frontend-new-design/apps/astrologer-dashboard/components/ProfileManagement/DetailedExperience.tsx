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
    const [newExp, setNewExp] = useState<Partial<ExperienceItem>>({
        title: "",
        organization: "",
        startDate: "",
        endDate: "",
        description: "",
        isCurrent: false
    });

    const handleAdd = () => {
        if (newExp.title && newExp.organization && newExp.startDate) {
            onAdd({
                id: Date.now(),
                title: newExp.title!,
                organization: newExp.organization!,
                startDate: newExp.startDate!,
                endDate: newExp.isCurrent ? "Present" : newExp.endDate || "",
                description: newExp.description || "",
                isCurrent: newExp.isCurrent || false
            });
            setNewExp({
                title: "",
                organization: "",
                startDate: "",
                endDate: "",
                description: "",
                isCurrent: false
            });
            setIsAdding(false);
        } else {
            alert("Please fill in atleast Title, Organization and Start Date");
        }
    };

    return (
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <h2 className="flex items-center text-base sm:text-lg font-semibold">
                    <Briefcase className="w-5 h-5 mr-2 text-blue-600" /> Professional Experience
                </h2>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full hover:bg-blue-100 flex items-center transition-colors"
                    >
                        <Plus className="w-4 h-4 mr-1" /> Add Experience
                    </button>
                )}
            </div>

            {isAdding && (
                <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100 animate-in fade-in slide-in-from-top-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Job Title *</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={newExp.title}
                                onChange={(e) => setNewExp({ ...newExp, title: e.target.value })}
                                placeholder="e.g. Senior Vedic Astrologer"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Organization *</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={newExp.organization}
                                onChange={(e) => setNewExp({ ...newExp, organization: e.target.value })}
                                placeholder="e.g. Astrology In Bharat"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Start Date *</label>
                            <input
                                type="date"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={newExp.startDate}
                                onChange={(e) => setNewExp({ ...newExp, startDate: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">End Date</label>
                            <input
                                type="date"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200 disabled:text-gray-500"
                                value={newExp.endDate}
                                onChange={(e) => setNewExp({ ...newExp, endDate: e.target.value })}
                                disabled={newExp.isCurrent}
                            />
                            <div className="mt-2 flex items-center">
                                <input
                                    type="checkbox"
                                    id="isCurrent"
                                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                                    checked={newExp.isCurrent}
                                    onChange={(e) => setNewExp({ ...newExp, isCurrent: e.target.checked })}
                                />
                                <label htmlFor="isCurrent" className="ml-2 text-xs text-gray-600">Currently working here</label>
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                                value={newExp.description}
                                onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                                placeholder="Briefly describe your role and responsibilities..."
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setIsAdding(false)}
                            className="bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAdd}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                            Add Experience
                        </button>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {experiences.map((exp) => (
                    <div key={exp.id} className="relative bg-gray-50 p-4 rounded-xl border border-gray-100 hover:border-blue-200 transition-colors group">
                        <div className="flex items-start gap-4">
                            <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm shrink-0">
                                <Briefcase className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold text-gray-900">{exp.title}</h4>
                                <div className="flex items-center text-xs text-gray-500 font-medium mt-1">
                                    <Building className="w-3 h-3 mr-1" />
                                    {exp.organization}
                                    <span className="mx-2">•</span>
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}
                                </div>
                                {exp.description && (
                                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">{exp.description}</p>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => onRemove(exp.id)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
                {experiences.length === 0 && !isAdding && (
                    <div className="text-center py-6">
                        <p className="text-sm text-gray-400">No experience details added.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
