"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMockPosts } from "../_data/mockData";
import { PostProps } from "./Post/types";
import Post from "./Post/Post";
import PostSkeleton from "./Post/PostSkeleton";

interface PostTimelineProps {
  activeTab: string;
  filterOptions: {
    topics: string[];
    sortBy: string;
  };
}

export default function PostTimeline({
  activeTab,
  filterOptions,
}: PostTimelineProps) {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<PostProps[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Initial fetch
  useEffect(() => {
    setLoading(true);
    fetchPosts();
  }, [activeTab, filterOptions]);

  const fetchPosts = async () => {
    try {
      // Dummy API call simulation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockPosts = getMockPosts()
        .filter((post) => {
          if (activeTab === "all") return true;
          if (activeTab === "questions") return post.category === "question";
          if (activeTab === "stories") return post.category === "story";
          if (activeTab === "resources") return post.category === "resource";
          if (activeTab === "expert") return post.author.isExpert;
          return true;
        })
        .filter((post) => {
          // Filter by topics if any selected
          if (filterOptions.topics.length === 0) return true;
          return post.tags.some((tag: any) =>
            filterOptions.topics.includes(tag)
          );
        })
        .sort((a, b) => {
          // Sort posts
          if (filterOptions.sortBy === "latest") {
            return b.createdAt.getTime() - a.createdAt.getTime();
          }
          if (filterOptions.sortBy === "popular") {
            const aEngagement =
              a.reactions.likes +
              a.reactions.helpful +
              a.reactions.support +
              a.commentCount;
            const bEngagement =
              b.reactions.likes +
              b.reactions.helpful +
              b.reactions.support +
              b.commentCount;
            return bEngagement - aEngagement;
          }
          return 0;
        })
        .slice(0, page * 5); // 5 posts per page

      setPosts(mockPosts);
      setHasMore(mockPosts.length < getMockPosts().length);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
      setLoading(false);
    }
  };

  const loadMore = () => {
    setPage(page + 1);
    fetchPosts();
  };

  // loading skeletons
  if (loading && posts.length === 0) {
    return (
      <div className="space-y-4">
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <PostSkeleton key={index} />
          ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No posts found
        </h3>
        <p className="text-gray-600 mb-6">
          {activeTab !== "all"
            ? `There are no posts in the ${activeTab} category yet.`
            : "There are no posts matching your filters."}
        </p>
        <Button>Create the First Post</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}

      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button variant="outline" onClick={loadMore} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}

      {/* Show skeletons at bottom when loading more posts */}
      {loading && posts.length > 0 && <PostSkeleton />}
    </div>
  );
}
