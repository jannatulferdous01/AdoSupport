"use client";

import { TrendingUp, Users, UserCheck, UserX, Clock } from "lucide-react";
import StatsCard from "./StatsCard";

interface UserStatsProps {
  stats: {
    total: number;
    active: number;
    suspended: number;
    newThisMonth: number;
    trends: {
      totalChange: number;
      activeChange: number;
      suspendedChange: number;
      newChange: number;
    };
  };
}

export default function UserStats({ stats }: UserStatsProps) {
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Users"
        value={stats.total.toLocaleString()}
        trend={stats.trends.totalChange}
        icon={<Users className="h-5 w-5" />}
        iconBg="bg-blue-50"
        iconColor="text-blue-600"
      />

      <StatsCard
        title="Active Users"
        value={stats.active.toLocaleString()}
        trend={stats.trends.activeChange}
        icon={<UserCheck className="h-5 w-5" />}
        iconBg="bg-green-50"
        iconColor="text-green-600"
      />

      <StatsCard
        title="Suspended"
        value={stats.suspended.toLocaleString()}
        trend={stats.trends.suspendedChange}
        icon={<UserX className="h-5 w-5" />}
        iconBg="bg-red-50"
        iconColor="text-red-600"
      />

      <StatsCard
        title="New This Month"
        value={stats.newThisMonth.toLocaleString()}
        trend={stats.trends.newChange}
        icon={<Clock className="h-5 w-5" />}
        iconBg="bg-purple-50"
        iconColor="text-purple-600"
      />
    </div>
  );
}
