"use client";

import { ReportData } from "../../_services/mockReportsApi";
import EmptyState from "./EmptyState";
import TableBody from "./TableBody";
import TableHeader from "./TableHeader";
import TablePagination from "./TablePagination";
import TableSkeleton from "./TableSkeleton";
import { Table } from "@/components/ui/table";

interface ReportsTableProps {
  reports: ReportData[];
  loading: boolean;
  selectedReports: string[];
  onSelectedReportsChange: (reports: string[]) => void;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
}

export default function ReportsTable({
  reports,
  loading,
  selectedReports,
  onSelectedReportsChange,
  totalItems,
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  sortField,
  sortDirection,
  onSort,
}: ReportsTableProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectedReportsChange(reports.map((report) => report.id));
    } else {
      onSelectedReportsChange([]);
    }
  };

  const handleSelectReport = (reportId: string, checked: boolean) => {
    if (checked) {
      onSelectedReportsChange([...selectedReports, reportId]);
    } else {
      onSelectedReportsChange(selectedReports.filter((id) => id !== reportId));
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <TableSkeleton itemsPerPage={itemsPerPage} />
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
          onItemsPerPageChange={onItemsPerPageChange}
          isLoading={true}
        />
      </div>
    );
  }

  if (reports.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-white overflow-hidden">
        <Table>
          <TableHeader
            reports={reports}
            selectedReports={selectedReports}
            onSelectAll={handleSelectAll}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={onSort}
          />
          <TableBody
            reports={reports}
            selectedReports={selectedReports}
            onSelectReport={handleSelectReport}
          />
        </Table>
      </div>
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
        onItemsPerPageChange={onItemsPerPageChange}
        isLoading={false}
      />
    </div>
  );
}
