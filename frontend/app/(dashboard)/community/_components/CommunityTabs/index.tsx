"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Filter, Plus, ChevronRight } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface CommunityTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenFilter: () => void;
  onCreatePost: () => void;
}

export default function CommunityTabs({
  activeTab,
  setActiveTab,
  onOpenFilter,
  onCreatePost,
}: CommunityTabsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      {/* Tabs with horizontal scroll on mobile */}
      <div className="w-full">
        <ScrollArea className="w-full whitespace-nowrap">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="bg-white border border-gray-200 h-9">
              <TabsTrigger value="all" className="text-sm px-3">
                All Posts
              </TabsTrigger>
              <TabsTrigger value="questions" className="text-sm px-3">
                Questions
              </TabsTrigger>
              <TabsTrigger value="stories" className="text-sm px-3">
                Success Stories
              </TabsTrigger>
              <TabsTrigger value="resources" className="text-sm px-3">
                Resources
              </TabsTrigger>
              <TabsTrigger value="expert" className="text-sm px-3">
                Expert Content
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <ScrollBar orientation="horizontal" className="invisible" />
        </ScrollArea>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 justify-end shrink-0">
        <Button
          variant="outline"
          size="sm"
          className="hidden sm:flex items-center gap-1 h-9"
          onClick={onOpenFilter}
        >
          <Filter size={16} />
          Filter
        </Button>

        <Button
          onClick={onCreatePost}
          className="gap-1 flex items-center h-9"
          size="sm"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Create Post</span>
        </Button>

        {/* Mobile filter button */}
        <Button
          variant="outline"
          size="icon"
          className="sm:hidden h-9 w-9"
          onClick={onOpenFilter}
        >
          <Filter size={16} />
        </Button>
      </div>
    </div>
  );
}
