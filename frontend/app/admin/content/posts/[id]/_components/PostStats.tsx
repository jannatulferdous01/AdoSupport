"use client";

import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Flag } from "lucide-react";
import { PostData } from "../../_services/mockPostsApi";

interface PostStatsProps {
  post: PostData;
}

export default function PostStats({ post }: PostStatsProps) {
  return (
    <div className="flex items-center justify-between text-sm text-gray-500">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1">
          <Heart className="h-4 w-4" />
          <span>{post.likes} likes</span>
        </div>
        <div className="flex items-center gap-1">
          <MessageCircle className="h-4 w-4" />
          <span>{post.commentsCount} comments</span>
        </div>
        {post.isReported && (
          <div className="flex items-center gap-1 text-red-600">
            <Flag className="h-4 w-4" />
            <span>{post.reportCount} reports</span>
          </div>
        )}
      </div>
      <div>
        Last updated: {formatDistanceToNow(post.updatedAt, { addSuffix: true })}
      </div>
    </div>
  );
}