import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PostProps } from "../Post/types";

type PostDetailContentProps = {
  post: PostProps;
  readTimeMinutes: number;
  getCategoryLabel: (category: string) => string;
  getCategoryColor: (category: string) => string;
};

export default function PostDetailContent({
  post,
  readTimeMinutes,
  getCategoryLabel,
  getCategoryColor,
}: PostDetailContentProps) {
  return (
    <div className="p-6 border-b border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.author.image} alt={post.author.name} />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <Link
                href={`/community/profile/${post.author.id}`}
                className="font-medium text-gray-900 hover:text-primary transition-colors"
              >
                {post.author.name}
              </Link>
              {post.author.isExpert && (
                <Badge
                  variant="outline"
                  className="text-primary border-primary"
                >
                  Expert
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>
                {formatDistanceToNow(post.createdAt, { addSuffix: true })}
              </span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{readTimeMinutes} min read</span>
              </div>
            </div>
          </div>
        </div>

        <Badge className={`${getCategoryColor(post.category)}`}>
          {getCategoryLabel(post.category)}
        </Badge>
      </div>

      {post.content.title && (
        <h1 className="text-2xl font-bold mb-3 text-gray-900">
          {post.content.title}
        </h1>
      )}

      <div className="prose max-w-none text-gray-700 whitespace-pre-line">
        {post.content.text}
      </div>

      {post.content.image && (
        <div className="mt-4 rounded-lg overflow-hidden">
          <Image
            src={post.content.image}
            alt="Post image"
            width={1000}
            height={500}
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-4">
          {post.tags.map((tag) => (
            <Link href={`/community/tag/${tag}`} key={tag}>
              <Badge
                variant="secondary"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                #{tag}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
