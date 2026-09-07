import React from "react";
import { Calendar, Compass, Loader2 } from "lucide-react";
import LocationAutocomplete from "@/components/ui/LocationAutocomplete";

import { PlanetFormProps } from "@/lib/types/calculator";

const PlanetForm: React.FC<PlanetFormProps> = ({
  formData,
  handleChange,
  handleLocationSelect,
  locationName,
  loading,
  handleSubmit,
  renderIcon,
  t,
  fontStyle,
}) => {
  return (
    <div className="w-full lg:w-1/3">
      <div className="bg-white rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 sticky top-24">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-orange-50 p-3 rounded-2xl">
            {renderIcon(Calendar, { className: "text-primary", size: 24 })}
          </div>
          <h2 className="text-2xl font-bold text-slate-800" style={fontStyle}>{t.title}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-500 mb-2 ml-1" style={fontStyle}>{t.date}</label>
              <input
                type="number"
                name="date"
                className="w-full px-4 py-3 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-primary transition-all"
                placeholder="DD"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-500 mb-2 ml-1" style={fontStyle}>{t.month}</label>
              <input
                type="number"
                name="month"
                className="w-full px-4 py-3 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-primary transition-all"
                placeholder="MM"
                value={formData.month}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-500 mb-2 ml-1" style={fontStyle}>{t.year}</label>
            <input
              type="number"
              name="year"
              className="w-full px-4 py-3 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-primary transition-all"
              placeholder="YYYY"
              value={formData.year}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 ml-1" style={fontStyle}>{t.hour}</label>
              <input
                type="number"
                name="hours"
                className="w-full px-3 py-3 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-primary transition-all"
                placeholder="HH"
                value={formData.hours}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 ml-1" style={fontStyle}>{t.min}</label>
              <input
                type="number"
                name="minutes"
                className="w-full px-3 py-3 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-primary transition-all"
                placeholder="MM"
                value={formData.minutes}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 ml-1" style={fontStyle}>{t.sec}</label>
              <input
                type="number"
                name="seconds"
                className="w-full px-3 py-3 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-primary transition-all"
                placeholder="SS"
                value={formData.seconds}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-500 mb-2 ml-1" style={fontStyle}>{t.location}</label>
            <LocationAutocomplete
              onSelect={handleLocationSelect}
              initialValue={locationName}
              placeholder={t.locationPlaceholder}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-500 mb-2 ml-1" style={fontStyle}>{t.timezone}</label>
            <input
              type="number"
              step="0.1"
              name="timezone"
              className="w-full px-4 py-3 bg-slate-50 border-0 rounded-2xl focus:ring-2 focus:ring-primary transition-all"
              value={formData.timezone}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-primary hover:bg-primary-hover text-white rounded-2xl font-bold shadow-[0_10px_20px_rgba(242,94,10,0.3)] transition-all flex items-center justify-center gap-3 group mt-8"
            disabled={loading}
          >
            {loading ? (
              renderIcon(Loader2, { className: "animate-spin", size: 20 })
            ) : (
              <>
                <span style={fontStyle}>{t.submit}</span>
                {renderIcon(Compass, { size: 18, className: "group-hover:rotate-45 transition-transform" })}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PlanetForm;

