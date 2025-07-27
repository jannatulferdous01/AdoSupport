"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { ReportData } from "../../_services/mockReportsApi";

interface SelectAllCheckboxProps {
  reports: ReportData[];
  selectedReports: string[];
  onSelectAll: (checked: boolean) => void;
}

export default function SelectAllCheckbox({
  reports,
  selectedReports,
  onSelectAll,
}: SelectAllCheckboxProps) {
  const allSelected =
    reports.length > 0 && selectedReports.length === reports.length;
  const someSelected = selectedReports.length > 0 && !allSelected;

  return (
    <Checkbox
      checked={allSelected}
      onCheckedChange={onSelectAll}
      ref={(el) => {
        if (el) {
          const input = el.querySelector(
            'input[type="checkbox"]'
          ) as HTMLInputElement;
          if (input) {
            input.indeterminate = someSelected;
          }
        }
      }}
    />
  );
}
