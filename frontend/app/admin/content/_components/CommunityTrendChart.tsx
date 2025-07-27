"use client";

import AdminCard from "../../_components/ui/AdminCard";
import { TrendingUp, Calendar } from "lucide-react";
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

interface CommunityTrendChartProps {
  loading: boolean;
}

export default function CommunityTrendChart({
  loading,
}: CommunityTrendChartProps) {
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
          <div className="h-80 bg-gray-200 rounded-lg"></div>
        </div>
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gray-100/80 to-transparent animate-[shimmer_2s_infinite]"></div>
      </AdminCard>
    );
  }

  // Mock trend data with more realistic teen community patterns
  const monthlyTrends = [
    {
      month: "Jan",
      questions: 245,
      discussions: 412,
      resources: 89,
      experiences: 156,
    },
    {
      month: "Feb",
      questions: 289,
      discussions: 456,
      resources: 102,
      experiences: 178,
    },
    {
      month: "Mar",
      questions: 367,
      discussions: 523,
      resources: 134,
      experiences: 201,
    },
    {
      month: "Apr",
      questions: 412,
      discussions: 598,
      resources: 145,
      experiences: 234,
    },
    {
      month: "May",
      questions: 456,
      discussions: 634,
      resources: 167,
      experiences: 267,
    },
    {
      month: "Jun",
      questions: 523,
      discussions: 712,
      resources: 189,
      experiences: 289,
    },
  ];

  // Custom tooltip
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
                {entry.value} posts
              </span>
            </div>
          ))}
          <div className="mt-2 pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              💬 Community activity is growing steadily!
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <AdminCard className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/30">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Community Growth Trends
              </h3>
              <p className="text-sm text-muted-foreground font-medium">
                Monthly content creation patterns
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Last 6 months</span>
          </div>
        </div>

        {/* Chart Container */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={monthlyTrends}
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
              <Legend
                wrapperStyle={{
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              />
              <Line
                type="monotone"
                dataKey="questions"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: "#3b82f6", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, stroke: "#3b82f6", strokeWidth: 2 }}
                name="Questions"
              />
              <Line
                type="monotone"
                dataKey="discussions"
                stroke="#10b981"
                strokeWidth={3}
                dot={{ fill: "#10b981", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, stroke: "#10b981", strokeWidth: 2 }}
                name="Discussions"
              />
              <Line
                type="monotone"
                dataKey="resources"
                stroke="#f59e0b"
                strokeWidth={3}
                dot={{ fill: "#f59e0b", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, stroke: "#f59e0b", strokeWidth: 2 }}
                name="Resources"
              />
              <Line
                type="monotone"
                dataKey="experiences"
                stroke="#ef4444"
                strokeWidth={3}
                dot={{ fill: "#ef4444", strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, stroke: "#ef4444", strokeWidth: 2 }}
                name="Experiences"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Insights */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center p-3 bg-blue-50/50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">📈 +18%</div>
            <div className="text-xs text-muted-foreground">
              Questions growth
            </div>
          </div>
          <div className="text-center p-3 bg-green-50/50 rounded-lg">
            <div className="text-lg font-bold text-green-600">🗣️ +15%</div>
            <div className="text-xs text-muted-foreground">
              Discussion growth
            </div>
          </div>
          <div className="text-center p-3 bg-amber-50/50 rounded-lg">
            <div className="text-lg font-bold text-amber-600">📚 +22%</div>
            <div className="text-xs text-muted-foreground">
              Resources growth
            </div>
          </div>
          <div className="text-center p-3 bg-red-50/50 rounded-lg">
            <div className="text-lg font-bold text-red-600">❤️ +28%</div>
            <div className="text-xs text-muted-foreground">Stories growth</div>
          </div>
        </div>
      </div>
    </AdminCard>
  );
}
