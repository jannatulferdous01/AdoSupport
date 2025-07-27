"use client";

import { Badge } from "@/components/ui/badge";
import { ReportData } from "../../_services/mockReportsApi";

interface PriorityBadgeProps {
  priority: ReportData["priority"];
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const configs = {
    low: { className: "bg-gray-100 text-gray-700 border-gray-300" },
    medium: { className: "bg-blue-100 text-blue-700 border-blue-300" },
    high: { className: "bg-orange-100 text-orange-700 border-orange-300" },
    critical: { className: "bg-red-100 text-red-700 border-red-300" },
  };

  return (
    <Badge
      variant="outline"
      className={`${configs[priority].className} font-medium`}
    >
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </Badge>
  );
}
