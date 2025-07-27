"use client";

import { Badge } from "@/components/ui/badge";
import { ReportData } from "../../_services/mockReportsApi";

interface ReportTypeBadgeProps {
  type: ReportData["type"];
}

export default function ReportTypeBadge({ type }: ReportTypeBadgeProps) {
  const configs = {
    inappropriate_content: {
      label: "Inappropriate",
      className: "bg-red-100 text-red-800 border-red-200",
    },
    harassment: {
      label: "Harassment",
      className: "bg-orange-100 text-orange-800 border-orange-200",
    },
    spam: {
      label: "Spam",
      className: "bg-yellow-100 text-yellow-800 border-yellow-200",
    },
    misinformation: {
      label: "Misinformation",
      className: "bg-purple-100 text-purple-800 border-purple-200",
    },
    other: {
      label: "Other",
      className: "bg-gray-100 text-gray-800 border-gray-200",
    },
  };

  const config = configs[type];
  return (
    <Badge variant="outline" className={`${config.className} font-medium`}>
      {config.label}
    </Badge>
  );
}
