import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PostProps } from "./types";

export default function PostHeader({ post }: { post: PostProps }) {
  const getCategoryStyles = (category: PostProps["category"]) => {
    switch (category) {
      case "question":
        return "bg-blue-50 text-blue-700";
      case "story":
        return "bg-green-50 text-green-700";
      case "resource":
        return "bg-amber-50 text-amber-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  const getCategoryLabel = (category: PostProps["category"]) => {
    switch (category) {
      case "question":
        return "Question";
      case "story":
        return "Success Story";
      case "resource":
        return "Resource";
      default:
        return "Post";
    }
  };

  return (
    <div className="p-4 border-b border-gray-100 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={post.author.image} alt={post.author.name} />
          <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <Link
              href={`/profile/${post.author.id}`}
              className="font-medium text-gray-900 hover:text-primary transition-colors"
            >
              {post.author.name}
            </Link>
            {post.author.isExpert && (
              <Badge
                variant="outline"
                className="text-xs border-primary text-primary"
              >
                Expert
              </Badge>
            )}
          </div>
          <p className="text-xs text-gray-500">
            {formatDistanceToNow(post.createdAt, { addSuffix: true })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Badge className={`text-xs ${getCategoryStyles(post.category)}`}>
          {getCategoryLabel(post.category)}
        </Badge>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal size={16} />
              <span className="sr-only">More options</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Report</DropdownMenuItem>
            <DropdownMenuItem>Hide</DropdownMenuItem>
            <DropdownMenuItem>Follow {post.author.name}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}