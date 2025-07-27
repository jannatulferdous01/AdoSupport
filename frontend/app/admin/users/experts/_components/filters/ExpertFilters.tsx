"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExpertFilters as IExpertFilters } from "../../page";

interface ExpertFiltersProps {
  filters: IExpertFilters;
  onFiltersChange: (filters: IExpertFilters) => void;
}

export default function ExpertFilters({
  filters,
  onFiltersChange,
}: ExpertFiltersProps) {
  const updateFilter = (key: keyof IExpertFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value === "all" ? undefined : value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(
    (value) => value && value !== "all"
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Filter Experts</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search experts..."
              value={filters.search || ""}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select
            value={filters.status || "all"}
            onValueChange={(value) => updateFilter("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Specialty Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Specialty</label>
          <Select
            value={filters.specialty || "all"}
            onValueChange={(value) => updateFilter("specialty", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Specialties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Specialties</SelectItem>
              <SelectItem value="psychology">Psychology</SelectItem>
              <SelectItem value="psychiatry">Psychiatry</SelectItem>
              <SelectItem value="counseling">Counseling</SelectItem>
              <SelectItem value="therapy">Therapy</SelectItem>
              <SelectItem value="social-work">Social Work</SelectItem>
              <SelectItem value="education">Education</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Experience Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Experience</label>
          <Select
            value={filters.experience || "all"}
            onValueChange={(value) => updateFilter("experience", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Experience</SelectItem>
              <SelectItem value="0-2">0-2 years</SelectItem>
              <SelectItem value="3-5">3-5 years</SelectItem>
              <SelectItem value="6-10">6-10 years</SelectItem>
              <SelectItem value="10+">10+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Availability Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Availability</label>
          <Select
            value={filters.availability || "all"}
            onValueChange={(value) => updateFilter("availability", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Availability</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="busy">Busy</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Rating Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Rating</label>
          <Select
            value={filters.rating || "all"}
            onValueChange={(value) => updateFilter("rating", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Ratings" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ratings</SelectItem>
              <SelectItem value="4+">4+ Stars</SelectItem>
              <SelectItem value="3+">3+ Stars</SelectItem>
              <SelectItem value="2+">2+ Stars</SelectItem>
              <SelectItem value="1+">1+ Stars</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Location Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Location</label>
          <Input
            placeholder="Filter by location..."
            value={filters.location || ""}
            onChange={(e) => updateFilter("location", e.target.value)}
          />
        </div>

        {/* Date Joined Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Date Joined</label>
          <Select
            value={filters.dateJoined || "all"}
            onValueChange={(value) => updateFilter("dateJoined", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
