"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Send,
  Loader2,
  ThumbsUp,
  MessageSquare,
  Award,
  MoreHorizontal,
  Flag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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

export interface CommentAuthor {
  id: string;
  name: string;
  image: string;
  isExpert?: boolean;
  role?: string;
}

export interface CommentReaction {
  likes: number;
}

export interface Comment {
  id: string;
  author: CommentAuthor;
  content: string;
  createdAt: Date;
  reactions: CommentReaction;
  isPinned?: boolean;
  replyTo?: string;
  replies?: Comment[];
}

interface CommentsProps {
  comments: Comment[];
  onAddComment: (content: string) => Promise<void>;
  onAddReply: (content: string, parentId: string) => Promise<void>;
  onLikeComment: (commentId: string) => void;
}

export default function Comments({
  comments,
  onAddComment,
  onAddReply,
  onLikeComment,
}: CommentsProps) {
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;
    setSubmitting(true);

    try {
      await onAddComment(commentText);
      setCommentText("");
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!replyText.trim()) return;
    setSubmitting(true);

    try {
      await onAddReply(replyText, parentId);
      setReplyText("");
      setReplyingTo(null);
    } catch (error) {
      console.error("Error posting reply:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
      {/* Comments header with count and sorting options */}
      <div className="p-4 md:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 bg-gray-50">
        <h2 className="font-semibold text-gray-900 text-lg flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Discussion ({comments.length})
        </h2>
      </div>

      {/* Comment input area */}
      <div className="p-4 md:p-5 border-b border-gray-100 bg-white">
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10 mt-0.5 border border-gray-200 shadow-sm">
            <AvatarImage
              src="/assets/images/dummy-user.png"
              alt="Your avatar"
            />
            <AvatarFallback>Y</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="relative">
              <Textarea
                id="comment-input"
                placeholder="Share your thoughts..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={3}
                className="resize-none focus-visible:ring-primary pr-24"
              />
              <div className="absolute bottom-2 right-2">
                <Button
                  size="sm"
                  variant={commentText.trim() ? "default" : "ghost"}
                  onClick={handleSubmitComment}
                  disabled={!commentText.trim() || submitting}
                  className="h-8"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      Posting
                    </>
                  ) : (
                    <>
                      <Send className="mr-1.5 h-3.5 w-3.5" />
                      Post
                    </>
                  )}
                </Button>
              </div>
            </div>

            <p className="mt-2 text-xs text-gray-500">
              Be respectful and constructive in your comments.
            </p>
          </div>
        </div>
      </div>

      {/* Comments list */}
      <div className="divide-y divide-gray-100">
        {comments?.length === 0 ? (
          <div className="p-8 text-center">
            <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-gray-700 font-medium mb-1">No comments yet</h3>
            <p className="text-gray-500 text-sm">
              Be the first to share your thoughts
            </p>
          </div>
        ) : (
          <div className="px-4 md:px-5">
            {comments?.map((comment) => (
              <div
                key={comment.id}
                id={`comment-${comment.id}`}
                className={`py-5 ${comment.isPinned ? "bg-amber-50/30" : ""}`}
              >
                {comment.isPinned && (
                  <div className="flex items-center text-amber-600 text-xs mb-2 gap-1">
                    <Award className="h-3.5 w-3.5" />
                    <span className="font-medium">Pinned by moderator</span>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10 mt-0.5 border border-gray-200">
                    <AvatarImage
                      src={comment.author.image}
                      alt={comment.author.name}
                    />
                    <AvatarFallback>
                      {comment.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center flex-wrap gap-1.5">
                      <span className="font-medium text-gray-900 truncate max-w-[150px]">
                        {comment.author.name}
                      </span>

                      {comment.author.isExpert && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Badge
                                variant="outline"
                                className="bg-primary-50 text-xs border-primary-100 text-primary px-1.5 py-0 h-5"
                              >
                                Expert
                              </Badge>
                            </TooltipTrigger>
                            <TooltipContent side="top">
                              <p className="text-xs">
                                {comment.author.role || "Verified Expert"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}

                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(comment.createdAt, {
                          addSuffix: true,
                        })}
                      </span>
                    </div>

                    <div className="mt-1.5 text-gray-800 break-words">
                      {comment.content}
                    </div>

                    <div className="flex items-center mt-3 gap-4">
                      <button
                        className={`text-xs flex items-center gap-1.5 py-1 px-2 rounded-md transition-colors hover:bg-gray-100 ${
                          comment.reactions.likes > 0
                            ? "text-primary font-medium"
                            : "text-gray-500"
                        }`}
                        onClick={() => onLikeComment(comment.id)}
                      >
                        <ThumbsUp
                          className={`h-3.5 w-3.5 ${
                            comment.reactions.likes > 0 ? "fill-primary" : ""
                          }`}
                        />
                        <span>
                          {comment.reactions.likes > 0
                            ? comment.reactions.likes
                            : "Like"}
                        </span>
                      </button>

                      <button
                        className="text-xs text-gray-500 flex items-center gap-1.5 py-1 px-2 rounded-md hover:bg-gray-100 transition-colors"
                        onClick={() =>
                          setReplyingTo((prev) =>
                            prev === comment.id ? null : comment.id
                          )
                        }
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>
                          {replyingTo === comment.id ? "Cancel" : "Reply"}
                        </span>
                      </button>

                      <div className="ml-auto">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
                              {""}
                              <MoreHorizontal className="h-4 w-4" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            align="end"
                            className="w-[180px]"
                          >
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() =>
                                toast.success(
                                  "Comment reported. Thank you for helping keep our community safe."
                                )
                              }
                            >
                              <Flag className="h-4 w-4 mr-2" />
                              Report comment
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    {/* Reply input */}
                    {replyingTo === comment.id && (
                      <div className="mt-3 pl-3 border-l-2 border-gray-100">
                        <div className="flex items-start gap-2 pt-2">
                          <Avatar className="h-7 w-7">
                            <AvatarImage
                              src="/assets/images/dummy-user.png"
                              alt="Your avatar"
                            />
                            <AvatarFallback>Y</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="relative">
                              <Textarea
                                placeholder={`Reply to ${comment.author.name}...`}
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                rows={2}
                                className="resize-none text-sm pr-20"
                              />
                              <div className="absolute bottom-2 right-2">
                                <Button
                                  size="sm"
                                  variant={
                                    replyText.trim() ? "default" : "ghost"
                                  }
                                  onClick={() => handleSubmitReply(comment.id)}
                                  disabled={!replyText.trim() || submitting}
                                  className="h-7 text-xs"
                                >
                                  {submitting ? (
                                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                  ) : (
                                    <Send className="h-3 w-3 mr-1" />
                                  )}
                                  Reply
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Nested replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-4 pl-4 border-l-2 border-gray-100 space-y-4">
                        {comment.replies.map((reply: any) => (
                          <div key={reply.id} className="pt-1">
                            <div className="flex items-start gap-2">
                              <Avatar className="h-7 w-7">
                                <AvatarImage
                                  src={reply.author.image}
                                  alt={reply.author.name}
                                />
                                <AvatarFallback>
                                  {reply.author.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center flex-wrap gap-1.5">
                                  <span className="font-medium text-gray-900 text-sm truncate max-w-[150px]">
                                    {reply.author.name}
                                  </span>

                                  {reply.author.isExpert && (
                                    <Badge
                                      variant="outline"
                                      className="bg-primary-50 text-xs border-primary-100 text-primary px-1 py-0 h-4"
                                    >
                                      Expert
                                    </Badge>
                                  )}

                                  <span className="text-xs text-gray-500">
                                    {formatDistanceToNow(reply.createdAt, {
                                      addSuffix: true,
                                    })}
                                  </span>
                                </div>

                                <div className="mt-1 text-sm text-gray-800 break-words">
                                  {reply.content}
                                </div>

                                <div className="flex items-center mt-2 gap-3">
                                  <button className="text-xs text-gray-500 flex items-center gap-1 py-1 px-1.5 rounded-md hover:bg-gray-100 transition-colors">
                                    <ThumbsUp
                                      className={`h-3 w-3 ${
                                        reply.reactions.likes > 0
                                          ? "fill-primary"
                                          : ""
                                      }`}
                                    />
                                    <span>
                                      {reply.reactions.likes > 0
                                        ? reply.reactions.likes
                                        : "Like"}
                                    </span>
                                  </button>

                                  <button
                                    className="text-xs text-gray-500 flex items-center gap-1 py-1 px-1.5 rounded-md hover:bg-gray-100 transition-colors"
                                    onClick={() => setReplyingTo(comment.id)}
                                  >
                                    <MessageSquare className="h-3 w-3" />
                                    <span>Reply</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
