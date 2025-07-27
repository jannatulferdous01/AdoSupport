"use client";

import { Download, Filter, Users } from "lucide-react";
import AdminPageHeader from "../../../_components/ui/AdminPageHeader";

interface ReportsPageHeaderProps {
  onExport: () => Promise<void>;
  onToggleFilters: () => void;
  showFilters: boolean;
}

export default function ReportsPageHeader({
  onExport,
  onToggleFilters,
  showFilters,
}: ReportsPageHeaderProps) {
  return (
    <div className="space-y-4">
      <AdminPageHeader
        title="Reports Management"
        description="Monitor and manage community reports, investigate violations, and maintain platform safety"
        action={{
          label: "Assign Moderators",
          icon: <Users className="h-4 w-4" />,
          onClick: () => {
            console.log("Assign moderators clicked");
          },
        }}
      />

      <div className="flex items-center justify-end gap-3">
        <button
          onClick={onExport}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Download className="h-4 w-4" />
          Export
        </button>
        <button
          onClick={onToggleFilters}
          className={`inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            showFilters ? "bg-gray-100" : "bg-white"
          }`}
        >
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>
    </div>
  );
}
