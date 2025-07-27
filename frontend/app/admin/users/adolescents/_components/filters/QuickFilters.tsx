"use client";

import { Button } from "@/components/ui/button";

interface QuickFiltersProps {
  onQuickFilter: (filter: any) => void;
}

export default function QuickFilters({ onQuickFilter }: QuickFiltersProps) {
  const quickFilters = [
    {
      label: "All Users",
      filter: {},
    },
    {
      label: "Active Today",
      filter: { status: "active", dateJoined: "today" },
    },
    {
      label: "New This Week",
      filter: { dateJoined: "week" },
    },
    {
      label: "Suspended Users",
      filter: { status: "suspended" },
    },
    {
      label: "Teens (13-15)",
      filter: { ageRange: "13-15" },
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      <span className="text-sm font-medium text-gray-500">Quick filters:</span>
      {quickFilters.map((item, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          onClick={() => onQuickFilter(item.filter)}
          className="h-7 text-xs"
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
}
