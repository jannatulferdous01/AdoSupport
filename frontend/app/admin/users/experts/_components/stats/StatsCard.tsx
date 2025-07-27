"use client";

import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
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
    if (trend === undefined || trend === 0) return <Minus className="h-3 w-3" />;
    return trend > 0 ? (
      <TrendingUp className="h-3 w-3" />
    ) : (
      <TrendingDown className="h-3 w-3" />
    );
  };

  const getTrendColor = () => {
    if (trend === undefined || trend === 0) return "text-muted-foreground";
    return trend > 0 ? "text-emerald-600" : "text-red-600";
  };

  const formatTrend = () => {
    if (trend === undefined || trend === 0) return "No change";
    const sign = trend > 0 ? "+" : "";
    return `${sign}${trend}%`;
  };

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="space-y-1">
            <p className="text-2xl font-bold">{value}</p>
            {subValue && (
              <p className="text-xs text-muted-foreground">{subValue}</p>
            )}
          </div>
        </div>
        <div className={`rounded-full p-3 ${iconBg}`}>
          <div className={iconColor}>{icon}</div>
        </div>
      </div>

      {trend !== undefined && (
        <div className="mt-4 flex items-center gap-1">
          <div className={getTrendColor()}>{getTrendIcon()}</div>
          <span className={`text-sm font-medium ${getTrendColor()}`}>
            {formatTrend()}
          </span>
          <span className="text-sm text-muted-foreground">from last month</span>
        </div>
      )}
    </div>
  );
}