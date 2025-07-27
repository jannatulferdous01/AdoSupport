"use client";

import {
  HelpCircle,
  MessageCircle,
  BookOpen,
  Heart,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import AdminCard from "../../_components/ui/AdminCard";

interface ContentTypeCardsProps {
  stats: {
    postTypes: {
      questions: {
        total: number;
        answered: number;
        unanswered: number;
        reported: number;
      };
      discussions: {
        total: number;
        active: number;
        closed: number;
        reported: number;
      };
      resources: {
        total: number;
        published: number;
        draft: number;
        reported: number;
      };
      experiences: {
        total: number;
        approved: number;
        pending: number;
        reported: number;
      };
    };
    trends: {
      questionsChange: number;
      discussionsChange: number;
      resourcesChange: number;
      experiencesChange: number;
    };
  };
  loading: boolean;
}

export default function ContentTypeCards({
  stats,
  loading,
}: ContentTypeCardsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <AdminCard key={i} className="relative overflow-hidden p-6">
            <div className="animate-pulse space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-5 w-5 bg-gray-200 rounded"></div>
                <div className="h-4 w-12 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                  <div className="h-5 bg-gray-200 rounded w-8"></div>
                </div>
                <div className="space-y-1">
                  <div className="h-3 bg-gray-200 rounded w-12"></div>
                  <div className="h-5 bg-gray-200 rounded w-8"></div>
                </div>
              </div>
            </div>
            {/* Shimmer effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-gray-100/80 to-transparent animate-[shimmer_2s_infinite]"></div>
          </AdminCard>
        ))}
      </div>
    );
  }

  const contentTypes = [
    {
      title: "Questions",
      icon: <HelpCircle className="h-5 w-5 text-blue-600" />,
      total: stats.postTypes?.questions?.total || 0,
      primaryLabel: "Answered",
      primaryValue: stats.postTypes?.questions?.answered || 0,
      secondaryLabel: "Unanswered",
      secondaryValue: stats.postTypes?.questions?.unanswered || 0,
      trend: stats.trends?.questionsChange || 0,
    },
    {
      title: "Discussions",
      icon: <MessageCircle className="h-5 w-5 text-green-600" />,
      total: stats.postTypes?.discussions?.total || 0,
      primaryLabel: "Active",
      primaryValue: stats.postTypes?.discussions?.active || 0,
      secondaryLabel: "Closed",
      secondaryValue: stats.postTypes?.discussions?.closed || 0,
      trend: stats.trends?.discussionsChange || 0,
    },
    {
      title: "Resources",
      icon: <BookOpen className="h-5 w-5 text-amber-600" />,
      total: stats.postTypes?.resources?.total || 0,
      primaryLabel: "Published",
      primaryValue: stats.postTypes?.resources?.published || 0,
      secondaryLabel: "Draft",
      secondaryValue: stats.postTypes?.resources?.draft || 0,
      trend: stats.trends?.resourcesChange || 0,
    },
    {
      title: "Stories",
      icon: <Heart className="h-5 w-5 text-red-600" />,
      total: stats.postTypes?.experiences?.total || 0,
      primaryLabel: "Approved",
      primaryValue: stats.postTypes?.experiences?.approved || 0,
      secondaryLabel: "Pending",
      secondaryValue: stats.postTypes?.experiences?.pending || 0,
      trend: stats.trends?.experiencesChange || 0,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {contentTypes.map((type, index) => (
        <AdminCard
          key={index}
          className="p-6 hover:shadow-md transition-shadow"
        >
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {type.icon}
                <h3 className="font-medium text-gray-900">{type.title}</h3>
              </div>
              <div className="flex items-center gap-1 text-sm">
                {type.trend >= 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span
                  className={`text-xs font-medium ${
                    type.trend >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {type.trend >= 0 ? "+" : ""}
                  {type.trend}%
                </span>
              </div>
            </div>

            {/* Total */}
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {type.total.toLocaleString()}
              </p>
            </div>

            {/* Breakdown */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  {type.primaryLabel}
                </p>
                <p className="text-lg font-semibold text-gray-900">
                  {type.primaryValue.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  {type.secondaryLabel}
                </p>
                <p className="text-lg font-semibold text-gray-600">
                  {type.secondaryValue.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </AdminCard>
      ))}
    </div>
  );
}
