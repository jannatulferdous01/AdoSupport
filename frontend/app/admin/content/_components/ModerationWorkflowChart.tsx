"use client";

import AdminCard from "../../_components/ui/AdminCard";
import { Shield, Clock, CheckCircle, XCircle } from "lucide-react";

interface ModerationWorkflowChartProps {
  stats: {
    moderation: {
      totalReports: number;
      pending: number;
      resolved: number;
      dismissed: number;
    };
  };
  loading: boolean;
}

export default function ModerationWorkflowChart({
  stats,
  loading,
}: ModerationWorkflowChartProps) {
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
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gray-100/80 to-transparent animate-[shimmer_2s_infinite]"></div>
      </AdminCard>
    );
  }

  // Calculate percentages with proper fallbacks
  const total = stats?.moderation?.totalReports || 1;
  const pending = stats?.moderation?.pending || 0;
  const resolved = stats?.moderation?.resolved || 0;
  const dismissed = stats?.moderation?.dismissed || 0;

  const pendingPercentage = (pending / total) * 100;
  const resolvedPercentage = (resolved / total) * 100;
  const dismissedPercentage = (dismissed / total) * 100;

  return (
    <AdminCard>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-gray-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Moderation Workflow
            </h3>
            <p className="text-sm text-gray-600">Report resolution status</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Pending Reports */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-gray-900">
                  Pending
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-900">
                  {pending}
                </span>
                <span className="text-xs text-gray-600 ml-1">
                  ({pendingPercentage.toFixed(1)}%)
                </span>
              </div>
            </div>
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-orange-500 to-orange-600 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${pendingPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Resolved Reports */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-gray-900">
                  Resolved
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-900">
                  {resolved}
                </span>
                <span className="text-xs text-gray-600 ml-1">
                  ({resolvedPercentage.toFixed(1)}%)
                </span>
              </div>
            </div>
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-1000 ease-out delay-200"
                  style={{ width: `${resolvedPercentage}%` }}
                />
              </div>
            </div>
          </div>

          {/* Dismissed Reports */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-900">
                  Dismissed
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-900">
                  {dismissed}
                </span>
                <span className="text-xs text-gray-600 ml-1">
                  ({dismissedPercentage.toFixed(1)}%)
                </span>
              </div>
            </div>
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-gray-500 to-gray-600 h-2 rounded-full transition-all duration-1000 ease-out delay-400"
                  style={{ width: `${dismissedPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="text-lg font-bold text-orange-600">{pending}</div>
            <div className="text-xs text-gray-600">Need Action</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{resolved}</div>
            <div className="text-xs text-gray-600">Resolved</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-600">{dismissed}</div>
            <div className="text-xs text-gray-600">Dismissed</div>
          </div>
        </div>
      </div>
    </AdminCard>
  );
}
