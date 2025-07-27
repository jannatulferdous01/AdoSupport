"use client";

import { useState, useEffect } from "react";
import { Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminPageHeader from "../../_components/ui/AdminPageHeader";
import AdminCard from "../../_components/ui/AdminCard";
import UserStats from "./_components/stats/UserStats";
import UserFilters from "./_components/filters/UserFilters";
import UsersTable from "./_components/table/UsersTable";
import { mockApi } from "./_services/mockApi";
import toast from "react-hot-toast";

export interface AdolescentUser {
  id: string;
  name: string;
  email: string;
  age: number;
  status: "active" | "suspended" | "pending";
  joinDate: Date;
  lastActive: Date;
  location: string;
  avatar: string;
  parentEmail?: string;
  totalPosts: number;
  warningsCount: number;
}

export interface UserStats {
  total: number;
  active: number;
  suspended: number;
  newThisMonth: number;
  trends: {
    totalChange: number;
    activeChange: number;
    suspendedChange: number;
    newChange: number;
  };
}

export interface UserFilters {
  search?: string;
  status?: string;
  ageRange?: string;
  dateJoined?: string;
  location?: string;
}

export default function AdolescentUsersPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState<UserFilters>({});
  const [sortField, setSortField] = useState("joinDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const [users, setUsers] = useState<AdolescentUser[]>([]);
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    active: 0,
    suspended: 0,
    newThisMonth: 0,
    trends: {
      totalChange: 0,
      activeChange: 0,
      suspendedChange: 0,
      newChange: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [usersResponse, statsResponse] = await Promise.all([
          mockApi.fetchUsers({
            page: currentPage,
            limit: itemsPerPage,
            filters,
            sortBy: sortField,
            sortOrder: sortDirection,
          }),
          mockApi.fetchUserStats(),
        ]);

        setUsers(usersResponse.users);
        setTotalItems(usersResponse.total);
        setStats(statsResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, itemsPerPage, filters, sortField, sortDirection]);

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Sorting handler
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  // Filter handler
  const updateFilters = (newFilters: UserFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // Export functionality
  const handleExport = async () => {
    const exportingCount =
      selectedUsers.length > 0 ? selectedUsers.length : totalItems;

    // Mock version (remove when implementing RTK Query)
    toast.loading(`Preparing to export ${exportingCount} users...`, {
      id: "export",
    });
    try {
      const result = await mockApi.exportUsers(
        selectedUsers.length > 0 ? selectedUsers : undefined
      );
      toast.success(`Successfully exported ${exportingCount} users!`, {
        id: "export",
      });
    } catch (error) {
      toast.error("Failed to export users", { id: "export" });
    }
  };

  // Bulk actions
  const handleBulkAction = async (
    action: "suspend" | "activate" | "delete"
  ) => {
    if (selectedUsers.length === 0) return;

    // Mock version (remove when implementing RTK Query)
    const actionLabel = action === "activate" ? "activate" : action;
    toast.loading(
      `Processing ${actionLabel} for ${selectedUsers.length} users...`,
      { id: "bulk" }
    );

    try {
      const result = await mockApi.bulkUpdateUsers(selectedUsers, action);

      if (result.failed > 0) {
        toast.error(
          `${result.success} users ${actionLabel}d, ${result.failed} failed`,
          { id: "bulk" }
        );
      } else {
        toast.success(`Successfully ${actionLabel}d ${result.success} users`, {
          id: "bulk",
        });
      }

      setSelectedUsers([]);
      // Trigger refetch by updating dependencies
      setCurrentPage((prev) => prev);
    } catch (error) {
      toast.error(`Failed to ${actionLabel} users`, { id: "bulk" });
    }
  };

  // Refresh data
  const refreshData = () => {
    // Mock version (remove when implementing RTK Query)
    setCurrentPage((prev) => prev);
  };

  return (
    <>
      <AdminPageHeader
        title="Adolescent Users"
        description={`Manage and monitor ${totalItems.toLocaleString()} adolescent user accounts, activities, and settings.`}
        action={{
          label: "Export Users",
          icon: <Download className="mr-2 h-4 w-4" />,
          onClick: handleExport,
        }}
      />

      {/* Stats overview */}
      <UserStats stats={stats} />

      {/* Filters and actions */}
      <AdminCard className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {Object.keys(filters).length > 0 && (
                <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {Object.keys(filters).length}
                </span>
              )}
            </Button>

            {selectedUsers.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {selectedUsers.length} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("suspend")}
                >
                  Suspend Selected
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("activate")}
                >
                  Activate Selected
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction("delete")}
                  className="text-red-600 hover:text-red-700"
                >
                  Delete Selected
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={refreshData}
              disabled={loading}
            >
              Refresh
            </Button>
            <Button size="sm" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export All
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 border-t pt-4">
            <UserFilters filters={filters} onFiltersChange={updateFilters} />
          </div>
        )}
      </AdminCard>

      {/* Users table */}
      <AdminCard padding="none">
        <UsersTable
          users={users}
          loading={loading}
          selectedUsers={selectedUsers}
          onSelectedUsersChange={setSelectedUsers}
          totalItems={totalItems}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
          sortField={sortField}
          sortDirection={sortDirection}
          onSort={handleSort}
        />
      </AdminCard>
    </>
  );
}
