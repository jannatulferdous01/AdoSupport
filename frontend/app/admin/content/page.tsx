"use client";

import { useState, useEffect } from "react";
import AdminPageHeader from "../_components/ui/AdminPageHeader";
import ContentTypeCards from "./_components/ContentTypeCards";
import CommunityTrendChart from "./_components/CommunityTrendChart";
import ContentDistributionChart from "./_components/ContentDistributionChart";
import ModerationWorkflowChart from "./_components/ModerationWorkflowChart";
import {
  mockCommunityApi,
  type CommunityStatsData,
} from "./_services/mockCommunityApi";

export default function CommunityOverviewPage() {
  // RTK Query hooks (commented out for future implementation)
  /*
  const {
    data: communityStatsData,
    isLoading: isLoadingCommunityStats,
  } = useGetCommunityStatsQuery();
  */

  // Mock data state (remove this when implementing RTK Query)
  const [stats, setStats] = useState<CommunityStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data fetching (remove this when implementing RTK Query)
  useEffect(() => {
    const fetchCommunityStats = async () => {
      setLoading(true);
      try {
        const communityStats = await mockCommunityApi.fetchCommunityStats();
        setStats(communityStats);
      } catch (error) {
        console.error("Error fetching community stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityStats();
  }, []);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Community Overview"
        description="Monitor community content types, engagement, and moderation activities"
      />

      {/* Content Type Cards */}
      <ContentTypeCards stats={stats || ({} as any)} loading={loading} />

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Content Distribution Chart */}
        <ContentDistributionChart
          stats={stats || ({} as any)}
          loading={loading}
        />

        {/* Moderation Workflow Chart */}
        <ModerationWorkflowChart
          stats={stats || ({} as any)}
          loading={loading}
        />
      </div>

      {/* Community Trend Chart */}
      <div className="w-full">
        <CommunityTrendChart loading={loading} />
      </div>
    </div>
  );
}
