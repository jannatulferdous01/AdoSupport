"use client";

import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Filter, Heart, Flag } from "lucide-react";
import { PostComment } from "../../_services/mockPostsApi";

interface CommentsSectionProps {
  comments: PostComment[];
  loading: boolean;
}

export default function CommentsSection({
  comments,
  loading,
}: CommentsSectionProps) {
  const getRoleBadge = (role: string) => {
    const colors = {
      adolescent: "bg-blue-50 text-blue-600",
      parent: "bg-green-50 text-green-600",
      expert: "bg-purple-50 text-purple-600",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          colors[role as keyof typeof colors]
        }`}
      >
        {role}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Comments */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
                <div className="h-16 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={comment.author.avatar}
                  alt={comment.author.name}
                />
                <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">
                    {comment.author.name}
                  </span>
                  {getRoleBadge(comment.author.role)}
                  <span className="text-sm text-gray-500">
                    {formatDistanceToNow(comment.createdAt, {
                      addSuffix: true,
                    })}
                  </span>
                  {comment.isReported && (
                    <Badge className="bg-red-50 text-red-700 border-red-200 text-xs">
                      Reported
                    </Badge>
                  )}
                </div>

                <div className="text-gray-700 leading-relaxed">
                  {comment.content}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1 hover:text-gray-700">
                    <Heart className="h-3 w-3" />
                    {comment.likes}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          No comments yet on this post.
        </div>
      )}
    </div>
  );
}
