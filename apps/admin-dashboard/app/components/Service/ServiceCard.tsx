"use client";
import { 
  Clock,
  Users,
  Star,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";

interface ServiceCardProps {
  id: number;
  name: string;
  category: string;
  description: string;
  duration: number;
  price: number;
  discountedPrice: number;
  status: "active" | "inactive";
  bookings: number;
  rating: number;
  popularity: "high" | "medium" | "low";
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number) => void;
}

export function ServiceCard({
  id,
  name,
  category,
  description,
  duration,
  price,
  discountedPrice,
  status,
  bookings,
  rating,
  popularity,
  onEdit,
  onDelete,
  onToggleStatus,
}: ServiceCardProps) {
  const getStatusBadge = (status: string) => {
    return status === "active"
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getPopularityBadge = (popularity: string) => {
    switch (popularity) {
      case "high":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "medium":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "low":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const discountPercentage =
    price !== discountedPrice
      ? Math.round(((price - discountedPrice) / price) * 100)
      : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-xl transition-all hover:border-orange-300 hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 mb-1">{name}</h3>
          <span className="inline-block px-3 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
            {category}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
              status
            )}`}
          >
            {status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-center">
          <Clock className="w-4 h-4 text-gray-500 mx-auto mb-1" />
          <p className="text-xs text-gray-600">Duration</p>
          <p className="font-semibold text-sm text-gray-800">{duration} min</p>
        </div>
        <div className="text-center">
          <Users className="w-4 h-4 text-gray-500 mx-auto mb-1" />
          <p className="text-xs text-gray-600">Bookings</p>
          <p className="font-semibold text-sm text-gray-800">{bookings}</p>
        </div>
        <div className="text-center">
          <Star className="w-4 h-4 text-yellow-500 mx-auto mb-1 fill-yellow-500" />
          <p className="text-xs text-gray-600">Rating</p>
          <p className="font-semibold text-sm text-gray-800">{rating}</p>
        </div>
      </div>

      {/* Popularity */}
      <div className="mb-4">
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getPopularityBadge(
            popularity
          )}`}
        >
          {popularity.toUpperCase()} DEMAND
        </span>
      </div>

      {/* Pricing */}
      <div className="mb-4 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border border-orange-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-600 mb-1">Price</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-orange-600">
                ₹{discountedPrice}
              </span>
              {discountPercentage > 0 && (
                <span className="text-sm text-gray-500 line-through">
                  ₹{price}
                </span>
              )}
            </div>
          </div>
          {discountPercentage > 0 && (
            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              {discountPercentage}% OFF
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-gray-200">
        <button
          onClick={() => onToggleStatus(id)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm"
        >
          {status === "active" ? (
            <>
              <EyeOff className="w-4 h-4" />
              <span>Hide</span>
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              <span>Show</span>
            </>
          )}
        </button>
        <button
          onClick={() => onEdit(id)}
          className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm"
        >
          <Edit2 className="w-4 h-4" />
          <span>Edit</span>
        </button>
        <button
          onClick={() => onDelete(id)}
          className="flex items-center justify-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}