"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import ParentRow from "./ParentRow";
import { Skeleton } from "@/components/ui/skeleton";
import { ParentUser } from "../../page";
import AdminTablePagination from "@/app/admin/_components/ui/AdminTablePagination";

interface ParentsTableProps {
  parents: ParentUser[];
  loading: boolean;
  selectedUsers: string[];
  onSelectedUsersChange: (users: string[]) => void;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  sortField?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (field: string) => void;
}

export default function ParentsTable({
  parents,
  loading,
  selectedUsers,
  onSelectedUsersChange,
  totalItems,
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  sortField = "joinDate",
  sortDirection = "desc",
  onSort,
}: ParentsTableProps) {
  // Calculate total pages for pagination
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  // Handle select all functionality for current page parents
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const currentPageParentIds = parents.map((parent) => parent.id);
      const newSelected = [...selectedUsers];

      currentPageParentIds.forEach((id) => {
        if (!newSelected.includes(id)) {
          newSelected.push(id);
        }
      });

      onSelectedUsersChange(newSelected);
    } else {
      const currentPageParentIds = parents.map((parent) => parent.id);
      onSelectedUsersChange(
        selectedUsers.filter((id) => !currentPageParentIds.includes(id))
      );
    }
  };

  // Handle individual parent selection
  const handleParentSelect = (parentId: string, checked: boolean) => {
    if (checked) {
      onSelectedUsersChange([...selectedUsers, parentId]);
    } else {
      onSelectedUsersChange(selectedUsers.filter((id) => id !== parentId));
    }
  };

  // Handle column sorting functionality
  const handleSort = (field: string) => {
    if (onSort) {
      onSort(field);
    }
  };

  // Generate appropriate sort icon based on current state
  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-gray-400" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4 text-blue-600" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4 text-blue-600" />
    );
  };

  // Check selection status for current page
  const currentPageParentIds = parents.map((parent) => parent.id);
  const allCurrentPageSelected =
    currentPageParentIds.length > 0 &&
    currentPageParentIds.every((id) => selectedUsers.includes(id));
  const someCurrentPageSelected = currentPageParentIds.some((id) =>
    selectedUsers.includes(id)
  );

  // Loading skeleton display
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border bg-white">
          <div className="p-6">
            <div className="space-y-4">
              {[...Array(itemsPerPage)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[80px]" />
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[80px]" />
                  <Skeleton className="h-8 w-8" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pagination loading skeleton */}
        <div className="bg-white p-4 border rounded-lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-8 w-[80px]" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-[80px]" />
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-8" />
              ))}
              <Skeleton className="h-8 w-[60px]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Parent users data table */}
      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={allCurrentPageSelected}
                  ref={(el) => {
                    if (el) {
                      const input = el.querySelector(
                        'input[type="checkbox"]'
                      ) as HTMLInputElement;
                      if (input) {
                        input.indeterminate =
                          someCurrentPageSelected && !allCurrentPageSelected;
                      }
                    }
                  }}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>

              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-auto p-0 font-medium hover:bg-transparent ${
                    sortField === "name" ? "text-blue-600" : ""
                  }`}
                  onClick={() => handleSort("name")}
                >
                  Parent User
                  {getSortIcon("name")}
                </Button>
              </TableHead>

              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-auto p-0 font-medium hover:bg-transparent ${
                    sortField === "childrenCount" ? "text-blue-600" : ""
                  }`}
                  onClick={() => handleSort("childrenCount")}
                >
                  Children & Orders
                  {getSortIcon("childrenCount")}
                </Button>
              </TableHead>

              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-auto p-0 font-medium hover:bg-transparent ${
                    sortField === "status" ? "text-blue-600" : ""
                  }`}
                  onClick={() => handleSort("status")}
                >
                  Status
                  {getSortIcon("status")}
                </Button>
              </TableHead>

              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-auto p-0 font-medium hover:bg-transparent ${
                    sortField === "joinDate" ? "text-blue-600" : ""
                  }`}
                  onClick={() => handleSort("joinDate")}
                >
                  Joined
                  {getSortIcon("joinDate")}
                </Button>
              </TableHead>

              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-auto p-0 font-medium hover:bg-transparent ${
                    sortField === "lastActive" ? "text-blue-600" : ""
                  }`}
                  onClick={() => handleSort("lastActive")}
                >
                  Last Active
                  {getSortIcon("lastActive")}
                </Button>
              </TableHead>

              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-auto p-0 font-medium hover:bg-transparent ${
                    sortField === "location" ? "text-blue-600" : ""
                  }`}
                  onClick={() => handleSort("location")}
                >
                  Location
                  {getSortIcon("location")}
                </Button>
              </TableHead>

              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {parents.map((parent) => (
              <ParentRow
                key={parent.id}
                parent={parent}
                selected={selectedUsers.includes(parent.id)}
                onSelect={(checked) => handleParentSelect(parent.id, checked)}
              />
            ))}
          </TableBody>
        </Table>

        {/* Empty state when no parents found */}
        {parents.length === 0 && !loading && (
          <div className="p-12 text-center">
            <div className="mx-auto max-w-sm">
              <div className="text-gray-400 mb-4">
                <svg
                  className="mx-auto h-12 w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No parent users found
              </h3>
              <p className="text-gray-500">
                No parent users match your current search criteria. Try
                adjusting your filters or clearing them to see all parent
                accounts.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Table pagination controls */}
      <AdminTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
        onItemsPerPageChange={onItemsPerPageChange}
        isLoading={loading}
      />
    </div>
  );
}
