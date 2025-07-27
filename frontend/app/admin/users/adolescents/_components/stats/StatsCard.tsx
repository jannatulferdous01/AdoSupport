import { ReactNode } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import AdminCard from "@/components/common/AdminCard";

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

          {/* Trend indicator */}
          <div className="mt-1 flex items-center gap-1">
            {isPositive ? (
              <TrendingUp className="h-3 w-3 text-green-600" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-600" />
            )}
            <span
              className={`text-xs font-medium ${
                isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {Math.abs(trend)}% from last month
            </span>
          </div>
        </div>

        <div className={`rounded-lg p-3 ${iconBg}`}>
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
    </AdminCard>
  );
}
