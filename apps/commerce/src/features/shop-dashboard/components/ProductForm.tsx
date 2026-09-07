"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { Package, IndianRupee, Tag, FileText, ChevronRight } from "lucide-react";

interface ProductFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSubmit }) => {
  const categories = ["Gemstones", "Rudraksha", "Pooja Items", "Vastu", "Spiritual Beads", "Yantras"];

  return (
    <form className="space-y-8 max-w-4xl animate-in fade-in slide-in-from-right-4 duration-700">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Column: Basic Info */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center space-x-2 border-b border-gray-50 pb-4">
               <Package className="w-5 h-5 text-orange-500" />
               <h3 className="font-bold text-gray-900 tracking-tight text-lg">Basic Information</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 pl-1">Product Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Natural 5-Carat Blue Sapphire" 
                  className="w-full px-5 py-3.5 bg-gray-50 rounded-2xl border-none text-sm focus:ring-2 focus:ring-orange-200 outline-none transition-all placeholder:text-gray-300"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 pl-1">Category</label>
                <select className="w-full px-5 py-3.5 bg-gray-50 rounded-2xl border-none text-sm focus:ring-2 focus:ring-orange-200 outline-none transition-all text-gray-600 appearance-none">
                  <option value="">Select a category</option>
                  {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex items-center space-x-2 border-b border-gray-50 pb-4">
               <IndianRupee className="w-5 h-5 text-green-500" />
               <h3 className="font-bold text-gray-900 tracking-tight text-lg">Pricing & Stock</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 pl-1">Regular Price</label>
                <input type="number" placeholder="0.00" className="w-full px-5 py-3.5 bg-gray-50 rounded-2xl border-none text-sm focus:ring-2 focus:ring-orange-200 outline-none transition-all placeholder:text-gray-300" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-400 pl-1">Sale Price</label>
                <input type="number" placeholder="0.00" className="w-full px-5 py-3.5 bg-gray-50 rounded-2xl border-none text-sm focus:ring-2 focus:ring-orange-200 outline-none transition-all placeholder:text-gray-300" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 pl-1">Inventory (Stock Quantity)</label>
              <input type="number" placeholder="e.g. 50" className="w-full px-5 py-3.5 bg-gray-50 rounded-2xl border-none text-sm focus:ring-2 focus:ring-orange-200 outline-none transition-all placeholder:text-gray-300" />
            </div>
          </div>
        </div>

        {/* Right Column: Description & Media */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6 h-full flex flex-col">
            <div className="flex items-center space-x-2 border-b border-gray-50 pb-4">
               <FileText className="w-5 h-5 text-blue-500" />
               <h3 className="font-bold text-gray-900 tracking-tight text-lg">Product Description</h3>
            </div>
            
            <div className="space-y-1.5 flex-1">
              <label className="text-xs font-bold text-gray-400 pl-1">Full Description</label>
              <textarea 
                className="w-full h-full min-h-[300px] px-6 py-4 bg-gray-50 rounded-3xl border-none text-sm focus:ring-2 focus:ring-orange-200 outline-none transition-all resize-none placeholder:text-gray-300 leading-relaxed" 
                placeholder="Write about the quality, origin, and benefits of the product..." 
              />
            </div>
          </div>
        </div>

      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end space-x-4 pt-4">
          <Button variant="ghost" type="button" size="lg" className="text-gray-400 hover:text-gray-600">Discard Changes</Button>
          <Button size="lg" className="h-14 px-12 group shadow-lg shadow-orange-100">
             Publish Product <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
      </div>
    </form>
  );
};
