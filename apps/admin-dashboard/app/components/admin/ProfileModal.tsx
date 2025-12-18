"use client";

import { X, LucideIcon } from "lucide-react";

interface DetailItem {
  icon: LucideIcon;
  label: string;
  value: string | number;
}

interface StatCard {
  icon: LucideIcon;
  value: string | number;
  label: string;
  bgColor: string;
  iconColor: string;
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  avatar?: string;
  name: string;
  subtitle?: string;
  badges?: {
    label: string;
    color: string;
  }[];
  stats?: StatCard[];
  details: DetailItem[];
  extraInfo?: {
    label: string;
    value: string;
  };
  actions?: {
    label: string;
    onClick: () => void;
    variant: "primary" | "danger";
  }[];
}

export function ProfileModal({
  isOpen,
  onClose,
  avatar,
  name,
  subtitle,
  badges,
  stats,
  details,
  extraInfo,
  actions,
}: ProfileModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-in fade-in duration-200">
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-all duration-200 hover:rotate-90"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            {avatar && (
              <div className="relative inline-block mb-4">
                <img
                  src={avatar}
                  alt={name}
                  className="w-24 h-24 rounded-full mx-auto object-cover ring-4 ring-yellow-100 shadow-lg"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-400/20 to-transparent" />
              </div>
            )}
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{name}</h3>
            {subtitle && (
              <p className="text-sm text-gray-600 font-medium">{subtitle}</p>
            )}
            {badges && badges.length > 0 && (
              <div className="flex items-center justify-center flex-wrap gap-2 mt-3">
                {badges.map((badge, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${badge.color} shadow-sm hover:scale-105 transition-transform duration-200`}
                  >
                    {badge.label}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Stats Cards */}
          {stats && stats.length > 0 && (
            <div className={`grid grid-cols-${stats.length} gap-4 mb-6`}>
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className={`group text-center p-4 ${stat.bgColor} rounded-xl hover:scale-105 hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-yellow-300`}
                  >
                    <Icon
                      className={`w-6 h-6 ${stat.iconColor} mx-auto mb-2 group-hover:scale-110 transition-transform duration-200 ${
                        stat.iconColor.includes("yellow") ? "fill-yellow-600" : ""
                      }`}
                    />
                    <p className="text-2xl font-bold text-gray-900 group-hover:scale-110 transition-transform duration-200">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-600 font-medium">
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {details.map((detail, index) => {
              const Icon = detail.icon;
              return (
                <div
                  key={index}
                  className="group flex items-start space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 hover:shadow-md hover:scale-105 transition-all duration-300 border border-transparent hover:border-gray-200"
                >
                  <div className="flex-shrink-0 p-2 bg-white rounded-lg group-hover:bg-yellow-50 transition-colors duration-200 shadow-sm">
                    <Icon className="w-5 h-5 text-yellow-600 group-hover:scale-110 transition-transform duration-200" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">
                      {detail.label}
                    </p>
                    <p className="text-sm text-gray-900 font-medium break-words">
                      {detail.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Extra Info */}
          {extraInfo && (
            <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200 hover:border-yellow-300 transition-colors duration-200 shadow-sm hover:shadow-md">
              <p className="text-sm text-gray-700">
                <span className="font-bold text-gray-900">
                  {extraInfo.label}:
                </span>{" "}
                <span className="font-medium">{extraInfo.value}</span>
              </p>
            </div>
          )}

          {/* Action Buttons */}
          {actions && actions.length > 0 && (
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              {actions.map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`flex-1 px-6 py-3 rounded-xl transition-all duration-200 font-semibold shadow-md hover:shadow-lg hover:scale-105 transform ${
                    action.variant === "primary"
                      ? "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700"
                      : "bg-gradient-to-r from-red-100 to-red-200 text-red-700 hover:from-red-200 hover:to-red-300"
                  }`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}