import React from "react";
import { User, ShoppingBag, Users, Star } from "lucide-react";
import { StatsCard } from "@/components/StartCard";
import { ActivityFeed } from "@/components/ActivityFeed";
import { UserTable } from "@/components/UserTable";
import { ExpertsTable } from "@/components/ExpertTable";
import { ProductsGrid } from "@/components/ProductsGrid";

const page = () => {
  return (
    <main className="space-y-8">
      {/* Stats Cards */}
      <section>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Consultations"
            value="12.5k"
            change="2.3%"
            changeType="up"
            icon={User}
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
          />
          <StatsCard
            title="Total Sales"
            value="9.1k"
            change="9.1%"
            changeType="up"
            icon={ShoppingBag}
            iconBg="bg-orange-100"
            iconColor="text-orange-600"
          />
          <StatsCard
            title="New Users"
            value="3.2k"
            change="19%"
            changeType="down"
            icon={Users}
            iconBg="bg-green-100"
            iconColor="text-green-600"
          />
          <StatsCard
            title="Active Experts"
            value="945"
            change="12%"
            changeType="up"
            icon={Star}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
          />
        </div>
      </section>


      <section>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent Activyty */}
          <ActivityFeed />
          <div className="lg:col-span-2">
            {/* Recent Activyty */}
            <UserTable />
          </div>
        </div>
      </section>

      {/* Management Section */}
      <section>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ExpertsTable />
          <ProductsGrid />
        </div>
      </section>
    </main>
  )
}

export default page