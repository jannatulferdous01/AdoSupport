"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ParentFilters {
  search?: string;
  status?: string;
  verificationStatus?: string;
  childrenCount?: string;
  dateJoined?: string;
  location?: string;
}

interface ParentFiltersProps {
  filters: ParentFilters;
  onFiltersChange: (filters: ParentFilters) => void;
}

export default function ParentFilters({
  filters,
  onFiltersChange,
}: ParentFiltersProps) {
  const [localFilters, setLocalFilters] = useState<ParentFilters>(filters);

  // Handle individual filter changes
  const handleFilterChange = (key: keyof ParentFilters, value: string) => {
    const newFilters = { ...localFilters, [key]: value === "all" ? undefined : value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  // Handle search input
  const handleSearchChange = (value: string) => {
    const newFilters = { ...localFilters, search: value || undefined };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  // Clear all filters
  const clearFilters = () => {
    setLocalFilters({});
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(localFilters).some(value => value !== undefined);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Filter Parents</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear Filters
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {/* Search Input */}
        <div className="xl:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by name, email..."
              value={localFilters.search || ""}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Account Status Filter */}
        <div>
          <Select
            value={localFilters.status || "all"}
            onValueChange={(value) => handleFilterChange("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Account Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Verification Status Filter */}
        <div>
          <Select
            value={localFilters.verificationStatus || "all"}
            onValueChange={(value) => handleFilterChange("verificationStatus", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Verification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Verification</SelectItem>
              <SelectItem value="verified">Verified</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="unverified">Unverified</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Children Count Filter */}
        <div>
          <Select
            value={localFilters.childrenCount || "all"}
            onValueChange={(value) => handleFilterChange("childrenCount", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Children" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Counts</SelectItem>
              <SelectItem value="1">1 Child</SelectItem>
              <SelectItem value="2-3">2-3 Children</SelectItem>
              <SelectItem value="4+">4+ Children</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Joined Filter */}
        <div>
          <Select
            value={localFilters.dateJoined || "all"}
            onValueChange={(value) => handleFilterChange("dateJoined", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Date Joined" />
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
      </div>
    </div>
  );
}
