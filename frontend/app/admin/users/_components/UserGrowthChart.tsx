"use client";

import AdminCard from "../../_components/ui/AdminCard";
import { TrendingUp, Users, Calendar, BarChart3 } from "lucide-react";

interface UserGrowthChartProps {
  stats: {
    totalUsers: number;
    activeUsers: number;
    adolescents: {
      total: number;
      active: number;
      trends: { totalChange: number };
    };
    parents: { total: number; active: number; trends: { totalChange: number } };
    experts: { total: number; active: number; trends: { totalChange: number } };
  };
  loading: boolean;
}

export default function UserGrowthChart({
  stats,
  loading,
}: UserGrowthChartProps) {
  if (loading) {
    return (
      <AdminCard className="relative overflow-hidden">
        <div className="animate-pulse space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-gray-200 rounded-xl"></div>
            <div className="space-y-2">
              <div className="h-6 bg-gray-200 rounded w-40"></div>
              <div className="h-4 bg-gray-200 rounded w-60"></div>
            </div>
          </div>
          <div className="space-y-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded-full"></div>
              </div>
            ))}
          </div>
          <div className="h-20 bg-gray-200 rounded-xl"></div>
        </div>
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gray-100/80 to-transparent animate-[shimmer_2s_infinite]"></div>
      </AdminCard>
    );
  }

  // Calculate percentages for visual representation
  const adolescentPercentage =
    (stats.adolescents.total / (stats.totalUsers || 1)) * 100;
  const parentPercentage =
    (stats.parents.total / (stats.totalUsers || 1)) * 100;
  const expertPercentage =
    (stats.experts.total / (stats.totalUsers || 1)) * 100;

  return (
    <AdminCard className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/30">
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
            <BarChart3 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">
              User Distribution
            </h3>
            <p className="text-sm text-muted-foreground font-medium">
              Platform user breakdown by type with growth trends
            </p>
          </div>
        </div>

        {/* Enhanced Visual Chart */}
        <div className="space-y-8">
          {/* Adolescents */}
          <div className="group space-y-3 p-4 rounded-xl bg-gradient-to-r from-blue-50/50 to-transparent hover:from-blue-50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-sm"></div>
                <span className="font-semibold text-gray-900">Adolescents</span>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-gray-900">
                  {stats.adolescents.total.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground ml-2 font-medium">
                  ({adolescentPercentage.toFixed(1)}%)
                </span>
              </div>
            </div>
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-700 ease-out shadow-sm"
                  style={{ width: `${adolescentPercentage}%` }}
                ></div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full opacity-50"></div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground font-medium">
                <span className="text-emerald-600 font-semibold">
                  {stats.adolescents.active.toLocaleString()}
                </span>{" "}
                active users
              </span>
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  stats.adolescents.trends.totalChange >= 0
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                <TrendingUp
                  className={`h-3 w-3 ${
                    stats.adolescents.trends.totalChange < 0 ? "rotate-180" : ""
                  }`}
                />
                {stats.adolescents.trends.totalChange >= 0 ? "+" : ""}
                {stats.adolescents.trends.totalChange}% this month
              </div>
            </div>
          </div>

          {/* Parents */}
          <div className="group space-y-3 p-4 rounded-xl bg-gradient-to-r from-green-50/50 to-transparent hover:from-green-50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-sm"></div>
                <span className="font-semibold text-gray-900">Parents</span>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-gray-900">
                  {stats.parents.total.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground ml-2 font-medium">
                  ({parentPercentage.toFixed(1)}%)
                </span>
              </div>
            </div>
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-700 ease-out delay-150 shadow-sm"
                  style={{ width: `${parentPercentage}%` }}
                ></div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full opacity-50"></div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground font-medium">
                <span className="text-emerald-600 font-semibold">
                  {stats.parents.active.toLocaleString()}
                </span>{" "}
                active users
              </span>
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  stats.parents.trends.totalChange >= 0
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                <TrendingUp
                  className={`h-3 w-3 ${
                    stats.parents.trends.totalChange < 0 ? "rotate-180" : ""
                  }`}
                />
                {stats.parents.trends.totalChange >= 0 ? "+" : ""}
                {stats.parents.trends.totalChange}% this month
              </div>
            </div>
          </div>

          {/* Experts */}
          <div className="group space-y-3 p-4 rounded-xl bg-gradient-to-r from-purple-50/50 to-transparent hover:from-purple-50 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full shadow-sm"></div>
                <span className="font-semibold text-gray-900">Experts</span>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-gray-900">
                  {stats.experts.total.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground ml-2 font-medium">
                  ({expertPercentage.toFixed(1)}%)
                </span>
              </div>
            </div>
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-purple-500 to-purple-600 h-full rounded-full transition-all duration-700 ease-out delay-300 shadow-sm"
                  style={{ width: `${expertPercentage}%` }}
                ></div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full opacity-50"></div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground font-medium">
                <span className="text-emerald-600 font-semibold">
                  {stats.experts.active.toLocaleString()}
                </span>{" "}
                active users
              </span>
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  stats.experts.trends.totalChange >= 0
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                <TrendingUp
                  className={`h-3 w-3 ${
                    stats.experts.trends.totalChange < 0 ? "rotate-180" : ""
                  }`}
                />
                {stats.experts.trends.totalChange >= 0 ? "+" : ""}
                {stats.experts.trends.totalChange}% this month
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Summary */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-green-500/10 to-purple-500/10 rounded-2xl blur-xl"></div>
          <div className="relative bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl p-6 shadow-lg">
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center group cursor-default">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  {adolescentPercentage.toFixed(1)}%
                </div>
                <div className="text-sm font-medium text-muted-foreground mt-1">
                  Adolescents
                </div>
                <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mt-2 opacity-60"></div>
              </div>
              <div className="text-center group cursor-default">
                <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  {parentPercentage.toFixed(1)}%
                </div>
                <div className="text-sm font-medium text-muted-foreground mt-1">
                  Parents
                </div>
                <div className="h-1 bg-gradient-to-r from-green-500 to-green-600 rounded-full mt-2 opacity-60"></div>
              </div>
              <div className="text-center group cursor-default">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  {expertPercentage.toFixed(1)}%
                </div>
                <div className="text-sm font-medium text-muted-foreground mt-1">
                  Experts
                </div>
                <div className="h-1 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full mt-2 opacity-60"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminCard>
  );
}
