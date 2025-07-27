"use client";

import { useState, useEffect } from "react";
import { Download, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminPageHeader from "../../_components/ui/AdminPageHeader";
import AdminCard from "../../_components/ui/AdminCard";
import ParentStats from "./_components/stats/ParentStats";
import ParentFilters from "./_components/filters/ParentFilters";
import ParentsTable from "./_components/table/ParentsTable";
import { mockApi } from "./_services/mockApi";
import toast from "react-hot-toast";

// Parent User interface - simplified without subscription/verification
export interface ParentUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "active" | "suspended" | "pending";
  joinDate: Date;
  lastActive: Date;
  location: string;
  avatar: string;
  childrenCount: number;
  totalOrders: number;
}

// Parent statistics interface - updated to match components
export interface ParentStats {
  total: number;
  active: number;
  inactive: number; // Changed from 'suspended' to 'inactive' to match ParentStats component
  newThisMonth: number;
  trends: {
    totalChange: number;
    activeChange: number;
    inactiveChange: number; // Changed from 'suspendedChange' to 'inactiveChange'
    newChange: number;
  };
}

// Parent filters interface - simplified
export interface ParentFilters {
  search?: string;
  status?: string;
  verificationStatus?: string; // Keep this as ParentFilters component uses it
  childrenCount?: string;
  dateJoined?: string;
  location?: string;
}

export default function ParentsUsersPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Pagination and filter state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState<ParentFilters>({});
  const [sortField, setSortField] = useState("joinDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // RTK Query hooks (commented out for future implementation)
  /*
  const {
    data: parentsData,
    isLoading: isLoadingParents,
    error: parentsError,
  } = useGetParentsQuery({
    page: currentPage,
    limit: itemsPerPage,
    filters,
    sortBy: sortField,
    sortOrder: sortDirection,
  });

  const {
    data: statsData,
    isLoading: isLoadingStats,
  } = useGetParentStatsQuery();

  const [updateParentStatus] = useUpdateParentStatusMutation();
  const [bulkUpdateParents] = useBulkUpdateParentsMutation();
  const [exportParentsData] = useExportParentsMutation();
  */

  // Mock data state (remove this when implementing RTK Query)
  const [parents, setParents] = useState<ParentUser[]>([]);
  const [stats, setStats] = useState<ParentStats>({
    total: 0,
    active: 0,
    inactive: 0, // Changed to match interface
    newThisMonth: 0,
    trends: {
      totalChange: 0,
      activeChange: 0,
      inactiveChange: 0, // Changed to match interface
      newChange: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  // Mock data fetching (remove this when implementing RTK Query)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [parentsResponse, statsResponse] = await Promise.all([
          mockApi.fetchParents({
            page: currentPage,
            limit: itemsPerPage,
            filters,
            sortBy: sortField,
            sortOrder: sortDirection,
          }),
          mockApi.fetchParentStats(),
        ]);

        setParents(parentsResponse.parents);
        setTotalItems(parentsResponse.total);
        setStats(statsResponse);
      } catch (error) {
        console.error("Error fetching parent data:", error);
        toast.error("Failed to load parent data");
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
  const updateFilters = (newFilters: ParentFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // Export functionality
  const handleExport = async () => {
    const exportingCount =
      selectedUsers.length > 0 ? selectedUsers.length : totalItems;

    // RTK Query version (commented out)
    /*
    try {
      const result = await exportParentsData({
        userIds: selectedUsers.length > 0 ? selectedUsers : undefined
      }).unwrap();
      
      toast.success(`Successfully exported ${exportingCount} parent accounts!`);
      // Handle download URL
      window.open(result.downloadUrl, '_blank');
    } catch (error) {
      toast.error("Failed to export parent accounts");
    }
    */

    // Mock version (remove when implementing RTK Query)
    toast.loading(`Preparing to export ${exportingCount} parent accounts...`, {
      id: "export",
    });
    try {
      const result = await mockApi.exportParents(
        selectedUsers.length > 0 ? selectedUsers : undefined
      );
      toast.success(
        `Successfully exported ${exportingCount} parent accounts!`,
        { id: "export" }
      );
    } catch (error) {
      toast.error("Failed to export parent accounts", { id: "export" });
    }
  };

  // Bulk actions for parent accounts
  const handleBulkAction = async (
    action: "suspend" | "activate" | "delete"
  ) => {
    if (selectedUsers.length === 0) return;

    // RTK Query version (commented out)
    /*
    try {
      const result = await bulkUpdateParents({
        userIds: selectedUsers,
        action
      }).unwrap();
      
      if (result.failed > 0) {
        toast.error(`${result.success} parents ${action}d, ${result.failed} failed`);
      } else {
        toast.success(`Successfully ${action}d ${result.success} parent accounts`);
      }
      
      setSelectedUsers([]);
    } catch (error) {
      toast.error(`Failed to ${action} parent accounts`);
    }
    */

    // Mock version (remove when implementing RTK Query)
    const actionLabel = action === "activate" ? "activate" : action;
    toast.loading(
      `Processing ${actionLabel} for ${selectedUsers.length} parent accounts...`,
      { id: "bulk" }
    );

    try {
      const result = await mockApi.bulkUpdateParents(selectedUsers, action);

      if (result.failed > 0) {
        toast.error(
          `${result.success} parents ${actionLabel}d, ${result.failed} failed`,
          { id: "bulk" }
        );
      } else {
        toast.success(
          `Successfully ${actionLabel}d ${result.success} parent accounts`,
          { id: "bulk" }
        );
      }

      setSelectedUsers([]);
      // Trigger refetch by updating dependencies
      setCurrentPage((prev) => prev);
    } catch (error) {
      toast.error(`Failed to ${actionLabel} parent accounts`, { id: "bulk" });
    }
  };

  // Refresh parent data
  const refreshData = () => {
    // RTK Query version (commented out)
    // This will automatically refetch when using RTK Query

    // Mock version (remove when implementing RTK Query)
    setCurrentPage((prev) => prev);
  };

  return (
    <>
      <AdminPageHeader
        title="Parent Users"
        description={`Manage and monitor ${totalItems.toLocaleString()} parent user accounts, their children, and activities.`}
        action={{
          label: "Export Parents",
          icon: <Download className="mr-2 h-4 w-4" />,
          onClick: handleExport,
        }}
      />

      {/* Parent account statistics overview */}
      <ParentStats stats={stats} />

      {/* Filters and bulk actions bar */}
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
              {Object.values(filters).filter(value => value && value !== "all").length > 0 && (
                <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {Object.values(filters).filter(value => value && value !== "all").length}
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

        {/* Collapsible filter section */}
        {showFilters && (
          <div className="mt-4 border-t pt-4">
            <ParentFilters filters={filters} onFiltersChange={updateFilters} />
          </div>
        )}
      </AdminCard>

      {/* Parent accounts table with pagination */}
      <AdminCard padding="none">
        <ParentsTable
          parents={parents}
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
