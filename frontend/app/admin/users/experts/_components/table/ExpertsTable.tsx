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
import ExpertRow from "./ExpertRow";
import { Skeleton } from "@/components/ui/skeleton";
import { ExpertUser } from "../../page";
import AdminTablePagination from "@/app/admin/_components/ui/AdminTablePagination";

interface ExpertsTableProps {
  experts: ExpertUser[];
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

export default function ExpertsTable({
  experts,
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
}: ExpertsTableProps) {
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectedUsersChange(experts.map((expert) => expert.id));
    } else {
      onSelectedUsersChange([]);
    }
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    if (checked) {
      onSelectedUsersChange([...selectedUsers, userId]);
    } else {
      onSelectedUsersChange(selectedUsers.filter((id) => id !== userId));
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === "asc" ? (
      <ArrowUp className="h-4 w-4" />
    ) : (
      <ArrowDown className="h-4 w-4" />
    );
  };

  const isAllSelected =
    experts.length > 0 && selectedUsers.length === experts.length;
  const isIndeterminate =
    selectedUsers.length > 0 && selectedUsers.length < experts.length;

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-12 px-6">
                  <Skeleton className="h-4 w-4" />
                </TableHead>
                <TableHead className="w-[240px] px-6">Expert</TableHead>
                <TableHead className="w-[120px] px-6">Specialty</TableHead>
                <TableHead className="w-[90px] px-6">Experience</TableHead>
                <TableHead className="w-[100px] px-6">Rating</TableHead>
                <TableHead className="w-[70px] px-6">Sessions</TableHead>
                <TableHead className="w-[90px] px-6">Status</TableHead>
                <TableHead className="w-[100px] px-6">Availability</TableHead>
                <TableHead className="w-16 px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: itemsPerPage }).map((_, i) => (
                <TableRow key={i} className="hover:bg-transparent">
                  <TableHead className="px-6">
                    <Skeleton className="h-4 w-4" />
                  </TableHead>
                  <TableHead className="px-6">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-48" />
                      </div>
                    </div>
                  </TableHead>
                  <TableHead className="px-6">
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                  <TableHead className="px-6">
                    <Skeleton className="h-4 w-16" />
                  </TableHead>
                  <TableHead className="px-6">
                    <Skeleton className="h-4 w-16" />
                  </TableHead>
                  <TableHead className="px-6">
                    <Skeleton className="h-4 w-12" />
                  </TableHead>
                  <TableHead className="px-6">
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </TableHead>
                  <TableHead className="px-6">
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </TableHead>
                  <TableHead className="px-6">
                    <Skeleton className="h-8 w-8" />
                  </TableHead>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (experts.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12 px-6">
                <Checkbox checked={false} onCheckedChange={() => {}} disabled />
              </TableHead>
              <TableHead className="w-[240px] px-6">Expert</TableHead>
              <TableHead className="w-[120px] px-6">Specialty</TableHead>
              <TableHead className="w-[90px] px-6">Experience</TableHead>
              <TableHead className="w-[100px] px-6">Rating</TableHead>
              <TableHead className="w-[70px] px-6">Sessions</TableHead>
              <TableHead className="w-[90px] px-6">Status</TableHead>
              <TableHead className="w-[100px] px-6">Availability</TableHead>
              <TableHead className="w-16 px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="hover:bg-transparent">
              <TableHead colSpan={9} className="text-center py-12 px-6">
                <div className="text-muted-foreground">
                  No experts found. Try adjusting your filters.
                </div>
              </TableHead>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b-2">
              <TableHead className="w-12 px-6">
                <Checkbox
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) {
                      const input = el.querySelector(
                        'input[type="checkbox"]'
                      ) as HTMLInputElement;
                      if (input) input.indeterminate = isIndeterminate;
                    }
                  }}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>

              <TableHead className="w-[240px] px-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSort?.("name")}
                  className="h-auto p-0 font-medium hover:bg-transparent"
                >
                  Expert
                  <span className="ml-2">{getSortIcon("name")}</span>
                </Button>
              </TableHead>

              <TableHead className="w-[120px] px-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSort?.("specialty")}
                  className="h-auto p-0 font-medium hover:bg-transparent"
                >
                  Specialty
                  <span className="ml-2">{getSortIcon("specialty")}</span>
                </Button>
              </TableHead>

              <TableHead className="w-[90px] px-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSort?.("experience")}
                  className="h-auto p-0 font-medium hover:bg-transparent"
                >
                  Experience
                  <span className="ml-2">{getSortIcon("experience")}</span>
                </Button>
              </TableHead>

              <TableHead className="w-[100px] px-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSort?.("rating")}
                  className="h-auto p-0 font-medium hover:bg-transparent"
                >
                  Rating
                  <span className="ml-2">{getSortIcon("rating")}</span>
                </Button>
              </TableHead>

              <TableHead className="w-[70px] px-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSort?.("totalSessions")}
                  className="h-auto p-0 font-medium hover:bg-transparent"
                >
                  Sessions
                  <span className="ml-2">{getSortIcon("totalSessions")}</span>
                </Button>
              </TableHead>

              <TableHead className="w-[90px] px-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSort?.("status")}
                  className="h-auto p-0 font-medium hover:bg-transparent"
                >
                  Status
                  <span className="ml-2">{getSortIcon("status")}</span>
                </Button>
              </TableHead>

              <TableHead className="w-[100px] px-6">Availability</TableHead>
              <TableHead className="w-16 px-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {experts.map((expert) => (
              <ExpertRow
                key={expert.id}
                expert={expert}
                selected={selectedUsers.includes(expert.id)}
                onSelect={(checked) => handleSelectUser(expert.id, checked)}
              />
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <AdminTablePagination
          currentPage={currentPage}
          totalPages={Math.ceil(totalItems / itemsPerPage) || 1}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          onPageChange={onPageChange}
          onItemsPerPageChange={onItemsPerPageChange}
        />
      </div>
    </div>
  );
}
