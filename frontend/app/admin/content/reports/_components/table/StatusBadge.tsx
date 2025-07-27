"use client";

import { Badge } from "@/components/ui/badge";
import { ReportData } from "../../_services/mockReportsApi";

interface StatusBadgeProps {
  status: ReportData["status"];
  assignedTo?: ReportData["assignedTo"];
}

export default function StatusBadge({ status, assignedTo }: StatusBadgeProps) {
  const configs = {
    pending: { className: "bg-red-100 text-red-700 border-red-300" },
    investigating: { className: "bg-blue-100 text-blue-700 border-blue-300" },
    resolved: { className: "bg-green-100 text-green-700 border-green-300" },
    dismissed: { className: "bg-gray-100 text-gray-700 border-gray-300" },
  };

  return (
    <div className="space-y-1">
      <Badge
        variant="outline"
        className={`${configs[status].className} font-medium`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
      {assignedTo && (
        <div className="text-xs text-gray-500">→ {assignedTo.name}</div>
      )}
    </div>
  );
}
