"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getMockPosts } from "../../_data/mockData";
import { PostProps } from "../../_components/Post/types";
import Comments, { Comment } from "../../_components/Comments";
import toast from "react-hot-toast";
import {
  PostDetailHeader,
  PostDetailContent,
  PostDetailActions,
  PostDetailSkeleton,
  PostDetailNotFound,
} from "../../_components/PostDetail";
import {
  calculateReadTime,
  getCategoryColor,
  getCategoryLabel,
} from "../../utils/postUtils";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  const [post, setPost] = useState<PostProps | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));
        const allPosts = getMockPosts();
        const foundPost = allPosts.find((p) => p.id === postId);

        if (!foundPost) {
          router.push("/community");
          return;
        }

        setPost(foundPost);
        setLikeCount(foundPost.reactions.likes);

        // Generate mock comments - this could be moved to a utility function
        const mockComments: Comment[] = [
          {
            id: "c1",
            author: {
              id: "user5",
              name: "Riley Chen",
              image: "/assets/images/avatars/avatar-7.png",
            },
            content:
              "This is really helpful! I've been struggling with something similar and your insights gave me a new perspective.",
            createdAt: new Date(Date.now() - 3600000 * 2),
            reactions: { likes: 3 },
          },
          {
            id: "c2",
            author: {
              id: "expert1",
              name: "Dr. Sarah Johnson",
              image: "/assets/images/avatars/avatar-2.png",
              isExpert: true,
              role: "Adolescent Therapist",
            },
            content:
              "Great point. I would add that consistent practice is key here. Even just 5 minutes daily can make a significant difference over time.",
            createdAt: new Date(Date.now() - 3600000 * 1),
            reactions: { likes: 7 },
            isPinned: true,
          },
          {
            id: "c3",
            author: {
              id: "user8",
              name: "Alex Kim",
              image: "/assets/images/avatars/avatar-8.png",
            },
            content:
              "I tried this approach last month and it really worked for me. The key was being consistent and patient with myself.",
            createdAt: new Date(Date.now() - 7200000),
            reactions: { likes: 5 },
            replies: [
              {
                id: "c3-r1",
                author: {
                  id: "user9",
                  name: "Taylor Morgan",
                  image: "/assets/images/avatars/avatar-5.png",
                },
                content:
                  "Did you use any specific resources or apps to help you stay on track?",
                createdAt: new Date(Date.now() - 3600000),
                reactions: { likes: 1 },
                replyTo: "c3",
              },
              {
                id: "c3-r2",
                author: {
                  id: "user8",
                  name: "Alex Kim",
                  image: "/assets/images/avatars/avatar-8.png",
                },
                content:
                  "I used a simple habit tracker app called 'Streaks' and set a daily reminder. It helped a lot!",
                createdAt: new Date(Date.now() - 1800000),
                reactions: { likes: 2 },
                replyTo: "c3-r1",
              },
            ],
          },
        ];

        setComments(mockComments);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, router]);

  const handleLikePost = () => {
    if (liked) {
      setLikeCount((prev) => prev - 1);
    } else {
      setLikeCount((prev) => prev + 1);
    }
    setLiked(!liked);
  };

  const handleAddComment = async (content: string) => {
    const newComment: Comment = {
      id: `c${comments.length + 1}-${Date.now()}`,
      author: {
        id: "currentUser",
        name: "You",
        image: "/assets/images/dummy-user.png",
      },
      content,
      createdAt: new Date(),
      reactions: { likes: 0 },
    };

    setComments([newComment, ...comments]);
    toast.success("Comment posted successfully");
  };

  const handleAddReply = async (content: string, parentId: string) => {
    const newReply: Comment = {
      id: `reply-${Date.now()}`,
      author: {
        id: "currentUser",
        name: "You",
        image: "/assets/images/dummy-user.png",
      },
      content,
      createdAt: new Date(),
      reactions: { likes: 0 },
      replyTo: parentId,
    };

    const updatedComments = comments.map((comment) => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: comment.replies
            ? [...comment.replies, newReply]
            : [newReply],
        };
      }
      return comment;
    });

    setComments(updatedComments);
    toast.success("Reply posted successfully");
  };

  const handleLikeComment = (commentId: string) => {
    setComments((prev) =>
      prev.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            reactions: {
              ...comment.reactions,
              likes: comment.reactions.likes + 1,
            },
          };
        }
        return comment;
      })
    );
  };

  if (loading) {
    return <PostDetailSkeleton />;
  }

  if (!post) {
    return <PostDetailNotFound />;
  }

  const readTimeMinutes = calculateReadTime(post.content.text);

  return (
    <main className="max-w-4xl mx-auto pb-16 px-4 sm:px-6">
      <PostDetailHeader />

      <div className="space-y-6">
        <article className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
          <PostDetailContent
            post={post}
            readTimeMinutes={readTimeMinutes}
            getCategoryLabel={getCategoryLabel}
            getCategoryColor={getCategoryColor}
          />

          <PostDetailActions
            likeCount={likeCount}
            commentCount={comments.length}
            liked={liked}
            saved={saved}
            onLikePost={handleLikePost}
            onSaveToggle={setSaved}
            onCommentFocus={() =>
              document.getElementById("comment-input")?.focus()
            }
          />
        </article>

        <Comments
          comments={comments}
          onAddComment={handleAddComment}
          onAddReply={handleAddReply}
          onLikeComment={handleLikeComment}
        />
      </div>
    </main>
  );
}
