"use client";

import AdminCard from "../../../_components/ui/AdminCard";
import PostsTable from "./table/PostsTable";
import { PostData } from "../_services/mockPostsApi";

interface PostsTableSectionProps {
  posts: PostData[];
  loading: boolean;
  selectedPosts: string[];
  onSelectedPostsChange: (posts: string[]) => void;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
}

export default function PostsTableSection(props: PostsTableSectionProps) {
  return (
    <AdminCard padding="none">
      <PostsTable {...props} />
    </AdminCard>
  );
}