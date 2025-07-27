"use client";

import {
  TrendingUp,
  TrendingDown,
  FileText,
  Eye,
  AlertTriangle,
  Archive,
} from "lucide-react";
import AdminCard from "../../../../_components/ui/AdminCard";

interface PostStatsProps {
  stats: {
    total: number;
    published: number;
    draft: number;
    reported: number;
    removed: number;
    todaysPosts: number;
    trends: {
      totalChange: number;
      publishedChange: number;
      reportedChange: number;
    };
  };
  loading: boolean;
}

export default function PostStats({ stats, loading }: PostStatsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <AdminCard key={i} className="p-5">
            <div className="animate-pulse space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-7 bg-gray-200 rounded w-12"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
          </AdminCard>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Posts",
      icon: <FileText className="h-4 w-4 text-blue-500" />,
      value: stats.total,
      change: stats.trends.totalChange,
      description: `${stats.published} published, ${stats.draft} drafts`,
    },
    {
      title: "Published",
      icon: <Eye className="h-4 w-4 text-green-500" />,
      value: stats.published,
      change: stats.trends.publishedChange,
      description: `${stats.todaysPosts} posted today`,
    },
    {
      title: "Reported",
      icon: <AlertTriangle className="h-4 w-4 text-orange-500" />,
      value: stats.reported,
      change: stats.trends.reportedChange,
      description: "Need moderation",
    },
    {
      title: "Removed",
      icon: <Archive className="h-4 w-4 text-gray-500" />,
      value: stats.removed,
      change: 0,
      description: "Archived posts",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((card, index) => (
        <AdminCard key={index} className="p-5 hover:shadow-md transition-all duration-200">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              {/* Title and Icon */}
              <div className="flex items-center gap-2">
                {card.icon}
                <h3 className="text-sm font-medium text-gray-600">{card.title}</h3>
              </div>

              {/* Main Value */}
              <div className="text-2xl font-bold text-gray-900">
                {card.value.toLocaleString()}
              </div>

              {/* Description */}
              <p className="text-xs text-gray-500">{card.description}</p>
            </div>

            {/* Trend Indicator */}
            {card.change !== 0 && (
              <div className="flex items-center gap-1 text-sm">
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    card.change >= 0
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {card.change >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {Math.abs(card.change)}%
                </div>
              </div>
            )}
          </div>
        </AdminCard>
      ))}
    </div>
  );
}
