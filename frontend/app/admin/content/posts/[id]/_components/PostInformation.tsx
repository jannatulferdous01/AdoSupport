"use client";

import { Badge } from "@/components/ui/badge";
import { PostData } from "../../_services/mockPostsApi";

interface PostInformationProps {
  post: PostData;
}

export default function PostInformation({ post }: PostInformationProps) {
  const getStatusBadge = (status: PostData["status"]) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-50 text-green-700 border-green-200">Published</Badge>;
      case "draft":
        return <Badge className="bg-gray-50 text-gray-700 border-gray-200">Draft</Badge>;
      case "reported":
        return <Badge className="bg-red-50 text-red-700 border-red-200">Reported</Badge>;
      case "removed":
        return <Badge className="bg-red-100 text-red-800 border-red-300">Removed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: PostData["type"]) => {
    const colors = {
      questions: "bg-blue-50 text-blue-700 border-blue-200",
      discussions: "bg-green-50 text-green-700 border-green-200",
      resources: "bg-amber-50 text-amber-700 border-amber-200",
      experiences: "bg-purple-50 text-purple-700 border-purple-200",
    };

    return (
      <Badge className={colors[type]}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">Post Information</h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Status:</span>
          {getStatusBadge(post.status)}
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Type:</span>
          {getTypeBadge(post.type)}
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Views:</span>
          <span className="font-medium">{post.views.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Likes:</span>
          <span className="font-medium">{post.likes.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Comments:</span>
          <span className="font-medium">{post.commentsCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Created:</span>
          <span className="font-medium">{post.createdAt.toLocaleDateString()}</span>
        </div>
        {post.isReported && (
          <div className="flex justify-between">
            <span className="text-gray-500">Reports:</span>
            <span className="font-medium text-red-600">{post.reportCount}</span>
          </div>
        )}
      </div>
    </div>
  );
}