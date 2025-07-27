"use client";

import { useState } from "react";
import { PostData } from "../_services/mockPostsApi";
import toast from "react-hot-toast";

export function usePostsActions(refreshData: () => Promise<void>) {
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);

  // Export functionality
  const handleExport = async (totalItems: number) => {
    const exportingCount = selectedPosts.length > 0 ? selectedPosts.length : totalItems;

    toast.loading(`Preparing to export ${exportingCount} posts...`, {
      id: "export",
    });

    try {
      // Simulate export process
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success(`Successfully exported ${exportingCount} posts`, {
        id: "export",
      });
    } catch (error) {
      toast.error("Export failed. Please try again.", { id: "export" });
    }
  };

  // Bulk actions
  const handleBulkStatusChange = async (status: PostData["status"]) => {
    if (selectedPosts.length === 0) {
      toast.error("Please select posts to update");
      return;
    }

    toast.loading(`Updating ${selectedPosts.length} posts...`, {
      id: "bulk-update",
    });

    try {
      // Simulate bulk update
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success(`Successfully updated ${selectedPosts.length} posts`, {
        id: "bulk-update",
      });
      setSelectedPosts([]);
      // Refresh data
      await refreshData();
    } catch (error) {
      toast.error("Bulk update failed. Please try again.", {
        id: "bulk-update",
      });
    }
  };

  const clearSelection = () => {
    setSelectedPosts([]);
  };

  return {
    selectedPosts,
    setSelectedPosts,
    handleExport,
    handleBulkStatusChange,
    clearSelection,
  };
}