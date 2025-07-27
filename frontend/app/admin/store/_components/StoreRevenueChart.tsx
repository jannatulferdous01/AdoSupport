"use client";

import AdminCard from "../../_components/ui/AdminCard";
import { DollarSign, TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface StoreRevenueChartProps {
  stats: any;
  loading: boolean;
}

export default function StoreRevenueChart({
  stats,
  loading,
}: StoreRevenueChartProps) {
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
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gray-100/80 to-transparent animate-[shimmer_2s_infinite]"></div>
      </AdminCard>
    );
  }

  // Mock revenue data - replace with real data from stats
  const revenueData = [
    { month: "Jan", revenue: 4200, orders: 32 },
    { month: "Feb", revenue: 5800, orders: 45 },
    { month: "Mar", revenue: 7200, orders: 58 },
    { month: "Apr", revenue: 6800, orders: 52 },
    { month: "May", revenue: 8900, orders: 67 },
    { month: "Jun", revenue: 12400, orders: 89 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{label} 2024</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-gray-700">Revenue:</span>
              <span className="font-medium text-gray-900">
                ${payload[0]?.value?.toLocaleString()}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              {payload[0]?.payload?.orders} orders this month
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <AdminCard>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm">
            <DollarSign className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Revenue Trends
            </h3>
            <p className="text-sm text-gray-600">Monthly revenue performance</p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={revenueData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
              <defs>
                <linearGradient
                  id="revenueGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f1f5f9"
                horizontal={true}
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={3}
                fill="url(#revenueGradient)"
                dot={{ fill: "#3b82f6", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">+15.4%</div>
            <div className="text-xs text-gray-600">Growth</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">$24.5K</div>
            <div className="text-xs text-gray-600">Total Revenue</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">342</div>
            <div className="text-xs text-gray-600">Total Orders</div>
          </div>
        </div>
      </div>
    </AdminCard>
  );
}
