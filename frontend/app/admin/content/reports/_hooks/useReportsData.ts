"use client";

import { useState, useEffect } from "react";
import { mockReportsApi, type ReportData, type ReportStats, type ReportFilters } from "../_services/mockReportsApi";
import toast from "react-hot-toast";

export function useReportsData() {
  // Pagination and filter state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState<ReportFilters>({});
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Data state
  const [reports, setReports] = useState<ReportData[]>([]);
  const [stats, setStats] = useState<ReportStats>({
    total: 0,
    pending: 0,
    investigating: 0,
    resolved: 0,
    dismissed: 0,
    todaysReports: 0,
    avgResolutionTime: 0,
    trends: {
      totalChange: 0,
      pendingChange: 0,
      resolvedChange: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [reportsResponse, statsResponse] = await Promise.all([
          mockReportsApi.fetchReports({
            page: currentPage,
            limit: itemsPerPage,
            filters,
            sortBy: sortField,
            sortOrder: sortDirection,
          }),
          mockReportsApi.fetchReportStats(),
        ]);

        setReports(reportsResponse.reports);
        setTotalItems(reportsResponse.total);
        setStats(statsResponse);
      } catch (error) {
        console.error("Error fetching reports data:", error);
        toast.error("Failed to load reports data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentPage, itemsPerPage, filters, sortField, sortDirection]);

  // Handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1);
  };

  const updateFilters = (newFilters: ReportFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const refreshData = async () => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [reportsResponse, statsResponse] = await Promise.all([
          mockReportsApi.fetchReports({
            page: currentPage,
            limit: itemsPerPage,
            filters,
            sortBy: sortField,
            sortOrder: sortDirection,
          }),
          mockReportsApi.fetchReportStats(),
        ]);

        setReports(reportsResponse.reports);
        setTotalItems(reportsResponse.total);
        setStats(statsResponse);
      } catch (error) {
        console.error("Error fetching reports data:", error);
        toast.error("Failed to load reports data");
      } finally {
        setLoading(false);
      }
    };

    await fetchData();
  };

  return {
    // State
    reports,
    stats,
    loading,
    totalItems,
    currentPage,
    itemsPerPage,
    filters,
    sortField,
    sortDirection,
    // Handlers
    handlePageChange,
    handleItemsPerPageChange,
    handleSort,
    updateFilters,
    clearFilters,
    refreshData,
  };
}