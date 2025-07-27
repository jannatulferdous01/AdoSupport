"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Bookmark, Search, Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Post, { PostProps } from "../_components/Post/Post";
import { getMockPosts } from "../_data/mockData";
import FilterDrawer from "../_components/FilterDrawer";

export default function SavedPostsPage() {
  const [savedPosts, setSavedPosts] = useState<PostProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState<{
    topics: string[];
    sortBy: string;
  }>({
    topics: [],
    sortBy: "latest",
  });

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        // In a real app, fetch from API
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Simulate random saved posts from mock data
        const allPosts = getMockPosts();
        const randomPosts = allPosts
          .sort(() => 0.5 - Math.random()) // Shuffle
          .slice(0, 3); // Take first 3

        setSavedPosts(randomPosts);
      } catch (error) {
        console.error("Error fetching saved posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedPosts();
  }, []);

  // Filter posts based on search, tab, and filters
  const filteredPosts = savedPosts
    .filter((post) => {
      // Filter by search query
      if (
        searchQuery &&
        !post.content.text.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !(
          post.content.title &&
          post.content.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
      ) {
        return false;
      }

      // Filter by tab
      if (activeTab !== "all" && post.category !== activeTab) {
        return false;
      }

      // Filter by topics
      if (
        filterOptions.topics.length > 0 &&
        !post.tags.some((tag) => filterOptions.topics.includes(tag))
      ) {
        return false;
      }

      return true;
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
    });

  return (
    <main className="max-w-5xl mx-auto pb-16 px-4 sm:px-6">
      <div className="py-6 flex items-center">
        <Link href="/community">
          <Button variant="ghost" size="icon" className="mr-4">
            <ArrowLeft size={18} />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold flex items-center">
          <Bookmark className="mr-2 h-6 w-6" />
          Saved Posts
        </h1>
      </div>

      <div className="space-y-6">
        {/* Search and filter */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:max-w-xs">
            <Input
              placeholder="Search saved posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => setIsFilterOpen(true)}
            >
              <Filter size={16} />
              Filter
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-white border border-gray-200">
            <TabsTrigger value="all">All Saved</TabsTrigger>
            <TabsTrigger value="question">Questions</TabsTrigger>
            <TabsTrigger value="story">Stories</TabsTrigger>
            <TabsTrigger value="resource">Resources</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Posts */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
              <Bookmark className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mt-4">
                No saved posts
              </h3>
              <p className="text-gray-600 mt-2 mb-6 max-w-sm mx-auto">
                {searchQuery ||
                activeTab !== "all" ||
                filterOptions.topics.length > 0
                  ? "No posts match your current filters"
                  : "When you save posts, they'll appear here for easy access"}
              </p>
              <Button asChild>
                <Link href="/community">Browse Community</Link>
              </Button>
            </div>
          ) : (
            filteredPosts.map((post) => <Post key={post.id} post={post} />)
          )}
        </div>
      </div>

      <FilterDrawer
        open={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        filterOptions={filterOptions}
        setFilterOptions={setFilterOptions}
      />
    </main>
  );
}
