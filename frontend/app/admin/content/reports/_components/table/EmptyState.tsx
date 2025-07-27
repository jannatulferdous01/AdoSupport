"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { FileX } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="rounded-lg border bg-white">
      <Table>
        <TableHeader>
          <TableRow className="border-b bg-gray-50/50">
            <TableHead className="w-12">
              <Checkbox checked={false} onCheckedChange={() => {}} disabled />
            </TableHead>
            <TableHead>Report Type</TableHead>
            <TableHead>Content</TableHead>
            <TableHead>Reporter</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="w-20">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell colSpan={8} className="text-center py-12">
              <div className="flex flex-col items-center gap-3">
                <FileX className="h-12 w-12 text-gray-400" />
                <div className="text-gray-500 font-medium">No reports found</div>
                <div className="text-sm text-gray-400">
                  Try adjusting your search or filters
                </div>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}