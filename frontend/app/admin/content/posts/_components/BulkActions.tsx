"use client";

import { Button } from "@/components/ui/button";
import AdminCard from "../../../_components/ui/AdminCard";
import { PostData } from "../_services/mockPostsApi";

interface BulkActionsProps {
  selectedPosts: string[];
  onBulkStatusChange: (status: PostData["status"]) => Promise<void>;
  onClearSelection: () => void;
}

export default function BulkActions({
  selectedPosts,
  onBulkStatusChange,
  onClearSelection,
}: BulkActionsProps) {
  if (selectedPosts.length === 0) {
    return null;
  }

  return (
    <AdminCard>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">
            {selectedPosts.length} post{selectedPosts.length !== 1 ? "s" : ""} selected
          </span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onBulkStatusChange("published")}
            >
              Publish
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onBulkStatusChange("draft")}
            >
              Unpublish
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onBulkStatusChange("removed")}
              className="text-red-600 hover:text-red-700"
            >
              Remove
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