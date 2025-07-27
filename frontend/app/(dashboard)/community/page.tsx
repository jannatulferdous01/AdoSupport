"use client";

import { useState } from "react";
import CommunityHeader from "./_components/CommunityHeader";
import PostTimeline from "./_components/PostTimeline";
import CreatePostDialog from "./_components/CreatePostDialog";
import FilterDrawer from "./_components/FilterDrawer";
import CommunitySidebar from "./_components/CommunitySidebar";
import MobileCommunityNav from "./_components/MobileCommunityNav";
import CommunityTabs from "./_components/CommunityTabs";

export default function CommunityPage() {
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [filterOptions, setFilterOptions] = useState<{
    topics: string[];
    sortBy: string;
  }>({
    topics: [],
    sortBy: "latest",
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] xl:grid-cols-[280px_1fr_300px] gap-6">
      {/* Left Sidebar - Fixed on desktop */}
      <div className="hidden lg:block">
        <div className="w-[280px] fixed pr-6 pb-20 h-[calc(100vh-80px)] overflow-y-auto scrollbar-hide">
          <CommunitySidebar onCreatePost={() => setIsCreatePostOpen(true)} />
        </div>
      </div>

      {/* Main Content */}
      <main className="py-6 space-y-8">
        <CommunityHeader />

        <CommunityTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenFilter={() => setIsFilterOpen(true)}
          onCreatePost={() => setIsCreatePostOpen(true)}
        />

        <PostTimeline activeTab={activeTab} filterOptions={filterOptions} />

        <CreatePostDialog
          open={isCreatePostOpen}
          onOpenChange={setIsCreatePostOpen}
        />

        <FilterDrawer
          open={isFilterOpen}
          onOpenChange={setIsFilterOpen}
          filterOptions={filterOptions}
          setFilterOptions={setFilterOptions}
        />
      </main>

      {/* Mobile navigation - fixed at bottom on mobile/tablet */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200">
        <MobileCommunityNav onCreatePost={() => setIsCreatePostOpen(true)} />
      </div>
    </div>
  );
}
