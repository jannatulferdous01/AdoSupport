"use client";

import { Users, UserCheck, UserX, UserPlus, Star, Clock } from "lucide-react";
import StatsCard from "./StatsCard";

interface ExpertStats {
  total: number;
  active: number;
  inactive: number;
  newThisMonth: number;
  averageRating: number;
  totalSessions: number;
  trends: {
    totalChange: number;
    activeChange: number;
    inactiveChange: number;
    newChange: number;
  };
}

interface ExpertStatsProps {
  stats: ExpertStats;
}

export default function ExpertStats({ stats }: ExpertStatsProps) {
  return (
    <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <StatsCard
        title="Total Experts"
        value={stats?.total?.toLocaleString()}
        trend={stats?.trends?.totalChange}
        icon={<Users className="h-6 w-6" />}
        iconBg="bg-blue-50"
        iconColor="text-blue-600"
      />

      <StatsCard
        title="Active Experts"
        value={stats?.active?.toLocaleString()}
        trend={stats?.trends?.activeChange}
        icon={<UserCheck className="h-6 w-6" />}
        iconBg="bg-emerald-50"
        iconColor="text-emerald-600"
      />

      <StatsCard
        title="Inactive Experts"
        value={stats?.inactive?.toLocaleString()}
        trend={stats?.trends?.inactiveChange}
        icon={<UserX className="h-6 w-6" />}
        iconBg="bg-orange-50"
        iconColor="text-orange-600"
      />

      <StatsCard
        title="New This Month"
        value={stats?.newThisMonth?.toLocaleString()}
        trend={stats?.trends?.newChange}
        icon={<UserPlus className="h-6 w-6" />}
        iconBg="bg-purple-50"
        iconColor="text-purple-600"
      />

      <StatsCard
        title="Avg Rating"
        value={stats?.averageRating?.toFixed(1)}
        subValue="out of 5.0"
        icon={<Star className="h-6 w-6" />}
        iconBg="bg-yellow-50"
        iconColor="text-yellow-600"
      />

      <StatsCard
        title="Total Sessions"
        value={stats?.totalSessions?.toLocaleString()}
        icon={<Clock className="h-6 w-6" />}
        iconBg="bg-indigo-50"
        iconColor="text-indigo-600"
      />
    </div>
  );
}
