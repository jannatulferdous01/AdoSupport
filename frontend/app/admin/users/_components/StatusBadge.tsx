"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "active" | "inactive" | "suspended" | "pending" | "available" | "busy" | "offline";
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return {
          label: "Active",
          className: "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
        };
      case "inactive":
        return {
          label: "Inactive",
          className: "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100",
        };
      case "suspended":
        return {
          label: "Suspended",
          className: "bg-red-50 text-red-700 border-red-200 hover:bg-red-100",
        };
      case "pending":
        return {
          label: "Pending",
          className: "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100",
        };
      case "available":
        return {
          label: "Available",
          className: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100",
        };
      case "busy":
        return {
          label: "Busy",
          className: "bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100",
        };
      case "offline":
        return {
          label: "Offline",
          className: "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100",
        };
      default:
        return {
          label: status.charAt(0).toUpperCase() + status.slice(1),
          className: "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge 
      variant="outline" 
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  );
}