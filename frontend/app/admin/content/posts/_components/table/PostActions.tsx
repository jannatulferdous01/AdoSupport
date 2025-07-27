"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Flag,
  Trash,
  Archive,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PostData } from "../../_services/mockPostsApi";
import toast from "react-hot-toast";

interface PostActionsProps {
  post: PostData;
}

export default function PostActions({ post }: PostActionsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleViewPost = () => {
    // Redirect to post details page
    window.open(`/admin/content/posts/${post.id}`, "_blank");
  };

  const handleEditPost = () => {
    toast.success("Edit post functionality will be implemented soon");
  };

  const handleToggleStatus = async () => {
    setIsLoading(true);
    try {
      // Mock action - in real app, this would call an API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newStatus = post.status === "published" ? "draft" : "published";
      toast.success(
        `Post ${
          newStatus === "published" ? "published" : "moved to draft"
        } successfully`
      );

      // Refresh page to show updated data
      window.location.reload();
    } catch (error) {
      toast.error("Failed to update post status");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReportPost = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast.success("Post marked as reported");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to report post");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this post? This action cannot be undone."
      )
    ) {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        toast.success("Post deleted successfully");
        window.location.reload();
      } catch (error) {
        toast.error("Failed to delete post");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          disabled={isLoading}
        >
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Post Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href={`/admin/content/posts/${post.id}`}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleEditPost}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Post
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleViewPost}>
          <ExternalLink className="mr-2 h-4 w-4" />
          View on Site
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleToggleStatus}>
          <Archive className="mr-2 h-4 w-4" />
          {post.status === "published" ? "Move to Draft" : "Publish"}
        </DropdownMenuItem>

        {!post.isReported && (
          <DropdownMenuItem
            onClick={handleReportPost}
            className="text-orange-600"
          >
            <Flag className="mr-2 h-4 w-4" />
            Mark as Reported
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleDeletePost}
          className="text-red-600 focus:text-red-600"
        >
          <Trash className="mr-2 h-4 w-4" />
          Delete Post
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}