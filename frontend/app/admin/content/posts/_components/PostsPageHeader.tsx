"use client";

import { Download, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminPageHeader from "../../../_components/ui/AdminPageHeader";

interface PostsPageHeaderProps {
  onExport: () => Promise<void>;
  onToggleFilters: () => void;
  showFilters: boolean;
}

export default function PostsPageHeader({
  onExport,
  onToggleFilters,
  showFilters,
}: PostsPageHeaderProps) {
  return (
    <div>
      <AdminPageHeader
        title="Posts Management"
        description="Manage community posts, moderate content, and track engagement"
      />
      <div className="flex items-center gap-3 mt-4">
        <Button variant="outline" onClick={onExport}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Button
          variant="outline"
          onClick={onToggleFilters}
          className={showFilters ? "bg-gray-100" : ""}
        >
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>
    </div>
  );
}
