"use client";

import { DollarSign, Package, ShoppingCart, Users } from "lucide-react";
import AdminCard from "../../_components/ui/AdminCard";
import StatsCard from "../../users/_components/StatsCard";

interface StoreOverviewStatsProps {
  stats: any;
  loading: boolean;
}

export default function StoreOverviewStats({
  stats,
  loading,
}: StoreOverviewStatsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <AdminCard key={i}>
            <div className="animate-pulse">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-8 w-8 bg-gray-200 rounded"></div>
              </div>
              <div className="mt-2 h-3 bg-gray-200 rounded w-12"></div>
            </div>
          </AdminCard>
        ))}
      </div>
    );
  }

  if (!stats?.overview) {
    return null;
  }

  const { overview } = stats;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Products"
        value={overview.totalProducts.toLocaleString()}
        icon={<Package className="h-5 w-5" />}
        iconBg="bg-blue-100"
        iconColor="text-blue-600"
        trend={overview.trends.productsChange}
      />

      <StatsCard
        title="Total Revenue"
        value={`$${overview.totalRevenue.toLocaleString()}`}
        icon={<DollarSign className="h-5 w-5" />}
        iconBg="bg-green-100"
        iconColor="text-green-600"
        trend={overview.trends.revenueChange}
      />

      <StatsCard
        title="Total Orders"
        value={overview.totalOrders.toLocaleString()}
        icon={<ShoppingCart className="h-5 w-5" />}
        iconBg="bg-orange-100"
        iconColor="text-orange-600"
        trend={overview.trends.ordersChange}
      />

      <StatsCard
        title="Customers"
        value={overview.totalCustomers.toLocaleString()}
        icon={<Users className="h-5 w-5" />}
        iconBg="bg-purple-100"
        iconColor="text-purple-600"
        trend={overview.trends.customersChange}
      />
    </div>
  );
}
