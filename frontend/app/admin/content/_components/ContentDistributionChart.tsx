"use client";

import AdminCard from "../../_components/ui/AdminCard";
import {
  TrendingUp,
  HelpCircle,
  MessageCircle,
  BookOpen,
  Heart,
} from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface ContentDistributionChartProps {
  stats: {
    postTypes: {
      questions: { total: number; answered: number; unanswered: number };
      discussions: { total: number; active: number; closed: number };
      resources: { total: number; published: number; draft: number };
      experiences: { total: number; approved: number; pending: number };
    };
  };
  loading: boolean;
}

export default function ContentDistributionChart({
  stats,
  loading,
}: ContentDistributionChartProps) {
  if (loading) {
    return (
      <AdminCard className="relative overflow-hidden">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
            <div className="space-y-2">
              <div className="h-5 bg-gray-200 rounded w-32"></div>
              <div className="h-3 bg-gray-200 rounded w-48"></div>
            </div>
          </div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gray-100/80 to-transparent animate-[shimmer_2s_infinite]"></div>
      </AdminCard>
    );
  }

  // Prepare data for the pie chart with proper fallbacks
  const chartData = [
    {
      name: "Questions",
      value: stats?.postTypes?.questions?.total || 0,
      fill: "#3b82f6",
      description: "Community questions and help requests",
    },
    {
      name: "Discussions",
      value: stats?.postTypes?.discussions?.total || 0,
      fill: "#10b981",
      description: "Open discussions and conversations",
    },
    {
      name: "Resources",
      value: stats?.postTypes?.resources?.total || 0,
      fill: "#f59e0b",
      description: "Educational content and guides",
    },
    {
      name: "Experiences",
      value: stats?.postTypes?.experiences?.total || 0,
      fill: "#ef4444",
      description: "Personal stories and experiences",
    },
  ];

  // Filter out items with zero values for cleaner chart
  const validChartData = chartData.filter((item) => item.value > 0);
  const totalPosts = validChartData.reduce((sum, item) => sum + item.value, 0);

  // Custom tooltip component with proper styling and positioning
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage =
        totalPosts > 0 ? ((data.value / totalPosts) * 100).toFixed(1) : "0";
      return (
        <div className="bg-white p-3 rounded-lg shadow-xl border border-gray-200 z-50 relative">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">{data.payload.description}</p>
          <p className="text-sm font-medium text-gray-800">
            {data.value.toLocaleString()} posts ({percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Get icon for post type
  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case "Questions":
        return <HelpCircle className="h-4 w-4" />;
      case "Discussions":
        return <MessageCircle className="h-4 w-4" />;
      case "Resources":
        return <BookOpen className="h-4 w-4" />;
      case "Experiences":
        return <Heart className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  // Show message if no data
  if (totalPosts === 0) {
    return (
      <AdminCard>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">
              Content Distribution
            </h3>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-500">No content data available yet</p>
          </div>
        </div>
      </AdminCard>
    );
  }

  return (
    <AdminCard>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-5 w-5 text-gray-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Content Distribution
            </h3>
            <p className="text-sm text-gray-600">
              Distribution of community content types
            </p>
          </div>
        </div>

        {/* Chart Container */}
        <div className="relative h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={validChartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {validChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                content={<CustomTooltip />}
                wrapperStyle={{ zIndex: 1000 }}
                position={{ x: 0, y: 0 }}
                allowEscapeViewBox={{ x: false, y: false }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Center Total - Outside the chart container to avoid tooltip conflicts */}
        <div className="flex items-center justify-center -mt-40 mb-16 pointer-events-none relative z-10">
          <div className="text-center bg-white/90 rounded-lg px-4 py-2 backdrop-blur-sm">
            <div className="text-2xl font-bold text-gray-900">
              {totalPosts.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Posts</div>
          </div>
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-3">
          {validChartData.map((item, index) => {
            const percentage =
              totalPosts > 0
                ? ((item.value / totalPosts) * 100).toFixed(1)
                : "0";
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.fill }}
                  ></div>
                  {getPostTypeIcon(item.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {item.name}
                  </div>
                  <div className="text-xs text-gray-600">
                    {item.value.toLocaleString()} ({percentage}%)
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminCard>
  );
}
