import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";

interface PostCommentInputProps {
  postId: string;
  commentText: string;
  setCommentText: (text: string) => void;
  submitting: boolean;
  handleCommentSubmit: () => Promise<void>;
  localCommentCount: number;
}

export default function PostCommentInput({
  postId,
  commentText,
  setCommentText,
  submitting,
  handleCommentSubmit,
  localCommentCount,
}: PostCommentInputProps) {
  return (
    <div className="p-4 border-t border-gray-100 bg-gray-50">
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8 mt-0.5">
          <AvatarImage src="/assets/images/dummy-user.png" alt="Your avatar" />
          <AvatarFallback>Y</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="relative">
            <Textarea
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={2}
              className="resize-none focus-visible:ring-primary pr-20 text-sm bg-white"
            />
            <div className="absolute bottom-2 right-2">
              <Button
                size="sm"
                variant={commentText.trim() ? "default" : "ghost"}
                onClick={handleCommentSubmit}
                disabled={!commentText.trim() || submitting}
                className="h-7 text-xs"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
                    Posting
                  </>
                ) : (
                  <>
                    <Send className="mr-1.5 h-3 w-3" />
                    Post
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-500">Be respectful and constructive</p>
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-xs text-primary"
              asChild
            >
              <Link href={`/community/post/${postId}`}>{`View all ${localCommentCount} ${
                localCommentCount === 1 ? "comment" : "comments"
              }`}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}