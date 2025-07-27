"use client";

import { useState, useEffect } from "react";
import { Download, Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminPageHeader from "../../_components/ui/AdminPageHeader";
import AdminCard from "../../_components/ui/AdminCard";
import toast from "react-hot-toast";
import { mockApi } from "./_services/mockApi";
import ExpertStats from "./_components/stats/ExpertStats";
import ExpertFilters from "./_components/filters/ExpertFilters";
import CreateExpertModal from "./_components/modals/CreateExpertModal";
import ExpertsTable from "./_components/table/ExpertsTable";

// Expert User interface
export interface ExpertUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  experience: number; // years of experience
  qualifications: string[];
  status: "active" | "suspended" | "pending";
  joinDate: Date;
  lastActive: Date;
  location: string;
  avatar: string;
  totalSessions: number;
  rating: number; // 1-5 stars
  hourlyRate: number; // USD per hour
  availability: "available" | "busy" | "offline";
}

// Expert statistics interface
export interface ExpertStats {
  total: number;
  active: number;
  inactive: number;
  newThisMonth: number;
  averageRating: number;
  totalSessions: number;
  trends: {
    totalChange: number;
    activeChange: number;
    inactiveChange: number;
    newChange: number;
  };
}

// Expert filters interface
export interface ExpertFilters {
  search?: string;
  status?: string;
  specialty?: string;
  experience?: string;
  availability?: string;
  location?: string;
  rating?: string;
  dateJoined?: string;
}

export default function ExpertUsersPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Pagination and filter state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState<ExpertFilters>({});
  const [sortField, setSortField] = useState("joinDate");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Mock data state (remove this when implementing RTK Query)
  const [experts, setExperts] = useState<ExpertUser[]>([]);
  const [stats, setStats] = useState<ExpertStats>({
    total: 0,
    active: 0,
    inactive: 0,
    newThisMonth: 0,
    averageRating: 0,
    totalSessions: 0,
    trends: {
      totalChange: 0,
      activeChange: 0,
      inactiveChange: 0,
      newChange: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  // Mock data fetching
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [expertsResponse, statsResponse] = await Promise.all([
          mockApi.fetchExperts({
            page: currentPage,
            limit: itemsPerPage,
            filters,
            sortBy: sortField,
            sortOrder: sortDirection,
          }),
          mockApi.fetchExpertStats(),
        ]);

        setExperts(expertsResponse.experts);
        setTotalItems(expertsResponse.total);
        setStats(statsResponse);
      } catch (error) {
        console.error("Error fetching expert data:", error);
        toast.error("Failed to load expert data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, itemsPerPage, filters, sortField, sortDirection]);

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
  const updateFilters = (newFilters: ExpertFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // Export functionality
  const handleExport = async () => {
    const exportingCount =
      selectedUsers.length > 0 ? selectedUsers.length : totalItems;

    toast.loading(`Preparing to export ${exportingCount} expert accounts...`, {
      id: "export",
    });
    try {
      const result = await mockApi.exportExperts(
        selectedUsers.length > 0 ? selectedUsers : undefined
      );
      toast.success(
        `Successfully exported ${exportingCount} expert accounts!`,
        { id: "export" }
      );
    } catch (error) {
      toast.error("Failed to export expert accounts", { id: "export" });
    }
  };

  // Bulk actions
  const handleBulkAction = async (
    action: "suspend" | "activate" | "delete"
  ) => {
    if (selectedUsers.length === 0) return;

    const actionLabel = action === "activate" ? "activate" : action;
    toast.loading(
      `Processing ${actionLabel} for ${selectedUsers.length} expert accounts...`,
      { id: "bulk" }
    );

    try {
      const result = await mockApi.bulkUpdateExperts(selectedUsers, action);

      if (result.failed > 0) {
        toast.error(
          `${result.success} experts ${actionLabel}d, ${result.failed} failed`,
          { id: "bulk" }
        );
      } else {
        toast.success(
          `Successfully ${actionLabel}d ${result.success} expert accounts`,
          { id: "bulk" }
        );
      }

      setSelectedUsers([]);
      setCurrentPage((prev) => prev);
    } catch (error) {
      toast.error(`Failed to ${actionLabel} expert accounts`, { id: "bulk" });
    }
  };

  // Refresh data
  const refreshData = () => {
    setCurrentPage((prev) => prev);
  };

  // Handle create expert
  const handleCreateExpert = async (expertData: Partial<ExpertUser>) => {
    try {
      await mockApi.createExpert(expertData);
      toast.success("Expert account created successfully!");
      setShowCreateModal(false);
      refreshData();
    } catch (error) {
      toast.error("Failed to create expert account");
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Expert Users"
        description={`Manage and monitor ${totalItems.toLocaleString()} expert accounts, their specialties, and session activities.`}
        action={{
          label: "Add Expert",
          icon: <Plus className="mr-2 h-4 w-4" />,
          onClick: () => setShowCreateModal(true),
        }}
      />

      {/* Expert statistics overview */}
      <ExpertStats stats={stats} />

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
              {Object.values(filters).filter(
                (value) => value && value !== "all"
              ).length > 0 && (
                <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {
                    Object.values(filters).filter(
                      (value) => value && value !== "all"
                    ).length
                  }
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
            <ExpertFilters filters={filters} onFiltersChange={updateFilters} />
          </div>
        )}
      </AdminCard>

      {/* Experts table */}
      <AdminCard padding="none">
        <ExpertsTable
          experts={experts}
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

      {/* Create Expert Modal */}
      <CreateExpertModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateExpert}
      />
    </>
  );
}
