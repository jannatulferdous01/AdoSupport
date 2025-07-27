import { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import AdminCard from "@/app/admin/_components/ui/AdminCard";

interface StatsCardProps {
  title: string;
  value: string;
  trend: number;
  icon: ReactNode;
  iconBg: string;
  iconColor: string;
}

export default function StatsCard({
  title,
  value,
  trend,
  icon,
  iconBg,
  iconColor,
}: StatsCardProps) {
  const isPositive = trend >= 0;

  return (
    <AdminCard>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>

          {/* Trend indicator for parent statistics */}
          <div className="mt-1 flex items-center gap-1">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span
              className={`text-sm font-medium ${
                isPositive ? "text-emerald-600" : "text-red-600"
              }`}
            >
              {isPositive ? "+" : ""}
              {trend}%
            </span>
            <span className="text-sm text-gray-500">vs last month</span>
          </div>
        </div>

        {/* Icon for parent stats */}
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-lg ${iconBg}`}
        >
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
    </AdminCard>
  );
}