"use client";

import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Eye, Flag } from "lucide-react";
import { PostData } from "../../_services/mockPostsApi";

interface PostHeaderProps {
  post: PostData;
}

export default function PostHeader({ post }: PostHeaderProps) {
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

  const getRoleBadge = (role: string) => {
    const colors = {
      adolescent: "bg-blue-50 text-blue-600",
      parent: "bg-green-50 text-green-600",
      expert: "bg-purple-50 text-purple-600",
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[role as keyof typeof colors]}`}>
        {role}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Badges */}
      <div className="flex items-center gap-3">
        {getTypeBadge(post.type)}
        {getStatusBadge(post.status)}
        {post.isReported && (
          <Badge className="bg-red-50 text-red-700 border-red-200">
            <Flag className="mr-1 h-3 w-3" />
            {post.reportCount} Report{post.reportCount !== 1 ? "s" : ""}
          </Badge>
        )}
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-900">{post.title}</h1>

      {/* Author and Meta */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-gray-900">{post.author.name}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {getRoleBadge(post.author.role)}
              {post.author.age && <span>• {post.author.age} years old</span>}
            </div>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {formatDistanceToNow(post.createdAt, { addSuffix: true })}
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            {post.views.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}