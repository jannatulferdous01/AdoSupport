import { useState } from "react";
import { ThumbsUp, MessageSquare, Share2, Bookmark, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import toast from "react-hot-toast";

interface PostDetailActionsProps {
  likeCount: number;
  commentCount: number;
  liked: boolean;
  saved: boolean;
  onLikePost: () => void;
  onSaveToggle: (saved: boolean) => void;
  onCommentFocus: () => void;
}

export default function PostDetailActions({
  likeCount,
  commentCount,
  liked,
  saved,
  onLikePost,
  onSaveToggle,
  onCommentFocus,
}: PostDetailActionsProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50">
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`gap-1.5 ${liked ? "text-primary" : "text-gray-600"}`}
                onClick={onLikePost}
              >
                <ThumbsUp size={18} className={liked ? "fill-primary" : ""} />
                <span>{likeCount}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs">{liked ? "Unlike post" : "Like post"}</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-gray-600"
                onClick={onCommentFocus}
              >
                <MessageSquare size={18} />
                <span>{commentCount}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs">Leave a comment</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-gray-600"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied to clipboard");
                }}
              >
                <Share2 size={18} />
                <span className="hidden sm:inline">Share</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs">Share this post</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`gap-1.5 ${saved ? "text-primary" : "text-gray-600"}`}
                onClick={() => {
                  const newSaved = !saved;
                  onSaveToggle(newSaved);
                  toast.success(newSaved ? "Added to saved posts" : "Removed from saved posts");
                }}
              >
                <Bookmark size={18} className={saved ? "fill-primary" : ""} />
                <span className="hidden sm:inline">Save</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="text-xs">{saved ? "Unsave post" : "Save post"}</p>
            </TooltipContent>
          </Tooltip>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-600">
                <MoreHorizontal size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  toast.success("Post reported. Thank you for helping keep our community safe.")
                }
              >
                Report Post
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </TooltipProvider>
  );
}