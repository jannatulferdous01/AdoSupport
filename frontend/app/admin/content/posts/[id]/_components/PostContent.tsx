"use client";

import { Badge } from "@/components/ui/badge";
import { Tag } from "lucide-react";
import { PostData } from "../../_services/mockPostsApi";

interface PostContentProps {
  post: PostData;
}

export default function PostContent({ post }: PostContentProps) {
  return (
    <div className="space-y-6">
      {/* Content */}
      <div className="prose max-w-none">
        <div 
          className="text-gray-700 leading-relaxed whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap pt-4">
          <Tag className="h-4 w-4 text-gray-500" />
          {post.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}