"use client";

import { useState } from "react";
import ReportsPageHeader from "./_components/ReportsPageHeader";
import ReportsFiltersSection from "./_components/ReportsFiltersSection";
import BulkActions from "./_components/BulkActions";
import ReportsTableSection from "./_components/ReportsTableSection";
import { useReportsData } from "./_hooks/useReportsData";
import { useReportsActions } from "./_hooks/useReportsActions";
import ReportStats from "./_components/ReportStats";

export default function ReportsPage() {
  const [showFilters, setShowFilters] = useState(false);

  // Custom hooks for data management
  const {
    reports,
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
  } = useReportsData();

  // Custom hooks for actions
  const {
    selectedReports,
    setSelectedReports,
    handleExport,
    handleBulkStatusChange,
    clearSelection,
  } = useReportsActions(refreshData);

  // Simple toggle function
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Export wrapper
  const onExport = () => handleExport(totalItems);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <ReportsPageHeader
        onExport={onExport}
        onToggleFilters={toggleFilters}
        showFilters={showFilters}
      />

      {/* Stats Overview */}
      <ReportStats stats={stats} loading={loading} />

      {/* Filters Section */}
      <ReportsFiltersSection
        showFilters={showFilters}
        filters={filters}
        onFiltersChange={updateFilters}
        onClearFilters={clearFilters}
      />

      {/* Bulk Actions */}
      <BulkActions
        selectedReports={selectedReports}
        onBulkStatusChange={handleBulkStatusChange}
        onClearSelection={clearSelection}
      />

      {/* Reports Table */}
      <ReportsTableSection
        reports={reports}
        loading={loading}
        selectedReports={selectedReports}
        onSelectedReportsChange={setSelectedReports}
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
