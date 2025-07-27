import { useState } from "react";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostActions from "./PostActions";
import PostCommentInput from "./PostCommentInput";
import { PostProps } from "./types";
import toast from "react-hot-toast";

export default function Post({ post }: { post: PostProps }) {
  const [saved, setSaved] = useState(false);
  const [reactions, setReactions] = useState(post.reactions);
  const [activeReaction, setActiveReaction] = useState<
    keyof PostProps["reactions"] | null
  >(null);
  const [commentText, setCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [localCommentCount, setLocalCommentCount] = useState(post.commentCount);

  const handleReaction = (type: keyof typeof post.reactions) => {
    if (activeReaction === type) {
      setReactions({
        ...reactions,
        [type]: reactions[type] - 1,
      });
      setActiveReaction(null);
    } else {
      if (activeReaction) {
        setReactions({
          ...reactions,
          [activeReaction]: reactions[activeReaction] - 1,
          [type]: reactions[type] + 1,
        });
      } else {
        setReactions({
          ...reactions,
          [type]: reactions[type] + 1,
        });
      }
      setActiveReaction(type);
    }
  };

  const handleCommentSubmit = async () => {
    if (!commentText.trim()) return;

    setSubmitting(true);

    try {
      // Dummy API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      setLocalCommentCount((prev) => prev + 1);
      setCommentText("");
      toast.success("Comment posted successfully");
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <article className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm transition-shadow hover:shadow-md">
      <PostHeader post={post} />

      <PostContent post={post} />

      <PostActions
        post={post}
        reactions={reactions}
        activeReaction={activeReaction}
        saved={saved}
        setSaved={setSaved}
        showCommentInput={showCommentInput}
        setShowCommentInput={setShowCommentInput}
        handleReaction={handleReaction}
        localCommentCount={localCommentCount}
      />

      {showCommentInput && (
        <PostCommentInput
          postId={post.id}
          commentText={commentText}
          setCommentText={setCommentText}
          submitting={submitting}
          handleCommentSubmit={handleCommentSubmit}
          localCommentCount={localCommentCount}
        />
      )}
    </article>
  );
}

export type { PostProps } from "./types";
