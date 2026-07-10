"use client";

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Info, Upload, Image as ImageIcon } from 'lucide-react';
import { PujaService, SamagriItem } from '../ProfileManagement/types';
import { upsertPujaApi } from '@/lib/profile';
import { toast } from 'react-toastify';
import { Loading } from '@repo/ui';
import { getErrorMessage } from '@repo/lib';

interface PujaModalProps {
  mode: 'add' | 'edit';
  puja?: PujaService;
  onClose: () => void;
  onSaved: (updatedProfile: any) => void;
}

export const PujaModal = ({ mode, puja, onClose, onSaved }: PujaModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<PujaService>>({
    is_online: true,
    is_home_visit: false,
    name: '',
    min_duration_hours: 1,
    max_duration_hours: 2,
    online_cost: 0,
    home_visit_with_samagri_cost: 0,
    home_visit_without_samagri_cost: 0,
    description: '',
    districts: [],
    samagri_list: [],
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [newSamagri, setNewSamagri] = useState<SamagriItem>({ name: '', quantity: '' });
  const [newDistrict, setNewDistrict] = useState('');

  useEffect(() => {
    if (puja) {
      setFormData(prev => ({
        ...prev,
        ...puja,
        is_online: puja.is_online ?? (puja as any).type === 'online',
        is_home_visit: puja.is_home_visit ?? (puja as any).type === 'home_visit',
        online_cost: puja.online_cost ?? (puja.is_online ? (puja as any).cost : 0),
        home_visit_with_samagri_cost: puja.home_visit_with_samagri_cost ?? (puja.is_home_visit ? (puja as any).cost : 0),
        home_visit_without_samagri_cost: puja.home_visit_without_samagri_cost ?? 0,
        min_duration_hours: puja.min_duration_hours || prev.min_duration_hours || 1,
        max_duration_hours: puja.max_duration_hours || prev.max_duration_hours || 2,
        samagri_list: puja.samagri_list || [],
        districts: puja.districts || [],
        description: puja.description || '',
      }));
      if (puja.puja_image_url) {
        setImagePreview(puja.puja_image_url);
      }
    }
  }, [mode, puja]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        setImageBase64(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.is_online && !formData.is_home_visit) {
        toast.error('Please select at least one availability type (Online or Home Visit).');
        return;
    }
    
    if ((formData.min_duration_hours || 0) > (formData.max_duration_hours || 0)) {
      toast.error('Minimum duration cannot be greater than maximum duration.');
      return;
    }

    try {
      setLoading(true);
      
      const payload = {
        is_online: formData.is_online,
        is_home_visit: formData.is_home_visit,
        name: formData.name,
        min_duration_hours: formData.min_duration_hours,
        max_duration_hours: formData.max_duration_hours,
        online_cost: formData.online_cost,
        home_visit_with_samagri_cost: formData.home_visit_with_samagri_cost,
        home_visit_without_samagri_cost: formData.home_visit_without_samagri_cost,
        description: formData.description,
        districts: formData.districts,
        samagri_list: formData.samagri_list,
        puja_image: imageBase64 || undefined,
      };

      const [data, error] = await upsertPujaApi(payload, puja?.id);
      if (error) {
        toast.error(getErrorMessage(error) || "Failed to save puja service.");
        return;
      }
      toast.success(`Puja service ${mode === 'add' ? 'added' : 'updated'} successfully!`);
      // The onSaved expects the updated Profile object.
      // If upsertPujaApi returns just the puja or the whole profile, we need to be careful.
      // In ServicePricingPage, onSaved(data) sets the entire profile.
      // Usually, expert/puja endpoint returns the whole expert profile or we should fetch it again.
      // For now, let's pass the data returned and hope it's the profile.
      onSaved(data);
      onClose();

    } catch (error: any) {
      console.error('Failed to save puja:', error);
      toast.error(getErrorMessage(error) || 'Failed to save puja service.');
    } finally {
      setLoading(false);
    }
  };

  const addSamagri = () => {
    if (!newSamagri.name || !newSamagri.quantity) return;
    setFormData({
      ...formData,
      samagri_list: [...(formData.samagri_list || []), newSamagri],
    });
    setNewSamagri({ name: '', quantity: '' });
  };

  const handleSamagriPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pastedText = e.clipboardData.getData('text');
    if (!pastedText || !pastedText.includes('\n')) return;

    e.preventDefault();
    const lines = pastedText.split(/\r?\n/).filter(line => line.trim() !== '');
    
    const newItems = lines.map(line => {
      let parts = line.split('\t');
      if (parts.length < 2) {
        parts = line.split(/\s{2,}/); // fallback to multiple spaces
      }
      return {
        name: parts[0]?.trim() || '',
        quantity: parts[1]?.trim() || ''
      };
    }).filter(item => item.name);

    if (newItems.length > 0) {
      setFormData({
        ...formData,
        samagri_list: [...(formData.samagri_list || []), ...newItems],
      });
    }
  };

  const removeSamagri = (index: number) => {
    setFormData({
      ...formData,
      samagri_list: (formData.samagri_list || []).filter((_, i) => i !== index),
    });
  };

  const addDistrict = () => {
    if (!newDistrict) return;
    if (formData.districts?.includes(newDistrict)) return;
    setFormData({
      ...formData,
      districts: [...(formData.districts || []), newDistrict],
    });
    setNewDistrict('');
  };

  const removeDistrict = (index: number) => {
    setFormData({
      ...formData,
      districts: (formData.districts || []).filter((_, i) => i !== index),
    });
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl relative my-8">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-3xl">
          <h3 className="text-xl font-bold text-gray-800">
            {mode === 'add' ? 'Add New Puja Service' : 'Edit Puja Service'}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Puja Image</label>
            <div className="flex items-center gap-4">
              <div className="relative w-32 h-[72px] rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50">
                {imagePreview ? (
                  <img src={imagePreview} alt="Puja preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-300" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  id="puja-image"
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                />
                <label
                  htmlFor="puja-image"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer transition-all shadow-xs"
                >
                  <Upload className="w-4 h-4" />
                  {imagePreview ? 'Change Image' : 'Upload Image'}
                </label>
                <div className="mt-2 p-2 bg-orange-50 border border-orange-100 rounded-xl">
                  <p className="text-[11px] text-orange-700 font-bold">📐 Required: 16:9 ratio (e.g. 1280×720, 1920×1080)</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">Min size: 1280×720px • Max file size: 5MB • JPEG / PNG / WebP</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Puja Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
                placeholder="e.g. Satyanarayana Puja"
              />
            </div>
          </div>

          <div className="space-y-4">
             <label className="block text-sm font-bold text-gray-700">Availability & Pricing</label>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Online Availability */}
                <div className={`p-4 rounded-2xl border transition-all ${formData.is_online ? 'border-blue-200 bg-blue-50/30' : 'border-gray-100 bg-gray-50/30'}`}>
                    <label className="flex items-center gap-3 cursor-pointer mb-3">
                        <input 
                            type="checkbox"
                            checked={formData.is_online}
                            onChange={(e) => setFormData({...formData, is_online: e.target.checked})}
                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="font-bold text-gray-700">Online Puja</span>
                    </label>
                    {formData.is_online && (
                        <div className="space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
                             <p className="text-[10px] text-gray-400 font-bold uppercase">Online Price (₹)</p>
                             <input
                                type="number"
                                required
                                min="0"
                                value={formData.online_cost}
                                onChange={(e) => setFormData({ ...formData, online_cost: Number(e.target.value) })}
                                className="w-full px-4 py-2 border border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                placeholder="Price for online session"
                             />
                        </div>
                    )}
                </div>

                {/* Home Visit Availability */}
                <div className={`p-4 rounded-2xl border transition-all ${formData.is_home_visit ? 'border-green-200 bg-green-50/30' : 'border-gray-100 bg-gray-50/30'}`}>
                    <label className="flex items-center gap-3 cursor-pointer mb-3">
                        <input 
                            type="checkbox"
                            checked={formData.is_home_visit}
                            onChange={(e) => setFormData({...formData, is_home_visit: e.target.checked})}
                            className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <span className="font-bold text-gray-700">Home Visit</span>
                    </label>
                    {formData.is_home_visit && (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                             <div className="space-y-1">
                                <p className="text-[10px] text-gray-400 font-bold uppercase">With Samagri (₹)</p>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={formData.home_visit_with_samagri_cost}
                                    onChange={(e) => setFormData({ ...formData, home_visit_with_samagri_cost: Number(e.target.value) })}
                                    className="w-full px-4 py-2 border border-green-100 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-white"
                                    placeholder="Price with items"
                                />
                             </div>
                             <div className="space-y-1">
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Without Samagri (₹)</p>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={formData.home_visit_without_samagri_cost}
                                    onChange={(e) => setFormData({ ...formData, home_visit_without_samagri_cost: Number(e.target.value) })}
                                    className="w-full px-4 py-2 border border-green-100 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-white"
                                    placeholder="Price only for ritual"
                                />
                             </div>
                        </div>
                    )}
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Min Duration (Hours)</label>
              <input
                type="number"
                required
                step="0.5"
                min="0.5"
                value={formData.min_duration_hours}
                onChange={(e) => setFormData({ ...formData, min_duration_hours: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
                placeholder="e.g. 1"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Max Duration (Hours)</label>
              <input
                type="number"
                required
                step="0.5"
                min="0.5"
                value={formData.max_duration_hours}
                onChange={(e) => setFormData({ ...formData, max_duration_hours: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
                placeholder="e.g. 2.5"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none resize-none"
              placeholder="Describe the significance and process..."
            />
          </div>

          {/* Districts (Only for Home Visit) */}
          {formData.is_home_visit && (
            <div className="space-y-3 p-4 bg-orange-50/30 rounded-2xl border border-orange-100">
              <label className="block text-sm font-bold text-orange-800">Available Districts (For Home Visit)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newDistrict}
                  onChange={(e) => setNewDistrict(e.target.value)}
                  className="flex-1 px-4 py-2 border border-orange-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                  placeholder="Enter district name"
                />
                <button
                  type="button"
                  onClick={addDistrict}
                  className="p-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.districts?.map((d, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-3 py-1 bg-white border border-orange-200 text-orange-700 rounded-full text-xs font-semibold shadow-sm">
                    {d}
                    <button type="button" onClick={() => removeDistrict(i)}>
                      <X className="w-3 h-3 hover:text-red-500" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Samagri List */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
              Samagri List
              <span className="text-xs font-normal text-gray-500">(Required items)</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={newSamagri.name}
                onChange={(e) => setNewSamagri({ ...newSamagri, name: e.target.value })}
                onPaste={handleSamagriPaste}
                className="px-3 py-2 border border-gray-300 rounded-xl outline-none"
                placeholder="Item name (Tip: Paste full list here)"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSamagri.quantity}
                  onChange={(e) => setNewSamagri({ ...newSamagri, quantity: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-xl outline-none"
                  placeholder="Qty/Weight"
                />
                <button
                  type="button"
                  onClick={addSamagri}
                  className="p-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Samagri Table View */}
            {(formData.samagri_list?.length || 0) > 0 && (
              <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-2 text-left">Item</th>
                      <th className="px-4 py-2 text-left">Quantity</th>
                      <th className="px-4 py-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {formData.samagri_list?.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50/50">
                        <td className="px-4 py-2 text-gray-700">{item.name}</td>
                        <td className="px-4 py-2 text-gray-500">{item.quantity}</td>
                        <td className="px-4 py-2 text-right">
                          <button
                            type="button"
                            onClick={() => removeSamagri(index)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex gap-3 pt-4 border-t sticky bottom-0 bg-white z-10">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 font-bold rounded-2xl hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-6 bg-orange-600 text-white font-bold rounded-2xl hover:bg-orange-700 transition-all shadow-lg flex items-center justify-center gap-2 hover:translate-y-[-2px] active:translate-y-0 disabled:opacity-50 disabled:translate-y-0"
            >
              {loading ? 'Saving...' : (mode === 'add' ? 'Save Service' : 'Update Service')}
            </button>
          </div>
        </form>
      </div>
      {loading && <Loading fullScreen />}
    </div>
  );
};
