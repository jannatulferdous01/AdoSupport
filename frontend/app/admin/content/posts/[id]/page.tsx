"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Edit, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import AdminPageHeader from "../../../_components/ui/AdminPageHeader";
import AdminCard from "../../../_components/ui/AdminCard";
import {
  mockPostsApi,
  type PostData,
  type PostComment,
} from "../_services/mockPostsApi";
import toast from "react-hot-toast";
import PostHeader from "./_components/PostHeader";
import PostContent from "./_components/PostContent";
import PostStats from "./_components/PostStats";
import CommentsSection from "./_components/CommentsSection";
import PostInformation from "./_components/PostInformation";
import AuthorInformation from "./_components/AuthorInformation";

export default function PostDetailsPage() {
  const params = useParams();
  const postId = params.id as string;

  const [post, setPost] = useState<PostData | null>(null);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!postId) return;

      try {
        const [postData, commentsData] = await Promise.all([
          mockPostsApi.fetchPostById(postId),
          mockPostsApi.fetchPostComments(postId),
        ]);

        setPost(postData);
        setComments(commentsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load post data");
      } finally {
        setLoading(false);
        setCommentsLoading(false);
      }
    };

    fetchData();
  }, [postId]);

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-16 bg-gray-200 rounded-lg animate-pulse" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
          </div>
          <div className="space-y-6">
            <div className="h-48 bg-gray-200 rounded-lg animate-pulse" />
            <div className="h-64 bg-gray-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Post not found
  if (!post) {
    return (
      <div className="space-y-6">
        <AdminPageHeader
          title="Post Not Found"
          description="The requested post could not be found"
        />
        <AdminCard>
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              This post doesn't exist or may have been removed.
            </p>
            <Link href="/admin/content/posts">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Posts
              </Button>
            </Link>
          </div>
        </AdminCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminPageHeader
        title={post.title}
        description={`Post by ${post.author.name} • ${formatDistanceToNow(
          post.createdAt,
          { addSuffix: true }
        )}`}
      />

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        <Link href="/admin/content/posts">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Posts
          </Button>
        </Link>
        <Button variant="outline">
          <Edit className="mr-2 h-4 w-4" />
          Edit Post
        </Button>
        <Button>
          <MoreHorizontal className="mr-2 h-4 w-4" />
          Actions
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Post Content Card */}
          <AdminCard>
            <div className="space-y-6">
              <PostHeader post={post} />
              <Separator />
              <PostContent post={post} />
              <Separator />
              <PostStats post={post} />
            </div>
          </AdminCard>

          {/* Comments Card */}
          <AdminCard>
            <CommentsSection comments={comments} loading={commentsLoading} />
          </AdminCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Post Information */}
          <AdminCard>
            <PostInformation post={post} />
          </AdminCard>

          {/* Author Information */}
          <AdminCard>
            <AuthorInformation author={post.author} />
          </AdminCard>
        </div>
      </div>
    </div>
  );
}
