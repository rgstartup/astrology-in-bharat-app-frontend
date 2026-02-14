"use client";
import React, { useState, useMemo, lazy, Suspense } from "react";

// Icons
import { Plus } from "lucide-react";

// Components
import { StatsCards } from "../../../../shared/components/StatsCard";
import { ServiceCard } from "@/app/components/Service/ServiceCard";
import { Button } from "../../../../shared/components/Button";
import { SearchInput } from "../../../../shared/components/SearchInput";

const AddService = lazy(() => import("@/app/components/Service/AddService"));
// Data config
import { servicesData, getStatsConfig, categories } from "@/app/components/Service/servicesConfig";

export default function ServicesPage() {
  // Search query state
  const [searchQuery, setSearchQuery] = useState("");

  // Category filter state (all, Vedic Astrology, Marriage, etc.)
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Get stats config (memoized)
  const statsConfig = useMemo(() => getStatsConfig(servicesData), []);
  const [showAddService, setShowAddService] = useState(false);
  const handleOpenAddService = () => {

    setShowAddService(true);
  };
  // Filter services based on search and category
  const filteredServices = useMemo(() => {
    return servicesData.filter((service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "all" || service.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, categoryFilter]);

  // Action handlers
  const handleEdit = (id: number) => console.log("Edit:", id);
  const handleDelete = (id: number) => console.log("Delete:", id);
  const handleToggleStatus = (id: number) => console.log("Toggle:", id);

  return (
    <main className="space-y-6">
      {/* Header with add service button */}
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* Text */}
        <div className="min-w-0">
          <h1 className="text-xl sm:text-3xl font-bold text-gray-800 truncate">
            Services & Pricing
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Manage astrology services and pricing
          </p>
        </div>

        {/* Action */}
        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={handleOpenAddService}
          className="w-full md:w-auto"
        >
          Add New Service
        </Button>
      </header>


      {/* Stats cards - Total, Active, Bookings, Avg Price */}
      <StatsCards stats={statsConfig} columns={4} />


      {/* Search and category filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search input */}
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search services..."
          className="flex-1"
          size="md"
        />

        {/* Category filter buttons */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={categoryFilter === category ? "primary" : "outline"}
              size="md"
              onClick={() => setCategoryFilter(category)}
              className="w-full sm:w-auto"
            >
              {category === "all" ? "All Categories" : category}
            </Button>
          ))}
        </div>


      </div>

      {/* Services grid (3 columns on xl screens) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
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


      {showAddService && (
        <Suspense
          fallback={
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg shadow text-sm sm:text-base">
                Loading...
              </div>
            </div>
          }
        >
          <AddService onClose={() => setShowAddService(false)} />
        </Suspense>
      )}

    </main>
  );
}