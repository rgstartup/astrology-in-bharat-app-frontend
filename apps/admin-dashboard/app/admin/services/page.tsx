"use client";
import React, { useState, useMemo ,lazy, Suspense} from "react";

// Icons
import { Plus } from "lucide-react";

// Components
import { StatsCards } from "@/app/components/admin/StatsCard";
import { ServiceCard } from "@/app/components/Service/ServiceCard";
import { Button } from "@/app/components/admin/Button";
import { SearchInput } from "@/app/components/admin/SearchInput";

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
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Services & Pricing</h1>
          <p className="text-gray-600 mt-1">Manage astrology services and pricing</p>
        </div>
        <Button variant="primary" size="md" icon={Plus}   onClick={handleOpenAddService}   
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

      {/* Services grid (3 columns on xl screens) */}
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

      <Suspense
  fallback={
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white px-6 py-3 rounded-lg shadow">
        Loading...
      </div>
    </div>
  }
>
  {showAddService && (
    <AddService onClose={() => setShowAddService(false)} />
  )}

 
</Suspense>
    </main>
  );
}