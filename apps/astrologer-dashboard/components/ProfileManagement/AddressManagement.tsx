import React, { useState } from "react";
import { MapPin, Plus, X, Edit3, Save, Trash2 } from "lucide-react";
import { Profile, Address } from "./types";

interface AddressManagementProps {
    profile: Profile;
    tempProfile: Profile;
    isEditing: boolean;
    onEdit: () => void;
    onSave: () => void;
    onCancel: () => void;
    onAddressChange: (addresses: Address[]) => void;
}

export default function AddressManagement({
    profile,
    tempProfile,
    isEditing,
    onEdit,
    onSave,
    onCancel,
    onAddressChange,
}: AddressManagementProps) {
    const [newAddr, setNewAddr] = useState<Address>({
        line1: "",
        city: "",
        state: "",
        country: "India",
        zipCode: "",
        tag: "office"
    });

    const addAddress = () => {
        if (newAddr.line1 && newAddr.city && newAddr.state) {
            onAddressChange([...tempProfile.addresses, newAddr]);
            setNewAddr({
                line1: "",
                city: "",
                state: "",
                country: "India",
                zipCode: "",
                tag: "office"
            });
        } else {
            alert("Please fill required address fields (Line 1, City, State)");
        }
    };

    const removeAddress = (index: number) => {
        onAddressChange(tempProfile.addresses.filter((_, i) => i !== index));
    };

    return (
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="flex items-center text-lg sm:text-xl font-bold text-gray-800">
                    <MapPin className="w-5 h-5 mr-2 text-yellow-600" /> Professional Addresses
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
                <div className="space-y-6">
                    {/* List Existing/Temp Addresses */}
                    <div className="space-y-3">
                        {tempProfile.addresses.map((addr, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <div className="text-sm">
                                    <span className="font-bold text-yellow-700 uppercase text-[10px] block mb-1">{addr.tag}</span>
                                    <p className="text-gray-800 font-medium">{addr.line1}</p>
                                    <p className="text-gray-500 text-xs">{addr.city}, {addr.state}, {addr.country} {addr.zipCode}</p>
                                </div>
                                <button onClick={() => removeAddress(idx)} className="text-red-400 hover:text-red-500 p-2">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Add New Address Form */}
                    <div className="p-4 border border-dashed border-gray-300 rounded-xl space-y-4">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Add New Address</p>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-xs text-gray-500 mb-1">Street Address / Line 1</label>
                                <input
                                    type="text"
                                    value={newAddr.line1}
                                    onChange={(e) => setNewAddr({ ...newAddr, line1: e.target.value })}
                                    className="w-full p-2 border rounded-lg text-sm text-black"
                                    placeholder="Room no, Building, Street..."
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">City</label>
                                <input
                                    type="text"
                                    value={newAddr.city}
                                    onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                                    className="w-full p-2 border rounded-lg text-sm text-black"
                                    placeholder="City"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">State</label>
                                <input
                                    type="text"
                                    value={newAddr.state}
                                    onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                                    className="w-full p-2 border rounded-lg text-sm text-black"
                                    placeholder="State"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Zip Code</label>
                                <input
                                    type="text"
                                    value={newAddr.zipCode}
                                    onChange={(e) => setNewAddr({ ...newAddr, zipCode: e.target.value })}
                                    className="w-full p-2 border rounded-lg text-sm text-black"
                                    placeholder="Zip"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">Tag</label>
                                <select
                                    value={newAddr.tag}
                                    onChange={(e) => setNewAddr({ ...newAddr, tag: e.target.value })}
                                    className="w-full p-2 border rounded-lg text-sm text-black"
                                >
                                    <option value="office">Office</option>
                                    <option value="home">Home</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={addAddress}
                            className="w-full py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors flex items-center justify-center"
                        >
                            <Plus className="w-4 h-4 mr-2" /> Add to List
                        </button>
                    </div>

                    <div className="flex space-x-2 justify-end pt-2">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onSave}
                            className="flex items-center space-x-2 bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 shadow-md text-sm font-medium"
                        >
                            <Save className="w-4 h-4" />
                            <span>Save Changes</span>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {profile.addresses.length > 0 ? (
                        profile.addresses.map((addr, idx) => (
                            <div key={idx} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <MapPin className="w-4 h-4 text-yellow-600 mt-1 flex-shrink-0" />
                                <div>
                                    <span className="font-bold text-yellow-700 uppercase text-[9px] tracking-widest">{addr.tag}</span>
                                    <p className="text-sm font-medium text-gray-800">{addr.line1}</p>
                                    <p className="text-gray-500 text-xs">{addr.city}, {addr.state}, {addr.country} {addr.zipCode}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p className="text-sm text-gray-400 italic">No addresses added yet.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}


