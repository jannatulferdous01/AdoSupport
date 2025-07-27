"use client";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import PostRow from "./PostRow";
import { Skeleton } from "@/components/ui/skeleton";
import { PostData } from "../../_services/mockPostsApi";
import AdminTablePagination from "@/app/admin/_components/ui/AdminTablePagination";

interface PostsTableProps {
  posts: PostData[];
  loading: boolean;
  selectedPosts: string[];
  onSelectedPostsChange: (posts: string[]) => void;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  sortField?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (field: string) => void;
}

export default function PostsTable({
  posts,
  loading,
  selectedPosts,
  onSelectedPostsChange,
  totalItems,
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  sortField = "createdAt",
  sortDirection = "desc",
  onSort,
}: PostsTableProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectedPostsChange(posts.map((post) => post.id));
    } else {
      onSelectedPostsChange([]);
    }
  };

  const handleSelectPost = (postId: string, checked: boolean) => {
    if (checked) {
      onSelectedPostsChange([...selectedPosts, postId]);
    } else {
      onSelectedPostsChange(selectedPosts.filter((id) => id !== postId));
    }
  };

  const handleSort = (field: string) => {
    if (onSort) {
      onSort(field);
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-gray-400" />;
    }
    return sortDirection === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4 text-blue-600" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4 text-blue-600" />
    );
  };

  const allCurrentPageSelected =
    posts.length > 0 && posts.every((post) => selectedPosts.includes(post.id));
  const someCurrentPageSelected = posts.some((post) =>
    selectedPosts.includes(post.id)
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Skeleton className="h-4 w-4" />
                </TableHead>
                <TableHead>Post</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Engagement</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead className="w-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: itemsPerPage }).map((_, i) => (
                <TableRow key={i}>
                  <TableHead>
                    <Skeleton className="h-4 w-4" />
                  </TableHead>
                  <TableHead>
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-6 w-20" />
                  </TableHead>
                  <TableHead>
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-32" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-4 w-16" />
                  </TableHead>
                  <TableHead>
                    <Skeleton className="h-8 w-8" />
                  </TableHead>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <AdminTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={onPageChange}
          onItemsPerPageChange={onItemsPerPageChange}
          isLoading={loading}
        />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox checked={false} onCheckedChange={() => {}} disabled />
              </TableHead>
              <TableHead>Post</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Engagement</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableHead colSpan={8} className="text-center py-12">
                <div className="text-muted-foreground">
                  No posts found. Try adjusting your filters.
                </div>
              </TableHead>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="border-b-2">
              <TableHead className="w-12">
                <Checkbox
                  checked={allCurrentPageSelected}
                  ref={(el) => {
                    if (el) {
                      const input = el.querySelector(
                        'input[type="checkbox"]'
                      ) as HTMLInputElement;
                      if (input) {
                        input.indeterminate =
                          someCurrentPageSelected && !allCurrentPageSelected;
                      }
                    }
                  }}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-auto p-0 font-medium hover:bg-transparent ${
                    sortField === "title" ? "text-blue-600" : ""
                  }`}
                  onClick={() => handleSort("title")}
                >
                  Post
                  {getSortIcon("title")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-auto p-0 font-medium hover:bg-transparent ${
                    sortField === "author" ? "text-blue-600" : ""
                  }`}
                  onClick={() => handleSort("author")}
                >
                  Author
                  {getSortIcon("author")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-auto p-0 font-medium hover:bg-transparent ${
                    sortField === "status" ? "text-blue-600" : ""
                  }`}
                  onClick={() => handleSort("status")}
                >
                  Status
                  {getSortIcon("status")}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-auto p-0 font-medium hover:bg-transparent ${
                    sortField === "createdAt" ? "text-blue-600" : ""
                  }`}
                  onClick={() => handleSort("createdAt")}
                >
                  Created
                  {getSortIcon("createdAt")}
                </Button>
              </TableHead>
              <TableHead>Engagement</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-auto p-0 font-medium hover:bg-transparent ${
                    sortField === "lastActivityAt" ? "text-blue-600" : ""
                  }`}
                  onClick={() => handleSort("lastActivityAt")}
                >
                  Last Activity
                  {getSortIcon("lastActivityAt")}
                </Button>
              </TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <PostRow
                key={post.id}
                post={post}
                selected={selectedPosts.includes(post.id)}
                onSelect={(checked) => handleSelectPost(post.id, checked)}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      <AdminTablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
        onItemsPerPageChange={onItemsPerPageChange}
        isLoading={loading}
      />
    </div>
  );
}
