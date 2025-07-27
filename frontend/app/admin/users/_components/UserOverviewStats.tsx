"use client";

import { Users, UserCheck, UserPlus, TrendingUp } from "lucide-react";
import AdminCard from "../../_components/ui/AdminCard";
import StatsCard from "./StatsCard";

interface UserOverviewStatsProps {
  stats: {
    totalUsers: number;
    activeUsers: number;
    newThisMonth: number;
    growthRate: number;
  };
  loading: boolean;
}

export default function UserOverviewStats({
  stats,
  loading,
}: UserOverviewStatsProps) {
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <AdminCard key={i} className="relative overflow-hidden">
            <div className="animate-pulse space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-8 bg-gray-200 rounded w-20"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gray-100/80 to-transparent animate-[shimmer_2s_infinite]"></div>
          </AdminCard>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div className="transform transition-all duration-300 hover:scale-[1.02]">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          subValue="Across all user types"
          trend={stats.growthRate}
          icon={<Users className="h-5 w-5" />}
          iconBg="bg-gradient-to-br from-blue-50 to-blue-100"
          iconColor="text-blue-600"
        />
      </div>

      <div className="transform transition-all duration-300 hover:scale-[1.02] delay-75">
        <StatsCard
          title="Active Users"
          value={stats.activeUsers.toLocaleString()}
          subValue={`${Math.round(
            (stats.activeUsers / (stats.totalUsers || 1)) * 100
          )}% of total users`}
          icon={<UserCheck className="h-5 w-5" />}
          iconBg="bg-gradient-to-br from-green-50 to-green-100"
          iconColor="text-green-600"
        />
      </div>

      <div className="transform transition-all duration-300 hover:scale-[1.02] delay-150">
        <StatsCard
          title="New This Month"
          value={stats.newThisMonth.toLocaleString()}
          subValue="Recent registrations"
          icon={<UserPlus className="h-5 w-5" />}
          iconBg="bg-gradient-to-br from-purple-50 to-purple-100"
          iconColor="text-purple-600"
        />
      </div>

      <div className="transform transition-all duration-300 hover:scale-[1.02] delay-300">
        <StatsCard
          title="Growth Rate"
          value={`${stats.growthRate > 0 ? "+" : ""}${stats.growthRate}%`}
          subValue="Compared to last month"
          trend={stats.growthRate}
          icon={<TrendingUp className="h-5 w-5" />}
          iconBg="bg-gradient-to-br from-orange-50 to-orange-100"
          iconColor="text-orange-600"
        />
      </div>
    </div>
  );
}
