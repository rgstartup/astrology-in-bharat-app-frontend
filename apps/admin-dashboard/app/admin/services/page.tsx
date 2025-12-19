"use client";
import React, { useState } from "react";
import {
  Sparkles,
  Users,
  Package,
  IndianRupee,
  Plus,
  Search,
} from "lucide-react";
import { StatsCards } from "@/app/components/admin/StatsCard";
import { ServiceCard } from "@/app/components/Service/ServiceCard";
import { Button } from "@/app/components/admin/Button";
import { SearchInput } from "@/app/components/admin/SearchInput";
export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

 const services = [
  {
    id: 1,
    name: "Birth Chart Reading",
    category: "Vedic Astrology",
    description: "Detailed analysis of your birth chart with predictions",
    duration: 30,
    price: 999,
    discountedPrice: 799,
    status: "active" as const,
    bookings: 156,
    rating: 4.8,
    popularity: "high" as const,
  },
  {
    id: 2,
    name: "Kundli Matching",
    category: "Marriage",
    description: "Comprehensive compatibility analysis for marriage",
    duration: 45,
    price: 1499,
    discountedPrice: 1199,
    status: "active" as const,
    bookings: 243,
    rating: 4.9,
    popularity: "high" as const,
  },
  {
    id: 3,
    name: "Career Consultation",
    category: "Career",
    description: "Get guidance on career path and opportunities",
    duration: 30,
    price: 899,
    discountedPrice: 699,
    status: "active" as const,
    bookings: 98,
    rating: 4.7,
    popularity: "medium" as const,
  },
  {
    id: 4,
    name: "Tarot Reading",
    category: "Tarot",
    description: "3-card or full spread tarot reading session",
    duration: 20,
    price: 599,
    discountedPrice: 499,
    status: "active" as const,
    bookings: 187,
    rating: 4.6,
    popularity: "medium" as const,
  },
  {
    id: 5,
    name: "Numerology Report",
    category: "Numerology",
    description: "Personalized numerology analysis and life path number",
    duration: 25,
    price: 799,
    discountedPrice: 599,
    status: "active" as const,
    bookings: 76,
    rating: 4.5,
    popularity: "low" as const,
  },
  {
    id: 6,
    name: "Vastu Consultation",
    category: "Vastu",
    description: "Home and office Vastu analysis with remedies",
    duration: 60,
    price: 1999,
    discountedPrice: 1599,
    status: "active" as const,
    bookings: 54,
    rating: 4.7,
    popularity: "low" as const,
  },
  {
    id: 7,
    name: "Palmistry Reading",
    category: "Palmistry",
    description: "Hand reading and palm analysis session",
    duration: 30,
    price: 699,
    discountedPrice: 549,
    status: "inactive" as const,
    bookings: 32,
    rating: 4.4,
    popularity: "low" as const,
  },
  {
    id: 8,
    name: "Gemstone Recommendation",
    category: "Remedies",
    description: "Personalized gemstone suggestions based on chart",
    duration: 20,
    price: 499,
    discountedPrice: 399,
    status: "active" as const,
    bookings: 121,
    rating: 4.6,
    popularity: "medium" as const,
  },
  {
    id: 9,
    name: "Love & Relationship Reading",
    category: "Relationship",
    description: "Insights into your love life and relationship compatibility",
    duration: 35,
    price: 1099,
    discountedPrice: 899,
    status: "active" as const,
    bookings: 165,
    rating: 4.8,
    popularity: "high" as const,
  },
  {
    id: 10,
    name: "Health Astrology",
    category: "Health",
    description: "Health analysis and remedies based on planetary positions",
    duration: 40,
    price: 1299,
    discountedPrice: 999,
    status: "active" as const,
    bookings: 87,
    rating: 4.5,
    popularity: "medium" as const,
  },
  {
    id: 11,
    name: "Business Consultation",
    category: "Business",
    description: "Astrological guidance for business decisions and partnerships",
    duration: 50,
    price: 1799,
    discountedPrice: 1399,
    status: "active" as const,
    bookings: 63,
    rating: 4.7,
    popularity: "medium" as const,
  },
  {
    id: 12,
    name: "Education & Study Guidance",
    category: "Education",
    description: "Career path and education choices for students",
    duration: 30,
    price: 799,
    discountedPrice: 649,
    status: "active" as const,
    bookings: 94,
    rating: 4.6,
    popularity: "medium" as const,
  },
  {
    id: 13,
    name: "Mangal Dosha Analysis",
    category: "Marriage",
    description: "Detailed Mangal Dosha check and remedies",
    duration: 25,
    price: 899,
    discountedPrice: 699,
    status: "active" as const,
    bookings: 112,
    rating: 4.7,
    popularity: "high" as const,
  },
  {
    id: 14,
    name: "Shani Sade Sati Report",
    category: "Vedic Astrology",
    description: "Saturn transit effects and remedies for Sade Sati period",
    duration: 35,
    price: 999,
    discountedPrice: 799,
    status: "active" as const,
    bookings: 78,
    rating: 4.6,
    popularity: "medium" as const,
  },
  {
    id: 15,
    name: "Rahu-Ketu Analysis",
    category: "Vedic Astrology",
    description: "Shadow planets impact and remedial measures",
    duration: 30,
    price: 899,
    discountedPrice: 699,
    status: "active" as const,
    bookings: 56,
    rating: 4.5,
    popularity: "low" as const,
  },
  {
    id: 16,
    name: "Baby Name Suggestion",
    category: "Naming",
    description: "Astrologically favorable names for your newborn",
    duration: 20,
    price: 599,
    discountedPrice: 499,
    status: "active" as const,
    bookings: 143,
    rating: 4.8,
    popularity: "high" as const,
  },
  {
    id: 17,
    name: "Pitra Dosha Consultation",
    category: "Remedies",
    description: "Ancestral afflictions analysis and remedies",
    duration: 40,
    price: 1199,
    discountedPrice: 899,
    status: "active" as const,
    bookings: 45,
    rating: 4.5,
    popularity: "low" as const,
  },
  {
    id: 18,
    name: "Muhurat Selection",
    category: "Muhurat",
    description: "Auspicious time selection for important events",
    duration: 25,
    price: 799,
    discountedPrice: 599,
    status: "active" as const,
    bookings: 89,
    rating: 4.7,
    popularity: "medium" as const,
  },
  {
    id: 19,
    name: "Transit Predictions",
    category: "Predictions",
    description: "Planetary transit effects for the upcoming year",
    duration: 45,
    price: 1299,
    discountedPrice: 999,
    status: "active" as const,
    bookings: 71,
    rating: 4.6,
    popularity: "medium" as const,
  },
  {
    id: 20,
    name: "Prashna Kundali",
    category: "Vedic Astrology",
    description: "Answer to specific questions using horary astrology",
    duration: 20,
    price: 699,
    discountedPrice: 549,
    status: "active" as const,
    bookings: 67,
    rating: 4.5,
    popularity: "low" as const,
  },
];

  const categories = ["all", "Vedic Astrology", "Marriage", "Career", "Tarot"];

  const statsConfig = [
    {
      title: "Total Services",
      value: services.length,
      icon: Package,
      iconColor: "text-orange-600",
      iconBgColor: "bg-orange-100",
      trend: { value: "+2", isPositive: true, period: "this month" },
    },
    {
      title: "Active Services",
      value: services.filter((s) => s.status === "active").length,
      icon: Sparkles,
      iconColor: "text-green-600",
      iconBgColor: "bg-green-100",
      trend: { value: "88%", isPositive: true, period: "of total" },
    },
    {
      title: "Total Bookings",
      value: services.reduce((sum, s) => sum + s.bookings, 0),
      icon: Users,
      iconColor: "text-blue-600",
      iconBgColor: "bg-blue-100",
      trend: { value: "+15%", isPositive: true, period: "this week" },
    },
    {
      title: "Avg Price",
      value: `₹${Math.round(services.reduce((sum, s) => sum + s.price, 0) / services.length)}`,
      icon: IndianRupee,
      iconColor: "text-purple-600",
      iconBgColor: "bg-purple-100",
      trend: { value: "+8%", isPositive: true, period: "vs last month" },
    },
  ];

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || service.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (id: number) => console.log("Edit:", id);
  const handleDelete = (id: number) => console.log("Delete:", id);
  const handleToggleStatus = (id: number) => console.log("Toggle:", id);

   return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Services & Pricing</h2>
          <p className="text-gray-600 mt-1">Manage astrology services and pricing</p>
        </div>
        <Button variant="primary" size="md" icon={Plus}>
          Add New Service
        </Button>
      </div>
      {/* Stats Cards */}
      <StatsCards stats={statsConfig} columns={4} />
      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Using SearchInput Component */}
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search services by name or description..."
          className="flex-1"
          size="md"
        />
        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={categoryFilter === category ? "primary" : "outline"}
              size="md"
              onClick={() => setCategoryFilter(category)}
            >
              {category === "all" ? "All Categories" : category}
            </Button>
          ))}
        </div>
      </div>
      {/* Services Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <ServiceCard
            key={service.id}
            {...service}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleStatus={handleToggleStatus}
          />
        ))}
      </div>
    </div>
  );
}