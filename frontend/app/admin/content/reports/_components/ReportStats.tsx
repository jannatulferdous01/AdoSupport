"use client";

import AdminCard from "@/app/admin/_components/ui/AdminCard";
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Shield,
} from "lucide-react";

interface ReportStatsProps {
  stats: {
    total: number;
    pending: number;
    investigating: number;
    resolved: number;
    dismissed: number;
    todaysReports: number;
    avgResolutionTime: number;
    trends: {
      totalChange: number;
      pendingChange: number;
      resolvedChange: number;
    };
  };
  loading: boolean;
}

export default function ReportStats({ stats, loading }: ReportStatsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
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
      title: "Total Reports",
      icon: <AlertTriangle className="h-4 w-4 text-orange-500" />,
      value: stats.total,
      change: stats.trends.totalChange,
      description: `${stats.todaysReports} reported today`,
    },
    {
      title: "Pending",
      icon: <Clock className="h-4 w-4 text-red-500" />,
      value: stats.pending,
      change: stats.trends.pendingChange,
      description: "Need immediate review",
    },
    {
      title: "Investigating",
      icon: <Shield className="h-4 w-4 text-blue-500" />,
      value: stats.investigating,
      change: 0,
      description: "Under investigation",
    },
    {
      title: "Resolved",
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      value: stats.resolved,
      change: stats.trends.resolvedChange,
      description: "Action taken",
    },
    {
      title: "Dismissed",
      icon: <XCircle className="h-4 w-4 text-gray-500" />,
      value: stats.dismissed,
      change: 0,
      description: "No violation found",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {statCards.map((card, index) => (
        <AdminCard
          key={index}
          className="p-5 hover:shadow-md transition-all duration-200"
        >
          <div className="space-y-3">
            {/* Title and Icon */}
            <div className="flex items-center gap-2">
              {card.icon}
              <h3 className="text-sm font-medium text-gray-600">
                {card.title}
              </h3>
            </div>

            {/* Main Value */}
            <div className="text-2xl font-bold text-gray-900">
              {card.value.toLocaleString()}
            </div>

            {/* Description and Trend */}
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-500">{card.description}</p>
              {card.change !== 0 && (
                <div
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    card.change >= 0
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {card.change >= 0 ? "+" : ""}
                  {card.change}%
                </div>
              )}
            </div>
          </div>
        </AdminCard>
      ))}
    </div>
  );
}
