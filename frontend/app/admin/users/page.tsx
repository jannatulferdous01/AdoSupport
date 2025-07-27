"use client";

import { useState, useEffect } from "react";
import { Users, TrendingUp, Activity, Calendar } from "lucide-react";
import AdminPageHeader from "../_components/ui/AdminPageHeader";
import AdminCard from "../_components/ui/AdminCard";
import UserOverviewStats from "./_components/UserOverviewStats";
import UserTypeCards from "./_components/UserTypeCards";
import UserGrowthChart from "./_components/UserGrowthChart";
import { mockApi as adolescentApi } from "./adolescents/_services/mockApi";
import { mockApi as parentApi } from "./parents/_services/mockApi";
import { mockApi as expertApi } from "./experts/_services/mockApi";

interface CombinedStats {
  totalUsers: number;
  activeUsers: number;
  newThisMonth: number;
  growthRate: number;
  adolescents: {
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
  parents: {
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
  };
  experts: {
    total: number;
    active: number;
    inactive: number; // Changed from 'suspended' to 'inactive'
    newThisMonth: number;
    averageRating: number; // Changed from 'avgRating' to 'averageRating'
    totalSessions: number;
    trends: {
      totalChange: number;
      activeChange: number;
      inactiveChange: number; // Changed from 'suspendedChange' to 'inactiveChange'
      newChange: number;
    };
  };
}

export default function UserManagementPage() {
  // RTK Query hooks (commented out for future implementation)
  /*
  const {
    data: adolescentStatsData,
    isLoading: isLoadingAdolescentStats,
  } = useGetAdolescentStatsQuery();

  const {
    data: parentStatsData,
    isLoading: isLoadingParentStats,
  } = useGetParentStatsQuery();

  const {
    data: expertStatsData,
    isLoading: isLoadingExpertStats,
  } = useGetExpertStatsQuery();

  const {
    data: recentActivityData,
    isLoading: isLoadingActivity,
  } = useGetRecentActivityQuery();
  */

  // Mock data state (remove this when implementing RTK Query)
  const [stats, setStats] = useState<CombinedStats>({
    totalUsers: 0,
    activeUsers: 0,
    newThisMonth: 0,
    growthRate: 0,
    adolescents: {
      total: 0,
      active: 0,
      suspended: 0,
      newThisMonth: 0,
      trends: {
        totalChange: 0,
        activeChange: 0,
        suspendedChange: 0,
        newChange: 0,
      },
    },
    parents: {
      total: 0,
      active: 0,
      inactive: 0,
      newThisMonth: 0,
      trends: {
        totalChange: 0,
        activeChange: 0,
        inactiveChange: 0,
        newChange: 0,
      },
    },
    experts: {
      total: 0,
      active: 0,
      inactive: 0,
      newThisMonth: 0,
      averageRating: 0,
      totalSessions: 0,
      trends: {
        totalChange: 0,
        activeChange: 0,
        inactiveChange: 0,
        newChange: 0,
      },
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCombinedStats = async () => {
      setLoading(true);
      try {
        const [adolescentStats, parentStats, expertStats] = await Promise.all([
          adolescentApi.fetchAdolescentStats(),
          parentApi.fetchParentStats(),
          expertApi.fetchExpertStats(),
        ]);

        const totalUsers =
          adolescentStats.total + parentStats.total + expertStats.total;
        const activeUsers =
          adolescentStats.active + parentStats.active + expertStats.active;
        const newThisMonth =
          adolescentStats.newThisMonth +
          parentStats.newThisMonth +
          expertStats.newThisMonth;

        const totalTrendSum =
          adolescentStats.trends.totalChange * adolescentStats.total +
          parentStats.trends.totalChange * parentStats.total +
          expertStats.trends.totalChange * expertStats.total;
        const growthRate =
          totalUsers > 0 ? Math.round(totalTrendSum / totalUsers) : 0;

        setStats({
          totalUsers,
          activeUsers,
          newThisMonth,
          growthRate,
          adolescents: adolescentStats,
          parents: parentStats,
          experts: expertStats,
        });
      } catch (error) {
        console.error("Error fetching combined stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCombinedStats();
  }, []);

  // RTK Query version will be:
  /*
  const loading = isLoadingAdolescentStats || isLoadingParentStats || isLoadingExpertStats;
  
  const stats = useMemo(() => {
    if (!adolescentStatsData || !parentStatsData || !expertStatsData) {
      return initialStats;
    }

    const totalUsers = adolescentStatsData.total + parentStatsData.total + expertStatsData.total;
    const activeUsers = adolescentStatsData.active + parentStatsData.active + expertStatsData.active;
    const newThisMonth = adolescentStatsData.newThisMonth + parentStatsData.newThisMonth + expertStatsData.newThisMonth;
    
    const totalTrendSum = 
      (adolescentStatsData.trends.totalChange * adolescentStatsData.total) +
      (parentStatsData.trends.totalChange * parentStatsData.total) +
      (expertStatsData.trends.totalChange * expertStatsData.total);
    const growthRate = totalUsers > 0 ? Math.round(totalTrendSum / totalUsers) : 0;

    return {
      totalUsers,
      activeUsers,
      newThisMonth,
      growthRate,
      adolescents: adolescentStatsData,
      parents: parentStatsData,
      experts: expertStatsData,
    };
  }, [adolescentStatsData, parentStatsData, expertStatsData]);
  */

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="User Management"
        description="Comprehensive overview and management of all user accounts across the platform"
      />

      {/* Overall Platform Stats */}
      <UserOverviewStats stats={stats} loading={loading} />

      {/* User Type Cards with Individual Stats */}
      <UserTypeCards stats={stats} loading={loading} />

      <div className="w-full">
        <UserGrowthChart stats={stats} loading={loading} />
      </div>
    </div>
  );
}
