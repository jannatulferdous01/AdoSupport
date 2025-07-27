"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  itemsPerPage: number;
}

export default function TableSkeleton({ itemsPerPage }: TableSkeletonProps) {
  return (
    <div className="rounded-lg border bg-white overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-b bg-gray-50/50">
            <TableHead className="w-12">
              <Skeleton className="h-4 w-4" />
            </TableHead>
            <TableHead className="w-[140px]">Report Type</TableHead>
            <TableHead className="min-w-[300px]">Content</TableHead>
            <TableHead className="w-[180px]">Reporter</TableHead>
            <TableHead className="w-[100px]">Priority</TableHead>
            <TableHead className="w-[120px]">Status</TableHead>
            <TableHead className="w-[120px]">Date</TableHead>
            <TableHead className="w-[60px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: itemsPerPage }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function SkeletonRow() {
  return (
    <TableRow>
      <TableCell className="w-12">
        <Skeleton className="h-4 w-4" />
      </TableCell>
      <TableCell className="w-[140px]">
        <Skeleton className="h-6 w-24" />
      </TableCell>
      <TableCell className="min-w-[300px]">
        <div className="space-y-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-3 w-24" />
        </div>
      </TableCell>
      <TableCell className="w-[180px]">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
      </TableCell>
      <TableCell className="w-[100px]">
        <Skeleton className="h-6 w-16" />
      </TableCell>
      <TableCell className="w-[120px]">
        <Skeleton className="h-6 w-20" />
      </TableCell>
      <TableCell className="w-[120px]">
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell className="w-[60px]">
        <Skeleton className="h-8 w-8" />
      </TableCell>
    </TableRow>
  );
}
