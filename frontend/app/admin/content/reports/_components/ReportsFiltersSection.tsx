"use client";

import AdminCard from "../../../_components/ui/AdminCard";
import ReportFilters from "./filters/ReportFilters";
import { ReportFilters as ReportFiltersType } from "../_services/mockReportsApi";

interface ReportsFiltersSectionProps {
  showFilters: boolean;
  filters: ReportFiltersType;
  onFiltersChange: (filters: ReportFiltersType) => void;
  onClearFilters: () => void;
}

export default function ReportsFiltersSection({
  showFilters,
  filters,
  onFiltersChange,
  onClearFilters,
}: ReportsFiltersSectionProps) {
  if (!showFilters) {
    return null;
  }

  return (
    <AdminCard>
      <ReportFilters
        filters={filters}
        onFiltersChange={onFiltersChange}
        onClear={onClearFilters}
      />
    </AdminCard>
  );
}
