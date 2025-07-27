"use client";

import { useState, useEffect } from "react";
import AdminPageHeader from "../_components/ui/AdminPageHeader";
import StoreOverviewStats from "./_components/StoreOverviewStats";
import { mockStoreApi, StoreStatsData } from "./_services/mockStoreApi";
import StoreRevenueChart from "./_components/StoreRevenueChart";
import StoreTrendChart from "./_components/StoreTrendChart";

export default function StoreOverviewPage() {
  // Mock data state (remove this when implementing RTK Query)
  const [stats, setStats] = useState<StoreStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data fetching (remove this when implementing RTK Query)
  useEffect(() => {
    const fetchStoreStats = async () => {
      setLoading(true);
      try {
        const storeStats = await mockStoreApi?.fetchStoreStats();
        setStats(storeStats);
      } catch (error) {
        console.error("Error fetching store stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreStats();
  }, []);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Store Management"
        description="Monitor product sales, order processing, and revenue analytics"
      />

      {/* Store Overview Stats */}
      <StoreOverviewStats stats={stats} loading={loading} />

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <StoreRevenueChart stats={stats} loading={loading} />

        {/* Sales Trend Chart */}
        <StoreTrendChart stats={stats} loading={loading} />
      </div>
    </div>
  );
}
