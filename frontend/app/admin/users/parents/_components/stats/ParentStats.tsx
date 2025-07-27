"use client";

import { Users, UserCheck, UserX, UserPlus } from "lucide-react";
import StatsCard from "./StatsCard";

interface ParentStats {
  total: number;
  active: number;
  inactive: number;
  newThisMonth: number;
  trends: {
    totalChange: number;
    activeChange: number;
    inactiveChange: number;
    newChange: number;
  };
}

interface ParentStatsProps {
  stats: ParentStats;
}

export default function ParentStats({ stats }: ParentStatsProps) {
  return (
    <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Parents */}
      <StatsCard
        title="Total Parents"
        value={stats?.total?.toLocaleString()}
        trend={stats?.trends?.totalChange}
        icon={<Users className="h-6 w-6" />}
        iconBg="bg-blue-50"
        iconColor="text-blue-600"
      />

      {/* Active Parents */}
      <StatsCard
        title="Active Parents"
        value={stats?.active?.toLocaleString()}
        trend={stats?.trends?.activeChange}
        icon={<UserCheck className="h-6 w-6" />}
        iconBg="bg-emerald-50"
        iconColor="text-emerald-600"
      />

      {/* Inactive Parents */}
      <StatsCard
        title="Inactive Parents"
        value={stats?.inactive?.toLocaleString()}
        trend={stats?.trends?.inactiveChange}
        icon={<UserX className="h-6 w-6" />}
        iconBg="bg-orange-50"
        iconColor="text-orange-600"
      />

      {/* New This Month */}
      <StatsCard
        title="New This Month"
        value={stats?.newThisMonth?.toLocaleString()}
        trend={stats?.trends?.newChange}
        icon={<UserPlus className="h-6 w-6" />}
        iconBg="bg-purple-50"
        iconColor="text-purple-600"
      />
    </div>
  );
}
