"use client";

import AdminCard from "../../_components/ui/AdminCard";
import { TrendingUp, ShoppingCart } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface StoreTrendChartProps {
  stats: any;
  loading: boolean;
}

export default function StoreTrendChart({
  stats,
  loading,
}: StoreTrendChartProps) {
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

  // Mock sales trend data
  const salesData = [
    { month: "Jan", books: 45, resources: 32, courses: 28, therapy: 18 },
    { month: "Feb", books: 52, resources: 38, courses: 31, therapy: 22 },
    { month: "Mar", books: 48, resources: 45, courses: 35, therapy: 28 },
    { month: "Apr", books: 61, resources: 52, courses: 42, therapy: 31 },
    { month: "May", books: 58, resources: 48, courses: 38, therapy: 35 },
    { month: "Jun", books: 67, resources: 55, courses: 45, therapy: 42 },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{label} 2024</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="capitalize text-gray-700">{entry.dataKey}:</span>
              <span className="font-medium text-gray-900">
                {entry.value} sales
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <AdminCard>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-sm">
            <ShoppingCart className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Sales by Category
            </h3>
            <p className="text-sm text-gray-600">
              Product category performance trends
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={salesData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 20,
              }}
            >
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
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="books"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, stroke: "#3b82f6", strokeWidth: 2 }}
                name="Books"
              />
              <Line
                type="monotone"
                dataKey="resources"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: "#10b981", strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, stroke: "#10b981", strokeWidth: 2 }}
                name="Resources"
              />
              <Line
                type="monotone"
                dataKey="courses"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ fill: "#8b5cf6", strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, stroke: "#8b5cf6", strokeWidth: 2 }}
                name="Courses"
              />
              <Line
                type="monotone"
                dataKey="therapy"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={{ fill: "#f59e0b", strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, stroke: "#f59e0b", strokeWidth: 2 }}
                name="Therapy"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Performance */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center p-3 bg-blue-50/50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">📚 +12%</div>
            <div className="text-xs text-gray-600">Books Growth</div>
          </div>
          <div className="text-center p-3 bg-green-50/50 rounded-lg">
            <div className="text-lg font-bold text-green-600">📄 +18%</div>
            <div className="text-xs text-gray-600">Resources Growth</div>
          </div>
          <div className="text-center p-3 bg-purple-50/50 rounded-lg">
            <div className="text-lg font-bold text-purple-600">🎓 -3%</div>
            <div className="text-xs text-gray-600">Courses Change</div>
          </div>
          <div className="text-center p-3 bg-amber-50/50 rounded-lg">
            <div className="text-lg font-bold text-amber-600">❤️ +23%</div>
            <div className="text-xs text-gray-600">Therapy Growth</div>
          </div>
        </div>
      </div>
    </AdminCard>
  );
}