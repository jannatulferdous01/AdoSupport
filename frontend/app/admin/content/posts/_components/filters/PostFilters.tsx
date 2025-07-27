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
import { PostFilters as PostFiltersType } from "../../_services/mockPostsApi";

interface PostFiltersProps {
  filters: PostFiltersType;
  onFiltersChange: (filters: PostFiltersType) => void;
  onClear: () => void;
}

export default function PostFilters({
  filters,
  onFiltersChange,
  onClear,
}: PostFiltersProps) {
  const [localFilters, setLocalFilters] = useState<PostFiltersType>(filters);

  const updateFilter = (key: keyof PostFiltersType, value: any) => {
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
        <h3 className="text-lg font-semibold text-gray-900">Filter Posts</h3>
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
              placeholder="Search posts..."
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
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="reported">Reported</SelectItem>
              <SelectItem value="removed">Removed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Type */}
        <div className="space-y-2">
          <Label>Type</Label>
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
              <SelectItem value="questions">Questions</SelectItem>
              <SelectItem value="discussions">Discussions</SelectItem>
              <SelectItem value="resources">Resources</SelectItem>
              <SelectItem value="experiences">Experiences</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Author Role */}
        <div className="space-y-2">
          <Label>Author Role</Label>
          <Select
            value={localFilters.authorRole || "all"}
            onValueChange={(value) =>
              updateFilter("authorRole", value === "all" ? undefined : value)
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
