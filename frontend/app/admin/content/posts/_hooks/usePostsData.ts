"use client";

import { useState, useEffect } from "react";
import { mockPostsApi, type PostData, type PostStats, type PostFilters } from "../_services/mockPostsApi";
import toast from "react-hot-toast";

export function usePostsData() {
  // Pagination and filter state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState<PostFilters>({});
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Data state
  const [posts, setPosts] = useState<PostData[]>([]);
  const [stats, setStats] = useState<PostStats>({
    total: 0,
    published: 0,
    draft: 0,
    reported: 0,
    removed: 0,
    todaysPosts: 0,
    trends: {
      totalChange: 0,
      publishedChange: 0,
      reportedChange: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(0);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [postsResponse, statsResponse] = await Promise.all([
          mockPostsApi.fetchPosts({
            page: currentPage,
            limit: itemsPerPage,
            filters,
            sortBy: sortField,
            sortOrder: sortDirection,
          }),
          mockPostsApi.fetchPostStats(),
        ]);

        setPosts(postsResponse.posts);
        setTotalItems(postsResponse.total);
        setStats(statsResponse);
      } catch (error) {
        console.error("Error fetching posts data:", error);
        toast.error("Failed to load posts data");
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

  const updateFilters = (newFilters: PostFilters) => {
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
        const [postsResponse, statsResponse] = await Promise.all([
          mockPostsApi.fetchPosts({
            page: currentPage,
            limit: itemsPerPage,
            filters,
            sortBy: sortField,
            sortOrder: sortDirection,
          }),
          mockPostsApi.fetchPostStats(),
        ]);

        setPosts(postsResponse.posts);
        setTotalItems(postsResponse.total);
        setStats(statsResponse);
      } catch (error) {
        console.error("Error fetching posts data:", error);
        toast.error("Failed to load posts data");
      } finally {
        setLoading(false);
      }
    };

    await fetchData();
  };

  return {
    // State
    posts,
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