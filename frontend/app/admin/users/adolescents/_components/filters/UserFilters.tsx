"use client";

import { useState } from "react";
import { Search, Calendar, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import QuickFilters from "./QuickFilters";

// Define proper types for filters
interface UserFilters {
  search?: string;
  status?: string;
  ageRange?: string;
  dateJoined?: string;
  location?: string;
}

interface UserFiltersProps {
  filters: UserFilters;
  onFiltersChange: (filters: UserFilters) => void;
}

export default function UserFilters({
  filters,
  onFiltersChange,
}: UserFiltersProps) {
  // Clear all filters
  const clearFilters = () => {
    onFiltersChange({});
  };

  // Update individual filter with proper typing
  const updateFilter = (key: keyof UserFilters, value: string) => {
    if (value === "all" || !value) {
      const newFilters = { ...filters };
      delete newFilters[key];
      onFiltersChange(newFilters);
    } else {
      onFiltersChange({ ...filters, [key]: value });
    }
  };

  const activeFiltersCount = Object.keys(filters).length;

  // Helper function to get human-readable filter labels
  const getFilterLabel = (key: keyof UserFilters): string => {
    const labels: Record<keyof UserFilters, string> = {
      search: "Search",
      status: "Status",
      ageRange: "Age Range",
      dateJoined: "Date Joined",
      location: "Location",
    };
    return labels[key];
  };

  return (
    <div className="space-y-4">
      {/* Quick filter buttons */}
      <QuickFilters onQuickFilter={(filter) => onFiltersChange(filter)} />

      {/* Detailed filters */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search users..."
            value={filters.search || ""}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Status filter */}
        <Select
          value={filters.status || "all"}
          onValueChange={(value) => updateFilter("status", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
            <SelectItem value="pending">Pending Verification</SelectItem>
          </SelectContent>
        </Select>

        {/* Age range filter */}
        <Select
          value={filters.ageRange || "all"}
          onValueChange={(value) => updateFilter("ageRange", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All ages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ages</SelectItem>
            <SelectItem value="13-15">13-15 years</SelectItem>
            <SelectItem value="16-17">16-17 years</SelectItem>
            <SelectItem value="18+">18+ years</SelectItem>
          </SelectContent>
        </Select>

        {/* Date joined filter */}
        <Select
          value={filters.dateJoined || "all"}
          onValueChange={(value) => updateFilter("dateJoined", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="All time" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">Last 3 Months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active filters display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500">Active filters:</span>

          {(Object.entries(filters) as Array<[keyof UserFilters, string]>).map(
            ([key, value]) => (
              <Badge
                key={key}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {getFilterLabel(key)}: {value}
                <X
                  className="h-3 w-3 cursor-pointer hover:text-red-600"
                  onClick={() => updateFilter(key, "")}
                />
              </Badge>
            )
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-6 px-2 text-xs"
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  );
}
