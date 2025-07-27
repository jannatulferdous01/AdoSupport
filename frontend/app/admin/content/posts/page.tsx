"use client";

import { useState } from "react";
import PostsPageHeader from "./_components/PostsPageHeader";
import PostStats from "./_components/stats/PostStats";
import PostsFiltersSection from "./_components/PostsFiltersSection";
import BulkActions from "./_components/BulkActions";
import PostsTableSection from "./_components/PostsTableSection";
import { usePostsData } from "./_hooks/usePostsData";
import { usePostsActions } from "./_hooks/usePostsActions";

export default function PostsPage() {
  const [showFilters, setShowFilters] = useState(false);

  // Custom hooks for data management
  const {
    posts,
    stats,
    loading,
    totalItems,
    currentPage,
    itemsPerPage,
    filters,
    sortField,
    sortDirection,
    handlePageChange,
    handleItemsPerPageChange,
    handleSort,
    updateFilters,
    clearFilters,
    refreshData,
  } = usePostsData();

  // Custom hooks for actions
  const {
    selectedPosts,
    setSelectedPosts,
    handleExport,
    handleBulkStatusChange,
    clearSelection,
  } = usePostsActions(refreshData);

  // Simple toggle function
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Export wrapper
  const onExport = () => handleExport(totalItems);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PostsPageHeader
        onExport={onExport}
        onToggleFilters={toggleFilters}
        showFilters={showFilters}
      />

      {/* Stats Overview */}
      <PostStats stats={stats} loading={loading} />

      {/* Filters Section */}
      <PostsFiltersSection
        showFilters={showFilters}
        filters={filters}
        onFiltersChange={updateFilters}
        onClearFilters={clearFilters}
      />

      {/* Bulk Actions */}
      <BulkActions
        selectedPosts={selectedPosts}
        onBulkStatusChange={handleBulkStatusChange}
        onClearSelection={clearSelection}
      />

      {/* Posts Table */}
      <PostsTableSection
        posts={posts}
        loading={loading}
        selectedPosts={selectedPosts}
        onSelectedPostsChange={setSelectedPosts}
        totalItems={totalItems}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
      />
    </div>
  );
}