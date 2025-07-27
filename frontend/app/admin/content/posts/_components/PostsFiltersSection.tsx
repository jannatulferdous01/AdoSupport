"use client";

import AdminCard from "../../../_components/ui/AdminCard";
import PostFilters from "./filters/PostFilters";
import { PostFilters as PostFiltersType } from "../_services/mockPostsApi";

interface PostsFiltersSectionProps {
  showFilters: boolean;
  filters: PostFiltersType;
  onFiltersChange: (filters: PostFiltersType) => void;
  onClearFilters: () => void;
}

export default function PostsFiltersSection({
  showFilters,
  filters,
  onFiltersChange,
  onClearFilters,
}: PostsFiltersSectionProps) {
  if (!showFilters) {
    return null;
  }

  return (
    <AdminCard>
      <PostFilters
        filters={filters}
        onFiltersChange={onFiltersChange}
        onClear={onClearFilters}
      />
    </AdminCard>
  );
}