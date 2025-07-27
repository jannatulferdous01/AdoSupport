"use client";

import { TableBody as TableBodyComponent } from "@/components/ui/table";
import { ReportData } from "../../_services/mockReportsApi";
import ReportRow from "./ReportRow";

interface TableBodyProps {
  reports: ReportData[];
  selectedReports: string[];
  onSelectReport: (reportId: string, checked: boolean) => void;
}

export default function TableBody({
  reports,
  selectedReports,
  onSelectReport,
}: TableBodyProps) {
  return (
    <TableBodyComponent>
      {reports.map((report) => (
        <ReportRow
          key={report.id}
          report={report}
          selected={selectedReports.includes(report.id)}
          onSelect={(checked) => onSelectReport(report.id, checked)}
        />
      ))}
    </TableBodyComponent>
  );
}
