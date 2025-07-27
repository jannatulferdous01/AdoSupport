"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Eye, MessageCircle, Heart, Flag } from "lucide-react";
import { PostData } from "../../_services/mockPostsApi";
import PostActions from "./PostActions";

interface PostRowProps {
  post: PostData;
  selected: boolean;
  onSelect: (checked: boolean) => void;
}

export default function PostRow({ post, selected, onSelect }: PostRowProps) {
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
    <TableRow className="hover:bg-gray-50">
      <TableCell className="w-12">
        <Checkbox checked={selected} onCheckedChange={onSelect} />
      </TableCell>

      <TableCell className="max-w-0">
        <div className="space-y-2">
          <Link
            href={`/admin/content/posts/${post.id}`}
            className="font-medium text-gray-900 hover:text-blue-600 line-clamp-2"
          >
            {post.title}
          </Link>
          <div className="flex items-center gap-2">
            {getTypeBadge(post.type)}
            {post.isReported && <Flag className="h-3 w-3 text-red-500" />}
          </div>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-gray-900">{post.author.name}</p>
            {getRoleBadge(post.author.role)}
          </div>
        </div>
      </TableCell>

      <TableCell>{getStatusBadge(post.status)}</TableCell>

      <TableCell>
        <div className="text-sm">
          <p className="text-gray-900">
            {formatDistanceToNow(post.createdAt, { addSuffix: true })}
          </p>
          <p className="text-gray-500">{post.createdAt.toLocaleDateString()}</p>
        </div>
      </TableCell>

      <TableCell>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            <span>{post.views}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            <span>{post.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            <span>{post.commentsCount}</span>
          </div>
        </div>
      </TableCell>

      <TableCell>
        <div className="text-sm">
          <p className="text-gray-900">
            {formatDistanceToNow(post.lastActivityAt, { addSuffix: true })}
          </p>
        </div>
      </TableCell>

      <TableCell>
        <PostActions post={post} />
      </TableCell>
    </TableRow>
  );
}