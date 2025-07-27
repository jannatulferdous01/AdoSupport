"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdminCard from "../../../../_components/ui/AdminCard";
import { ReportFilters as ReportFiltersType } from "../../_services/mockReportsApi";

interface ReportFiltersProps {
  filters: ReportFiltersType;
  onFiltersChange: (filters: ReportFiltersType) => void;
  onClear: () => void;
}

export default function ReportFilters({
  filters,
  onFiltersChange,
  onClear,
}: ReportFiltersProps) {
  const [localFilters, setLocalFilters] = useState<ReportFiltersType>(filters);

  const updateFilter = (key: keyof ReportFiltersType, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
  };

  const clearFilters = () => {
    setLocalFilters({});
    onClear();
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filter Reports</h3>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <X className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              id="search"
              placeholder="Search reports..."
              value={localFilters.search || ""}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={localFilters.status || "all"}
            onValueChange={(value) =>
              updateFilter("status", value === "all" ? undefined : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="investigating">Investigating</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="dismissed">Dismissed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Report Type */}
        <div className="space-y-2">
          <Label>Report Type</Label>
          <Select
            value={localFilters.type || "all"}
            onValueChange={(value) =>
              updateFilter("type", value === "all" ? undefined : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="inappropriate_content">
                Inappropriate Content
              </SelectItem>
              <SelectItem value="harassment">Harassment</SelectItem>
              <SelectItem value="spam">Spam</SelectItem>
              <SelectItem value="misinformation">Misinformation</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <Label>Priority</Label>
          <Select
            value={localFilters.priority || "all"}
            onValueChange={(value) =>
              updateFilter("priority", value === "all" ? undefined : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Content Type */}
        <div className="space-y-2">
          <Label>Content Type</Label>
          <Select
            value={localFilters.contentType || "all"}
            onValueChange={(value) =>
              updateFilter("contentType", value === "all" ? undefined : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All content" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Content</SelectItem>
              <SelectItem value="post">Posts</SelectItem>
              <SelectItem value="comment">Comments</SelectItem>
              <SelectItem value="user">Users</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Reporter Role */}
        <div className="space-y-2">
          <Label>Reporter Role</Label>
          <Select
            value={localFilters.reporterRole || "all"}
            onValueChange={(value) =>
              updateFilter("reporterRole", value === "all" ? undefined : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="adolescent">Adolescent</SelectItem>
              <SelectItem value="parent">Parent</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-500">
          {hasActiveFilters &&
            `${Object.keys(filters).length} filter(s) applied`}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={clearFilters}>
            Reset
          </Button>
          <Button onClick={applyFilters}>Apply Filters</Button>
        </div>
      </div>
    </div>
  );
}
