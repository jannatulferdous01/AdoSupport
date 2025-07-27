"use client";

import { useState } from "react";
import { ReportData } from "../_services/mockReportsApi";
import toast from "react-hot-toast";

export function useReportsActions(refreshData: () => Promise<void>) {
  const [selectedReports, setSelectedReports] = useState<string[]>([]);

  // Export functionality
  const handleExport = async (totalItems: number) => {
    const exportingCount = selectedReports.length > 0 ? selectedReports.length : totalItems;

    toast.loading(`Preparing to export ${exportingCount} reports...`, {
      id: "export",
    });

    try {
      // Simulate export process
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success(`Successfully exported ${exportingCount} reports`, {
        id: "export",
      });
    } catch (error) {
      toast.error("Export failed. Please try again.", { id: "export" });
    }
  };

  // Bulk actions
  const handleBulkStatusChange = async (status: ReportData["status"]) => {
    if (selectedReports.length === 0) {
      toast.error("Please select reports to update");
      return;
    }

    toast.loading(`Updating ${selectedReports.length} reports...`, {
      id: "bulk-update",
    });

    try {
      // Simulate bulk update
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success(`Successfully updated ${selectedReports.length} reports to ${status}`, {
        id: "bulk-update",
      });
      setSelectedReports([]);
      // Refresh data
      await refreshData();
    } catch (error) {
      toast.error("Bulk update failed. Please try again.", {
        id: "bulk-update",
      });
    }
  };

  const clearSelection = () => {
    setSelectedReports([]);
  };

  return {
    selectedReports,
    setSelectedReports,
    handleExport,
    handleBulkStatusChange,
    clearSelection,
  };
}