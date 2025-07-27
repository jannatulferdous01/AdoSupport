"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import AdminCard from "../../_components/ui/AdminCard";

interface StatsCardProps {
  title: string;
  value: string;
  subValue?: string;
  trend?: number;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}

export default function StatsCard({
  title,
  value,
  subValue,
  trend,
  icon,
  iconBg,
  iconColor,
}: StatsCardProps) {
  const getTrendIcon = () => {
    if (trend === undefined || trend === null) return null;

    if (trend > 0) {
      return <TrendingUp className="h-3 w-3" />;
    } else if (trend < 0) {
      return <TrendingDown className="h-3 w-3" />;
    } else {
      return <Minus className="h-3 w-3" />;
    }
  };

  const getTrendColor = () => {
    if (trend === undefined || trend === null) return "text-muted-foreground";

    if (trend > 0) {
      return "text-emerald-600 bg-emerald-50";
    } else if (trend < 0) {
      return "text-red-600 bg-red-50";
    } else {
      return "text-gray-500 bg-gray-50";
    }
  };

  return (
    <AdminCard className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/30">
      {/* Subtle background pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-5">
        <div className="w-full h-full transform rotate-12 scale-150">
          {icon}
        </div>
      </div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl ${iconBg} shadow-sm`}>
            <div className={iconColor}>{icon}</div>
          </div>

          {trend !== undefined && trend !== null && (
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getTrendColor()}`}
            >
              {getTrendIcon()}
              <span>
                {trend > 0 ? "+" : ""}
                {trend}%
              </span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {title}
            </p>
          </div>

          <div className="text-3xl font-bold text-gray-900 tracking-tight">
            {value}
          </div>

          {subValue && (
            <p className="text-sm text-muted-foreground font-medium">
              {subValue}
            </p>
          )}
        </div>
      </div>
    </AdminCard>
  );
}
