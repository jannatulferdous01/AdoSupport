"use client";

import Link from "next/link";
import { Users, Heart, Award, ArrowRight } from "lucide-react";
import AdminCard from "../../_components/ui/AdminCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface UserTypeCardsProps {
  stats: {
    adolescents: {
      total: number;
      active: number;
      suspended: number;
      newThisMonth: number;
      trends: { totalChange: number; activeChange: number };
    };
    parents: {
      total: number;
      active: number;
      inactive: number;
      newThisMonth: number;
      trends: { totalChange: number; activeChange: number };
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
        inactiveChange: number;
        newChange: number;
      }; // Added missing properties
    };
  };
  loading: boolean;
}

export default function UserTypeCards({ stats, loading }: UserTypeCardsProps) {
  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <AdminCard key={i} className="relative overflow-hidden">
            <div className="animate-pulse space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-gray-200 rounded-xl"></div>
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="h-6 w-12 bg-gray-200 rounded-full"></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div key={j} className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                    <div className="h-5 bg-gray-200 rounded w-12"></div>
                  </div>
                ))}
              </div>
              <div className="h-10 bg-gray-200 rounded-lg"></div>
            </div>
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gray-100/80 to-transparent animate-[shimmer_2s_infinite]"></div>
          </AdminCard>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Adolescents Card */}
      <div className="group transform transition-all duration-300 hover:scale-[1.02]">
        <AdminCard className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl bg-gradient-to-br from-blue-50/50 to-white">
          <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
            <Users className="w-full h-full text-blue-600" />
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Adolescents</h3>
              </div>
              <Badge
                variant="outline"
                className={`${
                  stats.adolescents.trends.totalChange >= 0
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {stats.adolescents.trends.totalChange > 0 ? "+" : ""}
                {stats.adolescents.trends.totalChange}%
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white/70 rounded-lg backdrop-blur-sm">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Total
                </span>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.adolescents.total.toLocaleString()}
                </p>
              </div>
              <div className="text-center p-3 bg-white/70 rounded-lg backdrop-blur-sm">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Active
                </span>
                <p className="text-2xl font-bold text-emerald-600 mt-1">
                  {stats.adolescents.active.toLocaleString()}
                </p>
              </div>
              <div className="text-center p-3 bg-white/70 rounded-lg backdrop-blur-sm">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Suspended
                </span>
                <p className="text-lg font-bold text-red-600 mt-1">
                  {stats.adolescents.suspended.toLocaleString()}
                </p>
              </div>
              <div className="text-center p-3 bg-white/70 rounded-lg backdrop-blur-sm">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  New
                </span>
                <p className="text-lg font-bold text-purple-600 mt-1">
                  {stats.adolescents.newThisMonth.toLocaleString()}
                </p>
              </div>
            </div>

            <Link href="/admin/users/adolescents">
              <Button className="w-full group/btn bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg transition-all duration-300">
                Manage Adolescents
                <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </AdminCard>
      </div>

      {/* Parents Card */}
      <div className="group transform transition-all duration-300 hover:scale-[1.02] delay-75">
        <AdminCard className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl bg-gradient-to-br from-green-50/50 to-white">
          <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
            <Heart className="w-full h-full text-green-600" />
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Parents</h3>
              </div>
              <Badge
                variant="outline"
                className={`${
                  stats.parents.trends.totalChange >= 0
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {stats.parents.trends.totalChange > 0 ? "+" : ""}
                {stats.parents.trends.totalChange}%
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white/70 rounded-lg backdrop-blur-sm">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Total
                </span>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.parents.total.toLocaleString()}
                </p>
              </div>
              <div className="text-center p-3 bg-white/70 rounded-lg backdrop-blur-sm">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Active
                </span>
                <p className="text-2xl font-bold text-emerald-600 mt-1">
                  {stats.parents.active.toLocaleString()}
                </p>
              </div>
              <div className="text-center p-3 bg-white/70 rounded-lg backdrop-blur-sm">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Inactive
                </span>
                <p className="text-lg font-bold text-orange-600 mt-1">
                  {stats.parents.inactive.toLocaleString()}
                </p>
              </div>
              <div className="text-center p-3 bg-white/70 rounded-lg backdrop-blur-sm">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  New
                </span>
                <p className="text-lg font-bold text-purple-600 mt-1">
                  {stats.parents.newThisMonth.toLocaleString()}
                </p>
              </div>
            </div>

            <Link href="/admin/users/parents">
              <Button className="w-full group/btn bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg transition-all duration-300">
                Manage Parents
                <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </AdminCard>
      </div>

      {/* Experts Card */}
      <div className="group transform transition-all duration-300 hover:scale-[1.02] delay-150">
        <AdminCard className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl bg-gradient-to-br from-purple-50/50 to-white">
          <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
            <Award className="w-full h-full text-purple-600" />
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Experts</h3>
              </div>
              <Badge
                variant="outline"
                className={`${
                  stats.experts.trends.totalChange >= 0
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {stats.experts.trends.totalChange > 0 ? "+" : ""}
                {stats.experts.trends.totalChange}%
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white/70 rounded-lg backdrop-blur-sm">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Total
                </span>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.experts.total.toLocaleString()}
                </p>
              </div>
              <div className="text-center p-3 bg-white/70 rounded-lg backdrop-blur-sm">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Active
                </span>
                <p className="text-2xl font-bold text-emerald-600 mt-1">
                  {stats.experts.active.toLocaleString()}
                </p>
              </div>
              <div className="text-center p-3 bg-white/70 rounded-lg backdrop-blur-sm">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Avg Rating
                </span>
                <p className="text-lg font-bold text-amber-600 mt-1">
                  {stats.experts.averageRating.toFixed(1)} ★
                </p>
              </div>
              <div className="text-center p-3 bg-white/70 rounded-lg backdrop-blur-sm">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Sessions
                </span>
                <p className="text-lg font-bold text-blue-600 mt-1">
                  {stats.experts.totalSessions.toLocaleString()}
                </p>
              </div>
            </div>

            <Link href="/admin/users/experts">
              <Button className="w-full group/btn bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg transition-all duration-300">
                Manage Experts
                <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
