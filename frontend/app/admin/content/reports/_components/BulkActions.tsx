"use client";

import { Button } from "@/components/ui/button";
import AdminCard from "../../../_components/ui/AdminCard";
import { ReportData } from "../_services/mockReportsApi";

interface BulkActionsProps {
  selectedReports: string[];
  onBulkStatusChange: (status: ReportData["status"]) => Promise<void>;
  onClearSelection: () => void;
}

export default function BulkActions({
  selectedReports,
  onBulkStatusChange,
  onClearSelection,
}: BulkActionsProps) {
  if (selectedReports.length === 0) {
    return null;
  }

  return (
    <AdminCard>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">
            {selectedReports.length} report{selectedReports.length !== 1 ? "s" : ""} selected
          </span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onBulkStatusChange("investigating")}
            >
              Start Investigation
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onBulkStatusChange("resolved")}
              className="text-green-600 hover:text-green-700"
            >
              Mark Resolved
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onBulkStatusChange("dismissed")}
              className="text-gray-600 hover:text-gray-700"
            >
              Dismiss
            </Button>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
        >
          Clear Selection
        </Button>
      </div>
    </AdminCard>
  );
}