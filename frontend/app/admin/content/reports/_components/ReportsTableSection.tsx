"use client";

import AdminCard from "../../../_components/ui/AdminCard";
import { ReportData } from "../_services/mockReportsApi";
import ReportsTable from "./table/ReportsTable";

interface ReportsTableSectionProps {
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

export default function ReportsTableSection(props: ReportsTableSectionProps) {
  return (
    <AdminCard padding="none">
      <ReportsTable {...props} />
    </AdminCard>
  );
}
