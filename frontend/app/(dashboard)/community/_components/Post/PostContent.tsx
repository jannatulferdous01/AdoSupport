import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { PostProps } from "./types";

export default function PostContent({ post }: { post: PostProps }) {
  return (
    <div className="p-4">
      {post.content.title && (
        <Link href={`/community/post/${post.id}`}>
          <h3 className="text-lg font-semibold mb-2 text-gray-900 hover:text-primary transition-colors">
            {post.content.title}
          </h3>
        </Link>
      )}

      {/* First paragraph of text could be clickable too */}
      <Link href={`/community/post/${post.id}`} className="inline-block">
        <p className="text-gray-700 whitespace-pre-line">
          {post.content.text.length > 300
            ? `${post.content.text.substring(0, 300)}...`
            : post.content.text}
        </p>
        {post.content.text.length > 300 && (
          <span className="text-primary hover:underline ml-1">Read more</span>
        )}
      </Link>

      {post.content.image && (
        <div className="mt-4 rounded-lg overflow-hidden">
          <Link href={`/community/post/${post.id}`}>
            <Image
              src={post.content.image}
              alt="Post image"
              width={600}
              height={400}
              className="w-full h-auto object-cover"
            />
          </Link>
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