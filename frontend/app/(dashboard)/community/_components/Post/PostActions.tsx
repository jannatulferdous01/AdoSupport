import { Button } from "@/components/ui/button";
import {
  ThumbsUp,
  Lightbulb,
  HandHeart,
  MessageSquare,
  Share2,
  Bookmark,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import toast from "react-hot-toast";
import { PostProps } from "./types";

interface PostActionsProps {
  post: PostProps;
  reactions: PostProps["reactions"];
  activeReaction: keyof PostProps["reactions"] | null;
  saved: boolean;
  setSaved: (saved: boolean) => void;
  showCommentInput: boolean;
  setShowCommentInput: (show: boolean) => void;
  handleReaction: (type: keyof PostProps["reactions"]) => void;
  localCommentCount: number;
}

export default function PostActions({
  post,
  reactions,
  activeReaction,
  saved,
  setSaved,
  showCommentInput,
  setShowCommentInput,
  handleReaction,
  localCommentCount,
}: PostActionsProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
        <div className="flex gap-1">
          {/* Like Reaction */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`gap-1.5 ${
                  activeReaction === "likes" ? "text-primary" : "text-gray-600"
                }`}
                onClick={() => handleReaction("likes")}
              >
                <ThumbsUp
                  size={16}
                  className={activeReaction === "likes" ? "fill-primary" : ""}
                />
                <span>{reactions.likes}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              <p>Like this post</p>
            </TooltipContent>
          </Tooltip>

          {/* Helpful Reaction */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`gap-1.5 ${
                  activeReaction === "helpful"
                    ? "text-amber-600"
                    : "text-gray-600"
                }`}
                onClick={() => handleReaction("helpful")}
              >
                <Lightbulb
                  size={16}
                  className={
                    activeReaction === "helpful" ? "fill-amber-600" : ""
                  }
                />
                <span>{reactions.helpful}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              <p>Mark as helpful</p>
            </TooltipContent>
          </Tooltip>

          {/* Support Reaction */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`gap-1.5 ${
                  activeReaction === "support"
                    ? "text-rose-600"
                    : "text-gray-600"
                }`}
                onClick={() => handleReaction("support")}
              >
                <HandHeart
                  size={16}
                  className={
                    activeReaction === "support" ? "fill-rose-600" : ""
                  }
                />
                <span>{reactions.support}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              <p>Show support</p>
            </TooltipContent>
          </Tooltip>

          {/* Comment Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={`gap-1.5 ${
                  showCommentInput ? "text-primary" : "text-gray-600"
                }`}
                onClick={() => setShowCommentInput(!showCommentInput)}
              >
                <MessageSquare size={16} />
                <span>{localCommentCount}</span>
                {showCommentInput ? (
                  <ChevronUp size={14} className="ml-0.5" />
                ) : (
                  <ChevronDown size={14} className="ml-0.5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              <p>{showCommentInput ? "Hide comments" : "Show comments"}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex gap-0.5">
          {/* Save Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${
                  saved ? "text-primary" : "text-gray-600"
                }`}
                onClick={() => {
                  setSaved(!saved);
                  toast.success(
                    saved ? "Removed from saved" : "Saved to your posts"
                  );
                }}
              >
                <Bookmark size={16} className={saved ? "fill-primary" : ""} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="text-xs">
              <p>{saved ? "Unsave post" : "Save post"}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
