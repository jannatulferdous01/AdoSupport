"use client";

import {
  TableHead,
  TableHeader as TableHeaderComponent,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { ReportData } from "../../_services/mockReportsApi";
import SelectAllCheckbox from "./SelectAllCheckbox";

interface TableHeaderProps {
  reports: ReportData[];
  selectedReports: string[];
  onSelectAll: (checked: boolean) => void;
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
}

export default function TableHeader({
  reports,
  selectedReports,
  onSelectAll,
  sortField,
  sortDirection,
  onSort,
}: TableHeaderProps) {
  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ArrowUpDown className="h-4 w-4 ml-2" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4 ml-2" />
    ) : (
      <ArrowDown className="h-4 w-4 ml-2" />
    );
  };

  const SortButton = ({
    field,
    children,
  }: {
    field: string;
    children: React.ReactNode;
  }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-auto p-0 font-semibold text-gray-900 hover:bg-transparent hover:text-blue-600"
      onClick={() => onSort(field)}
    >
      {children}
      {getSortIcon(field)}
    </Button>
  );

  return (
    <TableHeaderComponent>
      <TableRow className="border-b bg-gray-50/50">
        <TableHead className="w-12">
          <SelectAllCheckbox
            reports={reports}
            selectedReports={selectedReports}
            onSelectAll={onSelectAll}
          />
        </TableHead>
        <TableHead className="w-[140px]">
          <SortButton field="type">Report Type</SortButton>
        </TableHead>
        <TableHead className="min-w-[300px]">
          <SortButton field="reportedContent">Content</SortButton>
        </TableHead>
        <TableHead className="w-[180px]">
          <span className="font-semibold text-gray-900">Reporter</span>
        </TableHead>
        <TableHead className="w-[100px]">
          <SortButton field="priority">Priority</SortButton>
        </TableHead>
        <TableHead className="w-[120px]">
          <SortButton field="status">Status</SortButton>
        </TableHead>
        <TableHead className="w-[120px]">
          <SortButton field="createdAt">Date</SortButton>
        </TableHead>
        <TableHead className="w-[60px]">
          <span className="font-semibold text-gray-900">Actions</span>
        </TableHead>
      </TableRow>
    </TableHeaderComponent>
  );
}
